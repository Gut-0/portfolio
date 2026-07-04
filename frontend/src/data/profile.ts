export const profile = {
  name: "Gustavo Borges",
  headline: "Cloud & Backend Engineer",
  tagline: "Python · AWS · Data Pipelines",
  positioning:
    "I build and ship backend systems on AWS — serverless APIs, data pipelines and the infrastructure as code that keeps them reproducible.",
  location: "Brazil · remote (UTC−3)",
  languages: ["Portuguese (native)", "English (fluent)", "Spanish (fluent)"],
  links: {
    github: "https://github.com/Gut-0",
    linkedin: "https://www.linkedin.com/in/gustavo-borges", // TODO: confirm handle
    email: "gs.gustavoborges1@gmail.com",
  },
  about: [
    "I started as a full-stack developer in Brazil, moved into data engineering working for a company in Mexico, and today I focus on cloud and backend engineering with Python on AWS.",
    "Five years in, what I care about is the whole path to production: clean APIs, data that flows reliably, infrastructure written as code, and deploys that happen on git push — not by hand.",
    "I work in English, Spanish and Portuguese, and I've collaborated with teams across Latin America. Currently deepening my AWS architecture skills (Solutions Architect – Associate, exam July 2026).",
  ],
  skills: [
    {
      group: "Languages",
      items: ["Python", "SQL", "TypeScript / JavaScript"],
    },
    {
      group: "AWS",
      items: [
        "Lambda",
        "S3",
        "DynamoDB",
        "API Gateway",
        "CloudFront",
        "Glue",
        "Athena",
        "Kinesis",
        "EventBridge",
        "CloudWatch",
      ],
    },
    {
      group: "Data",
      items: ["Pipeline design", "ETL / ELT", "Parquet data lakes", "pandas / PyArrow"],
    },
    {
      group: "DevOps",
      items: ["Terraform", "GitHub Actions", "Docker", "Git"],
    },
  ],
  projects: [
    {
      title: "This website",
      status: "live",
      description:
        "A serverless multi-tier app, not a static page: React front served from S3 + CloudFront, a Python Lambda API behind API Gateway writing to DynamoDB, all provisioned with Terraform and deployed by GitHub Actions on every push.",
      stack: ["React", "Python", "Lambda", "DynamoDB", "Terraform", "GitHub Actions"],
      link: "https://github.com/Gut-0/portfolio",
    },
    {
      title: "Data pipeline & dashboard",
      status: "in progress",
      description:
        "Phase 2 of this project: a scheduled pipeline (EventBridge → Lambda) landing raw data in an S3 data lake, transformed to partitioned Parquet, queried with Glue Data Catalog + Athena, and served back through the existing API into a live dashboard on this site.",
      stack: ["EventBridge", "S3", "Parquet", "Glue", "Athena"],
      link: null,
    },
  ],
  certifications: [
    {
      name: "AWS Certified Cloud Practitioner",
      status: "Certified",
    },
    {
      name: "AWS Certified Solutions Architect – Associate",
      status: "Exam scheduled · July 2026",
    },
    {
      name: "AWS Certified Data Engineer – Associate",
      status: "In progress",
    },
  ],
} as const;
