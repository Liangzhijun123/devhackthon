# Requirements Document

## Introduction

Interview Buddy is a structured mock interview platform designed to simulate real coding interview conditions with accountability, timing pressure, and performance tracking. The platform addresses the gap between solo practice and actual interview environments by providing timed sessions, streak tracking, and tiered subscription plans that gate advanced features.

## Glossary

- **Platform**: The Interview Buddy web application system
- **User**: A registered person using the platform to practice interviews
- **Mock_Interview**: A timed 45-minute practice session with a randomly selected coding question
- **Session**: A completed Mock_Interview with associated feedback and performance data
- **Streak**: The count of consecutive days a User has completed at least one Session
- **Question_Bank**: The collection of coding problems available for Mock_Interviews
- **Plan**: The subscription tier (Basic, Premium, or Pro) associated with a User account
- **Pressure_Mode**: A Pro-tier feature that simulates interview stress with random interruptions
- **Streak_Freeze**: A Pro-tier feature allowing Users to skip one day without breaking their Streak
- **Analytics_Dashboard**: A Premium and Pro feature displaying performance metrics and trends
- **Interview_Readiness_Score**: A Pro-tier metric calculating overall interview preparedness

## Requirements

### Requirement 1: User Authentication and Plan Selection

**User Story:** As a new user, I want to create an account and select a subscription plan, so that I can access platform features appropriate to my needs.

#### Acceptance Criteria

1. THE Platform SHALL provide email and password authentication
2. WHEN a User creates an account, THE Platform SHALL require Plan selection (Basic, Premium, or Pro)
3. WHEN a User selects Basic Plan, THE Platform SHALL activate a 30-day free trial period
4. THE Platform SHALL store the Plan type in the User profile
5. WHEN the 30-day trial expires, THE Platform SHALL restrict Basic Plan Users to Basic features only

### Requirement 2: Mock Interview Session Management

**User Story:** As a user, I want to start timed mock interview sessions with random questions, so that I can practice under realistic conditions.

#### Acceptance Criteria

1. WHEN a User initiates a Mock_Interview, THE Platform SHALL start a 45-minute countdown timer
2. WHEN a Mock_Interview starts, THE Platform SHALL select and display one random question from the Question_Bank
3. THE Platform SHALL provide a hint reveal button during Mock_Interviews
4. THE Platform SHALL allow Users to end Sessions before the timer expires
5. WHEN the timer reaches zero, THE Platform SHALL automatically end the Session and redirect to the Feedback Page

### Requirement 3: Question Bank Management

**User Story:** As a user, I want access to coding questions appropriate to my plan tier, so that I can practice with varied difficulty levels.

#### Acceptance Criteria

1. THE Platform SHALL maintain a Question_Bank with at least 15 questions for Basic Plan Users
2. WHERE Premium or Pro Plan is active, THE Platform SHALL provide access to 30 questions
3. WHERE Pro Plan is active, THE Platform SHALL include behavioral and system design questions
4. THE Platform SHALL randomly select questions without immediate repetition within the same day
5. WHEN displaying a question, THE Platform SHALL include the problem statement and difficulty level

### Requirement 4: Session Feedback and Performance Tracking

**User Story:** As a user, I want to rate my performance after each session, so that I can track my progress over time.

#### Acceptance Criteria

1. WHEN a Session ends, THE Platform SHALL display the Feedback Page
2. THE Platform SHALL require Users to rate their performance on a scale of 1 to 5
3. THE Platform SHALL allow Users to select the perceived difficulty level
4. THE Platform SHALL provide a text field for optional notes
5. WHEN feedback is submitted, THE Platform SHALL save the Session data with timestamp, rating, difficulty, and notes

### Requirement 5: Streak Tracking and Accountability

**User Story:** As a user, I want to maintain a daily streak of completed sessions, so that I stay accountable to my practice schedule.

#### Acceptance Criteria

1. THE Platform SHALL initialize Streak count to zero for new Users
2. WHEN a User completes their first Session of a day, THE Platform SHALL increment the Streak by one
3. WHEN a User completes zero Sessions in a 24-hour period, THE Platform SHALL reset the Streak to zero
4. THE Platform SHALL display the current Streak count on the Dashboard
5. WHERE Pro Plan is active, THE Platform SHALL allow one Streak_Freeze per week to skip a day without resetting

### Requirement 6: Plan-Based Feature Gating

**User Story:** As a platform administrator, I want to restrict features based on subscription plans, so that users are incentivized to upgrade.

#### Acceptance Criteria

1. WHERE Basic Plan is active, THE Platform SHALL limit Users to 3 Mock_Interviews per week
2. WHERE Premium or Pro Plan is active, THE Platform SHALL allow unlimited Mock_Interviews
3. WHERE Basic Plan is active, THE Platform SHALL display only the last 5 Sessions
4. WHERE Premium or Pro Plan is active, THE Platform SHALL display all historical Sessions
5. WHERE Basic Plan is active, THE Platform SHALL hide or blur the Analytics_Dashboard with an upgrade prompt
6. WHERE Pro Plan is active, THE Platform SHALL enable Pressure_Mode toggle on the Mock Interview Page

### Requirement 7: Dashboard Display

**User Story:** As a user, I want to see my current status and quick actions on the dashboard, so that I can easily navigate the platform.

