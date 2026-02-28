# StorageService Documentation

## Overview

The `StorageService` class provides a robust wrapper around the browser's `localStorage` API with comprehensive error handling, data validation, and fallback mechanisms. It's designed to safely persist user data, session history, and streak information for the Interview Buddy platform.

## Features

- ✅ **Error Handling**: Gracefully handles localStorage unavailability and quota exceeded errors
- ✅ **Data Validation**: Validates data structure before saving and after loading
- ✅ **Type Safety**: Full TypeScript support with proper type definitions
- ✅ **Fallback Mechanisms**: Returns sensible defaults when data is missing or corrupted
- ✅ **Date Serialization**: Automatically handles Date object serialization/deserialization
- ✅ **Custom Error Types**: Provides `StorageError` for better error handling

## API Reference

### User Management

#### `saveUser(user: User): void`

Saves a user object to localStorage.

**Parameters:**
- `user`: User object to save

**Throws:**
- `StorageError` if localStorage is unavailable
- `StorageError` if user data structure is invalid
- `StorageError` if storage quota is exceeded

**Example:**
```typescript
import { StorageService } from '@/services';

const user = {
  id: 'user-123',
  email: 'user@example.com',
  plan: 'premium',
  createdAt: new Date(),
  trialEndsAt: null,
  streak: 5,
  streakFreezeUsed: false,
  lastSessionDate: new Date(),
};

try {
  StorageService.saveUser(user);
  console.log('User saved successfully');
} catch (error) {
  if (error instanceof StorageError) {
    console.error('Failed to save user:', error.message);
  }
}
```

#### `getUser(userId: string): User | null`

Retrieves a user from localStorage.

**Parameters:**
- `userId`: The ID of the user to retrieve

**Returns:**
- `User` object if found and valid
- `null` if user not found or data is invalid

**Example:**
```typescript
const user = StorageService.getUser('user-123');

if (user) {
  console.log('User found:', user.email);
  console.log('Current streak:', user.streak);
} else {
  console.log('User not found');
}
```

### Session Management

#### `saveSession(session: CompletedSession): void`

Saves a completed session to localStorage.

**Parameters:**
- `session`: CompletedSession object to save

**Throws:**
- `StorageError` if localStorage is unavailable
- `StorageError` if session data structure is invalid
- `StorageError` if storage quota is exceeded

**Example:**
```typescript
const session = {
  id: 'session-456',
  userId: 'user-123',
  questionId: 'q-1',
  questionTitle: 'Two Sum',
  category: 'arrays',
  difficulty: 'easy',
  startTime: new Date(Date.now() - 45 * 60 * 1000),
  endTime: new Date(),
  duration: 2700,
  rating: 4,
  perceivedDifficulty: 'medium',
  notes: 'Good practice session',
  pressureModeUsed: false,
};

try {
  StorageService.saveSession(session);
  console.log('Session saved successfully');
} catch (error) {
  if (error instanceof StorageError) {
    console.error('Failed to save session:', error.message);
  }
}
```

#### `getSessions(userId: string): CompletedSession[]`

Retrieves all sessions for a user from localStorage.

**Parameters:**
- `userId`: The ID of the user whose sessions to retrieve

**Returns:**
- Array of `CompletedSession` objects (empty array if none found)

**Example:**
```typescript
const sessions = StorageService.getSessions('user-123');

console.log(`Found ${sessions.length} sessions`);

sessions.forEach(session => {
  console.log(`${session.questionTitle} - Rating: ${session.rating}/5`);
});
```

### Streak Management

#### `updateStreak(userId: string, streak: number): void`

Updates a user's streak count.

**Parameters:**
- `userId`: The ID of the user
- `streak`: The new streak value (must be non-negative)

**Throws:**
- `StorageError` if localStorage is unavailable
- `StorageError` if streak value is invalid (negative)
- `StorageError` if storage quota is exceeded

**Example:**
```typescript
try {
  // Increment streak
  const currentStreak = StorageService.getStreak('user-123');
  StorageService.updateStreak('user-123', currentStreak + 1);
  
  // Reset streak
  StorageService.updateStreak('user-123', 0);
} catch (error) {
  if (error instanceof StorageError) {
    console.error('Failed to update streak:', error.message);
  }
}
```

#### `getStreak(userId: string): number`

Retrieves a user's streak count.

**Parameters:**
- `userId`: The ID of the user

**Returns:**
- Streak count (defaults to 0 if not found or invalid)

