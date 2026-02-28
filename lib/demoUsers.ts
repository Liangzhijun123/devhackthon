/**
 * Demo Users Initialization
 * Pre-populates demo accounts for quick testing with realistic session data
 */

import { User, CompletedSession } from '@/types';
import { StorageService } from '@/services/StorageService';
import { getQuestionsByPlan } from './questions';

/**
 * Mock password hashing (matches AuthService implementation)
 */
const MOCK_HASH_PREFIX = 'mock_hash_';

function hashPassword(password: string): string {
  return MOCK_HASH_PREFIX + password;
}

/**
 * Demo user accounts with credentials
 */
export const DEMO_ACCOUNTS = [
  {
    email: 'basic@demo.com',
    password: 'demo123',
    plan: 'basic' as const,
  },
  {
    email: 'premium@demo.com',
    password: 'demo123',
    plan: 'premium' as const,
  },
  {
    email: 'pro@demo.com',
    password: 'demo123',
    plan: 'pro' as const,
  },
];

/**
 * Generate realistic demo sessions for a user
 */
function generateDemoSessions(userId: string, plan: 'basic' | 'premium' | 'pro'): CompletedSession[] {
  const sessions: CompletedSession[] = [];
  const questions = getQuestionsByPlan(plan);
  
  if (questions.length === 0) return sessions;

  const now = Date.now();
  const sessionCounts = {
    basic: 3,      // 3 sessions this week
    premium: 8,    // 8 sessions over 2 weeks
    pro: 15,       // 15 sessions over 3 weeks
  };

  const count = sessionCounts[plan];

  for (let i = 0; i < count; i++) {
    const question = questions[i % questions.length];
    const daysAgo = Math.floor(i / 2); // 2 sessions per day
    const startTime = new Date(now - daysAgo * 24 * 60 * 60 * 1000 - i * 2 * 60 * 60 * 1000);
    const duration = 1800 + Math.floor(Math.random() * 900); // 30-45 minutes
    const endTime = new Date(startTime.getTime() + duration * 1000);

    // Vary ratings based on plan (pro users tend to rate higher)
    const ratingBase = plan === 'basic' ? 2 : plan === 'premium' ? 3 : 4;
    const rating = Math.min(5, Math.max(1, ratingBase + Math.floor(Math.random() * 2))) as 1 | 2 | 3 | 4 | 5;

    sessions.push({
      id: `demo_session_${userId}_${i}`,
      userId,
      questionId: question.id,
      questionTitle: question.title,
      category: question.category,
      difficulty: question.difficulty,
      startTime,
      endTime,
      duration,
      rating,
      perceivedDifficulty: question.difficulty,
      notes: i % 3 === 0 ? 'Good practice session. Need to review edge cases.' : '',
      pressureModeUsed: plan === 'pro' && i % 2 === 0,
    });
  }

  return sessions.reverse(); // Most recent first
}

/**
 * Initialize demo users in localStorage
 * Called on app startup to ensure demo accounts exist
 */
export function initializeDemoUsers(): void {
  if (typeof window === 'undefined') return;

  const PASSWORD_STORAGE_KEY = 'interview_buddy_passwords';
  const DEMO_INITIALIZED_KEY = 'interview_buddy_demo_initialized';
  
  // Check if already initialized
  if (localStorage.getItem(DEMO_INITIALIZED_KEY) === 'true') {
    return;
  }

  // Get existing password hashes
  let passwordHashes: Record<string, string> = {};
  try {
    const data = localStorage.getItem(PASSWORD_STORAGE_KEY);
    passwordHashes = data ? JSON.parse(data) : {};
  } catch {
    passwordHashes = {};
  }

  // Create demo users
  DEMO_ACCOUNTS.forEach((account) => {
    // Add password hash
    passwordHashes[account.email] = hashPassword(account.password);

    // Check if user already exists
    const existingUser = StorageService.getUserByEmail(account.email);
    if (!existingUser) {
      // Create user
      const now = new Date();
      const userId = `demo_${account.plan}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      const user: User = {
        id: userId,
        email: account.email,
        plan: account.plan,
        createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        trialEndsAt: account.plan === 'basic' ? new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000) : null, // 15 days left
        streak: account.plan === 'basic' ? 3 : account.plan === 'premium' ? 7 : 15,
        streakFreezeUsed: false,
        lastSessionDate: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Yesterday
      };

      StorageService.saveUser(user);

      // Generate demo sessions for this user
      const sessions = generateDemoSessions(userId, account.plan);
      sessions.forEach(session => {
        StorageService.saveSession(session);
      });
    }
  });

  // Save password hashes
  localStorage.setItem(PASSWORD_STORAGE_KEY, JSON.stringify(passwordHashes));
  
  // Mark as initialized
  localStorage.setItem(DEMO_INITIALIZED_KEY, 'true');
}
