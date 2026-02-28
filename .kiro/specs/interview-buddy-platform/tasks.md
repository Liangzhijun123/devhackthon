# Implementation Plan: Interview Buddy Platform

## Overview

This implementation plan breaks down the Interview Buddy platform into discrete coding tasks organized by the 3-day build timeline. The platform is a Next.js + TypeScript application with Tailwind CSS, using client-side state management and localStorage for persistence. All tasks build incrementally, with testing integrated throughout to validate correctness early.

## Tasks

### Day 1: Foundation and Core Infrastructure

- [x] 1. Initialize Next.js project with TypeScript and Tailwind CSS
  - Create Next.js 14+ project with App Router
  - Configure TypeScript with strict mode
  - Set up Tailwind CSS with custom theme colors
  - Configure project structure: `/app`, `/components`, `/services`, `/lib`, `/types`
  - _Requirements: All (foundation for entire platform)_

- [ ] 2. Define core TypeScript interfaces and types
  - [x] 2.1 Create type definitions file
    - Define `User`, `Question`, `Session`, `CompletedSession` interfaces
    - Define `Plan`, `WeeklyStats`, `CategoryPerformance`, `ReadinessScore` types
    - Define `Feedback` interface for session completion
    - Export all types from `/types/index.ts`
    - _Requirements: 1.2, 1.4, 2.1, 3.5, 4.5, 5.1, 11.1_

  - [x] 2.2 Write property test for type consistency
    - **Property 4: Plan persistence round trip**
    - **Validates: Requirements 1.4**

- [ ] 3. Implement StorageService with localStorage wrapper
  - [x] 3.1 Create StorageService class
    - Implement `saveUser`, `getUser`, `saveSession`, `getSessions` methods
    - Implement `updateStreak`, `getStreak` methods
    - Add error handling for quota exceeded and unavailable localStorage
    - Add data validation on load with fallback to defaults
    - _Requirements: 4.5, 5.1, 5.4, 13.1_

  - [x] 3.2 Write property test for storage round trip
    - **Property 16: Completed session storage includes all required fields**
    - **Validates: Requirements 4.5, 13.1**

- [ ] 4. Create mock data generators and question bank
  - [x] 4.1 Build question bank with categorized questions
    - Create 15 questions for Basic tier (arrays, strings, easy/medium difficulty)
    - Create 15 additional questions for Premium/Pro (trees, graphs, dynamic programming)
    - Add 5 behavioral and system design questions for Pro tier
    - Store in `/lib/questions.ts` with proper categorization
    - _Requirements: 3.1, 3.2, 3.3, 3.5_

  - [x] 4.2 Write property tests for question bank structure
    - **Property 10: Basic plan has minimum 15 questions**
    - **Property 11: Premium/Pro plans have minimum 30 questions**
    - **Property 12: Pro plan includes specialized question types**
    - **Property 14: Question display includes required fields**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.5**

  - [x] 4.3 Create mock user data generator
    - Generate sample users with different plans and trial states
    - Create utility for pre-populating demo data
    - _Requirements: 1.1, 1.2, 1.3_

- [ ] 5. Implement AuthService with mock authentication
  - [x] 5.1 Create AuthService class
    - Implement `signup` method with plan selection and trial activation
    - Implement `login` method with credential validation
    - Implement `logout`, `getCurrentUser`, `updatePlan` methods
    - Use StorageService for persistence
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 15.4_

  - [x] 5.2 Write property tests for authentication
    - **Property 1: Authentication validates credentials**
    - **Property 2: Account creation requires plan selection**
    - **Property 3: Basic plan activates 30-day trial**
    - **Validates: Requirements 1.1, 1.2, 1.3**

- [ ] 6. Create AuthContext provider
  - [x] 6.1 Build React Context for authentication state
    - Create `AuthContext` with user, plan, and auth methods
    - Implement `useAuth` hook for consuming context
    - Add loading states and error handling
    - Wrap app with AuthProvider in root layout
    - _Requirements: 1.1, 1.4, 15.5_

  - [x] 6.2 Write unit tests for AuthContext
    - Test login/logout flows
    - Test plan updates and immediate access
    - _Requirements: 1.1, 15.5_

