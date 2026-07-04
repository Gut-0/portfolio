# gustavo.borges — portfolio on AWS

Personal site of **Gustavo Borges, Cloud & Backend Engineer (Python)**, built as a real
serverless multi-tier application on AWS — the site is also the proof of the résumé. Its one truly
interactive feature is the **Visitor Wall**: guests pick their country and pin a "hello"
note to a board that holds 37 notes and resets every Monday — backed by a real API, not
`localStorage`.

## Architecture

```mermaid
flowchart LR
    V[Visitor] --> CF[CloudFront\nCDN + HTTPS]
    CF --> S3[(S3\nstatic frontend)]
    V -->|"GET/POST/DELETE /notes"| APIGW[API Gateway\nHTTP API]
    APIGW --> L[Lambda\nPython 3.13]
    L --> DDB[(DynamoDB\nwall notes)]
```

| Tier | Service | Notes |
| --- | --- | --- |
| Presentation | S3 + CloudFront | React (Vite) build, private bucket behind Origin Access Control |
| API | API Gateway (HTTP) + Lambda | Python — `GET /notes`, `POST /notes`, `DELETE /notes/{id}`; throttled, CORS locked to the site origin |
| Data | DynamoDB | On-demand; notes partitioned by ISO week, TTL sweeps old weeks |
| IaC | Terraform | Everything above reproducible from zero |
| CI/CD | GitHub Actions | OIDC to AWS (no stored keys): build → S3 sync → CloudFront invalidation → Lambda update |

**Phase 2 (planned):** a scheduled data pipeline (EventBridge → Lambda → S3 data lake in
partitioned Parquet → Glue Data Catalog + Athena) feeding the site's dashboard section
through the same API. Until then the dashboard computes its metrics client-side from
`GET /notes`.

## Visitor wall rules

- **37 notes per week**, then the wall is full.
- **One note per visitor per week**, enforced server-side keyed on an anonymous
  client-generated visitor id (`x-visitor-id` header). Deliberate trade-off: best-effort
  identity without cookies or fingerprinting; clearing browser storage frees the slot.
- **Weekly reset — Monday 00:00 UTC.** Notes are partitioned by ISO week key
  (e.g. `2026-W27`) and only the current week is ever read, so the reset needs no job at
  all; a DynamoDB TTL (21 days) garbage-collects old weeks.

## Repository layout

```
frontend/            React + Vite + TypeScript site
backend/wall/        Lambda handler (Python) for the visitor-wall API
terraform/           All infrastructure as code
.github/workflows/   Deploy pipeline
```

## Local development

```sh
cd frontend
npm install
npm run dev
```

Without `VITE_API_URL` set, the wall runs against a `localStorage` fallback with the same
contract, so the whole site works offline.

## Provisioning

Requires Terraform ≥ 1.7 and AWS credentials with admin-ish rights (first apply only).

```sh
cd terraform
terraform init
terraform apply -var "budget_alert_email=you@example.com"
```

Then set the Terraform outputs as **GitHub repository variables** so the pipeline can deploy:
`AWS_DEPLOY_ROLE_ARN`, `S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`, `LAMBDA_FUNCTION_NAME`
and `API_URL` (used at build time as `VITE_API_URL`). Every push to `main` then ships
frontend + Lambda automatically.

## Cost

Designed to run inside the AWS free tier: no NAT Gateway, no Glue ETL jobs, no Redshift.
CloudFront uses the default certificate and `PriceClass_100`; DynamoDB and Lambda are
on-demand. A $1 monthly AWS Budget alarm (actual + forecast) is part of the Terraform, so
drift from "basically free" pages me before it costs anything.
