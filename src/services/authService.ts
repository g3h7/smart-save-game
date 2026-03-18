/**
 * Auth Service Abstraction Layer
 * 
 * Currently uses localStorage (NOT secure for production).
 * When migrating to a real backend (e.g., Lovable Cloud/Supabase),
 * replace the implementations below without changing the interface.
 * 
 * LGPD Notes:
 * - Never store passwords in localStorage or plaintext
 * - Never log sensitive user data to console
 * - Minimize data collection (only what's necessary)
 * - Provide data deletion capabilities
 */

const AUTH_STORAGE_KEY = "educash-session";

export interface AuthUser {
  name: string;
  email: string;
  createdAt: string;
}

interface AuthSession {
  user: AuthUser;
  expiresAt: number;
}

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function sanitizeString(input: string): string {
  return input.replace(/[<>"'&]/g, "").trim();
}

export const authService = {
  /**
   * Simulate login. In production, this should call a secure backend endpoint.
   * NEVER store raw passwords.
   */
  async login(email: string, _password: string): Promise<AuthUser> {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));

    const sanitizedEmail = sanitizeString(email);

    // In production: POST to /api/auth/login with credentials
    // Backend handles password hashing comparison
    const user: AuthUser = {
      name: "Jogador",
      email: sanitizedEmail,
      createdAt: new Date().toISOString(),
    };

    const session: AuthSession = {
      user,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };

    // Store session (no sensitive data)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    return user;
  },

  /**
   * Simulate signup. In production, this should call a secure backend endpoint.
   */
  async signup(name: string, email: string, _password: string): Promise<AuthUser> {
    await new Promise((r) => setTimeout(r, 600));

    const sanitizedName = sanitizeString(name);
    const sanitizedEmail = sanitizeString(email);

    // In production: POST to /api/auth/signup
    // Backend handles: password hashing (bcrypt), email verification, rate limiting
    const user: AuthUser = {
      name: sanitizedName,
      email: sanitizedEmail,
      createdAt: new Date().toISOString(),
    };

    const session: AuthSession = {
      user,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    return user;
  },

  /**
   * Get current session if valid
   */
  getSession(): AuthUser | null {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return null;

      const session: AuthSession = JSON.parse(raw);

      // Check expiration
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }

      return session.user;
    } catch {
      this.logout();
      return null;
    }
  },

  /**
   * Clear session data (LGPD: user right to data deletion)
   */
  logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  /**
   * LGPD: Delete all user data from local storage
   */
  deleteAllUserData(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem("educash-character");
    // Add other user data keys here as they are created
  },

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  },
};
