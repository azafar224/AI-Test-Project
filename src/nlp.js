// Smarter, stricter NLP parser for natural-language catalog search.
// - Extracts price ranges (under/over/between), rating thresholds
// - Detects category by keywords/synonyms
// - Cleans keywords: strips numbers and filler words to avoid false negatives

function cap(s) {
  return s[0].toUpperCase() + s.slice(1);
}

export function parseQuery(q) {
  const query = (q || "").toLowerCase();
  const res = { must: [], category: null, price: {}, minRating: null };

  // --- price: under / over / between ---
  const under = query.match(/(?:under|below|less than)\s*\$?(\d+(?:\.\d+)?)/);
  if (under) res.price.max = parseFloat(under[1]);

  const over = query.match(/(?:over|above|more than)\s*\$?(\d+(?:\.\d+)?)/);
  if (over) res.price.min = parseFloat(over[1]);

  const between = query.match(
    /between\s*\$?(\d+(?:\.\d+)?)\s*(?:and|to|-)\s*\$?(\d+(?:\.\d+)?)/
  );
  if (between) {
    res.price.min = parseFloat(between[1]);
    res.price.max = parseFloat(between[2]);
  }

  // --- rating ---
  if (/(good reviews|highly rated|4(\.\d+)?\+|rating\s*>=?\s*4)/.test(query))
    res.minRating = 4.2;
  const rmatch = query.match(/rating\s*>=?\s*(\d(?:\.\d+)?)/);
  if (rmatch) res.minRating = parseFloat(rmatch[1]);

  // --- category via keywords/synonyms ---
  const categoryKeywords = {
    shoes: ["shoes", "sneakers", "running", "runner", "boots", "hiking"],
    apparel: [
      "apparel",
      "tee",
      "tshirt",
      "t-shirt",
      "joggers",
      "hoodie",
      "socks",
      "shirt",
      "pants",
    ],
    accessories: ["accessories", "bottle", "armband", "mat", "strap"],
    electronics: ["electronics", "watch", "fitness", "tracker"],
    equipment: ["equipment", "dumbbells", "weights"],
  };
  for (const [cat, words] of Object.entries(categoryKeywords)) {
    if (words.some((w) => query.includes(w))) {
      res.category = cap(cat);
      break;
    }
  }

  // --- keyword cleanup (remove numbers & filler words) ---
  const stop = new Set([
    "show",
    "me",
    "with",
    "good",
    "reviews",
    "review",
    "find",
    "looking",
    "for",
    "please",
    "under",
    "over",
    "between",
    "less",
    "more",
    "than",
    "and",
    "to",
    "the",
    "a",
    "an",
    "rated",
    "rating",
    "category",
    "items",
    "products",
    "display",
    "highly",
  ]);

  // remove numeric tokens, symbols, then split
  let cleaned = query
    .replace(/\$?\d+(\.\d+)?/g, " ") // strip numbers like 100 or 159.00
    .replace(/[^\w\s]/g, " ") // strip punctuation
    .replace(/\s+/g, " ")
    .trim();

  let tokens = cleaned.split(" ").filter(Boolean);

  // remove stopwords & keep only alpha tokens of length >= 3
  tokens = tokens.filter((t) => /^[a-z]{3,}$/.test(t) && !stop.has(t));

  // if category detected, remove category synonyms from tokens
  if (res.category) {
    const cat = res.category.toLowerCase();
    const syns = new Set(categoryKeywords[cat] || []);
    tokens = tokens.filter((t) => !syns.has(t));
  }

  res.must = tokens;
  return res;
}

export function smartFilter(products, q) {
  const { must, category, price, minRating } = parseQuery(q);
  return products.filter((p) => {
    if (category && p.category !== category) return false;
    if (price.min != null && p.price < price.min) return false;
    if (price.max != null && p.price > price.max) return false;
    if (minRating != null && p.rating < minRating) return false;
    if (must.length) {
      const hay = (p.name + " " + p.description).toLowerCase();
      for (const k of must) if (!hay.includes(k)) return false;
    }
    return true;
  });
}
