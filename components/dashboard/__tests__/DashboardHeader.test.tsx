/**
 * Unit tests for DashboardHeader component
 * Tests display of streak, weekly stats, plan badge, and upgrade button
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardHeader } from '../DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import { AnalyticsService } from '@/services/AnalyticsService';
import { StorageService } from '@/services/StorageService';
import { User, CompletedSession } from '@/types';

// Mock dependencies
jest.mock('@/contexts/AuthContext');
jest.mock('@/services/AnalyticsService');
jest.mock('@/services/StorageService');
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockAnalyticsService = AnalyticsService as jest.Mocked<typeof AnalyticsService>;
const mockStorageService = StorageService as jest.Mocked<typeof StorageService>;

describe('DashboardHeader', () => {
  const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    plan: 'basic',
    createdAt: new Date('2024-01-01'),
    trialEndsAt: new Date('2024-01-31'),
    streak: 5,
    streakFreezeUsed: false,
    lastSessionDate: new Date('2024-01-15'),
  };

  const mockSessions: CompletedSession[] = [
    {
      id: 'session-1',
      userId: 'user-1',
      questionId: 'q1',
      questionTitle: 'Two Sum',
      category: 'arrays',
      difficulty: 'easy',
      startTime: new Date('2024-01-15T10:00:00'),
      endTime: new Date('2024-01-15T10:45:00'),
      duration: 2700,
      rating: 4,
      perceivedDifficulty: 'medium',
      notes: 'Good practice',
      pressureModeUsed: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Requirement 7.1: Display current streak with fire emoji', () => {
    it('should display streak count with fire emoji', () => {
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

      mockStorageService.getSessions.mockReturnValue(mockSessions);
      mockAnalyticsService.calculateStreak.mockReturnValue(5);
      mockAnalyticsService.getWeeklyStats.mockReturnValue({
        weekStart: new Date(),
        weekEnd: new Date(),
        sessionsCompleted: 3,
        averageRating: 4.0,
        categoriesPracticed: ['arrays'],
        comparisonToPreviousWeek: {
          sessionsDelta: 1,
          ratingDelta: 0.5,
        },
      });

      render(<DashboardHeader />);

      // Check for fire emoji
      expect(screen.getByRole('img', { name: /fire/i })).toBeInTheDocument();

      // Check for streak count
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Day Streak')).toBeInTheDocument();
    });

    it('should display zero streak for new users', () => {
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
      mockAnalyticsService.calculateStreak.mockReturnValue(0);
      mockAnalyticsService.getWeeklyStats.mockReturnValue({
        weekStart: new Date(),
        weekEnd: new Date(),
        sessionsCompleted: 0,
        averageRating: 0,
        categoriesPracticed: [],
        comparisonToPreviousWeek: {
          sessionsDelta: 0,
          ratingDelta: 0,
        },
      });

      render(<DashboardHeader />);

      // Check for fire emoji and streak label to confirm streak section
      expect(screen.getByRole('img', { name: /fire/i })).toBeInTheDocument();
      expect(screen.getByText('Day Streak')).toBeInTheDocument();
      
      // Both streak and weekly count are 0, so we check for both labels
      const zeros = screen.getAllByText('0');
      expect(zeros.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Requirement 7.2: Show weekly session count', () => {
    it('should display weekly session count', () => {
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

      mockStorageService.getSessions.mockReturnValue(mockSessions);
      mockAnalyticsService.calculateStreak.mockReturnValue(5);
      mockAnalyticsService.getWeeklyStats.mockReturnValue({
        weekStart: new Date(),
        weekEnd: new Date(),
        sessionsCompleted: 3,
        averageRating: 4.0,
        categoriesPracticed: ['arrays'],
        comparisonToPreviousWeek: {
          sessionsDelta: 1,
          ratingDelta: 0.5,
        },
      });

      render(<DashboardHeader />);

      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('This Week')).toBeInTheDocument();
    });
  });

  describe('Requirement 7.3: Display plan badge', () => {
    it('should display Basic plan badge', () => {
      mockUseAuth.mockReturnValue({
        user: { ...mockUser, plan: 'basic' },
        loading: false,
        error: null,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        clearError: jest.fn(),
      });

      mockStorageService.getSessions.mockReturnValue([]);
      mockAnalyticsService.calculateStreak.mockReturnValue(0);
      mockAnalyticsService.getWeeklyStats.mockReturnValue({
        weekStart: new Date(),
        weekEnd: new Date(),
        sessionsCompleted: 0,
        averageRating: 0,
        categoriesPracticed: [],
        comparisonToPreviousWeek: {
          sessionsDelta: 0,
          ratingDelta: 0,
        },
      });

      render(<DashboardHeader />);

      expect(screen.getByText('Basic Plan')).toBeInTheDocument();
    });

    it('should display Premium plan badge', () => {
      mockUseAuth.mockReturnValue({
        user: { ...mockUser, plan: 'premium' },
        loading: false,
        error: null,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        clearError: jest.fn(),
      });

      mockStorageService.getSessions.mockReturnValue([]);
      mockAnalyticsService.calculateStreak.mockReturnValue(0);
      mockAnalyticsService.getWeeklyStats.mockReturnValue({
        weekStart: new Date(),
        weekEnd: new Date(),
        sessionsCompleted: 0,
        averageRating: 0,
        categoriesPracticed: [],
        comparisonToPreviousWeek: {
          sessionsDelta: 0,
          ratingDelta: 0,
        },
      });

      render(<DashboardHeader />);

      expect(screen.getByText('Premium Plan')).toBeInTheDocument();
    });

    it('should display Pro plan badge', () => {
      mockUseAuth.mockReturnValue({
        user: { ...mockUser, plan: 'pro' },
        loading: false,
        error: null,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        clearError: jest.fn(),
      });

      mockStorageService.getSessions.mockReturnValue([]);
      mockAnalyticsService.calculateStreak.mockReturnValue(0);
      mockAnalyticsService.getWeeklyStats.mockReturnValue({
        weekStart: new Date(),
        weekEnd: new Date(),
        sessionsCompleted: 0,
        averageRating: 0,
        categoriesPracticed: [],
        comparisonToPreviousWeek: {
          sessionsDelta: 0,
          ratingDelta: 0,
        },
      });

      render(<DashboardHeader />);

      expect(screen.getByText('Pro Plan')).toBeInTheDocument();
    });
  });

  describe('Requirement 7.6: Add upgrade button for Basic users', () => {
    it('should display upgrade button for Basic users', () => {
      mockUseAuth.mockReturnValue({
        user: { ...mockUser, plan: 'basic' },
        loading: false,
        error: null,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        clearError: jest.fn(),
      });

      mockStorageService.getSessions.mockReturnValue([]);
      mockAnalyticsService.calculateStreak.mockReturnValue(0);
      mockAnalyticsService.getWeeklyStats.mockReturnValue({
        weekStart: new Date(),
        weekEnd: new Date(),
        sessionsCompleted: 0,
        averageRating: 0,
        categoriesPracticed: [],
        comparisonToPreviousWeek: {
          sessionsDelta: 0,
          ratingDelta: 0,
        },
      });

      render(<DashboardHeader />);

      const upgradeButton = screen.getByText('Upgrade Plan');
      expect(upgradeButton).toBeInTheDocument();
      expect(upgradeButton.closest('a')).toHaveAttribute('href', '/pricing');
    });

    it('should NOT display upgrade button for Premium users', () => {
      mockUseAuth.mockReturnValue({
        user: { ...mockUser, plan: 'premium' },
        loading: false,
        error: null,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        clearError: jest.fn(),
      });

      mockStorageService.getSessions.mockReturnValue([]);
      mockAnalyticsService.calculateStreak.mockReturnValue(0);
      mockAnalyticsService.getWeeklyStats.mockReturnValue({
        weekStart: new Date(),
        weekEnd: new Date(),
        sessionsCompleted: 0,
        averageRating: 0,
        categoriesPracticed: [],
        comparisonToPreviousWeek: {
          sessionsDelta: 0,
          ratingDelta: 0,
        },
      });

      render(<DashboardHeader />);

      expect(screen.queryByText('Upgrade Plan')).not.toBeInTheDocument();
    });

    it('should NOT display upgrade button for Pro users', () => {
      mockUseAuth.mockReturnValue({
        user: { ...mockUser, plan: 'pro' },
        loading: false,
        error: null,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        clearError: jest.fn(),
      });

      mockStorageService.getSessions.mockReturnValue([]);
      mockAnalyticsService.calculateStreak.mockReturnValue(0);
      mockAnalyticsService.getWeeklyStats.mockReturnValue({
        weekStart: new Date(),
        weekEnd: new Date(),
        sessionsCompleted: 0,
        averageRating: 0,
        categoriesPracticed: [],
        comparisonToPreviousWeek: {
          sessionsDelta: 0,
          ratingDelta: 0,
        },
      });

      render(<DashboardHeader />);

      expect(screen.queryByText('Upgrade Plan')).not.toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should render nothing when user is null', () => {
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

      const { container } = render(<DashboardHeader />);

      expect(container.firstChild).toBeNull();
    });

    it('should handle empty sessions gracefully', () => {
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
      mockAnalyticsService.calculateStreak.mockReturnValue(0);
      mockAnalyticsService.getWeeklyStats.mockReturnValue({
        weekStart: new Date(),
        weekEnd: new Date(),
        sessionsCompleted: 0,
        averageRating: 0,
        categoriesPracticed: [],
        comparisonToPreviousWeek: {
          sessionsDelta: 0,
          ratingDelta: 0,
        },
      });

      render(<DashboardHeader />);

      // Verify both sections display correctly with zero values
      expect(screen.getByText('Day Streak')).toBeInTheDocument();
      expect(screen.getByText('This Week')).toBeInTheDocument();
      
      // Both streak and weekly count are 0
      const zeros = screen.getAllByText('0');
      expect(zeros.length).toBeGreaterThanOrEqual(2);
    });
  });
});
