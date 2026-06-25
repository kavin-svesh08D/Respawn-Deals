# PC Game Price Comparer 🎮

A modern React + Vite + Tailwind CSS web application that lets users search for any PC game and compare its prices across multiple stores (Steam, GOG, Epic, and more) using the [CheapShark API](https://www.cheapshark.com).

---

## Tech Stack

- **React 18** — UI library (functional components + hooks)
- **Vite** — super-fast development server and bundler
- **Tailwind CSS v3** — utility-first CSS framework
- **CheapShark API** — free, no-key-required PC game deals API

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Top navigation bar
│   ├── SearchBar.jsx       # Search input + recent searches + favorites
│   ├── GameCard.jsx        # Single game card + skeleton variant
│   ├── GameList.jsx        # Grid of GameCards
│   ├── PriceTable.jsx      # Price comparison section with sort controls
│   ├── DealRow.jsx         # Single deal row in the table + skeleton variant
│   ├── LoadingSpinner.jsx  # Reusable animated spinner
│   └── ErrorMessage.jsx    # Friendly error display
│
├── services/
│   └── cheapSharkApi.js    # All API calls (fetchStores, searchGames, fetchGameDeals)
│
├── utils/
│   ├── sortDeals.js        # Sort deals by price / discount / store name
│   └── calculateDiscount.js # Format prices, calculate discount %, etc.
│
├── App.jsx                 # Root component — owns all shared state
├── main.jsx                # React DOM entry point
└── index.css               # Tailwind directives + custom CSS
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production

```bash
npm run build
```

The compiled output will be in the `dist/` folder — ready to deploy to Netlify, Vercel, or GitHub Pages.

---

## Features

- 🔍 **Game Search** — Search any PC game by title
- 💰 **Price Comparison** — Compare deals across all available stores
- 🏷️ **Discount Badges** — See percentage savings at a glance
- ↕️ **Sort Options** — Sort by lowest price, best discount, or store name
- 🕒 **Recent Searches** — Automatically saved to localStorage
- ⭐ **Favorites** — Star games to save them for quick access
- 💀 **Skeleton Loaders** — Smooth loading placeholders
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop
- ♿ **Accessible** — Proper ARIA roles, keyboard navigation, screen reader friendly

---

## API Used

**CheapShark API** — No API key required!

| Endpoint | Purpose |
|---|---|
| `GET /stores` | Fetch all store names and logos |
| `GET /games?title={query}` | Search games by title |
| `GET /games?id={gameID}` | Get all deals for a specific game |
| `https://www.cheapshark.com/redirect?dealID={id}` | Redirect to store purchase page |