- [x] 7. Set up routing structure and layouts
  - Create route files: `/`, `/auth/signup`, `/auth/login`, `/dashboard`, `/interview`, `/interview/feedback`, `/history`, `/analytics`, `/pricing`, `/profile`
  - Implement `AppLayout` component with navigation and user info
  - Implement `LandingLayout` for marketing pages
  - Add route protection middleware for authenticated routes
  - _Requirements: 7.1, 7.3, 12.1_

- [~] 8. Checkpoint - Verify foundation
  - Ensure all tests pass, ask the user if questions arise.

### Day 2: Core Features and Session Flow

- [ ] 9. Build authentication pages
  - [x] 9.1 Create SignupForm component
    - Email and password inputs with validation
    - Plan selection radio buttons (Basic, Premium, Pro)
    - Form submission with error handling
    - Redirect to dashboard on success
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 9.2 Create LoginForm component
    - Email and password inputs
    - Mock credential validation
    - Error message display
    - Redirect to dashboard on success
    - _Requirements: 1.1_

  - [x] 9.3 Write unit tests for auth forms
    - Test form validation
    - Test submission flows
    - Test error states
    - _Requirements: 1.1, 1.2_

- [ ] 10. Implement SessionService for interview management
  - [x] 10.1 Create SessionService class
    - Implement `startSession` with timer initialization
    - Implement `getRandomQuestion` with plan-based filtering and daily deduplication
    - Implement `endSession` with feedback processing
    - Implement `getCurrentSession` and `getSessionHistory` with plan-based limits
    - _Requirements: 2.1, 2.2, 2.4, 3.4, 4.5, 6.1, 6.3, 6.4, 13.2, 13.3_

  - [x] 10.2 Write property tests for session management
    - **Property 6: Interview session initializes with 45-minute timer**
    - **Property 7: Interview session selects question from available bank**
    - **Property 8: Early session termination completes successfully**
    - **Property 13: Same-day question selection avoids repetition**
    - **Property 21: Basic plan limits weekly interviews to 3**
    - **Property 22: Premium/Pro plans allow unlimited interviews**
    - **Validates: Requirements 2.1, 2.2, 2.4, 3.4, 6.1, 6.2**

- [x] 11. Create SessionContext provider
  - Build React Context for active session state
  - Implement timer logic with setInterval and drift correction
  - Add session start, end, and update methods
  - Wrap app with SessionProvider
  - _Requirements: 2.1, 2.5, 14.1, 14.2_

- [ ] 12. Implement AnalyticsService for calculations
  - [x] 12.1 Create AnalyticsService class
    - Implement `calculateStreak` with daily increment and reset logic
    - Implement `getWeeklyStats` with session count and average rating
    - Implement `getPerformanceByCategory` with category averages
    - Implement `calculateReadinessScore` with multi-factor scoring
    - Implement `getWeakestCategory` identification
    - _Requirements: 5.2, 5.3, 8.2, 8.3, 9.2, 9.4, 11.1, 11.2_

  - [x] 12.2 Write property tests for analytics calculations
    - **Property 17: New users initialize with zero streak**
    - **Property 18: First daily session increments streak**
    - **Property 19: Missed day resets streak to zero**
    - **Property 31: Category performance calculation is accurate**
    - **Property 32: Weakest category is correctly identified**
    - **Validates: Requirements 5.1, 5.2, 5.3, 9.2, 9.4**

