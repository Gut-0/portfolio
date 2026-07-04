output "site_url" {
  description = "Public site URL"
  value       = "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "api_endpoint" {
  description = "Base URL of the HTTP API (set as VITE_API_URL / API_URL in GitHub)"
  value       = aws_apigatewayv2_api.api.api_endpoint
}

output "site_bucket" {
  description = "S3 bucket that holds the built frontend (GitHub var S3_BUCKET)"
  value       = aws_s3_bucket.site.bucket
}

output "cloudfront_distribution_id" {
  description = "For cache invalidation in CI (GitHub var CLOUDFRONT_DISTRIBUTION_ID)"
  value       = aws_cloudfront_distribution.site.id
}

output "lambda_function_name" {
  description = "Contact Lambda name (GitHub var LAMBDA_FUNCTION_NAME)"
  value       = aws_lambda_function.contact.function_name
}

output "deploy_role_arn" {
  description = "IAM role GitHub Actions assumes via OIDC (GitHub var AWS_DEPLOY_ROLE_ARN)"
  value       = aws_iam_role.deploy.arn
}
