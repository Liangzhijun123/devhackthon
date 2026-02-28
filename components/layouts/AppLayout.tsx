'use client';

/**
 * AppLayout - Main layout for authenticated pages
 * Modern dark blue theme with glassmorphism effects
 */

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ClickSpark from '@/components/ClickSpark';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Plan badge colors - Modern dark theme with better contrast
  const planColors = {
    basic: 'bg-slate-700/80 text-slate-100 border border-slate-500',
    premium: 'bg-blue-600/80 text-white border border-blue-400',
    pro: 'bg-purple-600/80 text-white border border-purple-400',
  };

  return (
    <ClickSpark
      sparkColor="#3b82f6"
      sparkSize={12}
      sparkRadius={20}
      sparkCount={8}
      duration={500}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation Header - Glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-slate-800/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all">
                  <span className="text-white font-bold text-lg">IB</span>
                </div>
                <span className="text-xl font-bold text-white">
                  Interview Buddy
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-slate-200 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/history"
                className="px-4 py-2 text-slate-200 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all font-medium"
              >
                History
              </Link>
              <Link
                href="/analytics"
                className="px-4 py-2 text-slate-200 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all font-medium"
              >
                Analytics
              </Link>
              <Link
                href="/pricing"
                className="px-4 py-2 text-slate-200 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all font-medium"
              >
                Pricing
              </Link>
            </nav>

            {/* User Info and Actions */}
            <div className="flex items-center space-x-3">
              {/* Streak Display - Requirement 7.1 - No emoji */}
              {user && (
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-orange-600/30 to-red-600/30 border border-orange-500/50 rounded-full backdrop-blur-sm">
                  <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  <span className="font-bold text-orange-200">{user.streak}</span>
                  <span className="text-xs text-orange-300 font-medium">day streak</span>
                </div>
              )}

              {/* Plan Badge - Requirement 7.3 */}
              {user && (
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                    planColors[user.plan]
                  }`}
                >
                  {user.plan}
                </span>
              )}

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <Link
                  href="/profile"
                  className="px-3 py-1.5 text-slate-200 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all text-sm font-medium"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-slate-300 hover:text-red-400 hover:bg-slate-800/50 rounded-lg transition-all text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with subtle pattern */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative">
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none opacity-20" />
          
          {/* Content */}
          <div className="relative">
            {children}
          </div>
        </div>
      </main>
    </div>
    </ClickSpark>
  );
}
