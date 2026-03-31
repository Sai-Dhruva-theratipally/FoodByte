import API from "./api";

export async function getMediaStatus() {
  const { data } = await API.get("/admin/media/status");
  return data;
}

export async function uploadImage(file, folder) {
  const form = new FormData();
  form.append("file", file);
  if (folder) form.append("folder", folder);

  const { data } = await API.post("/admin/media/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function createCategory(payload) {
  const { data } = await API.post("/admin/categories", payload);
  return data;
}

export async function createRestaurant(payload) {
  const { data } = await API.post("/admin/restaurants", payload);
  return data;
}

export async function createProduct(payload) {
  const { data } = await API.post("/admin/products", payload);
  return data;
}
