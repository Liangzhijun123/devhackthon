/**
 * Unit tests for LoginForm component
 * Tests form validation, submission flows, and error states
 * 
 * **Validates: Requirements 1.1**
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../LoginForm';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthService } from '@/services/AuthService';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    mockPush.mockClear();
    AuthService.clearAll();
  });

  const renderLoginForm = () => {
    return render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
  };

  describe('Form Rendering', () => {
    it('should render all form fields', () => {
      renderLoginForm();

      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });

    it('should render email and password labels', () => {
      renderLoginForm();

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('should render submit button with correct text', () => {
      renderLoginForm();

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toHaveTextContent('Log In');
    });
  });

  describe('Form Validation - Email', () => {
    it('should show error when email is empty', async () => {
      renderLoginForm();

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toHaveTextContent('Email is required');
      });
    });

    it('should show error for invalid email format', async () => {
      renderLoginForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      
      // Use an email that passes HTML5 validation but fails our regex
      fireEvent.change(emailInput, { target: { value: 'test@invalid' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      const emailError = await screen.findByTestId('email-error');
      expect(emailError).toHaveTextContent('Invalid email format');
    });

    it('should accept valid email format', async () => {
      renderLoginForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password' } });

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
      });
    });

    it('should validate various email formats', async () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user123@test-domain.com',
      ];

      for (const email of validEmails) {
        const { unmount } = renderLoginForm();

        const emailInput = screen.getByTestId('email-input');
        const passwordInput = screen.getByTestId('password-input');
        
        fireEvent.change(emailInput, { target: { value: email } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        const submitButton = screen.getByTestId('submit-button');
        fireEvent.click(submitButton);

        await waitFor(() => {
          expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
        });

        // Clean up for next iteration
        unmount();
        localStorage.clear();
      }
    });
  });

  describe('Form Validation - Password', () => {
    it('should show error when password is empty', async () => {
      renderLoginForm();

      const emailInput = screen.getByTestId('email-input');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('password-error')).toHaveTextContent('Password is required');
      });
    });

    it('should accept any non-empty password', async () => {
      renderLoginForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'pass' } });

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByTestId('password-error')).not.toBeInTheDocument();
      });
    });
  });

  describe('Submission Flow', () => {
    beforeEach(async () => {
      // Create a test user before login tests
      await AuthService.signup('test@example.com', 'password123', 'basic');
      AuthService.logout();
    });

    it('should successfully login with correct credentials', async () => {
      renderLoginForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should disable form inputs during submission', async () => {
      renderLoginForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      fireEvent.click(submitButton);

      // Check that button shows loading state
      expect(submitButton).toHaveTextContent('Logging in...');
      expect(submitButton).toBeDisabled();
    });

    it('should not submit form with validation errors', async () => {
      renderLoginForm();

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toBeInTheDocument();
        expect(screen.getByTestId('password-error')).toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('Error States', () => {
    beforeEach(async () => {
      // Create a test user
      await AuthService.signup('test@example.com', 'password123', 'basic');
      AuthService.logout();
    });

    it('should display error for incorrect password', async () => {
      renderLoginForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('server-error')).toHaveTextContent('Invalid email or password');
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should display error for non-existent user', async () => {
      renderLoginForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'nonexistent@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('server-error')).toHaveTextContent('Invalid email or password');
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should not reveal whether email or password is incorrect', async () => {
      renderLoginForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');

      // Test with wrong email
      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage1 = screen.getByTestId('server-error').textContent;
        expect(errorMessage1).toBe('Invalid email or password');
      });

      // Clear and test with wrong password
      localStorage.clear();
      await AuthService.signup('test@example.com', 'password123', 'basic');
      AuthService.logout();

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage2 = screen.getByTestId('server-error').textContent;
        expect(errorMessage2).toBe('Invalid email or password');
      });
    });

    it('should clear validation errors on new submission attempt', async () => {
      renderLoginForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');

      // First submission with empty fields
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toBeInTheDocument();
      });

      // Fill in fields and submit again
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      // Validation errors should be cleared
      await waitFor(() => {
        expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
        expect(screen.queryByTestId('password-error')).not.toBeInTheDocument();
      });
    });
  });

  describe('User Interaction', () => {
    it('should update email input value', () => {
      renderLoginForm();

      const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'user@example.com' } });

      expect(emailInput.value).toBe('user@example.com');
    });

    it('should update password input value', () => {
      renderLoginForm();

      const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: 'mypassword' } });

      expect(passwordInput.value).toBe('mypassword');
    });

    it('should mask password input', () => {
      renderLoginForm();

      const passwordInput = screen.getByTestId('password-input');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should allow form submission with Enter key', async () => {
      // Create a test user
      await AuthService.signup('test@example.com', 'password123', 'basic');
      AuthService.logout();

      renderLoginForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      // Submit form with Enter key
      fireEvent.submit(screen.getByTestId('login-form'));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for form inputs', () => {
      renderLoginForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');

      expect(emailInput).toHaveAttribute('id', 'email');
      expect(passwordInput).toHaveAttribute('id', 'password');
      expect(screen.getByLabelText('Email')).toBe(emailInput);
      expect(screen.getByLabelText('Password')).toBe(passwordInput);
    });

    it('should disable inputs when loading', async () => {
      // Create a test user
      await AuthService.signup('test@example.com', 'password123', 'basic');
      AuthService.logout();

      renderLoginForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      fireEvent.click(submitButton);

      // Inputs should be disabled during submission
      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
    });
  });

  describe('Integration with AuthContext', () => {
    it('should use AuthContext for login', async () => {
      // Create a test user
      await AuthService.signup('test@example.com', 'password123', 'premium');
      AuthService.logout();

      renderLoginForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });

      // Verify user is logged in
      const currentUser = AuthService.getCurrentUser();
      expect(currentUser).not.toBeNull();
      expect(currentUser?.email).toBe('test@example.com');
      expect(currentUser?.plan).toBe('premium');
    });
  });
});
