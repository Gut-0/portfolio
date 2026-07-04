output "site_url" {
  description = "Public site URL"
  value       = local.use_custom_domain ? "https://${var.custom_domain}" : "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "cloudfront_domain" {
  description = "CloudFront domain — target of the Hostinger CNAME for the subdomain"
  value       = aws_cloudfront_distribution.site.domain_name
}

output "acm_validation_record" {
  description = "CNAME to add at Hostinger to validate the certificate"
  value = var.custom_domain == "" ? null : {
    name  = one(aws_acm_certificate.site[0].domain_validation_options).resource_record_name
    type  = one(aws_acm_certificate.site[0].domain_validation_options).resource_record_type
    value = one(aws_acm_certificate.site[0].domain_validation_options).resource_record_value
  }
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
  description = "Wall Lambda name (GitHub var LAMBDA_FUNCTION_NAME)"
  value       = aws_lambda_function.wall.function_name
}

output "deploy_role_arn" {
  description = "IAM role GitHub Actions assumes via OIDC (GitHub var AWS_DEPLOY_ROLE_ARN)"
  value       = aws_iam_role.deploy.arn
}
