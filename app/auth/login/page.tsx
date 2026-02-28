import { LandingLayout } from "@/components/layouts/LandingLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <LandingLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Welcome back</h2>
            <p className="mt-2 text-slate-300">Sign in to continue your practice</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </LandingLayout>
  );
}
