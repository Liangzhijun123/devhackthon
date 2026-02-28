/**
 * Unit tests for QuickActions component
 * Tests button states, weekly limit checks, and navigation
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuickActions } from '../QuickActions';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { StorageService } from '@/services/StorageService';
import { User, CompletedSession } from '@/types';

// Mock dependencies
jest.mock('@/contexts/AuthContext');
jest.mock('next/navigation');
jest.mock('@/services/StorageService');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockStorageService = StorageService as jest.Mocked<typeof StorageService>;

describe('QuickActions', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter as any);
  });

  describe('Rendering', () => {
    it('should not render when user is not logged in', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        error: null,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        clearError: jest.fn(),
      });

      const { container } = render(<QuickActions />);
      expect(container.firstChild).toBeNull();
    });

    it('should render all action buttons when user is logged in', () => {
      const mockUser: User = {
        id: 'user1',
        email: 'test@example.com',
        plan: 'premium',
        createdAt: new Date(),
        trialEndsAt: null,
        streak: 5,
        streakFreezeUsed: false,
        lastSessionDate: null,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        error: null,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        clearError: jest.fn(),
      });

      mockStorageService.getSessions.mockReturnValue([]);

      render(<QuickActions />);

      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      expect(screen.getByText('Start Mock Interview')).toBeInTheDocument();
      expect(screen.getByText('View History')).toBeInTheDocument();
      expect(screen.getByText('View Analytics')).toBeInTheDocument();
    });
  });

  describe('Premium/Pro Users', () => {
    it('should enable start button for premium users with no weekly limit', () => {
      const mockUser: User = {
        id: 'user1',
        email: 'test@example.com',
        plan: 'premium',
        createdAt: new Date(),
        trialEndsAt: null,
        streak: 5,
        streakFreezeUsed: false,
        lastSessionDate: null,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        error: null,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        clearError: jest.fn(),
      });

      mockStorageService.getSessions.mockReturnValue([]);

      render(<QuickActions />);

      const startButton = screen.getByText('Start Mock Interview');
      expect(startButton).not.toBeDisabled();
      expect(startButton.closest('button')).not.toHaveClass('cursor-not-allowed');
    });

    it('should enable start button for pro users with no weekly limit', () => {
      const mockUser: User = {
        id: 'user1',
        email: 'test@example.com',
        plan: 'pro',
        createdAt: new Date(),
        trialEndsAt: null,
        streak: 5,
        streakFreezeUsed: false,
        lastSessionDate: null,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        error: null,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        clearError: jest.fn(),
      });

      mockStorageService.getSessions.mockReturnValue([]);

      render(<QuickActions />);

      const startButton = screen.getByText('Start Mock Interview');
      expect(startButton).not.toBeDisabled();
    });

    it('should navigate to /interview when start button is clicked', () => {
      const mockUser: User = {
        id: 'user1',
        email: 'test@example.com',
        plan: 'premium',
        createdAt: new Date(),
        trialEndsAt: null,
        streak: 5,
        streakFreezeUsed: false,
        lastSessionDate: null,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        error: null,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        clearError: jest.fn(),
      });

      mockStorageService.getSessions.mockReturnValue([]);

      render(<QuickActions />);

      const startButton = screen.getByText('Start Mock Interview');
      fireEvent.click(startButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/interview');
    });
  });

  describe('Basic Users - Weekly Limit', () => {
    it('should show weekly limit indicator for basic users with 0 sessions', () => {
      const mockUser: User = {
        id: 'user1',
        email: 'test@example.com',
        plan: 'basic',
        createdAt: new Date(),
        trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        streak: 0,
        streakFreezeUsed: false,
        lastSessionDate: null,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        error: null,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        clearError: jest.fn(),
      });

      mockStorageService.getSessions.mockReturnValue([]);

      render(<QuickActions />);

      expect(screen.getByText('0 of 3 interviews used this week')).toBeInTheDocument();
    });

    it('should enable start button for basic users with 2 sessions this week', () => {
      const mockUser: User = {
        id: 'user1',
        email: 'test@example.com',
        plan: 'basic',
        createdAt: new Date(),
        trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        streak: 2,
        streakFreezeUsed: false,
        lastSessionDate: null,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        error: null,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        clearError: jest.fn(),
      });

      // Create 2 sessions from this week
      const now = new Date();
      const sessions: CompletedSession[] = [
        {
          id: 'session1',
          userId: 'user1',
          questionId: 'q1',
          questionTitle: 'Test Question 1',
          category: 'arrays',
          difficulty: 'easy',
          startTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          endTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 1800000),
          duration: 1800,
          rating: 4,
          perceivedDifficulty: 'medium',
          notes: '',
          pressureModeUsed: false,
        },
        {
          id: 'session2',
          userId: 'user1',
          questionId: 'q2',
          questionTitle: 'Test Question 2',
          category: 'strings',
          difficulty: 'medium',
          startTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          endTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 1800000),
          duration: 1800,
          rating: 3,
          perceivedDifficulty: 'medium',
          notes: '',
          pressureModeUsed: false,
        },
      ];

      mockStorageService.getSessions.mockReturnValue(sessions);

      render(<QuickActions />);

      expect(screen.getByText('2 of 3 interviews used this week')).toBeInTheDocument();
      
      const startButton = screen.getByText('Start Mock Interview');
      expect(startButton).not.toBeDisabled();
    });

    it('should disable start button for basic users with 3 sessions this week', () => {
      const mockUser: User = {
        id: 'user1',
        email: 'test@example.com',
        plan: 'basic',
        createdAt: new Date(),
        trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        streak: 3,
        streakFreezeUsed: false,
        lastSessionDate: null,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        error: null,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        clearError: jest.fn(),
      });

      // Create 3 sessions from this week
      const now = new Date();
      const sessions: CompletedSession[] = [
        {
          id: 'session1',
          userId: 'user1',
          questionId: 'q1',
          questionTitle: 'Test Question 1',
          category: 'arrays',
          difficulty: 'easy',
          startTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 1800000),
          duration: 1800,
          rating: 4,
          perceivedDifficulty: 'medium',
          notes: '',
          pressureModeUsed: false,
        },
        {
          id: 'session2',
          userId: 'user1',
          questionId: 'q2',
          questionTitle: 'Test Question 2',
          category: 'strings',
          difficulty: 'medium',
          startTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 1800000),
          duration: 1800,
          rating: 3,
          perceivedDifficulty: 'medium',
          notes: '',
          pressureModeUsed: false,
        },
        {
          id: 'session3',
          userId: 'user1',
          questionId: 'q3',
          questionTitle: 'Test Question 3',
          category: 'trees',
          difficulty: 'hard',
          startTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 1800000),
          duration: 1800,
          rating: 2,
          perceivedDifficulty: 'hard',
          notes: '',
          pressureModeUsed: false,
        },
      ];

      mockStorageService.getSessions.mockReturnValue(sessions);

      render(<QuickActions />);

      expect(screen.getByText(/Weekly limit reached/)).toBeInTheDocument();
      
      const startButton = screen.getByText('Start Mock Interview');
      expect(startButton).toBeDisabled();
      expect(startButton.closest('button')).toHaveClass('cursor-not-allowed');
    });

    it('should not navigate when limit reached and disabled button clicked', () => {
      const mockUser: User = {
        id: 'user1',
        email: 'test@example.com',
        plan: 'basic',
        createdAt: new Date(),
        trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        streak: 3,
        streakFreezeUsed: false,
        lastSessionDate: null,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        error: null,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        clearError: jest.fn(),
      });

      // Create 3 sessions from this week
      const now = new Date();
      const sessions: CompletedSession[] = Array(3).fill(null).map((_, i) => ({
        id: `session${i}`,
        userId: 'user1',
        questionId: `q${i}`,
        questionTitle: `Test Question ${i}`,
        category: 'arrays',
        difficulty: 'easy' as const,
        startTime: new Date(now.getTime() - (3 - i) * 24 * 60 * 60 * 1000),
        endTime: new Date(now.getTime() - (3 - i) * 24 * 60 * 60 * 1000 + 1800000),
        duration: 1800,
        rating: 4 as const,
        perceivedDifficulty: 'medium' as const,
        notes: '',
        pressureModeUsed: false,
      }));

      mockStorageService.getSessions.mockReturnValue(sessions);

      render(<QuickActions />);

      const startButton = screen.getByText('Start Mock Interview');
      fireEvent.click(startButton);

      // Disabled button should not trigger navigation
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it('should not count sessions from previous week', () => {
      const mockUser: User = {
        id: 'user1',
        email: 'test@example.com',
        plan: 'basic',
        createdAt: new Date(),
        trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        streak: 1,
        streakFreezeUsed: false,
        lastSessionDate: null,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        error: null,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        clearError: jest.fn(),
      });

      // Create sessions: 3 from last week, 1 from this week
      const now = new Date();
      const sessions: CompletedSession[] = [
        // Last week sessions
        ...Array(3).fill(null).map((_, i) => ({
          id: `old_session${i}`,
          userId: 'user1',
          questionId: `q${i}`,
          questionTitle: `Old Question ${i}`,
          category: 'arrays',
          difficulty: 'easy' as const,
          startTime: new Date(now.getTime() - (10 + i) * 24 * 60 * 60 * 1000), // 10+ days ago
          endTime: new Date(now.getTime() - (10 + i) * 24 * 60 * 60 * 1000 + 1800000),
          duration: 1800,
          rating: 4 as const,
          perceivedDifficulty: 'medium' as const,
          notes: '',
          pressureModeUsed: false,
        })),
        // This week session
        {
          id: 'session1',
          userId: 'user1',
          questionId: 'q_new',
          questionTitle: 'New Question',
          category: 'strings',
          difficulty: 'medium',
          startTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          endTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 1800000),
          duration: 1800,
          rating: 5,
          perceivedDifficulty: 'easy',
          notes: '',
          pressureModeUsed: false,
        },
      ];

      mockStorageService.getSessions.mockReturnValue(sessions);

      render(<QuickActions />);

      // Should show 1 of 3, not 4 of 3
      expect(screen.getByText('1 of 3 interviews used this week')).toBeInTheDocument();
      
      const startButton = screen.getByText('Start Mock Interview');
      expect(startButton).not.toBeDisabled();
    });
  });

  describe('Navigation Links', () => {
    it('should have correct href for history link', () => {
      const mockUser: User = {
        id: 'user1',
        email: 'test@example.com',
        plan: 'premium',
        createdAt: new Date(),
        trialEndsAt: null,
        streak: 5,
        streakFreezeUsed: false,
        lastSessionDate: null,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        error: null,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        clearError: jest.fn(),
      });

      mockStorageService.getSessions.mockReturnValue([]);

      render(<QuickActions />);

      const historyLink = screen.getByText('View History').closest('a');
      expect(historyLink).toHaveAttribute('href', '/history');
    });

    it('should have correct href for analytics link', () => {
      const mockUser: User = {
        id: 'user1',
        email: 'test@example.com',
        plan: 'premium',
        createdAt: new Date(),
        trialEndsAt: null,
        streak: 5,
        streakFreezeUsed: false,
        lastSessionDate: null,
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        loading: false,
        error: null,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        clearError: jest.fn(),
      });

      mockStorageService.getSessions.mockReturnValue([]);

      render(<QuickActions />);

      const analyticsLink = screen.getByText('View Analytics').closest('a');
      expect(analyticsLink).toHaveAttribute('href', '/analytics');
    });
  });
});
