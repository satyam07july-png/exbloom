/**
 * API Base URL Utility
 *
 * Local/Dev (localhost): uses relative paths '' (Vite proxy forwards to http://localhost:5000)
 * Prod (Vercel): uses VITE_API_URL or defaults to live Render backend
 */
const envUrl = import.meta.env.VITE_API_URL;
const isLocal =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const BASE_URL = isLocal
  ? ''
  : envUrl && !envUrl.includes('your-render-app') && !envUrl.includes('your-app')
  ? envUrl.replace(/\/+$/, '')
  : 'https://nexbloom.onrender.com';

export default BASE_URL;
