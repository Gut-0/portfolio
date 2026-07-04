import Reveal from "./Reveal";

const certs = [
  {
    code: "CLF-C02",
    name: "AWS Certified Cloud Practitioner",
    status: "✓ Earned",
    tone: "pill-success",
  },
  {
    code: "SAA-C03",
    name: "AWS Certified Solutions Architect – Associate",
    status: "Scheduled · Jul 2026",
    tone: "pill-warning",
  },
];

export default function Certifications() {
  return (
    <section id="certifications" className="section section-alt">
      <div className="shell">
        <Reveal>
          <div className="section-heading">
            <span className="section-index mono">06</span>
            <h2>Certifications</h2>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="cert-table">
            {certs.map((cert) => (
              <div key={cert.code} className="cert-row">
                <span className="cert-code mono">{cert.code}</span>
                <span className="cert-name">{cert.name}</span>
                <span className={`pill mono ${cert.tone}`}>{cert.status}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
