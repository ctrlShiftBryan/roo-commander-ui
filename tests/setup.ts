// Import Bun's test globals first
import { JSDOM } from 'jsdom';
import ResizeObserver from 'resize-observer-polyfill';

// --- JSDOM Setup ---
// Create a basic JSDOM instance
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost/', // Necessary for things like localStorage, URL API
  pretendToBeVisual: true, // Enables requestAnimationFrame and other visual APIs
});

// Assign the JSDOM window and document to the global scope
// Need to cast to unknown first because TypeScript's global types conflict
global.window = dom.window as unknown as Window & typeof globalThis;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.requestAnimationFrame = dom.window.requestAnimationFrame;
global.cancelAnimationFrame = dom.window.cancelAnimationFrame;
global.getComputedStyle = dom.window.getComputedStyle; // Add this line

// Add missing globals needed by Radix UI
global.DocumentFragment = dom.window.DocumentFragment;
global.ResizeObserver = ResizeObserver; // Use the polyfill

// Assign other common globals needed by React/Testing Library
global.HTMLElement = dom.window.HTMLElement;
global.HTMLAnchorElement = dom.window.HTMLAnchorElement; // Needed by the test mocks
global.FileReader = dom.window.FileReader; // Needed by the test mocks
global.URL = dom.window.URL; // Needed by the test mocks

// You might need to expose other globals depending on your component's needs
// e.g., global.localStorage = dom.window.localStorage;

// --- End JSDOM Setup ---

// Add any other global test setup needed here in the future
