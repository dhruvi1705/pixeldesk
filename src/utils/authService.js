/**
 * PixelDesk Authentication Service
 * Manages JWT access tokens and user profile state.
 *
 * Security Architecture:
 * - JWT access tokens are strictly stored in browser sessionStorage only.
 *   They are never written to or read from localStorage.
 * - Non-sensitive cached user profile in sessionStorage is used exclusively
 *   for UI presentation hints and storage key namespacing; it NEVER authorizes
 *   access to protected routes without a verified session token.
 * - On browser refresh, session restoration requires verification against
 *   the backend /api/v1/auth/me endpoint.
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";
const TOKEN_KEY = "pixeldesk_auth_token";
const USER_KEY = "pixeldesk_auth_user";

export const authService = {
  /**
   * Register a new user account.
   */
  async signup({ username, email, password }) {
    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          full_name: username.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.detail || "Registration failed. Please check your details.",
        };
      }

      // Store session token and user profile in sessionStorage ONLY
      if (data.access_token) {
        this.setSession(data.access_token, data.user);
      }

      return {
        success: true,
        user: data.user,
        token: data.access_token,
      };
    } catch {
      return {
        success: false,
        error: "Unable to connect to backend server. Ensure the API is running at " + API_BASE,
      };
    }
  },

  /**
   * Authenticate user with email and password.
   */
  async login({ email, password }) {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.detail || "Invalid email or password.",
        };
      }

      // Store session token and user profile in sessionStorage ONLY
      if (data.access_token) {
        this.setSession(data.access_token, data.user);
      }

      return {
        success: true,
        user: data.user,
        token: data.access_token,
      };
    } catch {
      return {
        success: false,
        error: "Unable to connect to backend server. Ensure the API is running at " + API_BASE,
      };
    }
  },

  /**
   * Store token and cached user in sessionStorage only.
   */
  setSession(token, user) {
    if (token) {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
    if (user) {
      sessionStorage.setItem(
        USER_KEY,
        JSON.stringify({
          id: user.id,
          email: user.email,
          full_name: user.full_name,
        })
      );
    }
  },

  /**
   * Fetch latest profile from /api/v1/auth/me using current session token.
   * On 401/403: clears session and returns null (unauthenticated).
   * On network or server outage: throws error to trigger connection error screen.
   */
  async getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;

    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Token is invalid or expired
        this.logout();
        return null;
      }
      throw new Error(`Server returned status ${response.status}`);
    }

    const user = await response.json();
    this.setSession(token, user);
    return user;
  },

  /**
   * Read stored access token from sessionStorage ONLY.
   */
  getToken() {
    try {
      return sessionStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Read cached non-sensitive user profile from sessionStorage ONLY.
   */
  getStoredUser() {
    try {
      const raw = sessionStorage.getItem(USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Check if user currently holds an active session token.
   */
  isAuthenticated() {
    return Boolean(this.getToken());
  },

  /**
   * Log out and clear session tokens and cached user data.
   */
  logout() {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      // Clean up legacy localStorage keys if any exist
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.warn("Failed to clear auth storage during logout:", e);
    }
  },
};
