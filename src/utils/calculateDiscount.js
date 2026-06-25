// ============================================================
// calculateDiscount.js — Utility for discount/price formatting
//
// CURRENCY: CheapShark API gives prices in USD.
// We convert to INR using a fixed exchange rate.
// In a real production app you'd fetch this from a currency API,
// but for a frontend-only project a fixed rate is perfectly fine.
// ============================================================

// Approximate USD → INR exchange rate (update this if needed)
export const USD_TO_INR = 94.43;

// ─────────────────────────────────────────────────────────────
// safeParse — safely converts a price string to a number.
// The CheapShark API returns prices as strings like "19.99" or "0.00".
// parseFloat("abc") returns NaN (Not a Number) which breaks math.
// isNaN() checks for this and returns 0 as a safe fallback.
// ─────────────────────────────────────────────────────────────
function safeParse(priceString) {
  // Handle null, undefined, empty string — all return 0
  if (priceString === null || priceString === undefined || priceString === '') return 0;

  const parsed = parseFloat(priceString);

  // isNaN(parsed) returns true if parseFloat couldn't convert the string.
  // Example: parseFloat("abc") → NaN → isNaN(NaN) → true → we return 0
  return isNaN(parsed) ? 0 : parsed;
}

// ─────────────────────────────────────────────────────────────
// usdToInr — converts a USD amount to INR
// ─────────────────────────────────────────────────────────────
export function usdToInr(usdAmount) {
  return usdAmount * USD_TO_INR;
}

// ─────────────────────────────────────────────────────────────
// calculateDiscount — returns the discount percentage as an integer.
// Example: normalPrice="59.99", salePrice="19.99" → 67
// ─────────────────────────────────────────────────────────────
export function calculateDiscount(normalPrice, salePrice) {
  const normal = safeParse(normalPrice);
  const sale = safeParse(salePrice);

  // Guard: if normal price is 0 or missing, we can't calculate a % — return 0.
  // Without this check, we'd do (0 - 0) / 0 = NaN.
  if (normal === 0) return 0;

  // If sale >= normal, there's no real discount
  if (sale >= normal) return 0;

  return Math.round(((normal - sale) / normal) * 100);
}

// ─────────────────────────────────────────────────────────────
// formatPrice — converts a USD price string → formatted INR string.
//
// Examples:
//   "19.99"  →  "₹1,669"
//   "0.00"   →  "FREE"
//   null     →  "N/A"
// ─────────────────────────────────────────────────────────────
export function formatPrice(priceString) {
  // Handle completely missing price data
  if (priceString === null || priceString === undefined || priceString === '') {
    return 'N/A';
  }

  const usd = safeParse(priceString);

  // Free games — the API sends "0.00" for games with no price
  if (usd === 0) return 'FREE';

  const inr = usdToInr(usd);

  // Intl.NumberFormat with 'en-IN' locale formats numbers in the Indian style:
  // e.g. 1,23,456 instead of 123,456.
  // { maximumFractionDigits: 0 } removes the decimal part — ₹1,669 not ₹1,669.17
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(inr);
}

// ─────────────────────────────────────────────────────────────
// isDiscounted — returns true only if the sale price is genuinely
// lower than the normal price (and both are valid, non-zero numbers).
// ─────────────────────────────────────────────────────────────
export function isDiscounted(normalPrice, salePrice) {
  const normal = safeParse(normalPrice);
  const sale = safeParse(salePrice);

  // Both must be > 0, and sale must be strictly less than normal
  return normal > 0 && sale > 0 && sale < normal;
}
