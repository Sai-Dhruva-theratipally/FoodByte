import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import ErrorNotice from "../components/ErrorNotice";
import { useAuth } from "../auth/AuthContext";
import { listCategories, listProducts, listRestaurants } from "../services/food";
import {
  createCategory,
  createProduct,
  createRestaurant,
  getMediaStatus,
  uploadImage,
} from "../services/admin";

export default function AdminPage() {
  const { user } = useAuth();
  const isAdmin = String(user?.role || "").toUpperCase() === "ADMIN";

  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [mediaStatus, setMediaStatus] = useState(null);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadFolder, setUploadFolder] = useState("");
  const [lastUploadUrl, setLastUploadUrl] = useState(null);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  const [restaurantForm, setRestaurantForm] = useState({
    name: "",
    address: "",
    description: "",
    imageUrl: "",
  });

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    price: "",
    restaurantId: "",
    categoryId: "",
    available: true,
  });

  async function refreshLookups() {
    const [r, c, p] = await Promise.all([listRestaurants(), listCategories(), listProducts()]);
    setRestaurants(Array.isArray(r) ? r : []);
    setCategories(Array.isArray(c) ? c : []);
    setProducts(Array.isArray(p) ? p : []);
  }

  useEffect(() => {
    refreshLookups().catch(() => {
      // ignore (page can still work partially)
    });
  }, []);

  async function refreshMediaStatus() {
    setMediaLoading(true);
    setError(null);
    try {
      const status = await getMediaStatus();
      setMediaStatus(status);
    } catch (err) {
      setError(err);
    } finally {
      setMediaLoading(false);
    }
  }

  useEffect(() => {
    if (isAdmin) refreshMediaStatus();
  }, [isAdmin]);

  async function onUpload() {
    setError(null);
    setNotice(null);
    setLastUploadUrl(null);

    if (!uploadFile) {
      setError("Choose an image file to upload");
      return;
    }

    setUploading(true);
    try {
      const res = await uploadImage(uploadFile, uploadFolder || undefined);
      setLastUploadUrl(res?.url || null);
      setNotice("Image uploaded");
    } catch (err) {
      setError(err);
    } finally {
      setUploading(false);
    }
  }

  async function onCreateCategory(e) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    try {
      await createCategory({
        name: categoryForm.name,
        description: categoryForm.description || null,
        imageUrl: categoryForm.imageUrl || null,
      });
      setNotice("Category created");
      setCategoryForm({ name: "", description: "", imageUrl: "" });
      await refreshLookups();
    } catch (err) {
      setError(err);
    }
  }

  async function onCreateRestaurant(e) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    try {
      await createRestaurant({
        name: restaurantForm.name,
        address: restaurantForm.address,
        description: restaurantForm.description || null,
        imageUrl: restaurantForm.imageUrl || null,
      });
      setNotice("Restaurant created");
      setRestaurantForm({ name: "", address: "", description: "", imageUrl: "" });
      await refreshLookups();
    } catch (err) {
      setError(err);
    }
  }

  async function onCreateProduct(e) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    const priceNum = Number(productForm.price);
    const restaurantIdNum = Number(productForm.restaurantId);
    const categoryIdNum = productForm.categoryId ? Number(productForm.categoryId) : null;

    try {
      await createProduct({
        name: productForm.name,
        description: productForm.description || null,
        imageUrl: productForm.imageUrl || null,
        price: Number.isFinite(priceNum) ? priceNum : 0,
        restaurantId: Number.isFinite(restaurantIdNum) ? restaurantIdNum : null,
        categoryId: Number.isFinite(categoryIdNum) ? categoryIdNum : null,
        available: Boolean(productForm.available),
      });
      setNotice("Product created");
      setProductForm({
        name: "",
        description: "",
        imageUrl: "",
        price: "",
        restaurantId: "",
        categoryId: "",
        available: true,
      });
    } catch (err) {
      setError(err);
    }
  }

  const actions = useMemo(() => {
    if (!isAdmin) return null;
    return (
      <div className="row">
        <button
          className="button ghost"
          type="button"
          onClick={() => {
            refreshLookups().catch(() => {});
            refreshMediaStatus();
          }}
          disabled={mediaLoading}
        >
          Refresh
        </button>
      </div>
    );
  }, [isAdmin, mediaLoading]);

  const restaurantCount = restaurants.length;
  const categoryCount = categories.length;
  const productCount = products.length;

  return (
    <Layout title="Admin" actions={actions}>
      {notice ? <div className="notice">{notice}</div> : null}
      <ErrorNotice error={error} />

      {!isAdmin ? (
        <div className="notice error">
          Admin access required. Your account role is: {user?.role || "unknown"}.
        </div>
      ) : null}

      {isAdmin ? (
        <div className="stack">
          <section className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            <div className="surface card stack">
              <div className="muted small">Restaurants</div>
              <div className="h1">{restaurantCount}</div>
              <div className="muted small">
                {restaurantCount === 0 ? "Create your first restaurant below." : "Ready to serve menus."}
              </div>
            </div>
            <div className="surface card stack">
              <div className="muted small">Categories</div>
              <div className="h1">{categoryCount}</div>
              <div className="muted small">
                {categoryCount === 0 ? "Add menu categories below." : "Categories available."}
              </div>
            </div>
            <div className="surface card stack">
              <div className="muted small">Items</div>
              <div className="h1">{productCount}</div>
              <div className="muted small">
                {productCount === 0 ? "Add products below." : "Items available."}
              </div>
            </div>
          </section>

          <section className="surface card stack">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div className="h2">Media (local storage)</div>
              <button
                className="button ghost"
                type="button"
                onClick={refreshMediaStatus}
                disabled={mediaLoading}
              >
                {mediaLoading ? "Checking…" : "Check status"}
              </button>
            </div>

            {mediaStatus ? (
              <div className="row">
                <span className="kbd">
                  Configured: {mediaStatus.configured ? "YES" : "NO"}
                </span>
                <span className="kbd">Ping: {mediaStatus.pingOk ? "OK" : "FAIL"}</span>
                <span className="kbd">Folder: {mediaStatus.folder || ""}</span>
                <span className="muted small">{mediaStatus.message || ""}</span>
              </div>
            ) : (
              <div className="muted small">No status loaded yet.</div>
            )}

            <div className="row">
              <input
                className="input"
                type="file"
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
              <input
                className="input"
                style={{ width: 220 }}
                placeholder="Folder (optional)"
                value={uploadFolder}
                onChange={(e) => setUploadFolder(e.target.value)}
              />
              <button
                className="button primary"
                type="button"
                onClick={onUpload}
                disabled={uploading}
              >
                {uploading ? "Uploading…" : "Upload"}
              </button>
            </div>

            {lastUploadUrl ? (
              <div className="notice">
                Uploaded URL: <a href={lastUploadUrl}>{lastUploadUrl}</a>
              </div>
            ) : null}
          </section>

          <section className="surface card stack">
            <div className="h2">Create category</div>
            <form className="stack" onSubmit={onCreateCategory}>
              <div className="row">
                <input
                  className="input"
                  placeholder="Name"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm((s) => ({ ...s, name: e.target.value }))
                  }
                  required
                />
                <input
                  className="input"
                  placeholder="Image URL (optional)"
                  value={categoryForm.imageUrl}
                  onChange={(e) =>
                    setCategoryForm((s) => ({ ...s, imageUrl: e.target.value }))
                  }
                />
              </div>
              <input
                className="input"
                placeholder="Description (optional)"
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm((s) => ({ ...s, description: e.target.value }))
                }
              />
              <button className="button primary" type="submit">
                Create category
              </button>
            </form>
          </section>

          <section className="surface card stack">
            <div className="h2">Create restaurant</div>
            {restaurantCount === 0 ? (
              <div className="notice">No restaurants yet. Add one here and the public restaurant page will populate.</div>
            ) : null}
            <form className="stack" onSubmit={onCreateRestaurant}>
              <div className="row">
                <input
                  className="input"
                  placeholder="Name"
                  value={restaurantForm.name}
                  onChange={(e) =>
                    setRestaurantForm((s) => ({ ...s, name: e.target.value }))
                  }
                  required
                />
                <input
                  className="input"
                  placeholder="Address"
                  value={restaurantForm.address}
                  onChange={(e) =>
                    setRestaurantForm((s) => ({ ...s, address: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="row">
                <input
                  className="input"
                  placeholder="Image URL (optional)"
                  value={restaurantForm.imageUrl}
                  onChange={(e) =>
                    setRestaurantForm((s) => ({ ...s, imageUrl: e.target.value }))
                  }
                />
              </div>

              <input
                className="input"
                placeholder="Description (optional)"
                value={restaurantForm.description}
                onChange={(e) =>
                  setRestaurantForm((s) => ({ ...s, description: e.target.value }))
                }
              />

              <button className="button primary" type="submit">
                Create restaurant
              </button>
            </form>
          </section>

          <section className="surface card stack">
            <div className="h2">Create product</div>
            {restaurantCount === 0 ? (
              <div className="notice error">Create at least one restaurant first before adding items.</div>
            ) : null}
            <form className="stack" onSubmit={onCreateProduct}>
              <div className="row">
                <input
                  className="input"
                  placeholder="Name"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm((s) => ({ ...s, name: e.target.value }))
                  }
                  required
                />
                <input
                  className="input"
                  placeholder="Price"
                  type="number"
                  min={0}
                  step={0.01}
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm((s) => ({ ...s, price: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="row">
                <select
                  className="select"
                  value={productForm.restaurantId}
                  onChange={(e) =>
                    setProductForm((s) => ({ ...s, restaurantId: e.target.value }))
                  }
                  required
                >
                  <option value="">Select restaurant…</option>
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>

                <select
                  className="select"
                  value={productForm.categoryId}
                  onChange={(e) =>
                    setProductForm((s) => ({ ...s, categoryId: e.target.value }))
                  }
                >
                  <option value="">No category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <label className="row small" style={{ gap: 6 }}>
                  <input
                    type="checkbox"
                    checked={productForm.available}
                    onChange={(e) =>
                      setProductForm((s) => ({ ...s, available: e.target.checked }))
                    }
                  />
                  Available
                </label>
              </div>

              <div className="row">
                <input
                  className="input"
                  placeholder="Image URL (optional)"
                  value={productForm.imageUrl}
                  onChange={(e) =>
                    setProductForm((s) => ({ ...s, imageUrl: e.target.value }))
                  }
                />
              </div>

              <input
                className="input"
                placeholder="Description (optional)"
                value={productForm.description}
                onChange={(e) =>
                  setProductForm((s) => ({ ...s, description: e.target.value }))
                }
              />

              <button className="button primary" type="submit">
                Create product
              </button>

              <div className="muted small">
                Tip: you can paste the uploaded URL above into Image URL.
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </Layout>
  );
}
