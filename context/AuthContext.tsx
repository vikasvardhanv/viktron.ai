import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  fullName: string;
  company?: string;
  role: string;
}

interface OAuthData {
  email: string;
  fullName: string;
  provider: 'google' | 'apple';
  providerId: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; message: string }>;
  oauthLogin: (data: OAuthData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
}

interface SignupData {
  email: string;
  password: string;
  fullName: string;
  company?: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const toApiBase = (value?: string) => {
  if (!value) return '/api';
  const trimmed = String(value).trim().replace(/\/$/, '');
  if (!trimmed) return '/api';
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const getAuthApiBase = () => {
  if (typeof window === 'undefined') {
    return toApiBase(import.meta.env.VITE_API_URL);
  }

  const host = window.location.hostname.replace(/^www\./, '');
  if (/localhost|127\.0\.0\.1/.test(host)) {
    return toApiBase(import.meta.env.VITE_API_URL);
  }

  // Auth API is served by viktron.ai Node service.
  if (host === 'viktron.ai' || host.endsWith('.viktron.ai')) {
    return 'https://viktron.ai/api';
  }

  return toApiBase(import.meta.env.VITE_API_URL);
};


// Cookie helpers for cross-subdomain auth
const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const domain = window.location.hostname.includes('viktron.ai') ? '.viktron.ai' : window.location.hostname;
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; domain=${domain}; SameSite=Lax`;
};

const getCookie = (name: string) => {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
};

const deleteCookie = (name: string) => {
  const domain = window.location.hostname.includes('viktron.ai') ? '.viktron.ai' : window.location.hostname;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
};

const API_URL = getAuthApiBase();

// Synchronous session sync for cross-subdomain support
(function() {
  const TOKEN_KEY = 'viktron_auth_token';
  const USER_KEY = 'viktron_user';
  
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return '';
  };

  if (typeof window !== 'undefined' && !localStorage.getItem(TOKEN_KEY)) {
    const cookieToken = getCookie(TOKEN_KEY);
    const cookieUser = getCookie(USER_KEY);
    if (cookieToken) localStorage.setItem(TOKEN_KEY, cookieToken);
    if (cookieUser) localStorage.setItem(USER_KEY, cookieUser);
  }
})();

const TOKEN_KEY = 'viktron_auth_token';
const USER_KEY = 'viktron_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      let token = localStorage.getItem(TOKEN_KEY);
      let savedUser = localStorage.getItem(USER_KEY);

      // Try cookies if localStorage is empty (cross-subdomain support)
      if (!token) {
        token = getCookie(TOKEN_KEY);
        if (token) console.log('[Auth] Found token in cookies');
      }
      if (!savedUser) {
        savedUser = getCookie(USER_KEY);
        if (savedUser) console.log('[Auth] Found user in cookies');
      }

      console.log('[Auth] Loading user, token exists:', !!token, 'savedUser exists:', !!savedUser);

      if (token && savedUser) {
        try {
          // First, immediately set the user from localStorage for instant auth state
          const cachedUser = JSON.parse(savedUser);
          setUser(cachedUser);
          console.log('[Auth] Set cached user:', cachedUser?.email);

          // Then verify token is still valid in background
          const response = await fetch(`${API_URL}/auth/verify`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          console.log('[Auth] Verify response:', response.status);

          if (response.ok) {
            const data = await response.json();
            setUser(data.data.user);
            console.log('[Auth] User verified:', data.data.user?.email);
          } else {
            // Token invalid, clear storage
            console.log('[Auth] Token invalid, clearing');
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY); deleteCookie(TOKEN_KEY); deleteCookie(USER_KEY);
            setUser(null);
          }
        } catch (error) {
          // Network error - keep using cached user (already set above)
          console.log('[Auth] Network error during verify, keeping cached user:', error);
        }
      }
      setIsLoading(false);
      console.log('[Auth] Loading complete');
    };

    loadUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem(TOKEN_KEY, data.data.token); setCookie(TOKEN_KEY, data.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.data.user)); setCookie(USER_KEY, JSON.stringify(data.data.user));
        setUser(data.data.user);
        setShowAuthModal(false);
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  }, []);

  const signup = useCallback(async (signupData: SignupData) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
      });

      const text = await response.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      if (data?.success) {
        localStorage.setItem(TOKEN_KEY, data.data.token); setCookie(TOKEN_KEY, data.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.data.user)); setCookie(USER_KEY, JSON.stringify(data.data.user));
        setUser(data.data.user);
        setShowAuthModal(false);
        return { success: true, message: 'Account created successfully' };
      } else {
        return {
          success: false,
          message: data?.message || `Signup failed (${response.status})`
        };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  }, []);

  const oauthLogin = useCallback(async (oauthData: OAuthData) => {
    try {
      const response = await fetch(`${API_URL}/auth/oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(oauthData)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem(TOKEN_KEY, data.data.token); setCookie(TOKEN_KEY, data.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.data.user)); setCookie(USER_KEY, JSON.stringify(data.data.user));
        setUser(data.data.user);
        setShowAuthModal(false);
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: data.message || 'OAuth login failed' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY); deleteCookie(TOKEN_KEY); deleteCookie(USER_KEY);
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    oauthLogin,
    logout,
    showAuthModal,
    setShowAuthModal,
    authModalMode,
    setAuthModalMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to get auth token for API calls
export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

// Helper function to make authenticated API calls
export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  });
};
