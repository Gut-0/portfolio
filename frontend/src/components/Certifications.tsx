import { profile } from "../data/profile";

export default function Certifications() {
  return (
    <section id="certifications" className="container section">
      <h2>
        <span className="mono accent">04.</span> Certifications
      </h2>
      <ul className="cert-list">
        {profile.certifications.map((cert) => (
          <li className="card cert-item" key={cert.name}>
            <span className="cert-name">{cert.name}</span>
            <span className="cert-status mono">{cert.status}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
