import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import Message from "../components/Message";
import PageHeader from "../components/PageHeader";
import { getOrderHistory } from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrderHistory();
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Could not load order history.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <main className="page">
      <PageHeader title="Orders" subtitle="Track your past orders in one place." />

      {loading ? <Loading text="Loading orders..." /> : null}
      <Message type="error" text={error} />

      {!loading && !error ? (
        <div className="stack-layout">
          {orders.length > 0 ? (
            orders.map((order) => (
              <article className="card" key={order.id}>
                <h3>Order #{order.id}</h3>
                <p>Status: {order.status || "Placed"}</p>
                <p>Total: Rs. {order.totalAmount || order.total || 0}</p>
                <p className="muted-text">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "Date not available"}
                </p>
              </article>
            ))
          ) : (
            <div className="status-card">No orders found.</div>
          )}
        </div>
      ) : null}
    </main>
  );
}

export default Orders;
