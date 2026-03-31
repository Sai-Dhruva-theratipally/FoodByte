import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import Message from "../components/Message";
import PageHeader from "../components/PageHeader";
import {
  getCart,
  placeOrder,
  removeCartItem,
  updateCartItem,
} from "../services/api";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCartItems(Array.isArray(data) ? data : data.items || []);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (id, quantity) => {
    if (quantity < 1) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await updateCartItem(id, { quantity });
      setMessage("Cart updated.");
      fetchCart();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not update quantity.");
    }
  };

  const handleRemoveItem = async (id) => {
    setError("");
    setMessage("");

    try {
      await removeCartItem(id);
      setMessage("Item removed from cart.");
      fetchCart();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not remove item.");
    }
  };

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    setError("");
    setMessage("");

    try {
      await placeOrder();
      setMessage("Order placed successfully.");
      fetchCart();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => {
    const price = item.price || item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <main className="page">
      <PageHeader title="Cart" subtitle="Review your selected items before placing the order." />

      {loading ? <Loading text="Loading cart..." /> : null}
      <Message type="error" text={error} />
      <Message type="success" text={message} />

      {!loading && !error ? (
        <div className="stack-layout">
          {cartItems.length > 0 ? (
            <>
              <div className="list-card">
                {cartItems.map((item) => (
                  <div className="list-row" key={item.id}>
                    <div>
                      <h3>{item.product?.name || item.name}</h3>
                      <p className="muted-text">Rs. {item.product?.price || item.price}</p>
                    </div>

                    <div className="quantity-controls">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="summary-card">
                <h3>Total: Rs. {totalAmount}</h3>
                <button
                  type="button"
                  className="primary-button"
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                >
                  {placingOrder ? "Placing order..." : "Place Order"}
                </button>
              </div>
            </>
          ) : (
            <div className="status-card">Your cart is empty.</div>
          )}
        </div>
      ) : null}
    </main>
  );
}

export default Cart;
