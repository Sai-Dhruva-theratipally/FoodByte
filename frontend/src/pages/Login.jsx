import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import ErrorNotice from "../components/ErrorNotice";
import { useAuth } from "../auth/AuthContext";
import { login } from "../services/auth";

export default function LoginPage() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAs, setLoginAs] = useState("USER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await login({ email, password });

      const actualRole = String(data?.role || "").toUpperCase();
      const desiredRole = String(loginAs || "").toUpperCase();
      if (desiredRole && actualRole && desiredRole !== actualRole) {
        throw `This account is not ${desiredRole}.`;
      }

      setAuth(data);
      const isAdmin = actualRole === "ADMIN";
      const next = params.get("next") || (isAdmin ? "/admin" : "/restaurants");
      navigate(next);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Login">
      <div className="surface card" style={{ maxWidth: 520, margin: "0 auto" }}>
        <form className="stack" onSubmit={onSubmit}>
          <ErrorNotice error={error} />

          <div className="notice">
            Sign in with your User or Admin account.
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="stack" style={{ gap: 6 }}>
            <label className="small muted">Login as</label>
            <select
              className="select"
              value={loginAs}
              onChange={(e) => setLoginAs(e.target.value)}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="row" style={{ justifyContent: "space-between" }}>
            <button className="button primary" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
            <span className="small muted">
              New here? <Link to="/register">Create account</Link>
            </span>
          </div>
        </form>
      </div>
    </Layout>
  );
}
