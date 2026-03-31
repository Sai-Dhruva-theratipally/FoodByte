import API from "./api";

export async function getHealth() {
  const { data } = await API.get("/health");
  return data;
}

export async function listRestaurants() {
  const { data } = await API.get("/restaurants");
  return data;
}

export async function listCategories() {
  const { data } = await API.get("/categories");
  return data;
}

export async function listProducts() {
  const { data } = await API.get("/products");
  return data;
}

export async function listPopularProducts() {
  const { data } = await API.get("/products/popular");
  return data;
}

export async function listProductsByRestaurant(restaurantId) {
  const { data } = await API.get(`/products/${restaurantId}`);
  return data;
}

export async function getCart() {
  const { data } = await API.get("/cart");
  return data;
}

export async function addToCart(productId, quantity) {
  const { data } = await API.post("/cart/add", { productId, quantity });
  return data;
}

export async function updateCartItem(cartItemId, quantity) {
  const { data } = await API.put(`/cart/update/${cartItemId}`, null, {
    params: { quantity },
  });
  return data;
}

export async function removeCartItem(cartItemId) {
  await API.delete(`/cart/remove/${cartItemId}`);
}

export async function createOrder(notes) {
  const { data } = await API.post("/orders", { notes: notes || "" });
  return data;
}

export async function listOrderHistory() {
  const { data } = await API.get("/orders/history");
  return data;
}

export async function reorder(orderId) {
  const { data } = await API.post(`/orders/${orderId}/reorder`);
  return data;
}
