// ============================================================
// sortDeals.js — Utility for sorting game deals
// Pure functions (no side effects, just in → out) are easier
// to test and reuse across components.
// ============================================================

// getEffectivePrice handles the CheapShark quirk where salePrice="0.00"
// actually means "no sale, just the regular price".
// For SORTING purposes, we use normalPrice in that case so items
// are ordered correctly (not all pushed to the top as if they're free).
function getEffectivePrice(deal) {
  const sale = parseFloat(deal.salePrice);
  const normal = parseFloat(deal.normalPrice);

  // If salePrice is 0 or NaN but normalPrice is valid, use normalPrice for sorting
  if ((isNaN(sale) || sale === 0) && normal > 0) return normal;

  // If both are invalid/zero, treat as 0 (free game)
  if (isNaN(sale)) return 0;

  return sale;
}

// sortDeals takes a deals array and a sort key string,
// and returns a NEW sorted array (does NOT mutate the original).
export function sortDeals(deals, sortBy) {
  // [...deals] creates a shallow copy of the array.
  // We copy FIRST because .sort() mutates (modifies) the original array in place,
  // which can cause unexpected bugs in React (React state should never be mutated directly).
  const sorted = [...deals];

  switch (sortBy) {
    case 'price':
      // getEffectivePrice ensures "0.00 salePrice" items sort by their actual price,
      // not as if they're free. a - b sorts ascending (cheapest first).
      return sorted.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));

    case 'discount':
      // parseFloat(b.savings) - parseFloat(a.savings) sorts DESCENDING (biggest discount first).
      // "savings" is a percentage string like "66.67" from the API.
      // || 0 handles NaN — if savings is missing, treat as 0% discount.
      return sorted.sort((a, b) => (parseFloat(b.savings) || 0) - (parseFloat(a.savings) || 0));

    case 'store':
      // localeCompare is the correct way to compare strings alphabetically.
      // It handles special characters and is locale-aware (language-sensitive sorting).
      return sorted.sort((a, b) => {
        const nameA = a.storeName || '';
        const nameB = b.storeName || '';
        return nameA.localeCompare(nameB);
      });

    default:
      return sorted;
  }
}
