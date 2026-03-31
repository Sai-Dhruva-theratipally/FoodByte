import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import ErrorNotice from "../components/ErrorNotice";
import { listOrderHistory, listProducts, reorder } from "../services/food";
import { formatDateTime, formatMoney } from "../utils/format";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [productsById, setProductsById] = useState(() => new Map());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const [history, products] = await Promise.all([
        listOrderHistory(),
        listProducts(),
      ]);
      setOrders(Array.isArray(history) ? history : []);
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

  async function onReorder(orderId) {
    setBusy(true);
    setNotice(null);
    setError(null);
    try {
      const created = await reorder(orderId);
      setNotice(`Reordered successfully (#${created?.id})`);
      await refresh();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }

  const content = useMemo(() => {
    if (loading) return <div className="notice">Loading orders…</div>;
    if (!orders.length) return <div className="notice">No orders yet.</div>;

    return (
      <div className="stack">
        {orders.map((o) => (
          <div key={o.id} className="surface card stack">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div className="stack" style={{ gap: 2 }}>
                <div className="h2">Order #{o.id}</div>
                <div className="muted small">
                  {o.status} • {formatDateTime(o.createdAt)}
                </div>
              </div>
              <div className="stack" style={{ alignItems: "flex-end", gap: 2 }}>
                <div className="muted small">Total</div>
                <div className="h2">{formatMoney(o.totalAmount)}</div>
              </div>
            </div>

            <div className="surface card" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style={{ width: 90 }}>Qty</th>
                    <th style={{ width: 120 }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {(o.items || []).map((it) => {
                    const p = productsById.get(it.productId);
                    return (
                      <tr key={it.id}>
                        <td>
                          <div className="h2">{p?.name || `Product #${it.productId}`}</div>
                        </td>
                        <td>{it.quantity}</td>
                        <td>{formatMoney(it.price)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="row" style={{ justifyContent: "flex-end" }}>
              <button
                className="button"
                type="button"
                onClick={() => onReorder(o.id)}
                disabled={busy}
              >
                Reorder
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }, [busy, loading, orders, productsById]);

  return (
    <Layout
      title="Orders"
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
