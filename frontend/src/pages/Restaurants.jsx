import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import Message from "../components/Message";
import PageHeader from "../components/PageHeader";
import { getRestaurants } from "../services/api";

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(Array.isArray(data) ? data : data.restaurants || []);
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Could not load restaurants.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <main className="page">
      <PageHeader
        title="Restaurants"
        subtitle="Choose a restaurant and explore the available menu items."
      />

      {loading ? <Loading text="Loading restaurants..." /> : null}
      <Message type="error" text={error} />

      {!loading && !error ? (
        <div className="card-grid">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <article className="card" key={restaurant.id}>
                <h3>{restaurant.name}</h3>
                <p>{restaurant.description || "Fresh meals and quick delivery."}</p>
                <p className="muted-text">{restaurant.address || "Address not available"}</p>
                <Link
                  to={`/restaurants/${restaurant.id}`}
                  className="primary-button inline-button"
                >
                  View Menu
                </Link>
              </article>
            ))
          ) : (
            <div className="status-card">No restaurants found.</div>
          )}
        </div>
      ) : null}
    </main>
  );
}

export default Restaurants;
