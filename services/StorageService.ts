/**
 * StorageService - Wrapper for localStorage operations
 * Provides error handling, data validation, and fallback mechanisms
 * for persisting user data, sessions, and streaks
 */

import { User, CompletedSession } from '@/types';

/**
 * Storage keys used for localStorage
 */
const STORAGE_KEYS = {
  USERS: 'interview_buddy_users',
  SESSIONS: 'interview_buddy_sessions',
  STREAKS: 'interview_buddy_streaks',
} as const;

/**
 * Error types for storage operations
 */
export class StorageError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'StorageError';
  }
}

export class StorageService {
  /**
   * Check if localStorage is available
   */
  private static isLocalStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Safely parse JSON with validation and fallback
   */
  private static safeParse<T>(data: string | null, fallback: T): T {
    if (!data) return fallback;
    
    try {
      const parsed = JSON.parse(data);
      return parsed ?? fallback;
    } catch {
      console.warn('Failed to parse stored data, using fallback');
      return fallback;
    }
  }

  /**
   * Safely stringify data for storage
   */
  private static safeStringify(data: unknown): string {
    try {
      return JSON.stringify(data);
    } catch (error) {
      throw new StorageError('Failed to stringify data', error);
    }
  }

  /**
   * Validate user data structure
   */
  private static validateUser(user: unknown): user is User {
    if (!user || typeof user !== 'object') return false;
    
    const u = user as Partial<User>;
    return (
      typeof u.id === 'string' &&
      typeof u.email === 'string' &&
      typeof u.plan === 'string' &&
      ['basic', 'premium', 'pro'].includes(u.plan) &&
      typeof u.streak === 'number' &&
      typeof u.streakFreezeUsed === 'boolean'
    );
  }

  /**
   * Validate completed session data structure
   */
  private static validateSession(session: unknown): session is CompletedSession {
    if (!session || typeof session !== 'object') return false;
    
    const s = session as Partial<CompletedSession>;
    return (
      typeof s.id === 'string' &&
      typeof s.userId === 'string' &&
      typeof s.questionId === 'string' &&
      typeof s.questionTitle === 'string' &&
      typeof s.category === 'string' &&
      typeof s.difficulty === 'string' &&
      typeof s.rating === 'number' &&
      s.rating >= 1 &&
      s.rating <= 5 &&
      typeof s.notes === 'string' &&
      typeof s.pressureModeUsed === 'boolean'
    );
  }

