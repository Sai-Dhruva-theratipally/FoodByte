import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import Message from "../components/Message";
import PageHeader from "../components/PageHeader";
import { addToCart, getProductsByRestaurant } from "../services/api";

function RestaurantDetails() {
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getProductsByRestaurant(restaurantId);
        setMenuItems(Array.isArray(data) ? data : data.products || []);
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Could not load menu items.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [restaurantId]);

  const handleAddToCart = async (productId) => {
    setMessage("");
    setError("");

    try {
      await addToCart({ productId, quantity: 1 });
      setMessage("Item added to cart.");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not add item to cart.");
    }
  };

  return (
    <main className="page">
      <PageHeader
        title="Restaurant Menu"
        subtitle="Browse menu items and add what you like to your cart."
      />

      {loading ? <Loading text="Loading menu..." /> : null}
      <Message type="error" text={error} />
      <Message type="success" text={message} />

      {!loading && !error ? (
        <div className="card-grid">
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <article className="card" key={item.id}>
                <h3>{item.name}</h3>
                <p>{item.description || "Tasty and freshly prepared."}</p>
                <p className="price-text">Rs. {item.price}</p>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => handleAddToCart(item.id)}
                >
                  Add to Cart
                </button>
              </article>
            ))
          ) : (
            <div className="status-card">No menu items available.</div>
          )}
        </div>
      ) : null}
    </main>
  );
}

export default RestaurantDetails;
