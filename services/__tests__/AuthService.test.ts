/**
 * Unit tests for AuthService
 * Tests authentication, signup, login, and plan management
 */

import { AuthService, AuthError } from '../AuthService';
import { StorageService } from '../StorageService';
import { User } from '@/types';

describe('AuthService', () => {
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

  describe('signup', () => {
    it('should create a new user with valid credentials and plan', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const plan = 'basic';

      const user = await AuthService.signup(email, password, plan);

      expect(user).toBeDefined();
      expect(user.email).toBe(email);
      expect(user.plan).toBe(plan);
      expect(user.id).toBeDefined();
      expect(user.streak).toBe(0);
      expect(user.streakFreezeUsed).toBe(false);
      expect(user.lastSessionDate).toBeNull();
    });

    it('should activate 30-day trial for basic plan', async () => {
      const now = new Date();
      const user = await AuthService.signup('test@example.com', 'password123', 'basic');

      expect(user.trialEndsAt).toBeDefined();
      expect(user.trialEndsAt).toBeInstanceOf(Date);
      
      // Trial should end approximately 30 days from now
      const expectedEnd = new Date(now);
      expectedEnd.setDate(expectedEnd.getDate() + 30);
      const diff = Math.abs(user.trialEndsAt!.getTime() - expectedEnd.getTime());
      
      // Allow 5 seconds difference for test execution time
      expect(diff).toBeLessThan(5000);
    });

    it('should not set trial for premium plan', async () => {
      const user = await AuthService.signup('test@example.com', 'password123', 'premium');

      expect(user.trialEndsAt).toBeNull();
    });

    it('should not set trial for pro plan', async () => {
      const user = await AuthService.signup('test@example.com', 'password123', 'pro');

      expect(user.trialEndsAt).toBeNull();
    });

    it('should throw error for invalid email', async () => {
      await expect(
        AuthService.signup('invalid-email', 'password123', 'basic')
      ).rejects.toThrow(AuthError);

      await expect(
        AuthService.signup('invalid-email', 'password123', 'basic')
      ).rejects.toThrow('Invalid email format');
    });

    it('should throw error for weak password', async () => {
      await expect(
        AuthService.signup('test@example.com', 'short', 'basic')
      ).rejects.toThrow(AuthError);

      await expect(
        AuthService.signup('test@example.com', 'short', 'basic')
      ).rejects.toThrow('Password must be at least 8 characters');
    });

    it('should throw error for invalid plan', async () => {
      await expect(
        AuthService.signup('test@example.com', 'password123', 'invalid' as any)
      ).rejects.toThrow(AuthError);

      await expect(
        AuthService.signup('test@example.com', 'password123', 'invalid' as any)
      ).rejects.toThrow('Invalid plan selection');
    });

    it('should throw error for duplicate email', async () => {
      await AuthService.signup('test@example.com', 'password123', 'basic');

      await expect(
        AuthService.signup('test@example.com', 'password456', 'premium')
      ).rejects.toThrow(AuthError);

      await expect(
        AuthService.signup('test@example.com', 'password456', 'premium')
      ).rejects.toThrow('An account with this email already exists');
    });

    it('should set user as current user after signup', async () => {
      const user = await AuthService.signup('test@example.com', 'password123', 'basic');
      const currentUser = AuthService.getCurrentUser();

      expect(currentUser).toBeDefined();
      expect(currentUser?.id).toBe(user.id);
      expect(currentUser?.email).toBe(user.email);
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      // Create a test user
      await AuthService.signup('test@example.com', 'password123', 'basic');
      AuthService.logout(); // Log out after signup
    });

    it('should login with correct credentials', async () => {
      const user = await AuthService.login('test@example.com', 'password123');

      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.plan).toBe('basic');
    });

    it('should throw error for incorrect password', async () => {
      await expect(
        AuthService.login('test@example.com', 'wrongpassword')
      ).rejects.toThrow(AuthError);

      await expect(
        AuthService.login('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid email or password');
    });

    it('should throw error for non-existent email', async () => {
      await expect(
        AuthService.login('nonexistent@example.com', 'password123')
      ).rejects.toThrow(AuthError);

      await expect(
        AuthService.login('nonexistent@example.com', 'password123')
      ).rejects.toThrow('Invalid email or password');
    });

    it('should set user as current user after login', async () => {
      const user = await AuthService.login('test@example.com', 'password123');
      const currentUser = AuthService.getCurrentUser();

      expect(currentUser).toBeDefined();
      expect(currentUser?.id).toBe(user.id);
    });
  });

  describe('logout', () => {
    it('should clear current user', async () => {
      await AuthService.signup('test@example.com', 'password123', 'basic');
      expect(AuthService.getCurrentUser()).toBeDefined();

      AuthService.logout();
      expect(AuthService.getCurrentUser()).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user is logged in', () => {
      const currentUser = AuthService.getCurrentUser();
      expect(currentUser).toBeNull();
    });

    it('should return current user when logged in', async () => {
      const user = await AuthService.signup('test@example.com', 'password123', 'basic');
      const currentUser = AuthService.getCurrentUser();

      expect(currentUser).toBeDefined();
      expect(currentUser?.id).toBe(user.id);
      expect(currentUser?.email).toBe(user.email);
    });
  });

  describe('updatePlan', () => {
    let userId: string;

    beforeEach(async () => {
      const user = await AuthService.signup('test@example.com', 'password123', 'basic');
      userId = user.id;
    });

    it('should update user plan from basic to premium', async () => {
      const updatedUser = await AuthService.updatePlan(userId, 'premium');

      expect(updatedUser.plan).toBe('premium');
      expect(updatedUser.trialEndsAt).toBeNull();
    });

    it('should update user plan from basic to pro', async () => {
      const updatedUser = await AuthService.updatePlan(userId, 'pro');

      expect(updatedUser.plan).toBe('pro');
      expect(updatedUser.trialEndsAt).toBeNull();
    });

    it('should set trial when downgrading to basic', async () => {
      // First upgrade to premium
      await AuthService.updatePlan(userId, 'premium');
      
      // Then downgrade to basic
      const updatedUser = await AuthService.updatePlan(userId, 'basic');

      expect(updatedUser.plan).toBe('basic');
      expect(updatedUser.trialEndsAt).toBeDefined();
      expect(updatedUser.trialEndsAt).toBeInstanceOf(Date);
    });

    it('should throw error for invalid plan', async () => {
      await expect(
        AuthService.updatePlan(userId, 'invalid' as any)
      ).rejects.toThrow(AuthError);

      await expect(
        AuthService.updatePlan(userId, 'invalid' as any)
      ).rejects.toThrow('Invalid plan selection');
    });

    it('should throw error for non-existent user', async () => {
      await expect(
        AuthService.updatePlan('nonexistent-id', 'premium')
      ).rejects.toThrow(AuthError);

      await expect(
        AuthService.updatePlan('nonexistent-id', 'premium')
      ).rejects.toThrow('User not found');
    });
  });

  describe('isTrialExpired', () => {
    it('should return false for premium users', async () => {
      const user = await AuthService.signup('test@example.com', 'password123', 'premium');
      expect(AuthService.isTrialExpired(user)).toBe(false);
    });

    it('should return false for pro users', async () => {
      const user = await AuthService.signup('test@example.com', 'password123', 'pro');
      expect(AuthService.isTrialExpired(user)).toBe(false);
    });

    it('should return false for basic users with active trial', async () => {
      const user = await AuthService.signup('test@example.com', 'password123', 'basic');
      expect(AuthService.isTrialExpired(user)).toBe(false);
    });

    it('should return true for basic users with expired trial', async () => {
      const user = await AuthService.signup('test@example.com', 'password123', 'basic');
      
      // Manually set trial end date to the past
      const expiredUser: User = {
        ...user,
        trialEndsAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      };

      expect(AuthService.isTrialExpired(expiredUser)).toBe(true);
    });
  });
});
