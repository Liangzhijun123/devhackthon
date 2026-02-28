# SessionService

The SessionService manages the lifecycle of interview sessions, including session creation, question selection, and session completion.

## Overview

SessionService handles:
- Starting new interview sessions with 45-minute timers
- Selecting random questions based on user plan tier
- Avoiding same-day question repetition
- Enforcing weekly limits for Basic plan users
- Ending sessions and saving feedback
- Retrieving session history with plan-based filtering

## Key Features

### 1. Session Initialization
- All sessions start with exactly 2700 seconds (45 minutes)
- Questions are randomly selected from the plan-accessible bank
- Same-day question repetition is avoided

### 2. Plan-Based Access Control
- **Basic Plan**: Access to 15 questions, limited to 3 interviews per week
- **Premium Plan**: Access to 30 questions, unlimited interviews
- **Pro Plan**: Access to all 35 questions, unlimited interviews

### 3. Weekly Limits
- Basic plan users are limited to 3 interviews per week
- Week starts on Sunday at 00:00:00
- Premium and Pro users have no weekly limits

### 4. Question Selection
- Questions are selected randomly from the plan-accessible bank
- Questions used today are excluded from selection
- If all questions are used, repetition is allowed

## API Reference

### `startSession(userId: string, plan: Plan): Session`

Starts a new interview session for a user.

**Parameters:**
- `userId`: The unique identifier of the user
- `plan`: The user's subscription plan ('basic', 'premium', or 'pro')

**Returns:** A new `Session` object with:
- `id`: Unique session identifier
- `userId`: User identifier
- `questionId`: Selected question identifier
- `startTime`: Session start timestamp
- `endTime`: null (session is active)
- `timeRemaining`: 2700 seconds (45 minutes)
- `pressureModeEnabled`: false (default)
- `hintRevealed`: false (default)

**Throws:**
- `SessionError`: If Basic plan user has reached weekly limit (3 interviews)

**Example:**
```typescript
const session = SessionService.startSession('user-123', 'premium');
console.log(session.timeRemaining); // 2700
```

### `getRandomQuestion(plan: Plan, excludeIds: string[] = []): Question`

Selects a random question from the plan-accessible bank.

**Parameters:**
- `plan`: The user's subscription plan
- `excludeIds`: Array of question IDs to exclude (e.g., questions used today)

**Returns:** A `Question` object from the accessible bank

**Throws:**
- `SessionError`: If no questions are available (should never happen in practice)

**Example:**
```typescript
const question = SessionService.getRandomQuestion('basic', ['q1', 'q2']);
console.log(question.title); // "Two Sum"
```

### `endSession(session: Session, feedback: Feedback): CompletedSession`

Ends an active session and saves it with user feedback.

**Parameters:**
- `session`: The active session to end
- `feedback`: User feedback containing:
  - `rating`: Performance rating (1-5)
  - `perceivedDifficulty`: User's difficulty assessment ('easy', 'medium', 'hard')
  - `notes`: Optional notes (can be empty string)

**Returns:** A `CompletedSession` object with all session data and feedback

**Throws:**
- `SessionError`: If the question is not found

**Example:**
```typescript
const feedback = {
  rating: 4,
  perceivedDifficulty: 'medium',
  notes: 'Good practice session'
};
const completed = SessionService.endSession(session, feedback);
console.log(completed.duration); // Duration in seconds
```

### `getSessionHistory(userId: string, plan: Plan): CompletedSession[]`

Retrieves session history for a user with plan-based filtering.

**Parameters:**
- `userId`: The user identifier
- `plan`: The user's subscription plan

**Returns:** Array of `CompletedSession` objects, sorted by date (most recent first)
- Basic plan: Returns last 5 sessions
- Premium/Pro plans: Returns all sessions

**Example:**
```typescript
const history = SessionService.getSessionHistory('user-123', 'basic');
console.log(history.length); // Maximum 5 for basic plan
```

### `getCurrentSession(userId: string): Session | null`

Gets the current active session for a user.

**Note:** In the current implementation, this returns null as active sessions are managed in React context. This method is provided for future extensibility.

**Parameters:**
- `userId`: The user identifier

**Returns:** `Session | null`

## Property-Based Tests

The SessionService is validated by comprehensive property-based tests that verify:

1. **Property 6**: Interview session initializes with 45-minute timer
2. **Property 7**: Interview session selects question from available bank
3. **Property 8**: Early session termination completes successfully
4. **Property 13**: Same-day question selection avoids repetition
5. **Property 21**: Basic plan limits weekly interviews to 3
6. **Property 22**: Premium/Pro plans allow unlimited interviews

These tests run 100 iterations with randomized inputs to ensure correctness across all valid scenarios.

## Error Handling

### SessionError

All SessionService methods throw `SessionError` for operational errors:

- **Weekly Limit Exceeded**: "Basic plan users are limited to 3 interviews per week"
- **No Questions Available**: "No questions available for this plan"
- **Question Not Found**: "Question not found"

**Example:**
```typescript
try {
  const session = SessionService.startSession('user-123', 'basic');
} catch (error) {
  if (error instanceof SessionError) {
    console.error('Session error:', error.message);
  }
}
```

## Integration with Other Services

### StorageService
SessionService uses StorageService for:
- Retrieving past sessions to check weekly limits
- Retrieving today's sessions to avoid question repetition
- Saving completed sessions with feedback

### Question Bank
SessionService uses the question bank from `lib/questions.ts` for:
- Getting questions accessible to each plan tier
- Retrieving question details by ID

## Usage in React Components

```typescript
import { SessionService } from '@/services/SessionService';
import { useAuth } from '@/contexts/AuthContext';

function InterviewPage() {
  const { user } = useAuth();
  
  const startInterview = () => {
    try {
      const session = SessionService.startSession(user.id, user.plan);
      // Navigate to interview session with question
    } catch (error) {
      if (error instanceof SessionError) {
        // Show upgrade prompt for weekly limit
        showUpgradePrompt();
      }
    }
  };
  
  return (
    <button onClick={startInterview}>
      Start Mock Interview
    </button>
  );
}
```

## Testing

Run the property-based tests:
```bash
npm test -- __tests__/properties/session.properties.test.ts
```

All tests should pass, validating the correctness of session management across randomized inputs.
