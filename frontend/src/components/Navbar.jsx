import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearAuth, getStoredUser } from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        FoodByte
      </Link>

      <nav className="nav-links">
        {token ? <span className="nav-user">Hi, {user?.name || "User"}</span> : null}
        <NavLink to="/">Home</NavLink>
        <NavLink to="/restaurants">Restaurants</NavLink>
        <NavLink to="/cart">Cart</NavLink>
        <NavLink to="/orders">Orders</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        {token ? (
          <button type="button" className="nav-button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
