// Simple polyfill for Firefox compatibility
if (typeof browser !== 'undefined' && typeof chrome === 'undefined') {
  window.chrome = browser;
}