/**
 * API Base URL Utility
 *
 * Local/Dev (localhost): uses relative paths '' (Vite proxy forwards to http://localhost:5000)
 * Prod (Vercel): uses VITE_API_URL pointing to Render backend
 */
const envUrl = import.meta.env.VITE_API_URL;
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const isPlaceholder = !envUrl || envUrl.includes('your-render-app') || envUrl.includes('your-app');

const BASE_URL = (isLocal || isPlaceholder) ? '' : envUrl.replace(/\/+$/, '');

export default BASE_URL;
