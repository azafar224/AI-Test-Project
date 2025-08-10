import React, { useMemo, useState } from "react";
import data from "./products.json";
import { smartFilter } from "./nlp.js";
import { recommend } from "./recommend.js";

const categories = [
  "All",
  "Shoes",
  "Apparel",
  "Accessories",
  "Electronics",
  "Equipment",
];

export default function App() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");
  const [lastViewed, setLastViewed] = useState(null);
  const [budget, setBudget] = useState("");

  const filtered = useMemo(() => {
    let base = data;
    if (cat !== "All") base = base.filter((p) => p.category === cat);
    if (maxPrice) base = base.filter((p) => p.price <= parseFloat(maxPrice));
    if (q.trim()) base = smartFilter(base, q);
    return base;
  }, [q, cat, maxPrice]);

  const recos = useMemo(
    () =>
      recommend(data, {
        lastCategory: lastViewed?.category || (cat !== "All" ? cat : null),
        budget: budget ? parseFloat(budget) : null,
      }),
    [lastViewed, cat, budget]
  );

  return (
    <div
      style={{
        fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
        padding: 20,
        maxWidth: 1100,
        margin: "0 auto",
        background: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 4 }}>🛒 AI Commerce</h1>
      <p style={{ marginTop: 0, textAlign: "center", opacity: 0.75 }}>
        Smart Product Search + Recommendations
      </p>

      {/* Filter bar */}
      <section
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "1fr 1fr 2fr",
          alignItems: "end",
          marginBottom: 20,
          background: "#fff",
          padding: 16,
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <div>
          <label style={{ fontWeight: 500 }}>Category</label>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            style={inputStyle}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 500 }}>Max Price</label>
          <input
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="e.g. 100"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ fontWeight: 500 }}>
            Smart Search (natural language)
          </label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='e.g. "running shoes under $100 with good reviews"'
            style={inputStyle}
          />
        </div>
      </section>

      {/* Catalog */}
      <ProductsGrid items={filtered} onView={setLastViewed} />

      <hr style={{ margin: "28px 0" }} />

      {/* Recommendations */}
      <section
        style={{
          background: "#fff",
          padding: 16,
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Recommended for you</h2>
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <span>Budget:</span>
          <input
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. 60"
            style={{ ...inputStyle, width: 120 }}
          />
        </div>
        <ProductsRow items={recos} onView={setLastViewed} />
      </section>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: 14,
};

function ProductsGrid({ items, onView }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: 16,
      }}
    >
      {items.map((p) => (
        <Card key={p.id} item={p} onView={onView} />
      ))}
      {!items.length && (
        <div style={{ gridColumn: "1 / -1", opacity: 0.7 }}>
          No matching products.
        </div>
      )}
    </div>
  );
}

function ProductsRow({ items, onView }) {
  return (
    <div
      style={{ display: "flex", gap: 12, overflowX: "auto", padding: "8px 0" }}
    >
      {items.map((p) => (
        <MiniCard key={p.id} item={p} onView={onView} />
      ))}
    </div>
  );
}

function Card({ item, onView }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        padding: 14,
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      onMouseEnter={() => onView?.(item)}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
          {item.name}
        </div>
        <div style={{ color: "#2c5282", fontWeight: 500 }}>
          ${item.price.toFixed(2)}
        </div>
        <div style={{ fontSize: 13, opacity: 0.8 }}>
          {item.category} · ⭐ {item.rating}
        </div>
        <p style={{ fontSize: 14, marginTop: 8 }}>{item.description}</p>
      </div>
      <button
        onClick={() => alert("Added to cart (mock)")}
        style={{
          padding: "8px 10px",
          borderRadius: 6,
          border: "none",
          background: "#2c5282",
          color: "#fff",
          cursor: "pointer",
          marginTop: 8,
        }}
      >
        Add to cart
      </button>
    </div>
  );
}

function MiniCard({ item, onView }) {
  return (
    <div
      style={{
        minWidth: 200,
        background: "#fff",
        borderRadius: 10,
        padding: 12,
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={() => onView?.(item)}
    >
      <div style={{ fontWeight: 600 }}>{item.name}</div>
      <div style={{ color: "#2c5282" }}>
        ${item.price.toFixed(2)} · ⭐ {item.rating}
      </div>
    </div>
  );
}