  /**
   * Save a user to localStorage
   * @throws StorageError if localStorage is unavailable or quota exceeded
   */
  static saveUser(user: User): void {
    if (!this.isLocalStorageAvailable()) {
      throw new StorageError('localStorage is not available');
    }

    if (!this.validateUser(user)) {
      throw new StorageError('Invalid user data structure');
    }

    try {
      const usersData = this.safeParse<Record<string, User>>(
        localStorage.getItem(STORAGE_KEYS.USERS),
        {}
      );
      
      usersData[user.id] = user;
      
      const serialized = this.safeStringify(usersData);
      localStorage.setItem(STORAGE_KEYS.USERS, serialized);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new StorageError('Storage quota exceeded. Please clear old data.', error);
      }
      throw new StorageError('Failed to save user', error);
    }
  }

  /**
   * Retrieve a user from localStorage
   * @returns User object or null if not found
   */
  static getUser(userId: string): User | null {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      return null;
    }

    try {
      const usersData = this.safeParse<Record<string, User>>(
        localStorage.getItem(STORAGE_KEYS.USERS),
        {}
      );
      
      const user = usersData[userId];
      
      if (!user) return null;
      
      // Validate and return user
      if (this.validateUser(user)) {
        // Convert date strings back to Date objects
        return {
          ...user,
          createdAt: new Date(user.createdAt),
          trialEndsAt: user.trialEndsAt ? new Date(user.trialEndsAt) : null,
          lastSessionDate: user.lastSessionDate ? new Date(user.lastSessionDate) : null,
        };
      }
      
      console.warn('Invalid user data found, returning null');
      return null;
    } catch (error) {
      console.error('Failed to retrieve user:', error);
      return null;
    }
  }
  /**
   * Retrieve a user by email from localStorage
   * @returns User object or null if not found
   */
  static getUserByEmail(email: string): User | null {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      return null;
    }

    try {
      const usersData = this.safeParse<Record<string, User>>(
        localStorage.getItem(STORAGE_KEYS.USERS),
        {}
      );

      // Find user by email
      const user = Object.values(usersData).find(u => u.email === email);

      if (!user) return null;

      // Validate and return user
      if (this.validateUser(user)) {
        // Convert date strings back to Date objects
        return {
          ...user,
          createdAt: new Date(user.createdAt),
          trialEndsAt: user.trialEndsAt ? new Date(user.trialEndsAt) : null,
          lastSessionDate: user.lastSessionDate ? new Date(user.lastSessionDate) : null,
        };
      }

      console.warn('Invalid user data found, returning null');
      return null;
    } catch (error) {
      console.error('Failed to retrieve user by email:', error);
      return null;
    }
  }


  /**
   * Save a completed session to localStorage
   * @throws StorageError if localStorage is unavailable or quota exceeded
   */
  static saveSession(session: CompletedSession): void {
    if (!this.isLocalStorageAvailable()) {
      throw new StorageError('localStorage is not available');
    }

    if (!this.validateSession(session)) {
      throw new StorageError('Invalid session data structure');
    }

    try {
      const sessionsData = this.safeParse<Record<string, CompletedSession[]>>(
        localStorage.getItem(STORAGE_KEYS.SESSIONS),
        {}
      );
      
      if (!sessionsData[session.userId]) {
        sessionsData[session.userId] = [];
      }
      
      sessionsData[session.userId].push(session);
      
      const serialized = this.safeStringify(sessionsData);
      localStorage.setItem(STORAGE_KEYS.SESSIONS, serialized);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new StorageError('Storage quota exceeded. Please clear old data.', error);
      }
      throw new StorageError('Failed to save session', error);
    }
  }

  /**
   * Retrieve all sessions for a user from localStorage
   * @returns Array of completed sessions (empty array if none found)
   */
  static getSessions(userId: string): CompletedSession[] {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      return [];
    }

    try {
      const sessionsData = this.safeParse<Record<string, CompletedSession[]>>(
        localStorage.getItem(STORAGE_KEYS.SESSIONS),
        {}
      );
      
      const sessions = sessionsData[userId] || [];
      
      // Validate and convert date strings back to Date objects
      return sessions
        .filter(this.validateSession)
        .map(session => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: new Date(session.endTime),
        }));
    } catch (error) {
      console.error('Failed to retrieve sessions:', error);
      return [];
    }
  }

  /**
   * Update a user's streak count
   * @throws StorageError if localStorage is unavailable or quota exceeded
   */
  static updateStreak(userId: string, streak: number): void {
    if (!this.isLocalStorageAvailable()) {
      throw new StorageError('localStorage is not available');
    }

    if (typeof streak !== 'number' || streak < 0) {
      throw new StorageError('Invalid streak value: must be a non-negative number');
    }

    try {
      const streaksData = this.safeParse<Record<string, number>>(
        localStorage.getItem(STORAGE_KEYS.STREAKS),
        {}
      );
      
      streaksData[userId] = streak;
      
      const serialized = this.safeStringify(streaksData);
      localStorage.setItem(STORAGE_KEYS.STREAKS, serialized);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new StorageError('Storage quota exceeded. Please clear old data.', error);
      }
      throw new StorageError('Failed to update streak', error);
    }
  }

  /**
   * Retrieve a user's streak count
   * @returns Streak count (defaults to 0 if not found)
   */
  static getStreak(userId: string): number {
    if (!this.isLocalStorageAvailable()) {
      console.warn('localStorage is not available');
      return 0;
    }

    try {
      const streaksData = this.safeParse<Record<string, number>>(
        localStorage.getItem(STORAGE_KEYS.STREAKS),
        {}
      );
      
      const streak = streaksData[userId];
      
      // Validate streak is a non-negative number
      if (typeof streak === 'number' && streak >= 0) {
        return streak;
      }
      
      return 0;
    } catch (error) {
      console.error('Failed to retrieve streak:', error);
      return 0;
    }
  }

  /**
   * Clear all storage data (useful for testing and demo reset)
   */
  static clearAll(): void {
    if (!this.isLocalStorageAvailable()) {
      throw new StorageError('localStorage is not available');
    }

    try {
      localStorage.removeItem(STORAGE_KEYS.USERS);
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.STREAKS);
    } catch (error) {
      throw new StorageError('Failed to clear storage', error);
    }
  }
}
