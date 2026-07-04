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

variable "custom_domain" {
  description = "Custom domain for the site (empty string disables it). DNS stays at the registrar (Hostinger) via CNAMEs."
  type        = string
  default     = "gustavoborges.pandev.com.br"
}

variable "attach_custom_domain" {
  description = "Set true only after the ACM validation CNAME is in place and the cert is issued — attaches the domain to CloudFront"
  type        = bool
  default     = false
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
