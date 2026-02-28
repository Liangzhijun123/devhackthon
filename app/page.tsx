import { LandingLayout } from "@/components/layouts/LandingLayout";
import Link from "next/link";

export default function Home() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Practice Interviews Like It's{" "}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                the Real Thing
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              Structured mock interviews with timing pressure, accountability tracking, and performance analytics. 
              Stop practicing alone—start preparing like a pro.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/auth/signup"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-lg font-semibold shadow-lg hover:shadow-blue-500/50"
              >
                Start Free Trial
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-4 bg-slate-800/50 text-white border-2 border-slate-700 rounded-lg hover:bg-slate-800 hover:border-slate-600 transition-all text-lg font-semibold backdrop-blur-sm"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              The Real Problem
            </h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Solving problems alone doesn't prepare you for real interviews.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
                <div className="text-red-400 font-semibold mb-2">❌ No Pressure</div>
                <p className="text-slate-300 text-sm">
                  Practicing without time limits doesn't simulate real interview stress
                </p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
                <div className="text-red-400 font-semibold mb-2">❌ No Accountability</div>
                <p className="text-slate-300 text-sm">
                  Inconsistent practice leads to gaps in preparation
                </p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
                <div className="text-red-400 font-semibold mb-2">❌ No Structure</div>
                <p className="text-slate-300 text-sm">
                  Hard to simulate the full interview experience on your own
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-300">
              Four simple steps to interview mastery
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm hover:border-blue-500/50 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 text-white font-bold text-xl">
                  1
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Start Mock</h3>
                <p className="text-slate-300 text-sm">
                  Click "Start Mock Interview" and get a random coding question
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm hover:border-blue-500/50 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 text-white font-bold text-xl">
                  2
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Timed Session</h3>
                <p className="text-slate-300 text-sm">
                  Solve the problem in 45 minutes with a countdown timer
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm hover:border-blue-500/50 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 text-white font-bold text-xl">
                  3
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Get Feedback</h3>
                <p className="text-slate-300 text-sm">
                  Rate your performance and add notes for future reference
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm hover:border-blue-500/50 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 text-white font-bold text-xl">
                  4
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Track Streak</h3>
                <p className="text-slate-300 text-sm">
                  Build consistency and watch your progress grow over time
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-slate-300">
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-slate-800/50 border-2 border-slate-700 rounded-lg p-8 backdrop-blur-sm hover:border-slate-600 transition-all">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
                <div className="text-4xl font-bold text-white mb-2">Free</div>
                <p className="text-slate-400 text-sm">30-day trial</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">3 interviews per week</span>
                </li>
                <li className="flex items-start text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">45-min timer</span>
                </li>
                <li className="flex items-start text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Basic streak tracking</span>
                </li>
                <li className="flex items-start text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Last 5 sessions</span>
                </li>
              </ul>
              <Link
                href="/auth/signup"
                className="block w-full text-center px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all font-semibold"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border-2 border-blue-500 rounded-lg p-8 backdrop-blur-sm relative transform scale-105 shadow-xl shadow-blue-500/20">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  POPULAR
                </span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
                <div className="text-4xl font-bold text-white mb-2">$9<span className="text-lg text-slate-300">/mo</span></div>
                <p className="text-slate-300 text-sm">For serious grinders</p>
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
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg"
              >
                Get Premium
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-slate-800/50 border-2 border-purple-700 rounded-lg p-8 backdrop-blur-sm hover:border-purple-600 transition-all">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <div className="text-4xl font-bold text-white mb-2">$19<span className="text-lg text-slate-300">/mo</span></div>
                <p className="text-slate-400 text-sm">High-pressure prep</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Everything in Premium</span>
                </li>
                <li className="flex items-start text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Streak freeze (1/week)</span>
                </li>
                <li className="flex items-start text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Pressure mode</span>
                </li>
                <li className="flex items-start text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Readiness score</span>
                </li>
              </ul>
              <Link
                href="/auth/signup"
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold"
              >
                Get Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Start Your Mock Today
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of developers preparing for their dream jobs
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-lg font-semibold shadow-lg hover:shadow-blue-500/50"
          >
            Get Started Free →
          </Link>
        </div>
      </section>
    </LandingLayout>
  );
}
