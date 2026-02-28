'use client';

/**
 * LoginForm Component
 * Handles user login with email and password
 * 
 * **Validates: Requirements 1.1**
 */

import React, { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const { login, loading, error } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Default credentials for demo
  const demoAccounts = [
    { email: 'basic@demo.com', password: 'demo123', plan: 'Basic' },
    { email: 'premium@demo.com', password: 'demo123', plan: 'Premium' },
    { email: 'pro@demo.com', password: 'demo123', plan: 'Pro' },
  ];

  /**
   * Quick login with demo account
   */
  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    try {
      await login(demoEmail, demoPassword);
      router.push('/dashboard');
    } catch (err) {
      console.error('Demo login failed:', err);
    }
  };

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
      await login(email, password);
      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by AuthContext
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Demo Accounts Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Quick Demo Login</h3>
        <div className="grid grid-cols-1 gap-2">
          {demoAccounts.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => handleDemoLogin(account.email, account.password)}
              className="flex items-center justify-between px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg transition-all text-left group"
              disabled={loading}
            >
              <div>
                <div className="text-sm font-medium text-slate-100">{account.plan} Account</div>
                <div className="text-xs text-slate-400">{account.email}</div>
              </div>
              <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-slate-900 text-slate-400">Or login with credentials</span>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
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
            className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-800/50 px-3 py-2 text-slate-100 placeholder-slate-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={loading}
            data-testid="email-input"
            placeholder="your@email.com"
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-400" data-testid="email-error">
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
            className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-800/50 px-3 py-2 text-slate-100 placeholder-slate-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={loading}
            data-testid="password-input"
            placeholder="••••••••"
          />
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-400" data-testid="password-error">
              {validationErrors.password}
            </p>
          )}
        </div>

        {/* Server Error Display */}
        {error && (
          <div className="rounded-md bg-red-900/50 border border-red-700 p-4" data-testid="server-error">
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          data-testid="submit-button"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}
