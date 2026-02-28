/**
 * Unit tests for mock user data generator
 */

import {
  generateMockUser,
  generateBasicUserWithActiveTrial,
  generateBasicUserWithExpiredTrial,
  generatePremiumUser,
  generateProUser,
  generateProUserWithUsedFreeze,
  generateNewUser,
  generateMockUsers,
  demoUsers,
} from '../mockUsers';
import { Plan } from '@/types';

describe('Mock User Generator', () => {
  describe('generateMockUser', () => {
    it('should generate a basic user with trial end date', () => {
      const user = generateMockUser('basic');
      
      expect(user.id).toBeDefined();
      expect(user.email).toContain('@example.com');
      expect(user.plan).toBe('basic');
      expect(user.trialEndsAt).not.toBeNull();
      expect(user.streak).toBe(0);
      expect(user.streakFreezeUsed).toBe(false);
      expect(user.lastSessionDate).toBeNull();
    });

    it('should generate a premium user without trial end date', () => {
      const user = generateMockUser('premium');
      
      expect(user.plan).toBe('premium');
      expect(user.trialEndsAt).toBeNull();
    });

    it('should generate a pro user without trial end date', () => {
      const user = generateMockUser('pro');
      
      expect(user.plan).toBe('pro');
      expect(user.trialEndsAt).toBeNull();
    });

    it('should apply overrides correctly', () => {
      const customEmail = 'custom@test.com';
      const customStreak = 10;
      
      const user = generateMockUser('basic', {
        email: customEmail,
        streak: customStreak,
      });
      
      expect(user.email).toBe(customEmail);
      expect(user.streak).toBe(customStreak);
    });

    it('should calculate trial end date 30 days from creation for basic plan', () => {
      const createdAt = new Date('2024-01-01');
      const user = generateMockUser('basic', { createdAt });
      
      expect(user.trialEndsAt).not.toBeNull();
      
      const expectedTrialEnd = new Date('2024-01-31');
      expect(user.trialEndsAt?.getTime()).toBe(expectedTrialEnd.getTime());
    });
  });

  describe('generateBasicUserWithActiveTrial', () => {
    it('should generate a basic user with active trial', () => {
      const user = generateBasicUserWithActiveTrial();
      
      expect(user.plan).toBe('basic');
      expect(user.trialEndsAt).not.toBeNull();
      
      // Trial should not be expired (trial end date should be in the future)
      const now = new Date();
      expect(user.trialEndsAt!.getTime()).toBeGreaterThan(now.getTime());
      
      expect(user.streak).toBeGreaterThan(0);
      expect(user.lastSessionDate).not.toBeNull();
    });
  });

  describe('generateBasicUserWithExpiredTrial', () => {
    it('should generate a basic user with expired trial', () => {
      const user = generateBasicUserWithExpiredTrial();
      
      expect(user.plan).toBe('basic');
      expect(user.trialEndsAt).not.toBeNull();
      
      // Trial should be expired (trial end date should be in the past)
      const now = new Date();
      expect(user.trialEndsAt!.getTime()).toBeLessThan(now.getTime());
    });
  });

  describe('generatePremiumUser', () => {
    it('should generate a premium user with active streak', () => {
      const user = generatePremiumUser();
      
      expect(user.plan).toBe('premium');
      expect(user.trialEndsAt).toBeNull();
      expect(user.streak).toBeGreaterThan(0);
      expect(user.lastSessionDate).not.toBeNull();
    });
  });

  describe('generateProUser', () => {
    it('should generate a pro user with active streak', () => {
      const user = generateProUser();
      
      expect(user.plan).toBe('pro');
      expect(user.trialEndsAt).toBeNull();
      expect(user.streak).toBeGreaterThan(0);
      expect(user.lastSessionDate).not.toBeNull();
      expect(user.streakFreezeUsed).toBe(false);
    });
  });

  describe('generateProUserWithUsedFreeze', () => {
    it('should generate a pro user with used streak freeze', () => {
      const user = generateProUserWithUsedFreeze();
      
      expect(user.plan).toBe('pro');
      expect(user.streakFreezeUsed).toBe(true);
    });
  });

  describe('generateNewUser', () => {
    it('should generate a new user with no activity', () => {
      const user = generateNewUser();
      
      expect(user.streak).toBe(0);
      expect(user.lastSessionDate).toBeNull();
    });

    it('should generate a new user with specified plan', () => {
      const plans: Plan[] = ['basic', 'premium', 'pro'];
      
      plans.forEach(plan => {
        const user = generateNewUser(plan);
        expect(user.plan).toBe(plan);
      });
    });
  });

  describe('generateMockUsers', () => {
    it('should generate the specified number of users', () => {
      const count = 10;
      const users = generateMockUsers(count);
      
      expect(users).toHaveLength(count);
    });

    it('should generate users with varied plans', () => {
      const users = generateMockUsers(9); // Multiple of 3 to test all plans
      
      const plans = users.map(u => u.plan);
      expect(plans).toContain('basic');
      expect(plans).toContain('premium');
      expect(plans).toContain('pro');
    });

    it('should generate users with unique emails', () => {
      const users = generateMockUsers(10);
      const emails = users.map(u => u.email);
      const uniqueEmails = new Set(emails);
      
      expect(uniqueEmails.size).toBe(emails.length);
    });

    it('should generate users with varied streaks', () => {
      const users = generateMockUsers(20);
      const streaks = users.map(u => u.streak);
      const uniqueStreaks = new Set(streaks);
      
      // Should have some variety in streaks
      expect(uniqueStreaks.size).toBeGreaterThan(1);
    });
  });

  describe('demoUsers', () => {
    it('should have all predefined demo users', () => {
      expect(demoUsers.basicActiveTrial).toBeDefined();
      expect(demoUsers.basicExpiredTrial).toBeDefined();
      expect(demoUsers.premium).toBeDefined();
      expect(demoUsers.pro).toBeDefined();
      expect(demoUsers.proWithFreeze).toBeDefined();
      expect(demoUsers.newBasic).toBeDefined();
      expect(demoUsers.newPremium).toBeDefined();
      expect(demoUsers.newPro).toBeDefined();
    });

    it('should have correct plan types for demo users', () => {
      expect(demoUsers.basicActiveTrial.plan).toBe('basic');
      expect(demoUsers.basicExpiredTrial.plan).toBe('basic');
      expect(demoUsers.premium.plan).toBe('premium');
      expect(demoUsers.pro.plan).toBe('pro');
      expect(demoUsers.proWithFreeze.plan).toBe('pro');
      expect(demoUsers.newBasic.plan).toBe('basic');
      expect(demoUsers.newPremium.plan).toBe('premium');
      expect(demoUsers.newPro.plan).toBe('pro');
    });

    it('should have active trial for basicActiveTrial', () => {
      const now = new Date();
      expect(demoUsers.basicActiveTrial.trialEndsAt).not.toBeNull();
      expect(demoUsers.basicActiveTrial.trialEndsAt!.getTime()).toBeGreaterThan(now.getTime());
    });

    it('should have expired trial for basicExpiredTrial', () => {
      const now = new Date();
      expect(demoUsers.basicExpiredTrial.trialEndsAt).not.toBeNull();
      expect(demoUsers.basicExpiredTrial.trialEndsAt!.getTime()).toBeLessThan(now.getTime());
    });

    it('should have streak freeze used for proWithFreeze', () => {
      expect(demoUsers.proWithFreeze.streakFreezeUsed).toBe(true);
    });

    it('should have no activity for new users', () => {
      expect(demoUsers.newBasic.streak).toBe(0);
      expect(demoUsers.newBasic.lastSessionDate).toBeNull();
      
      expect(demoUsers.newPremium.streak).toBe(0);
      expect(demoUsers.newPremium.lastSessionDate).toBeNull();
      
      expect(demoUsers.newPro.streak).toBe(0);
      expect(demoUsers.newPro.lastSessionDate).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('should generate unique user IDs', () => {
      const users = generateMockUsers(100);
      const ids = users.map(u => u.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should handle createdAt dates correctly', () => {
      const pastDate = new Date('2020-01-01');
      const user = generateMockUser('basic', { createdAt: pastDate });
      
      expect(user.createdAt.getTime()).toBe(pastDate.getTime());
    });

    it('should not set trial end date for premium users', () => {
      const user = generateMockUser('premium');
      expect(user.trialEndsAt).toBeNull();
    });

    it('should not set trial end date for pro users', () => {
      const user = generateMockUser('pro');
      expect(user.trialEndsAt).toBeNull();
    });
  });
});
