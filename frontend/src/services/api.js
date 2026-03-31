import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

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

export const updateCartItem = async (id, payload) => {
  const response = await api.put(`/cart/update/${id}`, payload);
  return response.data;
};

export const removeCartItem = async (id) => {
  const response = await api.delete(`/cart/remove/${id}`);
  return response.data;
};

export const placeOrder = async () => {
  const response = await api.post("/orders");
  return response.data;
};

export const getOrderHistory = async () => {
  const response = await api.get("/orders/history");
  return response.data;
};

export default api;
