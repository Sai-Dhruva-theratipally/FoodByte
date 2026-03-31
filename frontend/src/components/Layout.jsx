import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function PillLink({ to, children, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `pill${isActive ? " active" : ""}`}
    >
      {children}
    </NavLink>
  );
}

export default function Layout({ title, actions, children }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = String(user?.role || "").toUpperCase() === "ADMIN";

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <div className="brand">
            <img
              src="/foodbyte.svg"
              alt="FoodByte"
              width={28}
              height={28}
              style={{ display: "block" }}
            />
            <span>FoodByte</span>
          </div>

          <nav className="nav-links">
            <PillLink to="/restaurants" end>
              Restaurants
            </PillLink>
            <PillLink to="/categories">Categories</PillLink>
            <PillLink to="/cart">Cart</PillLink>
            <PillLink to="/orders">Orders</PillLink>
            {isAuthenticated && isAdmin ? <PillLink to="/admin">Admin</PillLink> : null}
          </nav>

          <div className="row">
            {isAuthenticated ? (
              <>
                <span className="muted small">
                  {user?.email}
                  {user?.role ? ` (${user.role})` : ""}
                </span>
                <button
                  className="button ghost"
                  type="button"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <PillLink to="/login">Login</PillLink>
                <PillLink to="/register">Register</PillLink>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div className="stack">
            {title ? <h1 className="h1">{title}</h1> : null}
          </div>
          <div className="row">{actions}</div>
        </div>

        <div style={{ height: 12 }} />
        {children}
      </main>
    </>
  );
}
