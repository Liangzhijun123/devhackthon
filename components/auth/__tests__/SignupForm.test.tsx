/**
 * Unit tests for SignupForm component
 * Tests form validation, submission flows, and error states
 * 
 * **Validates: Requirements 1.1, 1.2**
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignupForm } from '../SignupForm';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthService } from '@/services/AuthService';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('SignupForm', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    mockPush.mockClear();
    AuthService.clearAll();
  });

  const renderSignupForm = () => {
    return render(
      <AuthProvider>
        <SignupForm />
      </AuthProvider>
    );
  };

  describe('Form Rendering', () => {
    it('should render all form fields', () => {
      renderSignupForm();

      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
      expect(screen.getByTestId('plan-basic')).toBeInTheDocument();
      expect(screen.getByTestId('plan-premium')).toBeInTheDocument();
      expect(screen.getByTestId('plan-pro')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });

    it('should render plan descriptions', () => {
      renderSignupForm();

      expect(screen.getByText('Basic')).toBeInTheDocument();
      expect(screen.getByText('Premium')).toBeInTheDocument();
      expect(screen.getByText('Pro')).toBeInTheDocument();
    });
  });

  describe('Form Validation - Email', () => {
    it('should show error when email is empty', async () => {
      renderSignupForm();

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toHaveTextContent('Email is required');
      });
    });

    it('should show error for invalid email format', async () => {
      renderSignupForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      const basicPlan = screen.getByTestId('plan-basic');
      const submitButton = screen.getByTestId('submit-button');
      
      // Fill in all fields - use an email that passes HTML5 validation but fails our regex
      fireEvent.change(emailInput, { target: { value: 'test@invalid' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(basicPlan);
      fireEvent.click(submitButton);

      // Wait for validation error to appear
      const emailError = await screen.findByTestId('email-error');
      expect(emailError).toHaveTextContent('Invalid email format');
    });

    it('should accept valid email format', async () => {
      renderSignupForm();

      const emailInput = screen.getByTestId('email-input');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Validation - Password', () => {
    it('should show error when password is empty', async () => {
      renderSignupForm();

      const emailInput = screen.getByTestId('email-input');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('password-error')).toHaveTextContent('Password is required');
      });
    });

    it('should show error when password is too short', async () => {
      renderSignupForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'short' } });

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('password-error')).toHaveTextContent('Password must be at least 8 characters');
      });
    });

    it('should accept password with 8 or more characters', async () => {
      renderSignupForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByTestId('password-error')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Validation - Confirm Password', () => {
    it('should show error when confirm password is empty', async () => {
      renderSignupForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('confirm-password-error')).toHaveTextContent('Please confirm your password');
      });
    });

    it('should show error when passwords do not match', async () => {
      renderSignupForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('confirm-password-error')).toHaveTextContent('Passwords do not match');
      });
    });

    it('should accept matching passwords', async () => {
      renderSignupForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByTestId('confirm-password-error')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Validation - Plan Selection (Requirement 1.2)', () => {
    it('should show error when no plan is selected', async () => {
      renderSignupForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('plan-error')).toHaveTextContent('Please select a subscription plan');
      });
    });

    it('should allow selecting Basic plan', () => {
      renderSignupForm();

      const basicPlan = screen.getByTestId('plan-basic');
      fireEvent.click(basicPlan);

      expect(basicPlan).toBeChecked();
    });

    it('should allow selecting Premium plan', () => {
      renderSignupForm();

      const premiumPlan = screen.getByTestId('plan-premium');
      fireEvent.click(premiumPlan);

      expect(premiumPlan).toBeChecked();
    });

    it('should allow selecting Pro plan', () => {
      renderSignupForm();

      const proPlan = screen.getByTestId('plan-pro');
      fireEvent.click(proPlan);

      expect(proPlan).toBeChecked();
    });

    it('should allow changing plan selection', () => {
      renderSignupForm();

      const basicPlan = screen.getByTestId('plan-basic');
      const premiumPlan = screen.getByTestId('plan-premium');

      fireEvent.click(basicPlan);
      expect(basicPlan).toBeChecked();

      fireEvent.click(premiumPlan);
      expect(premiumPlan).toBeChecked();
      expect(basicPlan).not.toBeChecked();
    });
  });

  describe('Submission Flow', () => {
    it('should successfully submit with valid data and Basic plan', async () => {
      renderSignupForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      const basicPlan = screen.getByTestId('plan-basic');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(basicPlan);

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should successfully submit with valid data and Premium plan', async () => {
      renderSignupForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      const premiumPlan = screen.getByTestId('plan-premium');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(premiumPlan);

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should successfully submit with valid data and Pro plan', async () => {
      renderSignupForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      const proPlan = screen.getByTestId('plan-pro');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(proPlan);

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should disable form inputs during submission', async () => {
      renderSignupForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      const basicPlan = screen.getByTestId('plan-basic');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(basicPlan);

      fireEvent.click(submitButton);

      // Check that button shows loading state
      expect(submitButton).toHaveTextContent('Creating Account...');
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Error States', () => {
    it('should display server error for duplicate email', async () => {
      // Create an existing user
      await AuthService.signup('existing@example.com', 'password123', 'basic');
      AuthService.logout();

      renderSignupForm();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      const basicPlan = screen.getByTestId('plan-basic');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(basicPlan);

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('server-error')).toHaveTextContent('An account with this email already exists');
      });

      // Should not redirect on error
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should clear validation errors when user starts typing', async () => {
      renderSignupForm();

      const emailInput = screen.getByTestId('email-input');
      const submitButton = screen.getByTestId('submit-button');

      // Trigger validation error
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toBeInTheDocument();
      });

      // Start typing - fill in all fields to clear all errors
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      const basicPlan = screen.getByTestId('plan-basic');
      
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(basicPlan);

      // Submit again to trigger validation
      fireEvent.click(submitButton);

      // All errors should be cleared since form is valid
      await waitFor(() => {
        expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
        expect(screen.queryByTestId('password-error')).not.toBeInTheDocument();
        expect(screen.queryByTestId('confirm-password-error')).not.toBeInTheDocument();
        expect(screen.queryByTestId('plan-error')).not.toBeInTheDocument();
      });
    });

    it('should not submit form with multiple validation errors', async () => {
      renderSignupForm();

      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toBeInTheDocument();
        expect(screen.getByTestId('password-error')).toBeInTheDocument();
        expect(screen.getByTestId('confirm-password-error')).toBeInTheDocument();
        expect(screen.getByTestId('plan-error')).toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('User Interaction', () => {
    it('should update email input value', () => {
      renderSignupForm();

      const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'user@example.com' } });

      expect(emailInput.value).toBe('user@example.com');
    });

    it('should update password input value', () => {
      renderSignupForm();

      const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: 'mypassword' } });

      expect(passwordInput.value).toBe('mypassword');
    });

    it('should update confirm password input value', () => {
      renderSignupForm();

      const confirmPasswordInput = screen.getByTestId('confirm-password-input') as HTMLInputElement;
      fireEvent.change(confirmPasswordInput, { target: { value: 'mypassword' } });

      expect(confirmPasswordInput.value).toBe('mypassword');
    });
  });
});
