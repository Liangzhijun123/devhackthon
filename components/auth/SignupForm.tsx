'use client';

/**
 * SignupForm Component
 * Handles user registration with email, password, and plan selection
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3**
 */

import React, { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Plan } from '@/types';
import { useRouter } from 'next/navigation';

export function SignupForm() {
  const router = useRouter();
  const { signup, loading, error } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<Plan | ''>('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  /**
   * Validate form inputs
   */
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Email validation
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Plan validation (Requirement 1.2)
    if (!selectedPlan) {
      errors.plan = 'Please select a subscription plan';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      await signup(email, password, selectedPlan as Plan);
      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by AuthContext
      console.error('Signup failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="signup-form">
      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-200">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={loading}
          data-testid="email-input"
        />
        {validationErrors.email && (
          <p className="mt-1 text-sm text-red-600" data-testid="email-error">
            {validationErrors.email}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-200">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={loading}
          data-testid="password-input"
        />
        {validationErrors.password && (
          <p className="mt-1 text-sm text-red-600" data-testid="password-error">
            {validationErrors.password}
          </p>
        )}
      </div>

      {/* Confirm Password Input */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={loading}
          data-testid="confirm-password-input"
        />
        {validationErrors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600" data-testid="confirm-password-error">
            {validationErrors.confirmPassword}
          </p>
        )}
      </div>

      {/* Plan Selection (Requirement 1.2) */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">
          Select Plan
        </label>
        <div className="space-y-3">
          {/* Basic Plan */}
          <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="plan"
              value="basic"
              checked={selectedPlan === 'basic'}
              onChange={(e) => setSelectedPlan(e.target.value as Plan)}
              className="mt-1 mr-3"
              disabled={loading}
              data-testid="plan-basic"
            />
            <div>
              <div className="font-medium">Basic</div>
              <div className="text-sm text-slate-400">30-day free trial, 3 interviews/week</div>
            </div>
          </label>

          {/* Premium Plan */}
          <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="plan"
              value="premium"
              checked={selectedPlan === 'premium'}
              onChange={(e) => setSelectedPlan(e.target.value as Plan)}
              className="mt-1 mr-3"
              disabled={loading}
              data-testid="plan-premium"
            />
            <div>
              <div className="font-medium">Premium</div>
              <div className="text-sm text-slate-400">Unlimited interviews, analytics dashboard</div>
            </div>
          </label>

          {/* Pro Plan */}
          <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="plan"
              value="pro"
              checked={selectedPlan === 'pro'}
              onChange={(e) => setSelectedPlan(e.target.value as Plan)}
              className="mt-1 mr-3"
              disabled={loading}
              data-testid="plan-pro"
            />
            <div>
              <div className="font-medium">Pro</div>
              <div className="text-sm text-slate-400">All Premium features + Pressure Mode + Readiness Score</div>
            </div>
          </label>
        </div>
        {validationErrors.plan && (
          <p className="mt-2 text-sm text-red-600" data-testid="plan-error">
            {validationErrors.plan}
          </p>
        )}
      </div>

      {/* Server Error Display */}
      {error && (
        <div className="rounded-md bg-red-50 p-4" data-testid="server-error">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid="submit-button"
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  );
}
