'use client';

import { AppLayout } from "@/components/layouts/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const planColors = {
    basic: 'from-slate-600 to-slate-700',
    premium: 'from-blue-600 to-indigo-600',
    pro: 'from-purple-600 to-pink-600',
  };

  const planBadgeColors = {
    basic: 'bg-slate-600',
    premium: 'bg-blue-600',
    pro: 'bg-purple-600',
  };

  const planFeatures = {
    basic: [
      '3 interviews per week',
      '45-minute timer',
      'Basic streak tracking',
      'Last 5 sessions history',
      '30-day free trial',
    ],
    premium: [
      'Unlimited interviews',
      'Weekly progress reports',
      'Performance analytics',
      '30+ question bank',
      'Full session history',
      'Advanced streak tracking',
    ],
    pro: [
      'Everything in Premium',
      'Streak freeze (1/week)',
      'Pressure mode',
      'Readiness score',
      'Priority support',
      'Custom difficulty settings',
    ],
  };

  const trialDaysLeft = user.trialEndsAt 
    ? Math.ceil((new Date(user.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white neon-text mb-2">Profile</h1>
            <p className="text-slate-300 terminal-text">
              &gt; Manage your account and subscription
            </p>
          </div>

          {/* Profile Card */}
          <div className="holo-card rounded-lg p-8 glow-border">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold neon-button">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                
                {/* User Info */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{user.email}</h2>
                  <div className="flex items-center gap-2">
                    <span className={`${planBadgeColors[user.plan]} text-white px-3 py-1 rounded-full text-sm font-semibold uppercase`}>
                      {user.plan}
                    </span>
                    {user.plan === 'basic' && trialDaysLeft && trialDaysLeft > 0 && (
                      <span className="text-slate-400 text-sm terminal-text">
                        // {trialDaysLeft} days left in trial
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-900/50 rounded-lg p-4 border border-blue-500/20">
                <div className="text-slate-400 text-sm mb-1 terminal-text">// Current Streak</div>
                <div className="text-3xl font-bold gradient-text">{user.streak}</div>
                <div className="text-slate-500 text-xs mt-1">days</div>
              </div>
              
              <div className="bg-slate-900/50 rounded-lg p-4 border border-blue-500/20">
                <div className="text-slate-400 text-sm mb-1 terminal-text">// Member Since</div>
                <div className="text-xl font-bold text-white">
                  {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              </div>
              
              <div className="bg-slate-900/50 rounded-lg p-4 border border-blue-500/20">
                <div className="text-slate-400 text-sm mb-1 terminal-text">// Last Session</div>
                <div className="text-xl font-bold text-white">
                  {user.lastSessionDate 
                    ? new Date(user.lastSessionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : 'Never'}
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="space-y-3 pt-4 border-t border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Email</span>
                <span className="text-white font-mono">{user.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">User ID</span>
                <span className="text-white font-mono text-sm">{user.id.substring(0, 16)}...</span>
              </div>
              {user.plan === 'pro' && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Streak Freeze Available</span>
                  <span className={`font-semibold ${user.streakFreezeUsed ? 'text-red-400' : 'text-green-400'}`}>
                    {user.streakFreezeUsed ? 'Used this week' : 'Available'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Current Plan Features */}
          <div className="holo-card rounded-lg p-8 glow-border">
            <h3 className="text-xl font-bold text-white mb-4 neon-text">
              Your {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
            </h3>
            <ul className="space-y-3">
              {planFeatures[user.plan].map((feature, index) => (
                <li key={index} className="flex items-start text-slate-200">
                  <svg className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {user.plan !== 'pro' && (
              <div className="mt-6 pt-6 border-t border-slate-700">
                <Link
                  href="/pricing"
                  className="block w-full text-center neon-button px-6 py-3 text-white rounded-lg transition-all font-semibold"
                >
                  {user.plan === 'basic' ? 'Upgrade to Premium' : 'Upgrade to Pro'}
                </Link>
              </div>
            )}
          </div>

          {/* Trial Warning for Basic Users */}
          {user.plan === 'basic' && trialDaysLeft && trialDaysLeft <= 7 && (
            <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="text-yellow-400 font-semibold mb-1">Trial Ending Soon</h4>
                  <p className="text-slate-300 text-sm">
                    Your free trial ends in {trialDaysLeft} {trialDaysLeft === 1 ? 'day' : 'days'}. 
                    Upgrade to Premium or Pro to continue unlimited access.
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-block mt-3 text-yellow-400 hover:text-yellow-300 font-semibold text-sm"
                  >
                    View Plans →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/history"
              className="holo-card rounded-lg p-6 glow-border hover:scale-105 transition-transform"
            >
              <h4 className="text-lg font-semibold text-white mb-2">Session History</h4>
              <p className="text-slate-400 text-sm">View all your past interview sessions</p>
            </Link>
            
            <Link
              href="/analytics"
              className="holo-card rounded-lg p-6 glow-border hover:scale-105 transition-transform"
            >
              <h4 className="text-lg font-semibold text-white mb-2">Analytics</h4>
              <p className="text-slate-400 text-sm">Track your performance over time</p>
            </Link>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
