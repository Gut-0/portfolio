import { useState } from "react";
import type { FormEvent } from "react";
import { profile } from "../data/profile";

const API_URL = import.meta.env.VITE_API_URL as string | undefined;

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    if (!API_URL) {
      // API not wired yet (local dev without backend) — fall back to mailto
      const subject = encodeURIComponent(`Portfolio contact from ${data.name}`);
      const body = encodeURIComponent(String(data.message));
      window.location.href = `mailto:${profile.links.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="container section">
      <h2>
        <span className="mono accent">05.</span> Contact
      </h2>
      <div className="contact-grid">
        <div className="contact-intro">
          <p>
            Open to remote Cloud &amp; Backend Engineer roles (US / EU). The fastest way to reach
            me is this form — it runs on the same API described in the projects above.
          </p>
          <ul className="contact-links mono">
            <li>
              <a href={profile.links.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={`mailto:${profile.links.email}`}>{profile.links.email}</a>
            </li>
          </ul>
        </div>
        <form className="contact-form card" onSubmit={handleSubmit}>
          <label>
            Name
            <input name="name" type="text" required maxLength={120} autoComplete="name" />
          </label>
          <label>
            Email
            <input name="email" type="email" required maxLength={254} autoComplete="email" />
          </label>
          <label>
            Message
            <textarea name="message" required maxLength={4000} rows={5} />
          </label>
          <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
          {status === "sent" && <p className="form-note ok">Message sent — thank you!</p>}
          {status === "error" && (
            <p className="form-note err">
              Something went wrong. Email me at {profile.links.email} instead.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
