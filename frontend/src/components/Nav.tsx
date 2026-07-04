const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#certifications", label: "Certifications" },
  { href: "#contact", label: "Contact" },
  // Phase 2: dashboard section plugs in here
  // { href: "#dashboard", label: "Data" },
];

export default function Nav() {
  return (
    <header className="nav">
      <nav className="container nav-inner" aria-label="Main">
        <a href="#top" className="nav-brand">
          gustavo<span className="accent">.borges</span>
        </a>
        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
