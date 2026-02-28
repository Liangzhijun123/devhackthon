import { LandingLayout } from "@/components/layouts/LandingLayout";

export default function PricingPage() {
  return (
    <LandingLayout>
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-slate-300">
              Select the plan that fits your interview preparation needs
            </p>
          </div>

          {/* Pricing table will be added in Task 21 */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border-2 border-slate-700 rounded-lg p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
              <p className="text-slate-400 mb-4">Get started with the essentials</p>
              <div className="text-4xl font-bold text-white mb-6">Free</div>
              <ul className="space-y-3 mb-8 text-slate-200">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  3 interviews per week
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  15 questions
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Last 5 sessions
                </li>
              </ul>
            </div>

            <div className="bg-slate-800/50 border-2 border-blue-500 rounded-lg p-8 relative backdrop-blur-sm">
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm rounded-bl-lg rounded-tr-lg">
                Popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <p className="text-slate-400 mb-4">For serious interview prep</p>
              <div className="text-4xl font-bold text-white mb-6">$9/mo</div>
              <ul className="space-y-3 mb-8 text-slate-200">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Unlimited interviews
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  30 questions
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Full session history
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Performance analytics
                </li>
              </ul>
            </div>

            <div className="bg-slate-800/50 border-2 border-slate-700 rounded-lg p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="text-slate-400 mb-4">Maximum preparation power</p>
              <div className="text-4xl font-bold text-white mb-6">$19/mo</div>
              <ul className="space-y-3 mb-8 text-slate-200">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Everything in Premium
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Pressure mode
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Readiness score
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Streak freeze
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
}
