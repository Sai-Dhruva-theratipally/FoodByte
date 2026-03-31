import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Message from "../components/Message";
import PageHeader from "../components/PageHeader";
import { getErrorMessage, loginUser, saveAuth } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(formData);
      saveAuth(data);
      navigate("/restaurants");
    } catch (apiError) {
      setError(getErrorMessage(apiError, "Login failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page narrow-page">
      <PageHeader title="Login" subtitle="Sign in to order food and manage your cart." />

      <form className="form-card" onSubmit={handleSubmit}>
        <Message type="error" text={error} />

        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </label>

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="helper-text">
          New user? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </main>
  );
}

export default Login;
