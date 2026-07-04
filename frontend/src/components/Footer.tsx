const contacts = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/theothergustavoborges/?locale=en-US",
    text: "in/theothergustavoborges",
  },
  { label: "GitHub", href: "https://github.com/Gut-0", text: "github.com/Gut-0" },
];

export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="shell footer-inner">
        <div>
          <p className="footer-wordmark">Gustavo Borges</p>
          <p className="footer-line mono">Cloud &amp; Backend Engineer (Python) · Brazil · UTC−3</p>
          <p className="footer-line mono">
            React on S3 + CloudFront · Lambda + DynamoDB · Terraform + GitHub Actions
          </p>
        </div>
        <div className="footer-contact">
          <ul className="footer-contact-list mono">
            {contacts.map((c) => (
              <li key={c.label}>
                <a href={c.href} target={c.href.startsWith("mailto") ? undefined : "_blank"} rel="noreferrer">
                  {c.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="footer-copy mono">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
