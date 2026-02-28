# AuthService

Mock authentication service for the Interview Buddy Platform. Handles user signup, login, logout, and plan management using localStorage for persistence.

## Features

- **User Signup**: Create new accounts with email, password, and plan selection
- **User Login**: Authenticate users with email and password
- **Plan Management**: Update user subscription plans
- **Trial Management**: Automatically activate 30-day trials for Basic plan users
- **Session Management**: Track currently logged-in user
- **Mock Password Hashing**: Simple password hashing for demonstration purposes

## Usage

### Sign Up

```typescript
import { AuthService } from '@/services/AuthService';

try {
  const user = await AuthService.signup(
    'user@example.com',
    'password123',
    'basic'
  );
  console.log('User created:', user);
} catch (error) {
  if (error instanceof AuthError) {
    console.error('Signup failed:', error.message);
  }
}
```

### Log In

```typescript
try {
  const user = await AuthService.login(
    'user@example.com',
    'password123'
  );
  console.log('Logged in:', user);
} catch (error) {
  if (error instanceof AuthError) {
    console.error('Login failed:', error.message);
  }
}
```

### Get Current User

```typescript
const currentUser = AuthService.getCurrentUser();
if (currentUser) {
  console.log('Current user:', currentUser);
} else {
  console.log('No user logged in');
}
```

### Log Out

```typescript
AuthService.logout();
```

### Update Plan

```typescript
try {
  const updatedUser = await AuthService.updatePlan(userId, 'premium');
  console.log('Plan updated:', updatedUser);
} catch (error) {
  if (error instanceof AuthError) {
    console.error('Update failed:', error.message);
  }
}
```

### Check Trial Status

```typescript
const user = AuthService.getCurrentUser();
if (user && AuthService.isTrialExpired(user)) {
  console.log('Trial has expired');
}
```

## API Reference

### `signup(email: string, password: string, plan: Plan): Promise<User>`

Creates a new user account.

**Parameters:**
- `email`: User's email address (must be valid format)
- `password`: User's password (minimum 8 characters)
- `plan`: Subscription plan ('basic', 'premium', or 'pro')

**Returns:** Promise resolving to the created User object

**Throws:**
- `AuthError` with code `INVALID_EMAIL` if email format is invalid
- `AuthError` with code `WEAK_PASSWORD` if password is too short
- `AuthError` with code `INVALID_PLAN` if plan is not valid
- `AuthError` with code `DUPLICATE_EMAIL` if email already exists

**Behavior:**
- Basic plan users get a 30-day trial (trialEndsAt set to 30 days from now)
- Premium and Pro users have no trial period (trialEndsAt is null)
- New users start with streak = 0
- User is automatically logged in after signup

### `login(email: string, password: string): Promise<User>`

Authenticates a user with email and password.

**Parameters:**
- `email`: User's email address
- `password`: User's password

**Returns:** Promise resolving to the User object

**Throws:**
- `AuthError` with code `INVALID_CREDENTIALS` if email or password is incorrect

**Behavior:**
- User is set as the current logged-in user
- Returns user with Date objects properly converted

### `logout(): void`

Logs out the current user.

**Behavior:**
- Removes current user session from localStorage
- Does not delete user data or password

### `getCurrentUser(): User | null`

Gets the currently logged-in user.

**Returns:** User object if logged in, null otherwise

**Behavior:**
- Retrieves user from StorageService
- Returns null if no user is logged in or user data is invalid

### `updatePlan(userId: string, newPlan: Plan): Promise<User>`

Updates a user's subscription plan.

**Parameters:**
- `userId`: ID of the user to update
- `newPlan`: New subscription plan ('basic', 'premium', or 'pro')

**Returns:** Promise resolving to the updated User object

**Throws:**
- `AuthError` with code `INVALID_PLAN` if plan is not valid
- `AuthError` with code `USER_NOT_FOUND` if user doesn't exist

**Behavior:**
- Downgrading to Basic plan activates a new 30-day trial
- Upgrading to Premium or Pro clears trial end date
- Changes take effect immediately

### `isTrialExpired(user: User): boolean`

Checks if a user's trial period has expired.

**Parameters:**
- `user`: User object to check

**Returns:** true if trial has expired, false otherwise

**Behavior:**
- Returns false for Premium and Pro users (no trial)
- Returns false if trial end date hasn't been reached
- Returns true if current date is past trial end date

### `clearAll(): void`

Clears all authentication data from localStorage.

**Behavior:**
- Removes password hashes
- Removes current user session
- Does not remove user data or sessions (use StorageService.clearAll() for that)
- Useful for testing and demo resets

## Error Handling

All authentication errors throw `AuthError` with descriptive messages and error codes:

```typescript
try {
  await AuthService.signup(email, password, plan);
} catch (error) {
  if (error instanceof AuthError) {
    switch (error.code) {
      case 'INVALID_EMAIL':
        // Handle invalid email
        break;
      case 'WEAK_PASSWORD':
        // Handle weak password
        break;
      case 'DUPLICATE_EMAIL':
        // Handle duplicate email
        break;
      case 'INVALID_PLAN':
        // Handle invalid plan
        break;
      default:
        // Handle other errors
    }
  }
}
```

## Security Notes

⚠️ **This is a mock authentication service for demonstration purposes only.**

- Passwords are "hashed" with a simple prefix (not secure)
- No rate limiting or brute force protection
- No email verification
- No password reset functionality
- All data stored in localStorage (client-side only)

**For production use:**
- Implement proper password hashing (bcrypt, argon2)
- Use a real backend API with secure authentication
- Implement JWT or session-based authentication
- Add rate limiting and security measures
- Use HTTPS for all communications
- Implement proper password reset flows

## Data Storage

The AuthService uses localStorage with the following keys:

- `interview_buddy_passwords`: Password hashes (email → hash mapping)
- `interview_buddy_current_user`: Current logged-in user ID
- `interview_buddy_users`: User data (managed by StorageService)

## Requirements Validation

This service implements the following requirements:

- **1.1**: Email and password authentication
- **1.2**: Plan selection during signup (Basic, Premium, Pro)
- **1.3**: 30-day trial activation for Basic plan
- **1.4**: Plan type storage in user profile
- **15.4**: Plan upgrade functionality

## Testing

See `services/__tests__/AuthService.test.ts` for unit tests and property-based tests.

Key test scenarios:
- Valid signup with all plan types
- Duplicate email rejection
- Invalid email/password validation
- Login with correct/incorrect credentials
- Plan updates and trial management
- Current user retrieval
- Trial expiration checking
