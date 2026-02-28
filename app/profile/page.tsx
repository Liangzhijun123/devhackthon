'use client';

import { AppLayout } from "@/components/layouts/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-slate-300">
            Manage your account settings and subscription plan.
          </p>
          {/* Profile components will be added in Task 23 */}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
