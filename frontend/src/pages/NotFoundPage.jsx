import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="surface-card">
      <h2 className="text-3xl font-semibold">Page not found</h2>
      <p className="mt-3 text-sm" style={{ color: "rgb(var(--text-soft))" }}>
        That route does not exist in FitForge.
      </p>
      <Link className="button-primary mt-5" to="/">
        Back to dashboard
      </Link>
    </div>
  );
}