**Example:**
```typescript
const streak = StorageService.getStreak('user-123');
console.log(`Current streak: ${streak} days 🔥`);
```

### Utility Methods

#### `clearAll(): void`

Clears all Interview Buddy data from localStorage.

**Throws:**
- `StorageError` if localStorage is unavailable

**Example:**
```typescript
try {
  StorageService.clearAll();
  console.log('All data cleared');
} catch (error) {
  if (error instanceof StorageError) {
    console.error('Failed to clear storage:', error.message);
  }
}
```

## Error Handling

The `StorageService` uses a custom `StorageError` class for all error conditions:

```typescript
try {
  StorageService.saveUser(user);
} catch (error) {
  if (error instanceof StorageError) {
    // Handle storage-specific errors
    console.error('Storage error:', error.message);
    
    // Check the cause for more details
    if (error.cause instanceof DOMException) {
      if (error.cause.name === 'QuotaExceededError') {
        // Handle quota exceeded
        alert('Storage is full. Please clear old data.');
      }
    }
  } else {
    // Handle unexpected errors
    console.error('Unexpected error:', error);
  }
}
```

## Common Error Scenarios

### 1. localStorage Unavailable

This can happen in:
- Private browsing mode (some browsers)
- Browser settings that disable storage
- Server-side rendering (Next.js)

**Solution**: The service gracefully handles this by returning defaults (null, empty arrays, 0) for read operations and throwing `StorageError` for write operations.

### 2. Quota Exceeded

When localStorage reaches its limit (typically 5-10MB).

**Solution**: The service throws a `StorageError` with a clear message. Implement cleanup logic or prompt users to clear old data.

### 3. Corrupted Data

If stored data becomes corrupted or invalid.

**Solution**: The service validates data on load and returns defaults if validation fails, logging warnings to the console.

## Data Validation

The service validates data structure before saving and after loading:

### User Validation
- `id` must be a string
- `email` must be a string
- `plan` must be 'basic', 'premium', or 'pro'
- `streak` must be a number
- `streakFreezeUsed` must be a boolean

### Session Validation
- All required fields must be present
- `rating` must be a number between 1 and 5
- `difficulty` must be a valid difficulty level
- `notes` must be a string
- `pressureModeUsed` must be a boolean

## Testing

To test the StorageService:

1. **Browser Testing**: Navigate to `/test-storage` in your browser to run the automated test suite
2. **Manual Testing**: Use the browser console to interact with the service directly
3. **Unit Testing**: Import the test helpers from `services/__tests__/StorageService.manual.test.ts`

## Best Practices

1. **Always wrap write operations in try-catch blocks**
   ```typescript
   try {
     StorageService.saveUser(user);
   } catch (error) {
     // Handle error
   }
   ```

2. **Check for null when reading users**
   ```typescript
   const user = StorageService.getUser(userId);
   if (!user) {
     // Handle missing user
   }
   ```

3. **Use default values for arrays and numbers**
   ```typescript
   const sessions = StorageService.getSessions(userId); // Always returns array
   const streak = StorageService.getStreak(userId); // Always returns number
   ```

4. **Handle quota exceeded errors gracefully**
   ```typescript
   try {
     StorageService.saveSession(session);
   } catch (error) {
     if (error instanceof StorageError && error.message.includes('quota')) {
       // Prompt user to clear old data
       // Or implement automatic cleanup
     }
   }
   ```

## Requirements Satisfied

This implementation satisfies the following requirements:

- **4.5**: Session data storage with timestamp, rating, difficulty, and notes
- **5.1**: Streak initialization and storage
- **5.4**: Streak display on dashboard (via getStreak)
- **13.1**: Session history storage with all required fields

## Storage Keys

The service uses the following localStorage keys:

- `interview_buddy_users`: Stores all user data
- `interview_buddy_sessions`: Stores all session data
- `interview_buddy_streaks`: Stores all streak data

## Performance Considerations

- Data is stored as JSON strings and parsed on each read
- For large session histories, consider implementing pagination
- The service validates all data on read, which has a small performance cost
- Consider implementing a caching layer for frequently accessed data

## Future Enhancements

Potential improvements for future versions:

1. **Compression**: Compress data before storing to save space
2. **Encryption**: Encrypt sensitive user data
3. **Migration**: Add version tracking and data migration support
4. **Indexing**: Implement efficient querying for large datasets
5. **Sync**: Add cloud sync capabilities for cross-device access
