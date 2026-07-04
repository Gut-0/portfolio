import { useEffect, useState } from "react";

const links = [
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "work", label: "Work" },
  { id: "architecture", label: "Architecture" },
  { id: "dashboard", label: "Dashboard" },
];

export default function Header() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        setActive(visible.values().next().value ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="header">
      <div className="shell header-inner">
        <a href="#top" className="wordmark">
          Gustavo Borges <span className="wordmark-tag mono">CLOUD · BACKEND</span>
        </a>
        <nav className="header-nav" aria-label="Main">
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} className={active === l.id ? "active" : ""}>
              {l.label}
            </a>
          ))}
          <a href="#wall" className="header-cta">
            Sign the wall
          </a>
        </nav>
      </div>
    </header>
  );
}
