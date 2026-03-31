import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

function Home() {
  const token = localStorage.getItem("token");

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-copy">
          <PageHeader
            title="Order food without the confusion"
            subtitle="A clean hackathon-ready food ordering frontend built with React, Router, and Axios."
          />
          <div className="hero-actions">
            <Link to={token ? "/restaurants" : "/login"} className="primary-button">
              {token ? "Browse Restaurants" : "Login to Start"}
            </Link>
            <Link to="/register" className="secondary-button">
              Create Account
            </Link>
          </div>
        </div>

        <div className="hero-panel">
          <h3>What you can do</h3>
          <ul>
            <li>Browse restaurants and menus</li>
            <li>Add items to cart and update quantity</li>
            <li>Place orders and check order history</li>
            <li>Keep auth token in localStorage</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

export default Home;
