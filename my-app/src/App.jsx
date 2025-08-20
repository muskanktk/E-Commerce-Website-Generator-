import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaUser, FaTrash, FaEdit, FaPlus, FaCog } from "react-icons/fa";

const About = lazy(() => import("./About"));
const Contact = lazy(() => import("./Contact"));

const OWNER_EMAIL = "muskanktk001@gmail.com";
const money = (cents = 0) => `$${(Number(cents || 0) / 100).toFixed(2)}`;

const DEFAULT_BRANDING = {
  siteTitle: "AROOJ",
  heroHeadline: "SEASONAL MOMENTS",
  heroButtonLabel: "SHOP HERE",
  primaryColor: "#ec4899",
  accentColor: "#16a34a",
  textColor: "#111827",
  fontFamily: "Inter",
  heroImages: [
    "https://i.pinimg.com/1200x/d3/3a/52/d33a5269faf18834849f12dd9815b650.jpg",
    "https://i.pinimg.com/736x/46/7b/a8/467ba80b3e5c0766bcdd9b629875eb97.jpg",
  ],
  showcaseTitle: "Showcase Your Style",
  showcaseBody:
    "Highlight real people wearing your jewelry, share customer photos, or show lifestyle images.",
  showcaseImage:
    "https://editorialist.com/thumbnail/wp-content/uploads/2025/07/Editorialist25_Bvlgari_Wedding-Guest-hero.webp?width=825&quality=60",
};

/* ---------------- AUTH ---------------- */
function AuthoModal({ open, onClose }) {
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  if (!open) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const demoAuth = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (mode === "signup") {
      if (!form.name.trim()) return setError("Please enter your name.");
      if ((form.password || "").trim().length < 6) return setError("Use at least 6 password characters.");
      if (users.some((u) => u.email === form.email)) return setError("Email already exists.");
      users.push({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("session", JSON.stringify({ email: form.email.trim() }));
      onClose();
      return;
    }
    const found = users.find((u) => u.email === form.email && u.password === form.password);
    if (!found) return setError("Invalid email or password.");
    localStorage.setItem("session", JSON.stringify({ email: found.email }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => { setMode("signin"); setError(""); }}
            className={`flex-1 rounded-lg border px-4 py-2 ${mode === "signin" ? "bg-blue-600 text-white" : "hover:bg-black/5"}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode("signup"); setError(""); }}
            className={`flex-1 rounded-lg border px-4 py-2 ${mode === "signup" ? "bg-blue-600 text-white" : "hover:bg-black/5"}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setError(""); demoAuth(); }} className="space-y-3">
          {mode === "signup" && (
            <input name="name" placeholder="Full name" value={form.name} onChange={handleChange}
              className="w-full rounded border px-3 py-2" required />
          )}
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange}
            className="w-full rounded border px-3 py-2" required />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange}
            className="w-full rounded border px-3 py-2" required />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 hover:bg-black/5">Cancel</button>
            <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
              {mode === "signup" ? "Create Account" : "Sign In"}
            </button>
          </div>
        </form>

        <p className="mt-3 text-center text-sm text-gray-500">
          (Demo only) Data is stored in your browser. Replace with a real API later.
        </p>
      </div>
    </div>
  );
}

/* -------------- ADMIN PRODUCT MODAL -------------- */
function AdminProductModal({ open, initial, onClose, onSave }) {
  const [form, setForm] = useState(
    initial || { title: "", price: "", image: "", stock: 1, badge: "", popularity: 0 }
  );

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        id: initial.id,
        title: initial.title || "",
        image: initial.image || "",
        stock: initial.stock ?? 1,
        badge: initial.badge || "",
        popularity: initial.popularity ?? 0,
        price: initial.price_cents != null ? (initial.price_cents / 100).toFixed(2) : (initial.price ?? ""),
      });
    } else {
      setForm({ title: "", price: "", image: "", stock: 1, badge: "", popularity: 0 });
    }
  }, [open, initial]);

  if (!open) return null;

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = () => {
    if (!form.title || !form.price || !form.image) return;
    const payload = {
      id: form.id || `p-${Date.now()}`,
      title: form.title.trim(),
      image: form.image.trim(),
      stock: parseInt(form.stock || 0, 10),
      badge: form.badge || "",
      popularity: parseInt(form.popularity || 0, 10),
      price_cents: Math.round(parseFloat(form.price || 0) * 100),
    };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-3">
        <h3 className="text-lg font-semibold">{initial ? "Edit Product" : "Add Product"}</h3>
        <input name="title" placeholder="Title" className="w-full border rounded px-3 py-2" value={form.title} onChange={handle} />
        <input name="price" type="number" step="0.01" placeholder="Price (e.g. 15)" className="w-full border rounded px-3 py-2" value={form.price} onChange={handle} />
        <input name="image" placeholder="Image URL" className="w-full border rounded px-3 py-2" value={form.image} onChange={handle} />
        <input name="stock" type="number" min="0" placeholder="Stock (e.g. 5)" className="w-full border rounded px-3 py-2" value={form.stock} onChange={handle} />
        <input name="badge" placeholder='Badge (e.g. "New", "Sale")' className="w-full border rounded px-3 py-2" value={form.badge} onChange={handle} />
        <input name="popularity" type="number" min="0" placeholder="Popularity score" className="w-full border rounded px-3 py-2" value={form.popularity} onChange={handle} />
        <div className="flex gap-2 justify-end pt-2">
          <button onClick={onClose} className="rounded-lg border px-4 py-2 hover:bg-black/5">Cancel</button>
          <button onClick={save} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Save</button>
        </div>
        <p className="text-xs text-gray-500">Tip: paste any image URL to show a product photo.</p>
      </div>
    </div>
  );
}

