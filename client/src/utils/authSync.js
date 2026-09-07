// client/src/utils/authSync.js

const SYNC_STORAGE_KEY = 'nexbloom_auth_sync';
const CHANNEL_NAME = 'nexbloom_auth_channel';

// Singleton BroadcastChannel instance
let authChannel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    authChannel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (e) {
  authChannel = null;
}

/**
 * Get current stored user (either tab-isolated admin or shared customer)
 */
export const getStoredUser = () => {
  try {
    // 1. Check tab-isolated Admin session (never shared across tabs)
    const adminTabSaved = sessionStorage.getItem('nexbloom_admin_tab_user');
    if (adminTabSaved) {
      return { user: JSON.parse(adminTabSaved), role: 'admin' };
    }

    // 2. Check Customer session (shared across tabs for convenience)
    const userSaved = localStorage.getItem('nexbloom_user');
    if (userSaved) {
      return { user: JSON.parse(userSaved), role: 'customer' };
    }
  } catch (e) {}
  return null;
};

/**
 * Get stored auth token (tab-isolated admin token or customer token)
 */
export const getStoredToken = () => {
  return (
    sessionStorage.getItem('nexbloom_admin_tab_token') ||
    localStorage.getItem('nexbloom_user_token') ||
    ''
  );
};

/**
 * Save user session:
 * - Admin: TAB-ISOLATED in sessionStorage (never shared across tabs, mandatory password on other tabs)
 * - Customer: Shared in localStorage + BroadcastChannel across tabs
 */
export const saveUserSession = (user, token, role = 'customer') => {
  try {
    if (role === 'admin') {
      // STRICT TAB ISOLATION FOR ADMIN
      sessionStorage.setItem('nexbloom_admin_tab_token', token);
      sessionStorage.setItem('nexbloom_admin_tab_user', JSON.stringify(user));

      // Ensure admin credentials NEVER leak to localStorage
      localStorage.removeItem('nexbloom_admin_token');
      localStorage.removeItem('nexbloom_admin_user');
      return; // DO NOT broadcast admin login to other tabs
    }

    // CUSTOMER SESSION (Shared across tabs)
    localStorage.setItem('nexbloom_user_token', token);
    localStorage.setItem('nexbloom_user', JSON.stringify(user));
    localStorage.removeItem('nexbloom_admin_token');
    localStorage.removeItem('nexbloom_admin_user');

    const payload = {
      type: 'LOGIN',
      user,
      role: 'customer',
      token,
      timestamp: Date.now(),
    };

    // 1. Notify via BroadcastChannel
    if (authChannel) {
      try {
        authChannel.postMessage(payload);
      } catch (err) {}
    }

    // 2. Notify via localStorage storage event (all other tabs receive this)
    localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error('saveUserSession error:', e);
  }
};

/**
 * Clear user session from storage and broadcast to ALL other tabs
 */
export const clearUserSession = (notifyOthers = true) => {
  try {
    // Clear Tab-isolated admin session
    sessionStorage.removeItem('nexbloom_admin_tab_token');
    sessionStorage.removeItem('nexbloom_admin_tab_user');

    // Clear Customer session
    localStorage.removeItem('nexbloom_admin_token');
    localStorage.removeItem('nexbloom_admin_user');
    localStorage.removeItem('nexbloom_user_token');
    localStorage.removeItem('nexbloom_user');

    if (notifyOthers) {
      const payload = {
        type: 'LOGOUT',
        timestamp: Date.now(),
      };

      // 1. Notify via BroadcastChannel
      if (authChannel) {
        try {
          authChannel.postMessage(payload);
        } catch (err) {}
      }

      // 2. Notify via localStorage storage event
      localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(payload));
    }
  } catch (e) {
    console.error('clearUserSession error:', e);
  }
};

/**
 * Subscribe to cross-tab auth events (Logout / Login across tabs)
 */
export const subscribeToAuthSync = ({ onLogin, onLogout }) => {
  let lastProcessedTimestamp = 0;

  const handleAction = (payload) => {
    if (!payload || !payload.type) return;
    if (payload.timestamp && payload.timestamp <= lastProcessedTimestamp) return;
    lastProcessedTimestamp = payload.timestamp || Date.now();

    if (payload.type === 'LOGOUT') {
      if (typeof onLogout === 'function') {
        onLogout();
      }
    } else if (payload.type === 'LOGIN') {
      if (typeof onLogin === 'function' && payload.user) {
        onLogin(payload.user, payload.role, payload.token);
      }
    }
  };

  // 1. Listen via BroadcastChannel
  const handleChannelMessage = (event) => {
    if (event && event.data) {
      handleAction(event.data);
    }
  };

  if (authChannel) {
    authChannel.addEventListener('message', handleChannelMessage);
  }

  // 2. Listen via window 'storage' event (fires in other tabs when localStorage changes)
  const handleStorageEvent = (event) => {
    // If sync payload was updated
    if (event.key === SYNC_STORAGE_KEY && event.newValue) {
      try {
        const payload = JSON.parse(event.newValue);
        handleAction(payload);
      } catch (e) {}
      return;
    }

    // Direct removal of user keys in another tab
    if (event.key === 'nexbloom_user' && !event.newValue) {
      handleAction({ type: 'LOGOUT', timestamp: Date.now() });
    }

    // Direct customer login in another tab
    if (event.key === 'nexbloom_user' && event.newValue) {
      try {
        const user = JSON.parse(event.newValue);
        handleAction({ type: 'LOGIN', user, role: 'customer', timestamp: Date.now() });
      } catch (e) {}
    }
  };

  window.addEventListener('storage', handleStorageEvent);

  // Return cleanup function
  return () => {
    if (authChannel) {
      authChannel.removeEventListener('message', handleChannelMessage);
    }
    window.removeEventListener('storage', handleStorageEvent);
  };
};
