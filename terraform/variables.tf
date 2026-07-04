variable "project_name" {
  description = "Name prefix for all resources"
  type        = string
  default     = "gustavo-portfolio"
}

variable "aws_region" {
  description = "AWS region for all resources (CloudFront is global)"
  type        = string
  default     = "us-east-1"
}

variable "budget_alert_email" {
  description = "Email that receives the AWS budget alert"
  type        = string
}

variable "create_github_oidc_provider" {
  description = "Create the GitHub OIDC provider (set false if the account already has one — it is account-wide and unique)"
  type        = bool
  default     = true
}

variable "github_repository" {
  description = "GitHub repo allowed to deploy via OIDC, in owner/name form"
  type        = string
  default     = "Gut-0/portfolio"
}
