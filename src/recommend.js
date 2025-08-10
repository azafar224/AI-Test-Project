// Simple rule-based recommendations based on last viewed category and optional budget.
// Sorted by rating desc, then price asc.
export function recommend(
  products,
  { lastCategory = null, budget = null } = {}
) {
  let pool = [...products];
  if (lastCategory) pool = pool.filter((p) => p.category === lastCategory);
  if (budget != null) pool = pool.filter((p) => p.price <= budget);
  pool.sort((a, b) => b.rating - a.rating || a.price - b.price);
  return pool.slice(0, 5);
}
