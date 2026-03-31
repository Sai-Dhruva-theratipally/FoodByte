import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Message from "../components/Message";
import PageHeader from "../components/PageHeader";
import { getErrorMessage, registerUser, saveAuth } from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await registerUser(formData);
      saveAuth(data);
      setSuccess("Registration successful.");
      setTimeout(() => navigate("/restaurants"), 800);
    } catch (apiError) {
      setError(getErrorMessage(apiError, "Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page narrow-page">
      <PageHeader title="Register" subtitle="Create your account to start ordering food." />

      <form className="form-card" onSubmit={handleSubmit}>
        <Message type="error" text={error} />
        <Message type="success" text={success} />

        <label>
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </label>

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
            placeholder="Create a password"
            required
          />
        </label>

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="helper-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </main>
  );
}

export default Register;
