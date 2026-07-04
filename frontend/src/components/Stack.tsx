import Reveal from "./Reveal";

const tiles = [
  { title: "LANGUAGES", chips: ["Python", "SQL", "JavaScript", "TypeScript"] },
  {
    title: "BACKEND",
    chips: ["Microservices", "REST APIs", "Automated Testing", "Backend Development"],
  },
  {
    title: "AWS",
    chips: [
      "S3",
      "Lambda",
      "API Gateway",
      "DynamoDB",
      "CloudFront",
      "Glue",
      "Athena",
      "Kinesis",
      "EventBridge",
    ],
  },
  {
    title: "GCP",
    chips: ["Cloud Run", "Cloud Functions", "Pub/Sub", "BigQuery"],
  },
  {
    title: "DATA ENGINEERING",
    chips: ["Pipelines / ETL", "Data lakes", "Parquet", "Batch ingestion"],
  },
  { title: "INFRA & DEVOPS", chips: ["Terraform", "GitHub Actions", "CI/CD", "Linux", "Git"] },
];

export default function Stack() {
  return (
    <section id="stack" className="section section-alt">
      <div className="shell">
        <Reveal>
          <div className="section-heading">
            <span className="section-index mono">02</span>
            <h2>Stack &amp; skills</h2>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="stack-grid">
            {tiles.map((tile) => (
              <div key={tile.title} className="stack-tile">
                <h3 className="tile-kicker mono">{tile.title}</h3>
                <div className="chip-row">
                  {tile.chips.map((chip) => (
                    <span key={chip} className="chip mono">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
