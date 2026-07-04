# Custom domain (gustavoborges.pandev.com.br) — DNS stays at Hostinger.
#
# Two-stage rollout because CloudFront refuses a cert that isn't issued yet:
#   1. apply with attach_custom_domain=false → creates the cert request;
#      paste the validation CNAME (see outputs) into Hostinger DNS.
#   2. once ACM shows "Issued", apply with attach_custom_domain=true →
#      waits for validation and attaches the alias + cert to CloudFront.
# Also add at Hostinger: CNAME gustavoborges → <cloudfront domain>.

resource "aws_acm_certificate" "site" {
  count = var.custom_domain != "" ? 1 : 0

  domain_name       = var.custom_domain
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "site" {
  count = var.custom_domain != "" && var.attach_custom_domain ? 1 : 0

  certificate_arn = aws_acm_certificate.site[0].arn
  validation_record_fqdns = [
    for o in aws_acm_certificate.site[0].domain_validation_options : o.resource_record_name
  ]
}
