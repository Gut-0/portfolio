export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <div>
          <p className="footer-wordmark">Gustavo Borges</p>
          <p className="footer-line mono">Data / Cloud Engineer · Brazil · UTC−3</p>
          <p className="footer-line mono">
            React on S3 + CloudFront · Lambda + DynamoDB · Terraform + GitHub Actions
          </p>
        </div>
        <p className="footer-copy mono">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