#### Acceptance Criteria

1. THE Platform SHALL display the current Streak with a fire emoji on the Dashboard
2. THE Platform SHALL display the count of Sessions completed this week
3. THE Platform SHALL display the User's current Plan badge
4. THE Platform SHALL provide a prominent "Start Mock Interview" button
5. THE Platform SHALL display a summary of the last completed Session
6. WHERE Basic Plan is active, THE Platform SHALL display an upgrade button

### Requirement 8: Weekly Progress Reports

**User Story:** As a premium or pro user, I want to receive weekly progress summaries, so that I can monitor my consistency and improvement.

#### Acceptance Criteria

1. WHERE Premium or Pro Plan is active, THE Platform SHALL generate a weekly progress report every 7 days
2. THE Platform SHALL include Sessions completed count in the weekly report
3. THE Platform SHALL include average performance rating in the weekly report
4. THE Platform SHALL display the weekly report on the Dashboard
5. WHERE Premium or Pro Plan is active, THE Platform SHALL send the weekly report via email

### Requirement 9: Performance Analytics by Category

**User Story:** As a premium or pro user, I want to see my performance broken down by question category, so that I can identify weak areas.

#### Acceptance Criteria

1. WHERE Premium or Pro Plan is active, THE Platform SHALL categorize questions by topic (arrays, trees, graphs, etc.)
2. THE Platform SHALL calculate average rating per category based on completed Sessions
3. THE Platform SHALL display a performance breakdown by category on the Analytics_Dashboard
4. THE Platform SHALL highlight the weakest category (lowest average rating)
5. THE Platform SHALL display a sessions chart showing activity over time

### Requirement 10: Pressure Mode Simulation

**User Story:** As a pro user, I want to enable pressure mode during interviews, so that I can simulate high-stress interview conditions.

#### Acceptance Criteria

1. WHERE Pro Plan is active, THE Platform SHALL display a Pressure_Mode toggle on the Mock Interview Page
2. WHEN Pressure_Mode is enabled, THE Platform SHALL display random interruption popups during the Session
3. WHEN Pressure_Mode is enabled and 2 minutes remain, THE Platform SHALL display a warning notification
4. THE Platform SHALL allow Users to dismiss interruption popups without ending the Session
5. WHEN Pressure_Mode is disabled, THE Platform SHALL not display any interruptions

### Requirement 11: Interview Readiness Score

**User Story:** As a pro user, I want to see an interview readiness score, so that I can gauge when I'm prepared for real interviews.

#### Acceptance Criteria

1. WHERE Pro Plan is active, THE Platform SHALL calculate an Interview_Readiness_Score
2. THE Platform SHALL base the score on recent Session count, average rating, and Streak consistency
3. THE Platform SHALL display the Interview_Readiness_Score on the Analytics_Dashboard
4. THE Platform SHALL update the score after each completed Session
5. THE Platform SHALL display a consistency score indicating practice regularity

### Requirement 12: Landing Page and Marketing Content

**User Story:** As a prospective user, I want to understand the platform's value proposition, so that I can decide whether to sign up.

#### Acceptance Criteria

1. THE Platform SHALL display a landing page with a hero section and call-to-action button
2. THE Platform SHALL include a problem section explaining the gap in solo practice
3. THE Platform SHALL include a "How It Works" section with step-by-step explanation
4. THE Platform SHALL display a pricing section comparing Basic, Premium, and Pro plans
5. THE Platform SHALL provide clear feature lists for each Plan tier

### Requirement 13: Session History and Review

**User Story:** As a user, I want to review my past sessions, so that I can reflect on my progress and identify patterns.

#### Acceptance Criteria

1. THE Platform SHALL store all completed Sessions with timestamp, question, rating, difficulty, and notes
2. WHERE Basic Plan is active, THE Platform SHALL display the 5 most recent Sessions
3. WHERE Premium or Pro Plan is active, THE Platform SHALL display all historical Sessions
4. THE Platform SHALL allow Users to view Session details including the original question
5. THE Platform SHALL sort Sessions by date with most recent first

### Requirement 14: Timer and Session Controls

**User Story:** As a user, I want clear timer visibility and session controls, so that I can manage my practice time effectively.

#### Acceptance Criteria

1. WHEN a Mock_Interview is active, THE Platform SHALL display the remaining time in minutes and seconds
2. THE Platform SHALL update the timer display every second
3. THE Platform SHALL provide an "End Session" button visible throughout the Mock_Interview
4. WHEN the User clicks "End Session", THE Platform SHALL prompt for confirmation before ending
5. WHEN the timer expires, THE Platform SHALL save the Session as completed and redirect to Feedback Page

### Requirement 15: Plan Upgrade Flow

**User Story:** As a basic user, I want to easily upgrade my plan, so that I can access advanced features when I'm ready.

#### Acceptance Criteria

1. WHERE Basic Plan is active, THE Platform SHALL display upgrade prompts on gated features
2. THE Platform SHALL provide a clear upgrade button on the Dashboard
3. WHEN a User clicks upgrade, THE Platform SHALL display the pricing comparison page
4. THE Platform SHALL allow Users to change their Plan selection in profile settings
5. WHEN a Plan upgrade is confirmed, THE Platform SHALL immediately grant access to new features
