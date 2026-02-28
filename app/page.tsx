'use client';

import { LandingLayout } from "@/components/layouts/LandingLayout";
import Link from "next/link";
import dynamic from 'next/dynamic';

const RippleGrid = dynamic(() => import('@/components/RippleGrid'), { ssr: false });

export default function Home() {
  return (
    <LandingLayout>
      {/* Ripple Grid Background Effect */}
      <RippleGrid
        enableRainbow={false}
        gridColor="#3b82f6"
        rippleIntensity={0.08}
        gridSize={10}
        gridThickness={15}
        mouseInteraction={true}
        mouseInteractionRadius={1.2}
        opacity={0.6}
        glowIntensity={0.2}
      />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight neon-text floating">
              Practice Interviews Like It's{" "}
              <span className="gradient-text">
                the Real Thing
              </span>
            </h1>
            <p className="text-xl text-slate-200 mb-10 leading-relaxed">
              Structured mock interviews with timing pressure, accountability tracking, and performance analytics. 
              Stop practicing alone—start preparing like a pro.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/auth/signup"
                className="neon-button px-8 py-4 text-white rounded-lg transition-all text-lg font-semibold"
              >
                Start Free Trial
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-4 holo-card text-white rounded-lg transition-all text-lg font-semibold glow-border"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-slate-900/50 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 neon-text">
              The Real Problem
            </h2>
            <p className="text-xl text-slate-200 mb-8 leading-relaxed">
              Solving problems alone doesn't prepare you for real interviews.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="holo-card rounded-lg p-6 glow-border cyber-border">
                <div className="text-red-400 font-semibold mb-2 terminal-text">// No Pressure</div>
                <p className="text-slate-200 text-sm">
                  Practicing without time limits doesn't simulate real interview stress
                </p>
              </div>
              <div className="holo-card rounded-lg p-6 glow-border cyber-border">
                <div className="text-red-400 font-semibold mb-2 terminal-text">// No Accountability</div>
                <p className="text-slate-200 text-sm">
                  Inconsistent practice leads to gaps in preparation
                </p>
              </div>
              <div className="holo-card rounded-lg p-6 glow-border cyber-border">
                <div className="text-red-400 font-semibold mb-2 terminal-text">// No Structure</div>
                <p className="text-slate-200 text-sm">
                  Hard to simulate the full interview experience on your own
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 neon-text">
              How It Works
            </h2>
            <p className="text-xl text-slate-200 terminal-text">
              &gt; Four simple steps to interview mastery
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="holo-card rounded-lg p-6 glow-border cyber-border">
                <div className="w-12 h-12 neon-button rounded-lg flex items-center justify-center mb-4 text-white font-bold text-xl">
                  1
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Start Mock</h3>
                <p className="text-slate-200 text-sm">
                  Click "Start Mock Interview" and get a random coding question
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="holo-card rounded-lg p-6 glow-border cyber-border">
                <div className="w-12 h-12 neon-button rounded-lg flex items-center justify-center mb-4 text-white font-bold text-xl">
                  2
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Timed Session</h3>
                <p className="text-slate-200 text-sm">
                  Solve the problem in 45 minutes with a countdown timer
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="holo-card rounded-lg p-6 glow-border cyber-border">
                <div className="w-12 h-12 neon-button rounded-lg flex items-center justify-center mb-4 text-white font-bold text-xl">
                  3
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Get Feedback</h3>
                <p className="text-slate-200 text-sm">
                  Rate your performance and add notes for future reference
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="holo-card rounded-lg p-6 glow-border cyber-border">
                <div className="w-12 h-12 neon-button rounded-lg flex items-center justify-center mb-4 text-white font-bold text-xl">
                  4
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Track Streak</h3>
                <p className="text-slate-200 text-sm">
                  Build consistency and watch your progress grow over time
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20 bg-slate-900/50 backdrop-blur-sm relative z-10 overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 neon-text">
              Choose Your Plan
            </h2>
            <p className="text-xl text-slate-200">
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start pt-6">
            {/* Basic Plan */}
            <div className="holo-card rounded-lg p-8 glow-border cyber-border">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
                <div className="text-4xl font-bold gradient-text mb-2">Free</div>
                <p className="text-slate-400 text-sm terminal-text">// 30-day trial</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-slate-200">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">3 interviews per week</span>
                </li>
                <li className="flex items-start text-slate-200">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">45-min timer</span>
                </li>
                <li className="flex items-start text-slate-200">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Basic streak tracking</span>
                </li>
                <li className="flex items-start text-slate-200">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Last 5 sessions</span>
                </li>
              </ul>
              <Link
                href="/auth/signup"
                className="block w-full text-center px-6 py-3 holo-card text-white rounded-lg glow-border transition-all font-semibold"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="relative">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-50">
                <span className="neon-button px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg whitespace-nowrap">
                  POPULAR
                </span>
              </div>
              <div className="holo-card rounded-lg p-8 transform scale-105 shadow-xl glow-border cyber-border">
                <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
                <div className="text-4xl font-bold gradient-text mb-2">$9<span className="text-lg text-slate-300">/mo</span></div>
                <p className="text-slate-300 text-sm terminal-text">// For serious grinders</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-white">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Unlimited interviews</span>
                </li>
                <li className="flex items-start text-white">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Weekly progress reports</span>
                </li>
                <li className="flex items-start text-white">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Performance analytics</span>
                </li>
                <li className="flex items-start text-white">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">30+ question bank</span>
                </li>
              </ul>
              <Link
                href="/auth/signup"
                className="block w-full text-center px-6 py-3 neon-button text-white rounded-lg transition-all font-semibold"
              >
                Get Premium
              </Link>
            </div>
            </div>

            {/* Pro Plan */}
            <div className="holo-card rounded-lg p-8 glow-border cyber-border">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <div className="text-4xl font-bold gradient-text mb-2">$19<span className="text-lg text-slate-300">/mo</span></div>
                <p className="text-slate-400 text-sm terminal-text">// High-pressure prep</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-slate-200">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Everything in Premium</span>
                </li>
                <li className="flex items-start text-slate-200">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Streak freeze (1/week)</span>
                </li>
                <li className="flex items-start text-slate-200">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Pressure mode</span>
                </li>
                <li className="flex items-start text-slate-200">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Readiness score</span>
                </li>
              </ul>
              <Link
                href="/auth/signup"
                className="block w-full text-center px-6 py-3 neon-button text-white rounded-lg transition-all font-semibold"
              >
                Get Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 neon-text">
            Start Your Mock Today
          </h2>
          <p className="text-xl text-slate-200 mb-8 terminal-text">
            &gt; Join thousands of developers preparing for their dream jobs
          </p>
          <Link
            href="/auth/signup"
            className="inline-block neon-button px-8 py-4 text-white rounded-lg transition-all text-lg font-semibold"
          >
            Get Started Free →
          </Link>
        </div>
      </section>
    </LandingLayout>
  );
}
