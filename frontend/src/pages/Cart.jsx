import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import ErrorNotice from "../components/ErrorNotice";
import {
  createOrder,
  getCart,
  listProducts,
  removeCartItem,
  updateCartItem,
} from "../services/food";
import { formatMoney } from "../utils/format";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [productsById, setProductsById] = useState(() => new Map());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [notes, setNotes] = useState("");

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const [c, products] = await Promise.all([getCart(), listProducts()]);
      setCart(c);
      const map = new Map();
      (Array.isArray(products) ? products : []).forEach((p) => map.set(p.id, p));
      setProductsById(map);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = cart?.items || [];

  async function onUpdate(itemId, quantity) {
    setBusy(true);
    setNotice(null);
    setError(null);
    try {
      await updateCartItem(itemId, quantity);
      await refresh();
      setNotice("Cart updated");
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }

  async function onRemove(itemId) {
    setBusy(true);
    setNotice(null);
    setError(null);
    try {
      await removeCartItem(itemId);
      await refresh();
      setNotice("Item removed");
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }

  async function onCheckout() {
    setBusy(true);
    setNotice(null);
    setError(null);
    try {
      const order = await createOrder(notes);
      setNotes("");
      await refresh();
      setNotice(`Order created (#${order?.id})`);
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }

  const estimatedTotal = useMemo(() => {
    if (!items.length) return 0;
    let sum = 0;
    for (const it of items) {
      const p = productsById.get(it.productId);
      const price = Number(p?.price || 0);
      sum += price * Number(it.quantity || 0);
    }
    return sum;
  }, [items, productsById]);

  const content = useMemo(() => {
    if (loading) return <div className="notice">Loading cart…</div>;

    if (!items.length) {
      return <div className="notice">Your cart is empty.</div>;
    }

    return (
      <div className="surface card stack">
        <table className="table">
          <thead>
            <tr>
              <th>Item</th>
              <th style={{ width: 110 }}>Qty</th>
              <th style={{ width: 120 }}>Price</th>
              <th style={{ width: 120 }}>Total</th>
              <th style={{ width: 120 }} />
            </tr>
          </thead>
          <tbody>
            {items.map((it) => {
              const p = productsById.get(it.productId);
              const unit = Number(p?.price || 0);
              const line = unit * Number(it.quantity || 0);

              return (
                <tr key={it.id}>
                  <td>
                    <div className="stack" style={{ gap: 2 }}>
                      <div className="h2">{p?.name || `Product #${it.productId}`}</div>
                      <div className="muted small">CartItem #{it.id}</div>
                    </div>
                  </td>
                  <td>
                    <div className="row" style={{ gap: 6, flexWrap: "nowrap" }}>
                      <button
                        className="button ghost"
                        type="button"
                        onClick={() => onUpdate(it.id, Math.max(1, Number(it.quantity || 1) - 1))}
                        disabled={busy || Number(it.quantity || 1) <= 1}
                      >
                        -
                      </button>
                      <span className="kbd">{it.quantity}</span>
                      <button
                        className="button ghost"
                        type="button"
                        onClick={() => onUpdate(it.id, Number(it.quantity || 1) + 1)}
                        disabled={busy}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>{formatMoney(unit)}</td>
                  <td>{formatMoney(line)}</td>
                  <td>
                    <button
                      className="button danger"
                      type="button"
                      onClick={() => onRemove(it.id)}
                      disabled={busy}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="row" style={{ justifyContent: "space-between" }}>
          <div className="stack" style={{ gap: 6, minWidth: 260 }}>
            <label className="small muted">Order notes (optional)</label>
            <input
              className="input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., No onions"
              maxLength={500}
              disabled={busy}
            />
          </div>

          <div className="stack" style={{ alignItems: "flex-end" }}>
            <div className="muted small">Estimated total</div>
            <div className="h2">{formatMoney(estimatedTotal)}</div>
            <button
              className="button primary"
              type="button"
              onClick={onCheckout}
              disabled={busy}
            >
              Place order
            </button>
          </div>
        </div>
      </div>
    );
  }, [busy, estimatedTotal, items, loading, notes, productsById]);

  return (
    <Layout
      title="Cart"
      actions={
        <button
          className="button ghost"
          type="button"
          onClick={refresh}
          disabled={loading || busy}
        >
          Refresh
        </button>
      }
    >
      {notice ? <div className="notice">{notice}</div> : null}
      <ErrorNotice error={error} />
      {content}
    </Layout>
  );
}