import axios from "axios";

const TOKEN_KEY = "token";
const USER_KEY = "user";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const saveAuth = (authData) => {
  if (!authData?.token) {
    return;
  }

  localStorage.setItem(TOKEN_KEY, authData.token);
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      userId: authData.userId,
      name: authData.name,
      email: authData.email,
      role: authData.role,
      type: authData.type,
    })
  );
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = () => {
  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    clearAuth();
    return null;
  }
};

export const getErrorMessage = (error, fallbackMessage) => {
  return error.response?.data?.message || fallbackMessage;
};

export const loginUser = async (payload) => {
  const response = await api.post("/auth/login", payload);
  return response.data;
};

export const registerUser = async (payload) => {
  const response = await api.post("/auth/register", payload);
  return response.data;
};

export const getRestaurants = async () => {
  const response = await api.get("/restaurants");
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const getProductsByRestaurant = async (restaurantId) => {
  const response = await api.get(`/products/${restaurantId}`);
  return response.data;
};

export const addToCart = async (payload) => {
  const response = await api.post("/cart/add", payload);
  return response.data;
};

export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

export const updateCartItem = async (id, quantity) => {
  const response = await api.put(`/cart/update/${id}`, null, {
    params: { quantity },
  });
  return response.data;
};

export const removeCartItem = async (id) => {
  await api.delete(`/cart/remove/${id}`);
};

export const placeOrder = async (notes = "") => {
  const response = await api.post("/orders", { notes });
  return response.data;
};

export const getOrderHistory = async () => {
  const response = await api.get("/orders/history");
  return response.data;
};

export default api;
