import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import ErrorNotice from "../components/ErrorNotice";
import { listRestaurants } from "../services/food";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await listRestaurants();
        if (mounted) setRestaurants(Array.isArray(data) ? data : []);
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
    if (loading) return <div className="notice">Loading restaurants…</div>;
    if (restaurants.length === 0)
      return (
        <div className="notice">
          No restaurants yet. Create one in Admin.
        </div>
      );

    return (
      <div className="grid">
        {restaurants.map((r) => (
          <div key={r.id} className="surface card stack">
            <img
              className="media"
              src={r.imageUrl || "/foodbyte.svg"}
              alt={r.name}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "/foodbyte.svg";
              }}
            />
            <div className="stack" style={{ gap: 2 }}>
              <div className="h2">{r.name}</div>
              <div className="muted small">{r.address || ""}</div>
            </div>
            <div className="muted small">{r.description || ""}</div>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <Link className="button" to={`/restaurants/${r.id}`}>
                View menu
              </Link>
              <span className="kbd">#{r.id}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }, [loading, restaurants]);

  return (
    <Layout title="Restaurants">
      <ErrorNotice error={error} />
      {content}
    </Layout>
  );
}
