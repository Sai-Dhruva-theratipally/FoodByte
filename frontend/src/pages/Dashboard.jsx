import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {user.name || "User"}!</h1>
      <p>You are logged in as <strong>{user.email}</strong> ({user.role}).</p>
      <button className="logout-btn" onClick={handleLogout}>
        Sign Out
      </button>
    </div>
  );
}
