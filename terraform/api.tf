# API tier: HTTP API Gateway -> Lambda (Python) -> DynamoDB (visitor-wall notes).

resource "aws_dynamodb_table" "wall_notes" {
  name         = "${var.project_name}-wall-notes"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk" # ISO week key, e.g. 2026-W27
  range_key    = "sk" # note id

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  # Old weeks self-clean: the Monday reset is just "a new week key" + TTL sweep.
  ttl {
    attribute_name = "expires_at"
    enabled        = true
  }
}

data "archive_file" "wall_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../backend/wall"
  output_path = "${path.module}/.build/wall.zip"
}

resource "aws_iam_role" "wall_lambda" {
  name = "${var.project_name}-wall-lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "wall_lambda" {
  name = "wall-lambda"
  role = aws_iam_role.wall_lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:Query",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem",
        ]
        Resource = aws_dynamodb_table.wall_notes.arn
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
    ]
  })
}

resource "aws_lambda_function" "wall" {
  function_name    = "${var.project_name}-wall"
  role             = aws_iam_role.wall_lambda.arn
  runtime          = "python3.13"
  handler          = "handler.lambda_handler"
  filename         = data.archive_file.wall_lambda.output_path
  source_code_hash = data.archive_file.wall_lambda.output_base64sha256
  timeout          = 10
  memory_size      = 128

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.wall_notes.name
    }
  }
}

resource "aws_apigatewayv2_api" "api" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["https://${aws_cloudfront_distribution.site.domain_name}"]
    allow_methods = ["GET", "POST", "DELETE", "OPTIONS"]
    allow_headers = ["content-type", "x-visitor-id"]
    max_age       = 3600
  }
}

resource "aws_apigatewayv2_integration" "wall" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.wall.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_notes" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /notes"
  target    = "integrations/${aws_apigatewayv2_integration.wall.id}"
}

resource "aws_apigatewayv2_route" "post_notes" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /notes"
  target    = "integrations/${aws_apigatewayv2_integration.wall.id}"
}

resource "aws_apigatewayv2_route" "delete_note" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "DELETE /notes/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.wall.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true

  default_route_settings {
    throttling_burst_limit = 10
    throttling_rate_limit  = 5
  }
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.wall.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}