/* -------------- SETTINGS MODAL -------------- */
function SettingsModal({ open, onClose, branding, setBranding, resetBranding }) {
  const [tab, setTab] = useState("brand");
  const [local, setLocal] = useState(branding);

  useEffect(() => { if (open) setLocal(branding); }, [open, branding]);
  if (!open) return null;

  const handle = (e) => setLocal({ ...local, [e.target.name]: e.target.value });
  const save = () => { setBranding(local); onClose(); };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Site Settings</h3>
          <button onClick={onClose} className="rounded-lg border px-3 py-1 hover:bg-black/5">Close</button>
        </div>

        <div className="mt-3 flex gap-2">
          {["brand", "content", "images"].map((t) => (
            <button
              key={t}
              className={`rounded-lg border px-3 py-1 ${tab === t ? "bg-[var(--brand)] text-white" : "hover:bg-black/5"}`}
              onClick={() => setTab(t)}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {tab === "brand" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm">Primary color</span>
                  <input type="color" name="primaryColor" value={local.primaryColor} onChange={handle}
                    className="block w-full h-10 p-1 border rounded" />
                </label>
                <label className="block">
                  <span className="text-sm">Accent color</span>
                  <input type="color" name="accentColor" value={local.accentColor} onChange={handle}
                    className="block w-full h-10 p-1 border rounded" />
                </label>
                <label className="block">
                  <span className="text-sm">Text color</span>
                  <input type="color" name="textColor" value={local.textColor} onChange={handle}
                    className="block w-full h-10 p-1 border rounded" />
                </label>
                <label className="block">
                  <span className="text-sm">Font family (Google Fonts name)</span>
                  <input name="fontFamily" value={local.fontFamily} onChange={handle} placeholder="e.g. Inter, Poppins, Playfair Display"
                    className="block w-full border rounded px-3 py-2" />
                </label>
              </div>
              <p className="text-xs text-gray-500">Tip: use an exact Google Fonts family name.</p>
            </>
          )}

          {tab === "content" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm">Site title</span>
                <input name="siteTitle" value={local.siteTitle} onChange={handle} className="block w-full border rounded px-3 py-2" />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm">Hero headline</span>
                <input name="heroHeadline" value={local.heroHeadline} onChange={handle} className="block w-full border rounded px-3 py-2" />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm">Hero button label</span>
                <input name="heroButtonLabel" value={local.heroButtonLabel} onChange={handle} className="block w-full border rounded px-3 py-2" />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm">Showcase title</span>
                <input
                  name="showcaseTitle"
                  value={local.showcaseTitle || ""}
                  onChange={handle}
                  className="block w-full border rounded px-3 py-2"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm">Showcase body</span>
                <textarea
                  name="showcaseBody"
                  rows={4}
                  value={local.showcaseBody || ""}
                  onChange={handle}
                  className="block w-full border rounded px-3 py-2"
                />
              </label>
            </div>
          )}

          {tab === "images" && (
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm">Hero image 1 URL</span>
                <input
                  name="heroImages0"
                  value={local.heroImages?.[0] || ""}
                  onChange={(e) => setLocal({ ...local, heroImages: [e.target.value, local.heroImages?.[1] || ""] })}
                  className="block w-full border rounded px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm">Hero image 2 URL</span>
                <input
                  name="heroImages1"
                  value={local.heroImages?.[1] || ""}
                  onChange={(e) => setLocal({ ...local, heroImages: [local.heroImages?.[0] || "", e.target.value] })}
                  className="block w-full border rounded px-3 py-2"
                />
              </label>

              <label className="block">
                <span className="text-sm">Showcase image URL</span>
                <input
                  name="showcaseImage"
                  value={local.showcaseImage || ""}
                  onChange={handle}
                  className="block w-full border rounded px-3 py-2"
                />
              </label>

              <p className="text-xs text-gray-500">Paste any public image URL (hosted on your drive, CDN, or images site).</p>
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={() => { resetBranding(); onClose(); }}
            className="rounded-lg border px-4 py-2 hover:bg-black/5"
          >
            Reset to defaults
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-lg border px-4 py-2 hover:bg-black/5">Cancel</button>
            <button onClick={save} className="rounded-lg px-4 py-2 text-white bg-[var(--brand)] hover:opacity-90">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------- HOME SECTION -------------- */
function HomeSection({ products, addToCart, addToWishlist, IS_OWNER, setEditProduct, setAdminOpen, deleteProduct, branding }) {
  const topFour = useMemo(
    () => [...products].sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 4),
    [products]
  );

  return (
    <>
      <section className="relative w-screen">
        <div className="flex">
          <img
            src={branding.heroImages[0]}
            alt="Banner 1"
            className="w-1/2 h-64 md:h-80 lg:h-96 object-cover"
            loading="eager"
            decoding="async"
            width="960"
            height="384"
          />
          <img
            src={branding.heroImages[1]}
            alt="Banner 2"
            className="w-1/2 h-64 md:h-80 lg:h-96 object-cover"
            loading="eager"
            decoding="async"
            width="960"
            height="384"
          />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 space-y-4">
          <span className="text-white text-3xl md:text-5xl font-bold tracking-wide">{branding.heroHeadline}</span>
          <Link
            to="/earrings"
            className="text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg hover:opacity-90 bg-[var(--brand)]"
          >
            {branding.heroButtonLabel}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <h2 className="mt-6 text-3xl font-extrabold tracking-wide text-center font-serif">
          HANDMADE POPULAR FEATURES
        </h2>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {topFour.map((p) => (
            <div key={p.id} className="group block text-center">
              <img
                src={p.image}
                alt={p.title}
                className="w-48 h-48 mx-auto object-cover rounded-lg group-hover:opacity-90 transition"
                loading="lazy"
                decoding="async"
                width="192"
                height="192"
              />
              <h3 className="mt-2 text-base">{p.title}</h3>
              <p className="text-gray-600">{money(p.price_cents)}</p>
              <p className="text-xs text-gray-500">
                {p.stock <= 0 ? "Out of stock" : p.stock <= 2 ? "Few left" : ""}{p.badge ? ` • ${p.badge}` : ""}
              </p>

              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToWishlist(p); }}
                className="bg-white p-1 rounded-full shadow hover:bg-pink-100 transition"
                title="Add to wishlist"
                aria-label="Add to wishlist"
              >
                <FaHeart size={18} />
              </button>

              <button
                type="button"
                disabled={p.stock <= 0}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(p); }}
                className={`bg-white p-1 rounded-full shadow transition ml-2 ${p.stock <= 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-green-100"}`}
                title={p.stock <= 0 ? "Out of stock" : "Add to cart"}
                aria-label={p.stock <= 0 ? "Out of stock" : "Add to cart"}
              >
                <FaShoppingCart size={18} />
              </button>

              {IS_OWNER && (
                <div className="mt-2 flex items-center justify-center gap-2">
                  <button onClick={() => { setEditProduct(p); setAdminOpen(true); }}
                    className="rounded border px-2 py-1 hover:bg-black/5 text-sm flex items-center gap-1" title="Edit product">
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => deleteProduct(p.id)}
                    className="rounded border px-2 py-1 hover:bg-black/5 text-sm text-red-600 flex items-center gap-1" title="Delete product">
                    <FaTrash /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Showcase */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-3">{branding.showcaseTitle || "Showcase Your Style"}</h3>
            <p className="text-gray-700">
              {branding.showcaseBody || "Highlight real people wearing your jewelry, share customer photos, or show lifestyle images."}
            </p>
          </div>
          <div>
            <img
              src={branding.showcaseImage || "https://editorialist.com/thumbnail/wp-content/uploads/2025/07/Editorialist25_Bvlgari_Wedding-Guest-hero.webp?width=825&quality=60"}
              alt="Showcase"
              className="rounded-lg shadow-md object-cover w-full h-64 md:h-80"
              loading="lazy"
              decoding="async"
              width="800"
              height="320"
            />
          </div>
        </section>
      </section>
    </>
  );
}

/* -------------- EARRINGS PAGE -------------- */
function EarringsPage({ products, addToCart, addToWishlist, IS_OWNER, setEditProduct, setAdminOpen, deleteProduct }) {
  return (
    <main className="pt-20 mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-wide text-center font-serif">ALL EARRINGS</h1>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p.id} className="group block text-center">
            <img
              src={p.image}
              alt={p.title}
              className="w-48 h-48 mx-auto object-cover rounded-lg group-hover:opacity-90 transition"
              loading="lazy"
              decoding="async"
              width="192"
              height="192"
            />
            <h3 className="mt-2 text-base">{p.title}</h3>
            <p className="text-gray-600">{money(p.price_cents)}</p>
            <p className="text-xs text-gray-500">
              {p.stock <= 0 ? "Out of stock" : p.stock <= 2 ? "Few left" : ""}{p.badge ? ` • ${p.badge}` : ""}
            </p>

            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToWishlist(p); }}
              className="bg-white p-1 rounded-full shadow hover:bg-pink-100 transition"
              title="Add to wishlist"
              aria-label="Add to wishlist"
            >
              <FaHeart size={18} />
            </button>

            <button
              type="button"
              disabled={p.stock <= 0}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(p); }}
              className={`bg-white p-1 rounded-full shadow transition ml-2 ${p.stock <= 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-green-100"}`}
              title={p.stock <= 0 ? "Out of stock" : "Add to cart"}
              aria-label={p.stock <= 0 ? "Out of stock" : "Add to cart"}
            >
              <FaShoppingCart size={18} />
            </button>

            {IS_OWNER && (
              <div className="mt-2 flex items-center justify-center gap-2">
                <button onClick={() => { setEditProduct(p); setAdminOpen(true); }}
                  className="rounded border px-2 py-1 hover:bg-black/5 text-sm flex items-center gap-1" title="Edit product">
                  <FaEdit /> Edit
                </button>
                <button onClick={() => deleteProduct(p.id)}
                  className="rounded border px-2 py-1 hover:bg-black/5 text-sm text-red-600 flex items-center gap-1" title="Delete product">
                  <FaTrash /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

/* -------------- ABOUT/CONTACT EDIT MODAL -------------- */
function EditSectionModal({ open, type, initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || {});
  useEffect(() => { if (open) setForm(initial || {}); }, [open, initial]);
  if (!open) return null;

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const save = () => { onSave(form); onClose(); };

  const isAbout = type === "about";
  const isContact = type === "contact";

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-semibold">
          {isAbout ? "Edit About" : "Edit Contact"}
        </h3>

        {isAbout && (
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm">Title</span>
              <input name="title" value={form.title || ""} onChange={handle}
                     className="w-full border rounded px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm">Image URL (banner)</span>
              <input name="image" value={form.image || ""} onChange={handle}
                     className="w-full border rounded px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm">Body</span>
              <textarea name="body" rows={6} value={form.body || ""} onChange={handle}
                        className="w-full border rounded px-3 py-2" />
            </label>
          </div>
        )}

        {isContact && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block sm:col-span-2">
              <span className="text-sm">Title</span>
              <input name="title" value={form.title || ""} onChange={handle}
                     className="w-full border rounded px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm">Email</span>
              <input name="email" value={form.email || ""} onChange={handle}
                     className="w-full border rounded px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm">Phone</span>
              <input name="phone" value={form.phone || ""} onChange={handle}
                     className="w-full border rounded px-3 py-2" />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm">Address</span>
              <input name="address" value={form.address || ""} onChange={handle}
                     className="w-full border rounded px-3 py-2" />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm">Note / Hours / Social</span>
              <textarea name="note" rows={4} value={form.note || ""} onChange={handle}
                        className="w-full border rounded px-3 py-2" />
            </label>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="rounded-lg border px-4 py-2 hover:bg-black/5">Cancel</button>
          <button onClick={save} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Save</button>
        </div>
      </div>
    </div>
  );
}

/* -------------- PRIVATE ROUTE -------------- */
function PrivateRoute({ isAllowed, children }) {
  return isAllowed ? children : <Navigate to="/" replace />;
}

/* -------------- REPORTS -------------- */
function ReportsPage({ orders, events, products }) {
  const totalRevenue = useMemo(
    () => orders.reduce((s, o) => s + (o.subtotal_cents || 0), 0),
    [orders]
  );
  const totalOrders = orders.length;
  const totalItems = useMemo(
    () => orders.reduce((s, o) => s + o.items.reduce((n, it) => n + it.qty, 0), 0),
    [orders]
  );

  const qtyByProduct = useMemo(() => {
    const map = new Map();
    orders.forEach((o) =>
      o.items.forEach((it) => map.set(it.id, (map.get(it.id) || 0) + it.qty))
    );
    return map;
  }, [orders]);

  const topProducts = useMemo(() => {
    const arr = [...qtyByProduct.entries()].map(([id, qty]) => {
      const p = products.find((x) => x.id === id);
      return { id, title: p?.title || id, qty };
    });
    return arr.sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [qtyByProduct, products]);

  const insights = useMemo(() => {
    const lines = [];
    if (totalOrders === 0) {
      lines.push("No orders yet. Try promoting your top 4 featured items on the home page.");
    } else {
      const avgOrder = totalRevenue / 100 / totalOrders;
      lines.push(`You’ve made ${totalOrders} orders totaling $${(totalRevenue/100).toFixed(2)} (avg $${avgOrder.toFixed(2)}).`);
      if (topProducts[0]) {
        lines.push(`Top seller is “${topProducts[0].title}” with ${topProducts[0].qty} sold.`);
      }
      const now = Date.now();
      const last7 = events.filter(e => now - e.ts < 7*24*60*60*1000);
      const wishlistAdds = last7.filter(e => e.type === "wishlist_add").length;
      const ATCs = last7.filter(e => e.type === "add_to_cart").length;
      const checkouts = last7.filter(e => e.type === "checkout").length;
      if (wishlistAdds > ATCs) lines.push("More wishlists than add-to-carts this week — consider a small discount banner.");
      if (ATCs > 0 && checkouts === 0) lines.push("People add to cart but don’t check out — show trust badges / return policy.");
    }
    return lines;
  }, [totalOrders, totalRevenue, topProducts, events]);

  return (
    <main className="pt-20 mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-wide text-center font-serif">REPORTS</h1>

      <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-semibold">${(totalRevenue/100).toFixed(2)}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Orders</p>
          <p className="text-2xl font-semibold">{totalOrders}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Items Sold</p>
          <p className="text-2xl font-semibold">{totalItems}</p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Top Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Product</th>
                <th className="py-2 pr-4">Qty Sold</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.length === 0 && (
                <tr><td className="py-2 pr-4 text-gray-500" colSpan={2}>No sales yet.</td></tr>
              )}
              {topProducts.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="py-2 pr-4">{p.title}</td>
                  <td className="py-2 pr-4">{p.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-3">AI Insights</h2>
        <ul className="list-disc pl-6 space-y-1">
          {insights.map((line, i) => <li key={i}>{line}</li>)}
        </ul>
        <p className="mt-3 text-xs text-gray-500">
          (Demo: rule-based insights in the browser.)
        </p>
      </section>
    </main>
  );
}

/* -------------- APP ROOT -------------- */
export default function App() {
  const [open, setOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const DEFAULT_ABOUT = {
    title: "About Us",
    body: "Write about your brand, story, materials, and care instructions.",
    image: "https://via.placeholder.com/1200x500?text=About+Banner",
  };
  const DEFAULT_CONTACT = {
    title: "Contact Us",
    email: "example@email.com",
    phone: "(123) 456-7890",
    address: "Your Business Address, City, State",
    note: "Reach us by email, phone, or Instagram.",
  };

  const [aboutData, setAboutData] = useState(() => {
    try { return { ...DEFAULT_ABOUT, ...(JSON.parse(localStorage.getItem("aboutData") || "{}")) }; }
    catch { return DEFAULT_ABOUT; }
  });
  const [contactData, setContactData] = useState(() => {
    try { return { ...DEFAULT_CONTACT, ...(JSON.parse(localStorage.getItem("contactData") || "{}")) }; }
    catch { return DEFAULT_CONTACT; }
  });
  useEffect(() => { localStorage.setItem("aboutData", JSON.stringify(aboutData)); }, [aboutData]);
  useEffect(() => { localStorage.setItem("contactData", JSON.stringify(contactData)); }, [contactData]);

  const [editSection, setEditSection] = useState(null);

  const sessionEmail =
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("session") || "null")?.email : null;
  const IS_OWNER = sessionEmail === OWNER_EMAIL;

  const [branding, setBranding] = useState(() => {
    try { return { ...DEFAULT_BRANDING, ...(JSON.parse(localStorage.getItem("branding") || "{}")) }; }
    catch { return DEFAULT_BRANDING; }
  });
  useEffect(() => {
    localStorage.setItem("branding", JSON.stringify(branding));
    const id = "dynamic-google-font";
    let link = document.getElementById(id);
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    const fam = (branding.fontFamily || "Inter").trim().replace(/\s+/g, "+");
    link.href = `https://fonts.googleapis.com/css2?family=${fam}:wght@400;600;700&display=swap`;
  }, [branding]);
  const resetBranding = () => setBranding(DEFAULT_BRANDING);

  const [products, setProducts] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("products") || "[]");
      const migrated = Array.isArray(raw)
        ? raw.map((p) =>
            p.price_cents != null
              ? p
              : { ...p, price_cents: Math.round(parseFloat(p.price ?? 0) * 100) }
          )
        : [];
      localStorage.setItem("products", JSON.stringify(migrated));
      return migrated;
    } catch {
      return [];
    }
  });
  useEffect(() => {
    if (products.length === 0) {
      const seed = [
        { id: "product-1", title: "Pink-Gold Hoops", price_cents: 1500,
          image: "https://i.pinimg.com/736x/cd/85/7d/cd857d4855b6d5d7daf9a4e638474012.jpg", stock: 5, popularity: 8 },
        { id: "product-2", title: "White-Pearl", price_cents: 1500,
          image: "https://i.pinimg.com/736x/c0/4e/c6/c04ec69775f4f5fe9ed243c78f9eaffc.jpg", stock: 5, popularity: 1 },
        { id: "product-3", title: "Dante Black Beads", price_cents: 1500,
          image: "https://www.lydieannejewelry.com/cdn/shop/files/H88ba3bec9243439d948b8cd49d55d80fn.jpg?v=1749461922&width=1346", stock: 5, popularity: 2 },
        { id: "product-4", title: "Rose-shaped Earrings", price_cents: 1500,
          image: "https://scarlettjewels.com/cdn/shop/files/image-2023-08-24T150442.754_63960777-b0a0-4e45-ad7c-60e792ad0c7a_1080x.png?v=1746548751", stock: 5, popularity: 3 },
      ];
      setProducts(seed);
      localStorage.setItem("products", JSON.stringify(seed));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { localStorage.setItem("products", JSON.stringify(products)); }, [products]);

  const handleSaveProduct = (prod) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === prod.id);
      if (idx >= 0) { const copy = [...prev]; copy[idx] = prod; return copy; }
      return [...prev, prod];
    });
    setAdminOpen(false); setEditProduct(null);
  };
  const deleteProduct = (id) => {
    if (!confirm("Delete this product?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cart") || "[]"); }
    catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  useEffect(() => { localStorage.setItem("cart", JSON.stringify(cart)); }, [cart]);
  const cartCount = useMemo(() => cart.reduce((n, i) => n + i.qty, 0), [cart]);

  const addToCart = (product) => {
    if (product.stock <= 0) return;
    setCart((prev) => {
      const idx = prev.findIndex((x) => x.id === product.id);
      if (idx >= 0) { const copy = [...prev]; copy[idx] = { ...copy[idx], qty: (copy[idx].qty || 1) + 1 }; return copy; }
      return [...prev, { ...product, qty: 1 }];
    });
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? { ...p, stock: Math.max(0, (p.stock || 0) - 1), popularity: (p.popularity || 0) + 1 }
          : p
      )
    );
    logEvent({ type: "add_to_cart", productId: product.id, qty: 1 });
    setCartOpen(true);
  };
  const inc = (id) => {
    const prod = products.find((p) => p.id === id);
    if (!prod || prod.stock <= 0) return;
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, (p.stock || 0) - 1) } : p)));
  };
  const dec = (id) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i)).filter((i) => i.qty > 0)
    );
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: (p.stock || 0) + 1 } : p)));
  };
  const removeFromCart = (id) => {
    const item = cart.find((i) => i.id === id);
    const qty = item?.qty || 0;
    setCart((prev) => prev.filter((i) => i.id !== id));
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: (p.stock || 0) + qty } : p)));
  };
  const clearCart = () => {
    setProducts((prev) => {
      const stockMap = new Map(prev.map((p) => [p.id, p.stock || 0]));
      cart.forEach((i) => stockMap.set(i.id, (stockMap.get(i.id) || 0) + i.qty));
      return prev.map((p) => ({ ...p, stock: stockMap.get(p.id) || 0 }));
    });
    setCart([]);
  };
  const subtotal = useMemo(() => cart.reduce((s, i) => s + (i.price_cents || 0) * (i.qty || 0), 0), [cart]);

  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wishlist") || "[]"); }
    catch { return []; }
  });
  const [wishlistOpen, setWishlistOpen] = useState(false);
  useEffect(() => { localStorage.setItem("wishlist", JSON.stringify(wishlist)); }, [wishlist]);

  const wishlistCount = useMemo(() => wishlist.length, [wishlist]);

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.find((x) => x.id === product.id)) return prev;
      return [...prev, product];
    });
    logEvent({ type: "wishlist_add", productId: product.id });
    setWishlistOpen(true);
  };
  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((i) => i.id !== id));
  };

  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem("orders") || "[]"); }
    catch { return []; }
  });
  useEffect(() => { localStorage.setItem("orders", JSON.stringify(orders)); }, [orders]);

  const [events, setEvents] = useState(() => {
    try { return JSON.parse(localStorage.getItem("events") || "[]"); }
    catch { return []; }
  });
  useEffect(() => { localStorage.setItem("events", JSON.stringify(events)); }, [events]);

  const logEvent = (evt) => setEvents((prev) => [...prev, { ts: Date.now(), ...evt }]);

  const checkout = () => {
    if (cart.length === 0) return;
    const order = {
      id: `o-${Date.now()}`,
      ts: Date.now(),
      items: cart.map(({ id, title, price_cents, qty }) => ({ id, title, price_cents, qty })),
      subtotal_cents: cart.reduce((s, i) => s + (i.price_cents || 0) * (i.qty || 0), 0),
    };
    setOrders((prev) => [order, ...prev]);
    logEvent({ type: "checkout", orderId: order.id, total_cents: order.subtotal_cents, items: order.items.length });
    setCart([]);
    setCartOpen(false);
    alert("Order placed! (demo)");
  };

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(p =>
      [p.title, p.badge].filter(Boolean).some(s => s.toLowerCase().includes(q))
    );
  }, [products, query]);

  const itemRemainingStock = (id) => {
    const prod = products.find((p) => p.id === id);
    return prod?.stock ?? 0;
  };

  return (
    <div
      style={{
        "--brand": branding.primaryColor,
        "--accent": branding.accentColor,
        "--text": branding.textColor,
        fontFamily: branding.fontFamily || "Inter",
        color: "var(--text)",
      }}
    >
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 bg-white text-black shadow">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-start gap-x-4 md:gap-x-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide whitespace-nowrap">
              <Link to="/">{branding.siteTitle}</Link>
            </h1>

            <nav className="hidden md:flex items-center gap-6 text-base md:text-lg whitespace-nowrap">
              <Link className="hover:underline" to="/">HOME</Link>
              <Link className="hover:underline" to="/earrings">EARRINGS</Link>
              <Link className="hover:underline" to="/about">ABOUT</Link>
              <Link className="hover:underline" to="/contact">CONTACT</Link>
              {IS_OWNER && (
                <Link className="hover:underline" to="/reports" title="Reports">
                  REPORTS
                </Link>
              )}
            </nav>

            <div className="ml-auto flex items-center gap-3">
              {IS_OWNER && (
                <button
                  type="button"
                  onClick={() => setSettingsOpen(true)}
                  className="hidden sm:inline-flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-black/5"
                  title="Site Settings"
                  aria-label="Open site settings"
                >
                  <FaCog /> Settings
                </button>
              )}

              {IS_OWNER && (
                <button
                  type="button"
                  onClick={() => { setEditProduct(null); setAdminOpen(true); }}
                  className="hidden sm:inline-flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-black/5"
                  title="Admin: Add product"
                  aria-label="Add product"
                >
                  <FaPlus /> Add Product
                </button>
              )}

              <button
                type="button"
                onClick={() => setWishlistOpen(true)}
                className="relative bg-white p-1 rounded-full shadow hover:bg-pink-100 transition"
                title="Wishlist"
                aria-label="Open wishlist"
              >
                <FaHeart size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative bg-white p-1 rounded-full shadow hover:bg-[var(--accent)]/20 transition"
                title="Open cart"
                aria-label="Open cart"
              >
                <FaShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[var(--accent)] text-white text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowAuth(true)}
                className="bg-white p-1 rounded-full shadow hover:bg-[var(--brand)]/20 transition"
                title={sessionEmail ? `Signed in: ${sessionEmail}` : "Sign in / Sign up"}
                aria-label="Sign in or sign up"
              >
                <FaUser size={18} />
              </button>

              {sessionEmail && (
                <button
                  type="button"
                  onClick={() => { localStorage.removeItem("session"); window.location.reload(); }}
                  className="bg-white p-1 rounded-full shadow hover:bg-gray-100 transition"
                  aria-label="Sign out"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search */}
      <section className="pt-20 mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <form onSubmit={(e) => e.preventDefault()} className="flex max-w-xl gap-2 mb-4">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">🔍</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search earrings by title or badge…"
              aria-label="Search products"
              className="w-full rounded px-3 py-2 pl-10 border-0 focus:outline-none focus:ring-0 bg-white"
            />
          </div>
        </form>
      </section>

      {/* PAGES */}
      <Suspense fallback={<div className="px-4 md:px-6 lg:px-8 pt-10">Loading…</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <HomeSection
                products={products}
                addToCart={addToCart}
                addToWishlist={addToWishlist}
                IS_OWNER={IS_OWNER}
                setEditProduct={setEditProduct}
                setAdminOpen={setAdminOpen}
                deleteProduct={deleteProduct}
                branding={branding}
              />
            }
          />
          <Route
            path="/earrings"
            element={
              <EarringsPage
                products={filteredProducts}
                addToCart={addToCart}
                addToWishlist={addToWishlist}
                IS_OWNER={IS_OWNER}
                setEditProduct={setEditProduct}
                setAdminOpen={setAdminOpen}
                deleteProduct={deleteProduct}
              />
            }
          />
          <Route
            path="/about"
            element={<About data={aboutData} canEdit={IS_OWNER} onEdit={() => setEditSection("about")} />}
          />
          <Route
            path="/contact"
            element={<Contact data={contactData} canEdit={IS_OWNER} onEdit={() => setEditSection("contact")} />}
          />

          <Route
            path="/reports"
            element={
              <PrivateRoute isAllowed={IS_OWNER}>
                <ReportsPage orders={orders} events={events} products={products} />
              </PrivateRoute>
            }
          />

          {/* Fallback so you never get a blank screen */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {/* Cart Drawer */}
      <div className={`fixed inset-0 z-[55] ${cartOpen ? "" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-black/40 transition-opacity ${cartOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setCartOpen(false)} />
        <aside className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col transition-transform duration-300 ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Your Cart</h3>
            <button onClick={() => setCartOpen(false)} className="rounded-lg border px-3 py-1 hover:bg-black/5">Close</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 && <p className="text-gray-600">Your cart is empty.</p>}
            {cart.map((item) => {
              const remaining = itemRemainingStock(item.id);
              return (
                <div key={item.id} className="flex gap-3 border rounded-lg p-2">
                  <img src={item.image} alt={item.title} className="size-20 object-cover rounded" loading="lazy" decoding="async" width="80" height="80" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-600">{money(item.price_cents)}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:text-red-700 p-1" title="Remove" aria-label="Remove from cart">
                        <FaTrash />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => dec(item.id)} className="rounded border px-2 py-1 hover:bg-black/5" aria-label="Decrease quantity">-</button>
                      <span className="min-w-8 text-center">{item.qty}</span>
                      <button
                        onClick={() => { if (remaining > 0) inc(item.id); }}
                        className={`rounded border px-2 py-1 ${remaining > 0 ? "hover:bg-black/5" : "opacity-50 cursor-not-allowed"}`}
                        disabled={remaining <= 0}
                        aria-label={remaining > 0 ? "Increase quantity" : "No more stock"}
                        title={remaining > 0 ? "Increase quantity" : "No more stock"}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Subtotal</span>
              <span className="font-semibold">{money(subtotal)}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={clearCart} className="flex-1 rounded-lg border px-4 py-2 hover:bg-black/5">Clear Cart</button>
              <button onClick={checkout} className="flex-1 rounded-lg bg-[var(--accent)] px-4 py-2 font-medium text-white hover:opacity-90">
                Checkout
              </button>
            </div>
            <p className="text-xs text-gray-500">(Demo checkout happens on this page—no navigation.)</p>
          </div>
        </aside>
      </div>

      {/* Wishlist Drawer */}
      <div className={`fixed inset-0 z-[55] ${wishlistOpen ? "" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-black/40 transition-opacity ${wishlistOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setWishlistOpen(false)} />
        <aside className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col transition-transform duration-300 ${wishlistOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Your Wishlist</h3>
            <button onClick={() => setWishlistOpen(false)} className="rounded-lg border px-3 py-1 hover:bg-black/5">Close</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {wishlist.length === 0 && <p className="text-gray-600">Your wishlist is empty.</p>}
            {wishlist.map((item) => (
              <div key={item.id} className="flex gap-3 border rounded-lg p-2">
                <img src={item.image} alt={item.title} className="size-20 object-cover rounded" loading="lazy" decoding="async" width="80" height="80" />
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-600">{money(item.price_cents)}</p>
                </div>
                <button onClick={() => removeFromWishlist(item.id)} className="text-red-600 hover:text-red-700 p-1" title="Remove" aria-label="Remove from wishlist">
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Modals */}
      <AuthoModal open={showAuth} onClose={() => setShowAuth(false)} />
      <AdminProductModal
        open={IS_OWNER && adminOpen}
        initial={editProduct}
        onClose={() => { setAdminOpen(false); setEditProduct(null); }}
        onSave={handleSaveProduct}
      />
      <SettingsModal
        open={IS_OWNER && settingsOpen}
        onClose={() => setSettingsOpen(false)}
        branding={branding}
        setBranding={setBranding}
        resetBranding={resetBranding}
      />
      <EditSectionModal
        open={IS_OWNER && !!editSection}
        type={editSection || undefined}
        initial={editSection === "about" ? aboutData : editSection === "contact" ? contactData : null}
        onClose={() => setEditSection(null)}
        onSave={(data) => {
          if (editSection === "about") setAboutData(data);
          if (editSection === "contact") setContactData(data);
        }}
      />
    </div>
  );
}
