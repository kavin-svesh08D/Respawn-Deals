// ============================================================
// cheapSharkApi.js — ALL API calls are centralized here.
// Keeping API logic separate from UI components is a best practice
// called "Separation of Concerns". If the API changes, you only
// need to update this one file, not every component.
// ============================================================

const BASE_URL = 'https://www.cheapshark.com/api/1.0';

// ─────────────────────────────────────────────
// fetchStores
// Returns an array of store objects from CheapShark.
// Each store has: storeID, storeName, isActive, images { logo, icon, banner }
// ─────────────────────────────────────────────
export async function fetchStores() {
  // "await" pauses execution here until the fetch() Promise resolves.
  // A Promise is JavaScript's way of saying "this will give you a value... eventually."
  const response = await fetch(`${BASE_URL}/stores`);

  // HTTP status codes: 200 = OK, 404 = Not Found, 500 = Server Error.
  // fetch() does NOT throw an error on 404/500 — you have to check manually.
  if (!response.ok) {
    throw new Error(`Failed to fetch stores: ${response.status}`);
  }

  // .json() parses the raw JSON string from the response body into a JS object/array.
  // This is also async because it streams the response body.
  return response.json();
}

// ─────────────────────────────────────────────
// searchGames
// Searches for games by title string.
// Returns an array of game objects, each with:
// { gameID, external (title), cheapest (price), thumb (image URL) }
// ─────────────────────────────────────────────
export async function searchGames(query) {
  // encodeURIComponent turns special characters (spaces → %20, & → %26) into URL-safe format.
  // Without this, a game title like "Grand Theft Auto" would break the URL.
  const encodedQuery = encodeURIComponent(query);

  const response = await fetch(`${BASE_URL}/games?title=${encodedQuery}`);

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`);
  }

  return response.json();
}

// ─────────────────────────────────────────────
// fetchGameDeals
// Fetches all available deals for a specific game by its CheapShark gameID.
// Returns an object like:
// {
//   info: { title, thumb },
//   deals: [{ storeID, price, retailPrice, savings, dealID }, ...]
//   (API also accepts legacy salePrice/normalPrice field names after normalization)
// }
// ─────────────────────────────────────────────
function normalizeDeal(deal) {
  return {
    ...deal,
    salePrice: deal.salePrice ?? deal.price,
    normalPrice: deal.normalPrice ?? deal.retailPrice,
  };
}

export async function fetchGameDeals(gameID) {
  const response = await fetch(`${BASE_URL}/games?id=${gameID}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch deals: ${response.status}`);
  }

  const data = await response.json();

  if (data.deals) {
    data.deals = data.deals.map(normalizeDeal);
  }

  return data;
}

// ─────────────────────────────────────────────
// fetchTopDeals — best current deals sorted by savings (Deal of the Day)
// fetchDealDetails — extended info for a single deal (Quick View)
// fetchCheapestPriceEver — check if current price is an all-time low
// ─────────────────────────────────────────────
export async function fetchTopDeals(pageSize = 1) {
  const response = await fetch(
    `${BASE_URL}/deals?sortBy=Savings&desc=0&pageSize=${pageSize}&onSale=1`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch deals: ${response.status}`);
  }

  return response.json();
}

// ─────────────────────────────────────────────
// fetchDealDetails
// Returns extended info for a single deal (for Quick View modal).
// ─────────────────────────────────────────────
export async function fetchDealDetails(dealID) {
  const encoded = encodeURIComponent(dealID);
  const response = await fetch(`${BASE_URL}/deals?id=${encoded}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch deal details: ${response.status}`);
  }

  return response.json();
}

// ─────────────────────────────────────────────
// fetchCheapestPriceEver
// Lightweight helper to check if current price is an all-time low.
// ─────────────────────────────────────────────
export async function fetchCheapestPriceEver(gameID) {
  const response = await fetch(`${BASE_URL}/games?id=${gameID}`);
  if (!response.ok) return null;

  const data = await response.json();
  return data.cheapestPriceEver || null;
}

export function buildStoreMap(stores) {
  // Converts stores array → { storeID: { name, logo, icon } } for O(1) lookup
  return stores.reduce((acc, store) => {
    // storeID is a string like "1", "2", "3" from the API
    acc[store.storeID] = {
      name: store.storeName,
      // CheapShark serves store logos from their CDN (Content Delivery Network).
      // The "logo" path in the API response is relative, so we prepend the domain.
      logo: `https://www.cheapshark.com${store.images.logo}`,
      icon: `https://www.cheapshark.com${store.images.icon}`,
    };
    return acc;
  }, {}); // {} is the initial value of "acc" — we start with an empty object
}
