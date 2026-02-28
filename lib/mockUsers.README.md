# Mock User Data Generator

This module provides utilities for generating sample user data for testing and demo purposes in the Interview Buddy Platform.

## Overview

The mock user generator creates realistic user profiles with different subscription plans (Basic, Premium, Pro) and various trial states. This is essential for:

- **Testing**: Verify feature gating and plan-specific functionality
- **Demo Mode**: Pre-populate the application with sample data for showcasing
- **Development**: Quickly create test users without manual data entry

## Core Functions

### `generateMockUser(plan, overrides?)`

Generate a single mock user with the specified plan.

```typescript
import { generateMockUser } from '@/lib/mockUsers';

// Generate a basic user
const basicUser = generateMockUser('basic');

// Generate with custom properties
const customUser = generateMockUser('premium', {
  email: 'custom@example.com',
  streak: 15,
  lastSessionDate: new Date(),
});
```

**Parameters:**
- `plan`: `'basic' | 'premium' | 'pro'` - The subscription plan
- `overrides?`: `Partial<User>` - Optional properties to override defaults

**Returns:** `User` object with all required fields

### Specialized User Generators

#### `generateBasicUserWithActiveTrial()`
Creates a Basic plan user with an active 30-day trial (created 10 days ago).

```typescript
const user = generateBasicUserWithActiveTrial();
// user.trialEndsAt will be in the future
```

#### `generateBasicUserWithExpiredTrial()`
Creates a Basic plan user with an expired trial (created 40 days ago).

```typescript
const user = generateBasicUserWithExpiredTrial();
// user.trialEndsAt will be in the past
```

#### `generatePremiumUser()`
Creates a Premium plan user with an active streak.

```typescript
const user = generatePremiumUser();
// user.plan === 'premium'
// user.trialEndsAt === null
```

#### `generateProUser()`
Creates a Pro plan user with an active streak and available freeze.

```typescript
const user = generateProUser();
// user.plan === 'pro'
// user.streakFreezeUsed === false
```

#### `generateProUserWithUsedFreeze()`
Creates a Pro plan user who has already used their weekly streak freeze.

```typescript
const user = generateProUserWithUsedFreeze();
// user.streakFreezeUsed === true
```

#### `generateNewUser(plan?)`
Creates a brand new user with no activity (zero streak, no sessions).

```typescript
const newUser = generateNewUser('basic');
// newUser.streak === 0
// newUser.lastSessionDate === null
```

### Bulk Generation

#### `generateMockUsers(count)`
Generate multiple users with varied plans and states.

```typescript
const users = generateMockUsers(10);
// Returns array of 10 users with mixed plans and random streaks
```

**Parameters:**
- `count`: `number` - Number of users to generate (default: 5)

**Returns:** `User[]` - Array of generated users

## Pre-defined Demo Users

The module exports a `demoUsers` object with pre-configured users for consistent testing:

```typescript
import { demoUsers } from '@/lib/mockUsers';

// Access specific demo users
const basicUser = demoUsers.basicActiveTrial;
const expiredUser = demoUsers.basicExpiredTrial;
const premiumUser = demoUsers.premium;
const proUser = demoUsers.pro;
const proWithFreeze = demoUsers.proWithFreeze;
const newBasic = demoUsers.newBasic;
const newPremium = demoUsers.newPremium;
const newPro = demoUsers.newPro;
```

### Demo User Profiles

| Key | Plan | Trial Status | Streak | Freeze Used | Last Session |
|-----|------|--------------|--------|-------------|--------------|
| `basicActiveTrial` | Basic | Active (20 days left) | 5 | N/A | Yesterday |
| `basicExpiredTrial` | Basic | Expired | 0 | N/A | 5 days ago |
| `premium` | Premium | N/A | 15 | N/A | Yesterday |
| `pro` | Pro | N/A | 30 | No | Yesterday |
| `proWithFreeze` | Pro | N/A | 25 | Yes | Yesterday |
| `newBasic` | Basic | Active (30 days) | 0 | N/A | Never |
| `newPremium` | Premium | N/A | 0 | N/A | Never |
| `newPro` | Pro | N/A | 0 | No | Never |

