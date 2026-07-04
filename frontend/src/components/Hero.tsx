import { profile } from "../data/profile";

export default function Hero() {
  return (
    <section id="top" className="hero container">
      <p className="hero-kicker mono">{profile.location}</p>
      <h1>
        {profile.name}
        <br />
        <span className="accent">{profile.headline}</span>
      </h1>
      <p className="hero-tagline mono">{profile.tagline}</p>
      <p className="hero-positioning">{profile.positioning}</p>
      <div className="hero-actions">
        <a className="btn btn-primary" href="#projects">
          View projects
        </a>
        <a className="btn btn-ghost" href="#contact">
          Get in touch
        </a>
      </div>
    </section>
  );
}
