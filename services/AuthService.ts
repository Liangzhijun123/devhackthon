/**
 * AuthService - Mock authentication service
 * Handles user signup, login, logout, and plan management
 * Uses StorageService for persistence in localStorage
 */

import { User, Plan } from '@/types';
import { StorageService } from './StorageService';

/**
 * Authentication error types
 */
export class AuthError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Mock password hashing (for demonstration purposes only)
 * In a real application, this would use bcrypt or similar
 */
class PasswordService {
  private static readonly MOCK_HASH_PREFIX = 'mock_hash_';

  static hash(password: string): string {
    // Simple mock hashing - just prefix the password
    // In production, use proper hashing like bcrypt
    return this.MOCK_HASH_PREFIX + password;
  }

  static verify(password: string, hash: string): boolean {
    return hash === this.MOCK_HASH_PREFIX + password;
  }
}

/**
 * Storage key for password hashes
 */
const PASSWORD_STORAGE_KEY = 'interview_buddy_passwords';

/**
 * Storage key for current user session
 */
const CURRENT_USER_KEY = 'interview_buddy_current_user';

export class AuthService {
  /**
   * Generate a unique user ID
   */
  private static generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate email format
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  private static isValidPassword(password: string): boolean {
    // Minimum 8 characters for this mock implementation
    return password.length >= 8;
  }

  /**
   * Get password hashes from localStorage
   */
  private static getPasswordHashes(): Record<string, string> {
    try {
      const data = localStorage.getItem(PASSWORD_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  /**
   * Save password hash to localStorage
   */
  private static savePasswordHash(email: string, hash: string): void {
    const hashes = this.getPasswordHashes();
    hashes[email] = hash;
    localStorage.setItem(PASSWORD_STORAGE_KEY, JSON.stringify(hashes));
  }

  /**
   * Get password hash for an email
   */
  private static getPasswordHash(email: string): string | null {
    const hashes = this.getPasswordHashes();
    return hashes[email] || null;
  }

  /**
   * Calculate trial end date (30 days from now)
   */
  private static calculateTrialEndDate(): Date {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    return endDate;
  }

  /**
   * Sign up a new user with email, password, and plan selection
   * @throws AuthError if validation fails or user already exists
   */
  static async signup(email: string, password: string, plan: Plan): Promise<User> {
    // Validate email
    if (!this.isValidEmail(email)) {
      throw new AuthError('Invalid email format', 'INVALID_EMAIL');
    }

    // Validate password
    if (!this.isValidPassword(password)) {
      throw new AuthError('Password must be at least 8 characters', 'WEAK_PASSWORD');
    }

    // Validate plan
    if (!['basic', 'premium', 'pro'].includes(plan)) {
      throw new AuthError('Invalid plan selection', 'INVALID_PLAN');
    }

    // Check if user already exists
    const existingHash = this.getPasswordHash(email);
    if (existingHash) {
      throw new AuthError('An account with this email already exists', 'DUPLICATE_EMAIL');
    }

    // Create new user
    const userId = this.generateUserId();
    const now = new Date();
    
    const user: User = {
      id: userId,
      email,
      plan,
      createdAt: now,
      trialEndsAt: plan === 'basic' ? this.calculateTrialEndDate() : null,
      streak: 0,
      streakFreezeUsed: false,
      lastSessionDate: null,
    };

    // Hash and save password
    const passwordHash = PasswordService.hash(password);
    this.savePasswordHash(email, passwordHash);

    // Save user to storage
    StorageService.saveUser(user);

    // Set as current user
    localStorage.setItem(CURRENT_USER_KEY, userId);

    return user;
  }

  /**
   * Log in a user with email and password
   * @throws AuthError if credentials are invalid
   */
  static async login(email: string, password: string): Promise<User> {
    // Validate email format
    if (!this.isValidEmail(email)) {
      throw new AuthError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    // Get stored password hash
    const storedHash = this.getPasswordHash(email);
    if (!storedHash) {
      throw new AuthError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    // Verify password
    if (!PasswordService.verify(password, storedHash)) {
      throw new AuthError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    // Find user by email
    // We need to iterate through all users to find by email
    const usersData = localStorage.getItem('interview_buddy_users');
    if (!usersData) {
      throw new AuthError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const users: Record<string, User> = JSON.parse(usersData);
    const user = Object.values(users).find(u => u.email === email);

    if (!user) {
      throw new AuthError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    // Set as current user
    localStorage.setItem(CURRENT_USER_KEY, user.id);

    // Return user with dates converted
    return {
      ...user,
      createdAt: new Date(user.createdAt),
      trialEndsAt: user.trialEndsAt ? new Date(user.trialEndsAt) : null,
      lastSessionDate: user.lastSessionDate ? new Date(user.lastSessionDate) : null,
    };
  }

  /**
   * Log out the current user
   */
  static logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  /**
   * Get the currently logged-in user
   * @returns User object or null if not logged in
   */
  static getCurrentUser(): User | null {
    const userId = localStorage.getItem(CURRENT_USER_KEY);
    if (!userId) {
      return null;
    }

    return StorageService.getUser(userId);
  }

  /**
   * Update a user's plan
   * @throws AuthError if user not found
   */
  static async updatePlan(userId: string, newPlan: Plan): Promise<User> {
    // Validate plan
    if (!['basic', 'premium', 'pro'].includes(newPlan)) {
      throw new AuthError('Invalid plan selection', 'INVALID_PLAN');
    }

    // Get existing user
    const user = StorageService.getUser(userId);
    if (!user) {
      throw new AuthError('User not found', 'USER_NOT_FOUND');
    }

    // Update plan
    const updatedUser: User = {
      ...user,
      plan: newPlan,
      // Set trial end date if downgrading to basic, otherwise clear it
      trialEndsAt: newPlan === 'basic' ? this.calculateTrialEndDate() : null,
    };

    // Save updated user
    StorageService.saveUser(updatedUser);

    return updatedUser;
  }

  /**
   * Check if a user's trial has expired
   */
  static isTrialExpired(user: User): boolean {
    if (user.plan !== 'basic' || !user.trialEndsAt) {
      return false;
    }

    return new Date() > user.trialEndsAt;
  }

  /**
   * Clear all authentication data (useful for testing)
   */
  static clearAll(): void {
    localStorage.removeItem(PASSWORD_STORAGE_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}
