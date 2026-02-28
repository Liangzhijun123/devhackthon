'use client';

/**
 * AuthContext - React Context for authentication state management
 * Provides user authentication state and methods throughout the application
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Plan } from '@/types';
import { AuthService, AuthError } from '@/services/AuthService';

/**
 * Authentication context value interface
 */
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, plan: Plan) => Promise<void>;
  logout: () => void;
  updatePlan: (newPlan: Plan) => Promise<void>;
  clearError: () => void;
}

/**
 * Create the authentication context
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * AuthProvider component props
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider component
 * Wraps the application and provides authentication state
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize authentication state on mount
   */
  useEffect(() => {
    const initAuth = () => {
      try {
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        setError('Failed to load user session');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login handler
   */
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const loggedInUser = await AuthService.login(email, password);
      setUser(loggedInUser);
    } catch (err) {
      const errorMessage = err instanceof AuthError ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Signup handler
   */
  const signup = useCallback(async (email: string, password: string, plan: Plan) => {
    setLoading(true);
    setError(null);
    
    try {
      const newUser = await AuthService.signup(email, password, plan);
      setUser(newUser);
    } catch (err) {
      const errorMessage = err instanceof AuthError ? err.message : 'Signup failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout handler
   */
  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
    setError(null);
  }, []);

  /**
   * Update plan handler
   * Immediately updates the user state to grant access to new features
   */
  const updatePlan = useCallback(async (newPlan: Plan) => {
    if (!user) {
      const errorMessage = 'No user logged in';
      setError(errorMessage);
      throw new Error(errorMessage);
    }

    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await AuthService.updatePlan(user.id, newPlan);
      // Immediately update state to grant access to new features (Requirement 15.5)
      setUser(updatedUser);
    } catch (err) {
      const errorMessage = err instanceof AuthError ? err.message : 'Plan update failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Clear error handler
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updatePlan,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth hook
 * Custom hook to consume the authentication context
 * @throws Error if used outside of AuthProvider
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