- [ ] 13. Build Dashboard page and components
  - [x] 13.1 Create DashboardHeader component
    - Display current streak with fire emoji
    - Show weekly session count
    - Display plan badge
    - Add upgrade button for Basic users
    - _Requirements: 7.1, 7.2, 7.3, 7.6_

  - [x] 13.2 Create QuickActions component
    - Prominent "Start Mock Interview" button with weekly limit check
    - Secondary navigation to history and analytics
    - _Requirements: 7.4_

  - [x] 13.3 Create LastSessionSummary component
    - Display most recent session details
    - Show question title, rating, date
    - Link to full session in history
    - _Requirements: 7.5_

  - [x] 13.4 Create UpgradePrompt component for Basic users
    - Highlight locked features
    - CTA button to pricing page
    - _Requirements: 6.5, 15.1, 15.2_

  - [~] 13.5 Assemble Dashboard page
    - Integrate all dashboard components
    - Add loading states
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [~] 13.6 Write property tests for dashboard display
    - **Property 27: Dashboard displays current streak with emoji**
    - **Property 28: Dashboard shows weekly session count**
    - **Property 29: Dashboard displays most recent session**
    - **Validates: Requirements 7.1, 7.2, 7.5**

- [ ] 14. Implement mock interview session page
  - [~] 14.1 Create Timer component
    - Display countdown in MM:SS format
    - Update every second with drift correction
    - Visual warning when < 5 minutes remain
    - Auto-end session at 00:00
    - _Requirements: 2.1, 2.5, 14.1, 14.2, 14.5_

  - [~] 14.2 Write property tests for timer behavior
    - **Property 9: Timer expiry auto-completes session**
    - **Property 39: Timer displays in MM:SS format**
    - **Property 40: Timer decrements by one second per second**
    - **Validates: Requirements 2.5, 14.1, 14.2**

  - [~] 14.3 Create QuestionDisplay component
    - Show question title and difficulty badge
    - Render problem statement
    - Hint reveal button (initially hidden)
    - Code editor placeholder (textarea for MVP)
    - _Requirements: 2.3, 3.5_

  - [~] 14.4 Create InterviewSession component
    - Integrate Timer and QuestionDisplay
    - Add "End Session" button with confirmation dialog
    - Handle session state transitions
    - _Requirements: 2.4, 14.3, 14.4_

  - [~] 14.5 Write property test for session controls
    - **Property 41: End session requires confirmation**
    - **Validates: Requirements 14.4**

  - [~] 14.6 Build interview page route
    - Load current session from SessionContext
    - Redirect to dashboard if no active session
    - _Requirements: 2.1, 2.2, 2.4_

- [ ] 15. Create feedback page and form
  - [~] 15.1 Build FeedbackForm component
    - Performance rating selector (1-5 stars)
    - Perceived difficulty dropdown (Easy, Medium, Hard)
    - Notes textarea (optional)
    - Submit button with validation
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [~] 15.2 Write property test for feedback validation
    - **Property 15: Feedback submission requires rating**
    - **Validates: Requirements 4.2**

  - [~] 15.3 Create feedback page route
    - Display FeedbackForm
    - Handle submission and save session
    - Update streak after session save
    - Redirect to dashboard on completion
    - _Requirements: 4.1, 4.5, 5.2_

- [~] 16. Checkpoint - Verify core session flow
  - Ensure all tests pass, ask the user if questions arise.

### Day 3: Advanced Features and Polish

