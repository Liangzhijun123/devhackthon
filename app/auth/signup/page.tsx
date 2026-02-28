import { LandingLayout } from "@/components/layouts/LandingLayout";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <LandingLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Create your account</h2>
            <p className="mt-2 text-slate-300">Start practicing interviews today</p>
          </div>
          <SignupForm />
        </div>
      </div>
    </LandingLayout>
  );
}
