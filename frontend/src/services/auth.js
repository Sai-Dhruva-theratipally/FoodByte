import API from "./api";

export async function register({ email, name, password, role }) {
  const body = { email, name, password };
  if (role) body.role = role;
  const { data } = await API.post("/auth/register", body);
  return data;
}

export async function login({ email, password }) {
  const { data } = await API.post("/auth/login", { email, password });
  return data;
}
