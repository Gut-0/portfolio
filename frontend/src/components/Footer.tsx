import { profile } from "../data/profile";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner mono">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>
          Built with React · deployed on AWS (S3 + CloudFront + Lambda) · provisioned with
          Terraform
        </span>
      </div>
    </footer>
  );
}
