'use client';

/**
 * UpgradePrompt Component
 * Displays upgrade prompt for Basic users highlighting locked features
 * 
 * Requirements:
 * - 6.5: Display upgrade prompt for gated features
 * - 15.1: Display upgrade prompts on gated features
 * - 15.2: Provide clear upgrade button on Dashboard
 */

import React from 'react';
import Link from 'next/link';

export function UpgradePrompt() {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl border-2 border-blue-700/50 p-6 backdrop-blur-sm">
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>

        {/* Heading */}
        <h3 className="text-xl font-bold text-slate-100 mb-2">
          Unlock Premium Features
        </h3>
        <p className="text-slate-300 mb-6 max-w-md">
          Upgrade to Premium or Pro to access unlimited interviews, advanced analytics, and more
        </p>

        {/* Locked Features List */}
        <div className="w-full max-w-md mb-6">
          <div className="bg-slate-800/50 rounded-lg p-4 space-y-3 border border-slate-700">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 text-slate-500 mt-0.5">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-slate-200">Unlimited Interviews</p>
                <p className="text-xs text-slate-400">Practice as much as you want</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 text-slate-500 mt-0.5">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-slate-200">Performance Analytics</p>
                <p className="text-xs text-slate-400">Track your progress over time</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 text-slate-500 mt-0.5">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-slate-200">Full Session History</p>
                <p className="text-xs text-slate-400">Access all your past sessions</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 text-slate-500 mt-0.5">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-slate-200">30+ Questions</p>
                <p className="text-xs text-slate-400">Double your practice variety</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="/pricing"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          View Pricing Plans
        </Link>

        {/* Additional Info */}
        <p className="text-xs text-slate-400 mt-4">
          Starting at just $9/month
        </p>
      </div>
    </div>
  );
}
