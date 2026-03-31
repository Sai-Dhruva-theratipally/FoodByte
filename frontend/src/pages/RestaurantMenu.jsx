import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import ErrorNotice from "../components/ErrorNotice";
import { addToCart, listProductsByRestaurant } from "../services/food";
import { formatMoney } from "../utils/format";
import { useAuth } from "../auth/AuthContext";

export default function RestaurantMenuPage() {
  const { id } = useParams();
  const restaurantId = Number(id);

  const { isAuthenticated } = useAuth();

  const [products, setProducts] = useState([]);
  const [qty, setQty] = useState(() => new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await listProductsByRestaurant(restaurantId);
        if (mounted) setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [restaurantId]);

  const restaurantName = products[0]?.restaurantName;

  function getQty(productId) {
    return Math.max(1, Number(qty.get(productId) || 1));
  }

  function bumpQty(productId, delta) {
    const current = getQty(productId);
    const nextValue = Math.max(1, Math.min(99, current + delta));
    const next = new Map(qty);
    next.set(productId, nextValue);
    setQty(next);
  }

  async function onAdd(productId) {
    setNotice(null);
    setError(null);
    const q = getQty(productId);
    try {
      await addToCart(productId, q);
      setNotice("Added to cart");
    } catch (err) {
      setError(err);
    }
  }

  const content = useMemo(() => {
    if (loading) return <div className="notice">Loading menu…</div>;
    if (products.length === 0)
      return (
        <div className="notice">
          No products for this restaurant yet.
        </div>
      );

    return (
      <div className="grid">
        {products.map((p) => (
          <div key={p.id} className="surface card stack">
            <img
              className="media"
              src={p.imageUrl || "/foodbyte.svg"}
              alt={p.name}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "/foodbyte.svg";
              }}
            />
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div className="h2">{p.name}</div>
              <span className="kbd">{formatMoney(p.price)}</span>
            </div>
            <div className="muted small">{p.description || ""}</div>

            <div className="row" style={{ justifyContent: "space-between" }}>
              <span className="muted small">
                {p.available ? "Available" : "Unavailable"}
              </span>
              {isAuthenticated ? (
                <div className="row">
                  <button
                    className="button ghost"
                    type="button"
                    onClick={() => bumpQty(p.id, -1)}
                    disabled={!p.available}
                  >
                    -
                  </button>
                  <span className="kbd">{getQty(p.id)}</span>
                  <button
                    className="button ghost"
                    type="button"
                    onClick={() => bumpQty(p.id, 1)}
                    disabled={!p.available}
                  >
                    +
                  </button>
                  <button
                    className="button primary"
                    type="button"
                    onClick={() => onAdd(p.id)}
                    disabled={!p.available}
                  >
                    Add
                  </button>
                </div>
              ) : (
                <Link className="button" to={`/login?next=${encodeURIComponent(`/restaurants/${restaurantId}`)}`}>
                  Login to add
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }, [isAuthenticated, loading, products, qty, restaurantId]);

  return (
    <Layout
      title={restaurantName ? `Menu • ${restaurantName}` : `Menu • #${restaurantId}`}
      actions={
        <Link className="button ghost" to="/restaurants">
          Back
        </Link>
      }
    >
      {notice ? <div className="notice">{notice}</div> : null}
      <ErrorNotice error={error} />
      {content}
    </Layout>
  );
}
