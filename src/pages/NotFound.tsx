import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="home" style={{ textAlign: "center" }}>
      <h1>404</h1>
      <p className="lead">
        We couldn't find that page in the Laravel Toaster Magic docs.
      </p>
      <div className="hero__cta">
        <Link className="btn btn--primary" to="/">
          Back home
        </Link>
        <Link className="btn btn--ghost" to="/docs/getting-started">
          Getting Started
        </Link>
      </div>
    </div>
  );
}
