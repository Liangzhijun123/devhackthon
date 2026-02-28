/**
 * Unit tests for AuthContext
 * Tests login/logout flows, plan updates, and immediate access
 * 
 * **Validates: Requirements 1.1, 15.5**
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { AuthService } from '@/services/AuthService';
import { StorageService } from '@/services/StorageService';
import { Plan } from '@/types';

/**
 * Wrapper component for testing hooks
 */
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear all storage before each test
    AuthService.clearAll();
    StorageService.clearAll();
  });

  afterEach(() => {
    // Clean up after each test
    AuthService.clearAll();
    StorageService.clearAll();
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });

    it('should provide auth context when used within AuthProvider', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.user).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(typeof result.current.login).toBe('function');
      expect(typeof result.current.signup).toBe('function');
      expect(typeof result.current.logout).toBe('function');
      expect(typeof result.current.updatePlan).toBe('function');
      expect(typeof result.current.clearError).toBe('function');
    });
  });

  describe('initialization', () => {
    it('should initialize with no user when not logged in', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should load existing user session on mount', async () => {
      // Create a user and login before rendering the hook
      await AuthService.signup('test@example.com', 'password123', 'basic');

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Wait for initialization
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeDefined();
      expect(result.current.user?.email).toBe('test@example.com');
      expect(result.current.user?.plan).toBe('basic');
    });
  });

  describe('signup flow', () => {
    it('should successfully signup a new user', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toBeNull();

      await act(async () => {
        await result.current.signup('test@example.com', 'password123', 'basic');
      });

      expect(result.current.user).toBeDefined();
      expect(result.current.user?.email).toBe('test@example.com');
      expect(result.current.user?.plan).toBe('basic');
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should handle signup errors', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        try {
          await result.current.signup('invalid-email', 'password123', 'basic');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.user).toBeNull();
      expect(result.current.error).toBe('Invalid email format');
      expect(result.current.loading).toBe(false);
    });

    it('should signup users with different plans', async () => {
      const plans: Plan[] = ['basic', 'premium', 'pro'];

      for (const plan of plans) {
        // Clear between tests
        AuthService.clearAll();
        StorageService.clearAll();

        const { result } = renderHook(() => useAuth(), { wrapper });

        await act(async () => {
          await result.current.signup(`test-${plan}@example.com`, 'password123', plan);
        });

        expect(result.current.user?.plan).toBe(plan);
      }
    });
  });

  describe('login flow', () => {
    beforeEach(async () => {
      // Create a test user
      await AuthService.signup('test@example.com', 'password123', 'premium');
      AuthService.logout();
    });

    it('should successfully login with correct credentials', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toBeNull();

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      expect(result.current.user).toBeDefined();
      expect(result.current.user?.email).toBe('test@example.com');
      expect(result.current.user?.plan).toBe('premium');
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should handle login errors for incorrect password', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        try {
          await result.current.login('test@example.com', 'wrongpassword');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.user).toBeNull();
      expect(result.current.error).toBe('Invalid email or password');
      expect(result.current.loading).toBe(false);
    });

    it('should handle login errors for non-existent user', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        try {
          await result.current.login('nonexistent@example.com', 'password123');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.user).toBeNull();
      expect(result.current.error).toBe('Invalid email or password');
    });
  });

  describe('logout flow', () => {
    it('should successfully logout a logged-in user', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // First login
      await act(async () => {
        await result.current.signup('test@example.com', 'password123', 'basic');
      });

      expect(result.current.user).toBeDefined();

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('should clear error state on logout', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Create an error state
      await act(async () => {
        try {
          await result.current.login('invalid@example.com', 'password123');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBeDefined();

      // Logout should clear error
      act(() => {
        result.current.logout();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('plan updates and immediate access (Requirement 15.5)', () => {
    it('should immediately update user plan from basic to premium', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Signup with basic plan
      await act(async () => {
        await result.current.signup('test@example.com', 'password123', 'basic');
      });

      expect(result.current.user?.plan).toBe('basic');

      // Update to premium
      await act(async () => {
        await result.current.updatePlan('premium');
      });

      // Should immediately grant access (Requirement 15.5)
      expect(result.current.user?.plan).toBe('premium');
      expect(result.current.error).toBeNull();
    });

    it('should immediately update user plan from basic to pro', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Signup with basic plan
      await act(async () => {
        await result.current.signup('test@example.com', 'password123', 'basic');
      });

      expect(result.current.user?.plan).toBe('basic');

      // Update to pro
      await act(async () => {
        await result.current.updatePlan('pro');
      });

      // Should immediately grant access (Requirement 15.5)
      expect(result.current.user?.plan).toBe('pro');
      expect(result.current.error).toBeNull();
    });

    it('should immediately update user plan from premium to pro', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Signup with premium plan
      await act(async () => {
        await result.current.signup('test@example.com', 'password123', 'premium');
      });

      expect(result.current.user?.plan).toBe('premium');

      // Update to pro
      await act(async () => {
        await result.current.updatePlan('pro');
      });

      // Should immediately grant access (Requirement 15.5)
      expect(result.current.user?.plan).toBe('pro');
      expect(result.current.error).toBeNull();
    });

    it('should clear trial when upgrading from basic to premium', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Signup with basic plan (has trial)
      await act(async () => {
        await result.current.signup('test@example.com', 'password123', 'basic');
      });

      expect(result.current.user?.trialEndsAt).toBeDefined();

      // Update to premium
      await act(async () => {
        await result.current.updatePlan('premium');
      });

      // Trial should be cleared
      expect(result.current.user?.trialEndsAt).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should handle plan update errors when no user is logged in', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        try {
          await result.current.updatePlan('premium');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('No user logged in');
    });

    it('should handle plan update errors for invalid plan', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.signup('test@example.com', 'password123', 'basic');
      });

      await act(async () => {
        try {
          await result.current.updatePlan('invalid' as Plan);
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Invalid plan selection');
      // User plan should remain unchanged
      expect(result.current.user?.plan).toBe('basic');
    });
  });

  describe('error handling', () => {
    it('should clear error with clearError method', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Create an error
      await act(async () => {
        try {
          await result.current.login('invalid@example.com', 'password123');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBeDefined();

      // Clear error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('should clear previous error on new login attempt', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Create an error
      await act(async () => {
        try {
          await result.current.login('invalid@example.com', 'password123');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBeDefined();

      // Create a user for successful login
      await AuthService.signup('test@example.com', 'password123', 'basic');
      AuthService.logout();

      // New login attempt should clear previous error
      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      expect(result.current.error).toBeNull();
    });

    it('should clear previous error on new signup attempt', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Create an error
      await act(async () => {
        try {
          await result.current.signup('invalid-email', 'password123', 'basic');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBeDefined();

      // New signup attempt should clear previous error
      await act(async () => {
        await result.current.signup('valid@example.com', 'password123', 'basic');
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('complete authentication flows', () => {
    it('should handle complete signup -> logout -> login flow', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Signup
      await act(async () => {
        await result.current.signup('test@example.com', 'password123', 'premium');
      });

      expect(result.current.user?.email).toBe('test@example.com');
      expect(result.current.user?.plan).toBe('premium');

      // Logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();

      // Login
      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      expect(result.current.user?.email).toBe('test@example.com');
      expect(result.current.user?.plan).toBe('premium');
    });

    it('should handle complete signup -> upgrade -> logout -> login flow', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Signup with basic
      await act(async () => {
        await result.current.signup('test@example.com', 'password123', 'basic');
      });

      expect(result.current.user?.plan).toBe('basic');

      // Upgrade to pro
      await act(async () => {
        await result.current.updatePlan('pro');
      });

      expect(result.current.user?.plan).toBe('pro');

      // Logout
      act(() => {
        result.current.logout();
      });

      // Login and verify plan persisted
      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      expect(result.current.user?.plan).toBe('pro');
    });
  });

  describe('concurrent operations', () => {
    it('should handle multiple plan updates correctly', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.signup('test@example.com', 'password123', 'basic');
      });

      // Update to premium
      await act(async () => {
        await result.current.updatePlan('premium');
      });

      expect(result.current.user?.plan).toBe('premium');

      // Update to pro
      await act(async () => {
        await result.current.updatePlan('pro');
      });

      expect(result.current.user?.plan).toBe('pro');

      // Downgrade to basic
      await act(async () => {
        await result.current.updatePlan('basic');
      });

      expect(result.current.user?.plan).toBe('basic');
    });
  });
});
