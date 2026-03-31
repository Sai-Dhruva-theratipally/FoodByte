import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import Message from "../components/Message";
import PageHeader from "../components/PageHeader";
import { getErrorMessage, getOrderHistory, getProducts } from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [ordersData, productsData] = await Promise.all([
          getOrderHistory(),
          getProducts(),
        ]);
        const products = Array.isArray(productsData) ? productsData : [];
        const productMap = products.reduce((map, product) => {
          map[product.id] = product;
          return map;
        }, {});

        const formattedOrders = (Array.isArray(ordersData) ? ordersData : []).map((order) => ({
          ...order,
          items: (order.items || []).map((item) => ({
            ...item,
            product: productMap[item.productId] || null,
          })),
        }));

        setOrders(formattedOrders);
      } catch (apiError) {
        setError(getErrorMessage(apiError, "Could not load order history."));
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
                <p>Status: {order.status || "PENDING"}</p>
                <p>Total: Rs. {Number(order.totalAmount || 0).toFixed(2)}</p>
                <p className="muted-text">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "Date not available"}
                </p>
                <div className="order-items">
                  {(order.items || []).map((item) => (
                    <p key={item.id} className="muted-text">
                      {item.product?.name || `Product #${item.productId}`} x {item.quantity}
                    </p>
                  ))}
                </div>
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
