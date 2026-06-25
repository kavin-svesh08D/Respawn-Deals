// ============================================================
// main.jsx — Application entry point.
// This is the ONLY file that directly touches the HTML DOM.
// React renders everything else through the virtual DOM.
//
// "Virtual DOM" explained:
// React keeps a lightweight copy of the real DOM in memory.
// When state changes, React compares the new virtual DOM with
// the old one ("diffing"), and only updates the real DOM where
// something actually changed. This is WAY faster than replacing
// the whole page every time something changes.
// ============================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Import global styles (Tailwind + custom CSS)

// ReactDOM.createRoot() creates a React "root" — the entry point into React's rendering system.
// It takes a real DOM element (the <div id="root"> from index.html) and hands it to React.
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode is a development tool — it intentionally renders components TWICE
  // to help you find bugs like side effects in render functions.
  // It has NO effect in production builds (it's stripped out during `vite build`).
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
