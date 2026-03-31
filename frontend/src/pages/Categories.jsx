import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import ErrorNotice from "../components/ErrorNotice";
import { listCategories } from "../services/food";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await listCategories();
        if (mounted) setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const content = useMemo(() => {
    if (loading) return <div className="notice">Loading categories…</div>;
    if (categories.length === 0)
      return <div className="notice">No categories yet.</div>;

    return (
      <div className="grid">
        {categories.map((c) => (
          <div key={c.id} className="surface card stack">
            <img
              className="media"
              src={c.imageUrl || "/foodbyte.svg"}
              alt={c.name}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "/foodbyte.svg";
              }}
            />
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div className="h2">{c.name}</div>
              <span className="kbd">#{c.id}</span>
            </div>
            <div className="muted small">{c.description || ""}</div>
          </div>
        ))}
      </div>
    );
  }, [categories, loading]);

  return (
    <Layout title="Categories">
      <ErrorNotice error={error} />
      {content}
    </Layout>
  );
}