- [ ] 17. Implement session history page
  - [~] 17.1 Create SessionCard component
    - Display session summary (date, question, rating, difficulty)
    - Expandable to show full details and notes
    - Show original question text on expand
    - _Requirements: 13.4_

  - [~] 17.2 Create SessionList component
    - Display sessions in reverse chronological order
    - Apply plan-based filtering (5 for Basic, all for Premium/Pro)
    - Handle empty state
    - _Requirements: 13.2, 13.3, 13.5_

  - [~] 17.3 Write property tests for session history
    - **Property 23: Basic plan displays maximum 5 sessions**
    - **Property 24: Premium/Pro plans display all sessions**
    - **Property 37: Session history sorted by date descending**
    - **Property 38: Session details include original question**
    - **Validates: Requirements 6.3, 6.4, 13.2, 13.3, 13.4, 13.5**

  - [~] 17.4 Build history page route
    - Integrate SessionList component
    - Add loading and error states
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 18. Build analytics dashboard (Premium/Pro feature)
  - [~] 18.1 Create PerformanceByCategory component
    - Display bar chart or table with average rating per category
    - Highlight weakest category
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [~] 18.2 Create SessionsChart component
    - Line or bar chart showing sessions over time
    - Weekly or monthly view toggle
    - _Requirements: 9.5_

  - [~] 18.3 Create WeeklyProgressReport component
    - Display sessions completed and average rating
    - Show comparison to previous week
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [~] 18.4 Write property test for weekly reports
    - **Property 30: Weekly report includes required metrics**
    - **Validates: Requirements 8.2, 8.3**

  - [~] 18.5 Create ReadinessScore component (Pro only)
    - Large circular progress indicator
    - Score out of 100
    - Breakdown: recent activity, performance, consistency
    - Recommendations display
    - _Requirements: 11.1, 11.2, 11.3, 11.5_

  - [~] 18.6 Write property test for readiness score
    - **Property 36: Readiness score updates after each session**
    - **Validates: Requirements 11.4**

  - [~] 18.7 Create AnalyticsDashboard container
    - Integrate all analytics components
    - Add feature gating for Basic users with upgrade prompt
    - _Requirements: 6.5, 9.1, 9.2, 9.3, 9.4, 9.5, 11.3_

  - [~] 18.8 Write property test for analytics access
    - **Property 25: Basic plan shows analytics upgrade prompt**
    - **Validates: Requirements 6.5**

  - [~] 18.9 Build analytics page route
    - Display AnalyticsDashboard
    - Handle insufficient data state
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 11.3_

- [ ] 19. Implement Pressure Mode (Pro feature)
  - [~] 19.1 Create PressureModeToggle component
    - Toggle switch for enabling/disabling
    - Only visible for Pro users
    - Persist state in session
    - _Requirements: 6.6, 10.1_

  - [~] 19.2 Create InterruptionPopup component
    - Random popup overlays with dismissible UI
    - Messages like "Your interviewer is typing..." or "Connection unstable"
    - Dismissal doesn't affect session or timer
    - _Requirements: 10.2, 10.4_

  - [~] 19.3 Add pressure mode logic to InterviewSession
    - Integrate PressureModeToggle
    - Trigger random interruptions when enabled (max 1 per 5 minutes)
    - Show warning notification at 2 minutes remaining
    - _Requirements: 10.2, 10.3, 10.5_

  - [~] 19.4 Write property tests for pressure mode
    - **Property 26: Pro plan enables pressure mode toggle**
    - **Property 33: Pressure mode controls interruption display**
    - **Property 34: Pressure mode shows warning at 2 minutes**
    - **Property 35: Dismissing interruptions preserves session**
    - **Validates: Requirements 6.6, 10.1, 10.2, 10.3, 10.4, 10.5**

- [ ] 20. Implement Pro streak freeze feature
  - [~] 20.1 Add streak freeze logic to AnalyticsService
    - Check if Pro user has used weekly freeze
    - Allow one missed day without streak reset
    - Reset freeze availability weekly
    - _Requirements: 5.5_

  - [~] 20.2 Write property test for streak freeze
    - **Property 20: Pro users can freeze streak once per week**
    - **Validates: Requirements 5.5**

  - [~] 20.3 Add streak freeze indicator to Dashboard
    - Show "Freeze Available" badge for Pro users
    - Display freeze status
    - _Requirements: 5.5_

- [ ] 21. Build pricing page
  - [~] 21.1 Create PricingTable component
    - Three-column layout (Basic, Premium, Pro)
    - Feature lists with checkmarks
    - Mock price display
    - CTA buttons for each tier
    - _Requirements: 12.4, 12.5_

  - [~] 21.2 Create FeatureComparison component
    - Detailed feature matrix
    - Highlight differences between plans
    - _Requirements: 12.5_

  - [~] 21.3 Build pricing page route
    - Integrate pricing components
    - Add navigation to signup with pre-selected plan
    - _Requirements: 12.4, 12.5_

