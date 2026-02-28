/**
 * Unit tests for LastSessionSummary component
 * Tests rendering, empty states, and data display
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { LastSessionSummary } from '../LastSessionSummary';
import { useAuth } from '@/contexts/AuthContext';
import { StorageService } from '@/services/StorageService';
import { CompletedSession, User } from '@/types';

// Mock dependencies
jest.mock('@/contexts/AuthContext');
jest.mock('@/services/StorageService');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockStorageService = StorageService as jest.Mocked<typeof StorageService>;

describe('LastSessionSummary', () => {
  const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    plan: 'premium',
    createdAt: new Date('2024-01-01'),
    trialEndsAt: null,
    streak: 5,
    streakFreezeUsed: false,
    lastSessionDate: new Date('2024-01-15'),
  };

  const mockSession: CompletedSession = {
    id: 'session-1',
    userId: 'user-1',
    questionId: 'q-1',
    questionTitle: 'Two Sum',
    category: 'arrays',
    difficulty: 'easy',
    startTime: new Date('2024-01-15T10:00:00'),
    endTime: new Date('2024-01-15T10:45:00'),
    duration: 2700,
    rating: 4,
    perceivedDifficulty: 'medium',
    notes: 'Great practice session!',
    pressureModeUsed: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render nothing when user is not authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        loading: false,
        error: null,
        clearError: jest.fn(),
      });

      const { container } = render(<LastSessionSummary />);
      expect(container.firstChild).toBeNull();
    });

    it('should render empty state when user has no sessions', () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        loading: false,
        error: null,
        clearError: jest.fn(),
      });

      mockStorageService.getSessions.mockReturnValue([]);

      render(<LastSessionSummary />);

      expect(screen.getByText('Last Session')).toBeInTheDocument();
      expect(screen.getByText('No sessions completed yet')).toBeInTheDocument();
      expect(screen.getByText('Start your first mock interview to see your progress')).toBeInTheDocument();
    });

    it('should render session details when user has completed sessions', () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        loading: false,
        error: null,
        clearError: jest.fn(),
      });

      mockStorageService.getSessions.mockReturnValue([mockSession]);

      render(<LastSessionSummary />);

      expect(screen.getByText('Last Session')).toBeInTheDocument();
      expect(screen.getByText('Two Sum')).toBeInTheDocument();
      expect(screen.getByText('Easy')).toBeInTheDocument();
      expect(screen.getByText('Arrays')).toBeInTheDocument();
      expect(screen.getByText('4/5')).toBeInTheDocument();
    });
  });

  describe('Session Details Display', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        loading: false,
        error: null,
        clearError: jest.fn(),
      });
    });

    it('should display question title correctly', () => {
      mockStorageService.getSessions.mockReturnValue([mockSession]);

      render(<LastSessionSummary />);

      expect(screen.getByText('Two Sum')).toBeInTheDocument();
    });

    it('should display difficulty badge with correct styling', () => {
      mockStorageService.getSessions.mockReturnValue([mockSession]);

      render(<LastSessionSummary />);

      const difficultyBadge = screen.getByText('Easy');
      expect(difficultyBadge).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('should display medium difficulty with correct styling', () => {
      const mediumSession = { ...mockSession, difficulty: 'medium' as const };
      mockStorageService.getSessions.mockReturnValue([mediumSession]);

      render(<LastSessionSummary />);

      const difficultyBadge = screen.getByText('Medium');
      expect(difficultyBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });

    it('should display hard difficulty with correct styling', () => {
      const hardSession = { ...mockSession, difficulty: 'hard' as const };
      mockStorageService.getSessions.mockReturnValue([hardSession]);

      render(<LastSessionSummary />);

      const difficultyBadge = screen.getByText('Hard');
      expect(difficultyBadge).toHaveClass('bg-red-100', 'text-red-800');
    });

    it('should display category with proper formatting', () => {
      mockStorageService.getSessions.mockReturnValue([mockSession]);

      render(<LastSessionSummary />);

      expect(screen.getByText('Arrays')).toBeInTheDocument();
    });

    it('should format multi-word categories correctly', () => {
      const dpSession = { ...mockSession, category: 'dynamic-programming' };
      mockStorageService.getSessions.mockReturnValue([dpSession]);

      render(<LastSessionSummary />);

      expect(screen.getByText('Dynamic Programming')).toBeInTheDocument();
    });

    it('should display rating with correct number of filled stars', () => {
      mockStorageService.getSessions.mockReturnValue([mockSession]);

      const { container } = render(<LastSessionSummary />);

      expect(screen.getByText('4/5')).toBeInTheDocument();
      
      // Check that 4 stars are filled (have fill-current class)
      const stars = container.querySelectorAll('svg.w-5.h-5');
      const filledStars = Array.from(stars).filter(star => 
        star.classList.contains('text-yellow-400') && star.classList.contains('fill-current')
      );
      expect(filledStars).toHaveLength(4);
    });

    it('should display notes when available', () => {
      mockStorageService.getSessions.mockReturnValue([mockSession]);

      render(<LastSessionSummary />);

      expect(screen.getByText(/Great practice session!/)).toBeInTheDocument();
    });

    it('should not display notes section when notes are empty', () => {
      const sessionWithoutNotes = { ...mockSession, notes: '' };
      mockStorageService.getSessions.mockReturnValue([sessionWithoutNotes]);

      render(<LastSessionSummary />);

      expect(screen.queryByText('Notes:')).not.toBeInTheDocument();
    });
  });

  describe('Date Formatting', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        loading: false,
        error: null,
        clearError: jest.fn(),
      });
    });

    it('should display "Today" for sessions completed today', () => {
      const todaySession = {
        ...mockSession,
        startTime: new Date(),
      };
      mockStorageService.getSessions.mockReturnValue([todaySession]);

      render(<LastSessionSummary />);

      expect(screen.getByText('Today')).toBeInTheDocument();
    });

    it('should display "Yesterday" for sessions completed yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdaySession = {
        ...mockSession,
        startTime: yesterday,
      };
      mockStorageService.getSessions.mockReturnValue([yesterdaySession]);

      render(<LastSessionSummary />);

      expect(screen.getByText('Yesterday')).toBeInTheDocument();
    });

    it('should display "X days ago" for recent sessions', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const recentSession = {
        ...mockSession,
        startTime: threeDaysAgo,
      };
      mockStorageService.getSessions.mockReturnValue([recentSession]);

      render(<LastSessionSummary />);

      expect(screen.getByText('3 days ago')).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        loading: false,
        error: null,
        clearError: jest.fn(),
      });
    });

    it('should render "View All" link to history page', () => {
      mockStorageService.getSessions.mockReturnValue([mockSession]);

      render(<LastSessionSummary />);

      const viewAllLink = screen.getByText('View All →');
      expect(viewAllLink).toHaveAttribute('href', '/history');
    });

    it('should render "View Full Details" link when session exists', () => {
      mockStorageService.getSessions.mockReturnValue([mockSession]);

      render(<LastSessionSummary />);

      const viewDetailsLink = screen.getByText('View Full Details');
      expect(viewDetailsLink).toHaveAttribute('href', '/history');
    });
  });

  describe('Multiple Sessions', () => {
    it('should display only the most recent session when multiple exist', () => {
      const olderSession: CompletedSession = {
        ...mockSession,
        id: 'session-2',
        questionTitle: 'Reverse Linked List',
        startTime: new Date('2024-01-14T10:00:00'),
      };

      const newerSession: CompletedSession = {
        ...mockSession,
        id: 'session-3',
        questionTitle: 'Binary Search',
        startTime: new Date('2024-01-16T10:00:00'),
      };

      mockUseAuth.mockReturnValue({
        user: mockUser,
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
        updatePlan: jest.fn(),
        loading: false,
        error: null,
        clearError: jest.fn(),
      });

      // Sessions should be sorted by date descending (most recent first)
      mockStorageService.getSessions.mockReturnValue([newerSession, mockSession, olderSession]);

      render(<LastSessionSummary />);

      // Should display the most recent session
      expect(screen.getByText('Binary Search')).toBeInTheDocument();
      expect(screen.queryByText('Two Sum')).not.toBeInTheDocument();
      expect(screen.queryByText('Reverse Linked List')).not.toBeInTheDocument();
    });
  });
});
