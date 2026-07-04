import { profile } from "../data/profile";

export default function About() {
  return (
    <section id="about" className="container section">
      <h2>
        <span className="mono accent">01.</span> About
      </h2>
      <div className="about-grid">
        <div className="about-text">
          {profile.about.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <aside className="about-aside">
          <h3 className="mono">Languages</h3>
          <ul>
            {profile.languages.map((lang) => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
