import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function NotFoundPage() {
  return (
    <Layout title="Not found">
      <div className="surface card stack" style={{ maxWidth: 520 }}>
        <div className="muted">That page doesn’t exist.</div>
        <Link className="button" to="/restaurants">
          Go to restaurants
        </Link>
      </div>
    </Layout>
  );
}
