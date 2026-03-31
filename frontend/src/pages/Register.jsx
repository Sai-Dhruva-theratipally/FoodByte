import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import ErrorNotice from "../components/ErrorNotice";
import { useAuth } from "../auth/AuthContext";
import { register } from "../services/auth";

export default function RegisterPage() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await register({
        email,
        name,
        password,
        role,
      });
      setAuth(data);
      const isAdmin = String(data?.role || role || "").toUpperCase() === "ADMIN";
      navigate(isAdmin ? "/admin" : "/restaurants");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Create account">
      <div className="surface card" style={{ maxWidth: 520, margin: "0 auto" }}>
        <form className="stack" onSubmit={onSubmit}>
          <ErrorNotice error={error} />

          <div className="stack" style={{ gap: 6 }}>
            <label className="small muted">Name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              minLength={2}
              required
            />
          </div>

          <div className="stack" style={{ gap: 6 }}>
            <label className="small muted">Email</label>
            <input
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="stack" style={{ gap: 6 }}>
            <label className="small muted">Password</label>
            <input
              className="input"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              minLength={6}
              required
            />
          </div>

          <div className="stack" style={{ gap: 6 }}>
            <label className="small muted">Account type</label>
            <select
              className="select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="notice">
            Admin registration can be disabled by the server. If it fails, register as User or set
            <span className="kbd" style={{ marginLeft: 6 }}>APP_ALLOW_ADMIN_REGISTRATION=true</span>.
          </div>

          <div className="row" style={{ justifyContent: "space-between" }}>
            <button className="button primary" type="submit" disabled={loading}>
              {loading ? "Creating…" : "Create account"}
            </button>
            <span className="small muted">
              Already have an account? <Link to="/login">Login</Link>
            </span>
          </div>
        </form>
      </div>
    </Layout>
  );
}
