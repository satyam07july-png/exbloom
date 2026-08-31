/**
 * API Base URL Utility
 *
 * Dev  (Vite proxy): relative paths work → ''
 * Prod (Vercel):     VITE_API_URL must point to Render backend
 *
 * Set in client/.env.production:
 *   VITE_API_URL=https://your-app.onrender.com
 */
const BASE_URL = import.meta.env.VITE_API_URL || '';

export default BASE_URL;