- [ ] 22. Create landing page
  - [~] 22.1 Build hero section
    - Compelling headline and subheadline
    - Primary CTA button to signup
    - Hero image or illustration
    - _Requirements: 12.1_

  - [~] 22.2 Build problem section
    - Explain gap in solo practice
    - Highlight pain points
    - _Requirements: 12.2_

  - [~] 22.3 Build "How It Works" section
    - Step-by-step explanation with visuals
    - 3-4 key steps
    - _Requirements: 12.3_

  - [~] 22.4 Integrate pricing preview
    - Link to full pricing page
    - _Requirements: 12.4_

  - [~] 22.5 Assemble landing page
    - Integrate all sections
    - Add smooth scrolling and animations
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [ ] 23. Build profile page and plan upgrade flow
  - [~] 23.1 Create profile page
    - Display user email and current plan
    - Show trial expiration date for Basic users
    - Link to pricing page for upgrades
    - _Requirements: 1.5, 15.4_

  - [~] 23.2 Write property tests for plan upgrades
    - **Property 5: Expired trial restricts features**
    - **Property 42: Plan upgrade grants immediate access**
    - **Validates: Requirements 1.5, 15.5**

  - [~] 23.3 Implement plan change functionality
    - Update user plan in AuthContext
    - Immediately grant access to new features
    - Show confirmation message
    - _Requirements: 15.4, 15.5_

- [~] 24. Add demo data initialization
  - Create utility to pre-populate localStorage with sample data
  - Generate demo sessions, streaks, and analytics
  - Add "Reset Demo Data" button in profile
  - Ensure all features are demonstrable
  - _Requirements: All (enables showcase mode)_

- [ ] 25. Polish UI and add responsive design
  - [~] 25.1 Refine Tailwind styling across all components
    - Ensure consistent spacing, colors, and typography
    - Add hover states and transitions
    - Implement mobile-first responsive breakpoints
    - _Requirements: All (UI polish)_

  - [~] 25.2 Add loading states and skeletons
    - Implement loading spinners for async operations
    - Add skeleton screens for data fetching
    - _Requirements: All (UX improvement)_

  - [~] 25.3 Implement error boundaries
    - Add React error boundaries for graceful error handling
    - Display user-friendly error messages
    - _Requirements: All (error handling)_

- [~] 26. Accessibility improvements
  - Add ARIA labels to interactive elements
  - Ensure keyboard navigation works throughout
  - Test with screen reader
  - Add focus indicators
  - _Requirements: All (accessibility compliance)_

- [ ] 27. Final testing and bug fixes
  - [~] 27.1 Run all property-based tests
    - Verify all 42 properties pass
    - Fix any failing tests
    - _Requirements: All_

  - [~] 27.2 Run all unit tests
    - Ensure 100% of unit tests pass
    - Fix any regressions
    - _Requirements: All_

  - [~] 27.3 Manual testing of complete user flows
    - Test signup → interview → feedback → dashboard flow
    - Test all three plan tiers
    - Test feature gating
    - Test streak logic with date manipulation
    - _Requirements: All_

- [~] 28. Checkpoint - Final verification
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 29. Deployment preparation
  - [~] 29.1 Configure for Vercel deployment
    - Add vercel.json configuration
    - Set environment variables (if any)
    - Test build process
    - _Requirements: All (deployment)_

  - [~] 29.2 Deploy to Vercel
    - Push to GitHub repository
    - Connect to Vercel
    - Deploy and verify production build
    - _Requirements: All (deployment)_

  - [~] 29.3 Post-deployment verification
    - Test all features in production
    - Verify localStorage works across browsers
    - Check mobile responsiveness
    - _Requirements: All (deployment verification)_

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties across randomized inputs
- Unit tests validate specific examples, edge cases, and integration points
- All code examples use TypeScript as specified in the design document
- The 3-day timeline assumes focused development with minimal distractions
- Demo data enables immediate showcase of all features without manual setup