## Demo Data Initialization

### `initializeDemoData()`
Pre-populate localStorage with demo users on first app load.

```typescript
import { initializeDemoData } from '@/lib/mockUsers';

// Call this in your app initialization (e.g., in a useEffect)
useEffect(() => {
  initializeDemoData();
}, []);
```

**Behavior:**
- Checks if demo data has already been initialized
- Stores all demo users in localStorage
- Sets a flag to prevent re-initialization
- Safe to call multiple times (idempotent)

### `resetDemoData()`
Clear and re-initialize all demo data.

```typescript
import { resetDemoData } from '@/lib/mockUsers';

// Useful for "Reset Demo" button in profile settings
const handleReset = () => {
  resetDemoData();
  window.location.reload();
};
```

## Usage Examples

### Testing Feature Gating

```typescript
import { generateBasicUserWithExpiredTrial, generateProUser } from '@/lib/mockUsers';

describe('Analytics Dashboard', () => {
  it('should show upgrade prompt for expired basic users', () => {
    const user = generateBasicUserWithExpiredTrial();
    // Test that analytics are blocked
  });

  it('should show full analytics for pro users', () => {
    const user = generateProUser();
    // Test that all analytics features are accessible
  });
});
```

### Testing Streak Logic

```typescript
import { generateMockUser } from '@/lib/mockUsers';

describe('Streak Calculation', () => {
  it('should reset streak after missed day', () => {
    const user = generateMockUser('basic', {
      streak: 10,
      lastSessionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    });
    
    // Test streak reset logic
  });
});
```

### Demo Mode Setup

```typescript
// In your root layout or app initialization
import { initializeDemoData } from '@/lib/mockUsers';

export default function RootLayout({ children }) {
  useEffect(() => {
    // Initialize demo data on first load
    initializeDemoData();
  }, []);

  return <html>{children}</html>;
}
```

## Implementation Details

### Trial Date Calculation

For Basic plan users, the trial end date is automatically calculated as 30 days from the `createdAt` date:

```typescript
trialEndsAt = new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000);
```

### Unique ID Generation

User IDs are generated using a combination of timestamp and random string:

```typescript
id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
```

This ensures uniqueness across multiple generations.

### Email Generation

Random emails are generated using the pattern:

```typescript
email = `user-${randomString}@example.com`;
```

## Requirements Validation

This mock user generator supports testing for the following requirements:

- **Requirement 1.1**: User authentication (provides test users)
- **Requirement 1.2**: Plan selection (generates users with all plan types)
- **Requirement 1.3**: 30-day trial activation (calculates trial dates correctly)
- **Requirement 1.4**: Plan persistence (stores plan in user profile)
- **Requirement 1.5**: Trial expiration (generates expired trial users)
- **Requirement 5.1**: Streak initialization (new users start with 0 streak)
- **Requirement 5.5**: Streak freeze (Pro users have freeze tracking)

## Testing

The mock user generator includes comprehensive unit tests covering:

- ✅ Basic user generation with trial dates
- ✅ Premium/Pro user generation without trials
- ✅ Override functionality
- ✅ Trial date calculation accuracy
- ✅ Specialized user generators
- ✅ Bulk generation with variety
- ✅ Demo user profiles
- ✅ Unique ID generation
- ✅ Edge cases

Run tests with:

```bash
npm test -- lib/__tests__/mockUsers.test.ts
```

## Best Practices

1. **Use specialized generators** for specific test scenarios rather than manually creating users
2. **Use `demoUsers`** for consistent, repeatable tests
3. **Call `initializeDemoData()`** once during app initialization for demo mode
4. **Use `resetDemoData()`** to provide a "Reset Demo" feature for users
5. **Override specific properties** when you need custom test cases

## Future Enhancements

Potential improvements for future iterations:

- Generate mock session history for users
- Add more realistic email patterns
- Support for custom trial durations
- Generate users with specific streak patterns
- Export/import demo data as JSON
