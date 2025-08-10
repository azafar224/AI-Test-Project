# AI Commerce – Test Project

This is a small, single-page e-commerce product catalog built with **React + Vite**.  
It displays a set of 12 static sample products and enhances the user experience with an **AI-powered Smart Product Search** and a lightweight **Recommendation System**.

---

## **How to run the app**

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open the printed URL in your browser (usually http://localhost:5173)
```

> Requires Node.js 16+ and npm.

---

## **AI feature chosen**

**🧠 Smart Product Search (Option A – NLP)**

A custom **rule-based NLP parser** allows natural language queries over the catalog.  
It understands:

- **Price ranges**:
  - “under/below/less than $X”
  - “over/above/more than $X”
  - “between $A and $B”
- **Rating filters**:
  - “good reviews” / “highly rated” → rating ≥ 4.2
  - “rating >= 4.5”
- **Category detection** by keywords (shoes, apparel, accessories, electronics, equipment)
- **Keyword matching** on product name and description

Example queries:

- `running shoes under $100 with good reviews`
- `between $20 and $40 apparel`
- `electronics rating >= 4.3`
- `accessories over 15`

---

## **Tools / Libraries used**

- **React 18** – UI components & state
- **Vite** – development/build tooling
- **JavaScript ES Modules**
- **Custom NLP parser** – pure JS, no external API needed
- **Rule-based Recommendation System** – suggests 3–5 items based on last viewed category + optional budget

---

## **Notable assumptions**

- The product catalog is **static JSON** for demo purposes (no backend calls).
- AI search is **rule-based**, not machine-learned, for simplicity and speed in a short test.  
  It’s designed to be replaced easily with an embeddings + vector search pipeline for production.
- Bonus blockchain ideas (not implemented in code):
  - **Token-gated pricing** for loyalty token holders
  - **On-chain preferences** (opt-in) for portable recommendations
  - **Loyalty smart contracts** to mint/redeem points per purchase

```

```
