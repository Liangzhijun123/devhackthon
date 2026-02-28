/**
 * Mock User Data Generator for Interview Buddy Platform
 * Generates sample users with different plans and trial states for testing and demo purposes
 */

import { User, Plan } from '@/types';

/**
 * Generate a unique user ID
 */
function generateUserId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate a mock user with specified plan and optional overrides
 */
export function generateMockUser(
  plan: Plan,
  overrides?: Partial<User>
): User {
  const now = new Date();
  const createdAt = overrides?.createdAt || new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago by default
  
  // Calculate trial end date for basic plan (30 days from creation)
  let trialEndsAt: Date | null = null;
  if (plan === 'basic') {
    trialEndsAt = new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000);
  }

  const baseUser: User = {
    id: generateUserId(),
    email: `user-${Math.random().toString(36).substring(2, 9)}@example.com`,
    plan,
    createdAt,
    trialEndsAt,
    streak: 0,
    streakFreezeUsed: false,
    lastSessionDate: null,
  };

  return { ...baseUser, ...overrides };
}

/**
 * Generate a basic plan user with active trial
 */
export function generateBasicUserWithActiveTrial(): User {
  const createdAt = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
  return generateMockUser('basic', {
    email: 'basic-trial@example.com',
    createdAt,
    streak: 5,
    lastSessionDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
  });
}

/**
 * Generate a basic plan user with expired trial
 */
export function generateBasicUserWithExpiredTrial(): User {
  const createdAt = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000); // 40 days ago
  return generateMockUser('basic', {
    email: 'basic-expired@example.com',
    createdAt,
    streak: 0,
    lastSessionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  });
}

/**
 * Generate a premium plan user
 */
export function generatePremiumUser(): User {
  const createdAt = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000); // 60 days ago
  return generateMockUser('premium', {
    email: 'premium@example.com',
    createdAt,
    streak: 15,
    lastSessionDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
  });
}

/**
 * Generate a pro plan user with active streak
 */
export function generateProUser(): User {
  const createdAt = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days ago
  return generateMockUser('pro', {
    email: 'pro@example.com',
    createdAt,
    streak: 30,
    lastSessionDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    streakFreezeUsed: false,
  });
}

/**
 * Generate a pro user who has used their streak freeze
 */
export function generateProUserWithUsedFreeze(): User {
  const createdAt = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days ago
  return generateMockUser('pro', {
    email: 'pro-freeze-used@example.com',
    createdAt,
    streak: 25,
    lastSessionDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    streakFreezeUsed: true,
  });
}

/**
 * Generate a new user with no activity
 */
export function generateNewUser(plan: Plan = 'basic'): User {
  return generateMockUser(plan, {
    email: 'newuser@example.com',
    createdAt: new Date(),
    streak: 0,
    lastSessionDate: null,
  });
}

/**
 * Generate multiple mock users with varied states
 */
export function generateMockUsers(count: number = 5): User[] {
  const users: User[] = [];
  const plans: Plan[] = ['basic', 'premium', 'pro'];
  
  for (let i = 0; i < count; i++) {
    const plan = plans[i % plans.length];
    const daysAgo = Math.floor(Math.random() * 90) + 1;
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const streak = Math.floor(Math.random() * 30);
    const hasRecentSession = Math.random() > 0.3;
    
    users.push(generateMockUser(plan, {
      email: `user${i + 1}@example.com`,
      createdAt,
      streak,
      lastSessionDate: hasRecentSession 
        ? new Date(Date.now() - 24 * 60 * 60 * 1000) 
        : null,
      streakFreezeUsed: plan === 'pro' && Math.random() > 0.5,
    }));
  }
  
  return users;
}

/**
 * Pre-defined demo users for consistent testing
 */
export const demoUsers = {
  basicActiveTrial: generateBasicUserWithActiveTrial(),
  basicExpiredTrial: generateBasicUserWithExpiredTrial(),
  premium: generatePremiumUser(),
  pro: generateProUser(),
  proWithFreeze: generateProUserWithUsedFreeze(),
  newBasic: generateNewUser('basic'),
  newPremium: generateNewUser('premium'),
  newPro: generateNewUser('pro'),
};

/**
 * Utility to pre-populate demo data in localStorage
 * This can be called on first app load to demonstrate all features
 */
export function initializeDemoData(): void {
  if (typeof window === 'undefined') return;
  
  const DEMO_DATA_KEY = 'interview-buddy-demo-initialized';
  
  // Check if demo data has already been initialized
  if (localStorage.getItem(DEMO_DATA_KEY)) {
    return;
  }
  
  // Store demo users
  Object.entries(demoUsers).forEach(([key, user]) => {
    localStorage.setItem(`user-${key}`, JSON.stringify(user));
  });
  
  // Mark demo data as initialized
  localStorage.setItem(DEMO_DATA_KEY, 'true');
}

/**
 * Reset demo data - useful for testing
 */
export function resetDemoData(): void {
  if (typeof window === 'undefined') return;
  
  // Clear all user data
  Object.keys(demoUsers).forEach(key => {
    localStorage.removeItem(`user-${key}`);
  });
  
  // Clear initialization flag
  localStorage.removeItem('interview-buddy-demo-initialized');
  
  // Re-initialize
  initializeDemoData();
}
