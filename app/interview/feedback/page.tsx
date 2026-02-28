'use client';

import { AppLayout } from "@/components/layouts/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { StorageService } from "@/services/StorageService";
import { CompletedSession } from "@/types";

export default function FeedbackPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | ''>('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const difficultyOptions = [
    { value: 'easy', label: 'Easy', color: 'green' },
    { value: 'medium', label: 'Medium', color: 'yellow' },
    { value: 'hard', label: 'Hard', color: 'red' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0 || difficulty === '') {
      alert('Please provide a rating and select difficulty');
      return;
    }

    if (!user) return;

    setIsSaving(true);
    
    // Create completed session
    const now = new Date();
    const startTime = new Date(now.getTime() - 38 * 60 * 1000); // 38 minutes ago
    
    const session: CompletedSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId: user.id,
      questionId: 'basic-array-1',
      questionTitle: 'Two Sum',
      category: 'arrays',
      difficulty: 'easy',
      startTime,
      endTime: now,
      duration: 38 * 60, // 38 minutes in seconds
      rating: rating as 1 | 2 | 3 | 4 | 5,
      perceivedDifficulty: difficulty as 'easy' | 'medium' | 'hard',
      notes: notes,
      pressureModeUsed: false,
    };

    try {
      // Save session to localStorage
      StorageService.saveSession(session);
      
      // Update user's last session date and streak
      const updatedUser = {
        ...user,
        lastSessionDate: now,
        streak: user.streak + 1,
      };
      StorageService.saveUser(updatedUser);
      
      // Wait a moment to show success
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to save session:', error);
      alert('Failed to save session. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="max-w-3xl mx-auto py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Session Feedback</h1>
            <p className="text-slate-400">
              Rate your performance and add notes about your session
            </p>
          </div>

          {/* Feedback Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Session Summary */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white mb-4">Session Summary</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-400">Question</div>
                  <div className="text-white font-medium">Two Sum</div>
                </div>
                <div>
                  <div className="text-slate-400">Category</div>
                  <div className="text-white font-medium">Arrays</div>
                </div>
                <div>
                  <div className="text-slate-400">Duration</div>
                  <div className="text-white font-medium">38 minutes</div>
                </div>
                <div>
                  <div className="text-slate-400">Hints Used</div>
                  <div className="text-white font-medium">1</div>
                </div>
              </div>
            </div>

            {/* Performance Rating */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
              <label className="block text-lg font-semibold text-white mb-4">
                How did you perform? <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center justify-center gap-4 py-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <svg
                      className={`w-12 h-12 ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-slate-600'
                      } transition-colors`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </button>
                ))}
              </div>
              <div className="text-center text-sm text-slate-400 mt-2">
                {rating === 0 && 'Click to rate your performance'}
                {rating === 1 && 'Struggled significantly'}
                {rating === 2 && 'Had some difficulties'}
                {rating === 3 && 'Average performance'}
                {rating === 4 && 'Performed well'}
                {rating === 5 && 'Excellent performance'}
              </div>
            </div>

            {/* Perceived Difficulty */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
              <label className="block text-lg font-semibold text-white mb-4">
                How difficult was this problem for you? <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                {difficultyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDifficulty(option.value as 'easy' | 'medium' | 'hard')}
                    className={`px-6 py-4 rounded-lg font-medium transition-all border-2 ${
                      difficulty === option.value
                        ? option.color === 'green'
                          ? 'bg-green-900/50 border-green-500 text-green-300'
                          : option.color === 'yellow'
                          ? 'bg-yellow-900/50 border-yellow-500 text-yellow-300'
                          : 'bg-red-900/50 border-red-500 text-red-300'
                        : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
              <label className="block text-lg font-semibold text-white mb-4">
                Session Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Add any notes about your session...

• What went well?
• What could be improved?
• Key learnings or insights
• Areas to review"
              />
              <div className="text-sm text-slate-400 mt-2">
                {notes.length} characters
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition-all"
              >
                Skip Feedback
              </button>
              <button
                type="submit"
                disabled={isSaving || rating === 0 || difficulty === ''}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    Save & Return to Dashboard
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Success Message */}
          {isSaving && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 max-w-md text-center">
                <div className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Session Saved!</h3>
                <p className="text-slate-300">
                  Your feedback has been recorded and your streak has been updated.
                </p>
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
