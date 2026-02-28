'use client';

import { AppLayout } from "@/components/layouts/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InterviewPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [showHint, setShowHint] = useState(false);
  const [pressureMode, setPressureMode] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60); // 45 minutes in seconds
  const [showSolution, setShowSolution] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [pressurePopup, setPressurePopup] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  if (!user) return null;

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        
        // Show warning at 2 minutes
        if (prev === 120 && !showWarning) {
          setShowWarning(true);
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showWarning]);

  // Pressure mode popups
  useEffect(() => {
    if (!pressureMode || user.plan !== 'pro') return;

    const popupMessages = [
      "Explain your thought process out loud!",
      "What's your time complexity?",
      "Have you considered edge cases?",
      "Can you optimize this further?",
      "Walk through your solution step by step."
    ];

    const showRandomPopup = () => {
      const randomMessage = popupMessages[Math.floor(Math.random() * popupMessages.length)];
      setPressurePopup(randomMessage);
      setTimeout(() => setPressurePopup(null), 5000);
    };

    // Show popup every 3-5 minutes
    const interval = setInterval(showRandomPopup, (3 + Math.random() * 2) * 60 * 1000);
    
    // Show first popup after 30 seconds
    const initialTimeout = setTimeout(showRandomPopup, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [pressureMode, user.plan]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    setShowSolution(true);
  };

  const handleEndSession = () => {
    router.push('/interview/feedback');
  };

  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'cpp', name: 'C++' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'go', name: 'Go' },
  ];

  return (
    <ProtectedRoute>
      <AppLayout>
        {/* Zoom-like Interview Interface */}
        <div className="h-[calc(100vh-120px)] flex flex-col">
          {/* Top Bar - Timer and Controls */}
          <div className="bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Timer */}
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border-2 ${
                  timeRemaining <= 120 ? 'border-red-500 animate-pulse' : 'border-blue-500'
                }`}>
                  <svg className={`w-6 h-6 ${timeRemaining <= 120 ? 'text-red-400' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className={`text-2xl font-bold font-mono ${timeRemaining <= 120 ? 'text-red-400' : 'text-white'}`}>
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-xs text-slate-400">Time Remaining</div>
                </div>
              </div>

              {/* Question Info */}
              <div className="border-l border-slate-700 pl-6">
                <div className="text-sm text-slate-400">Current Question</div>
                <div className="text-white font-medium">Two Sum Problem</div>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Pressure Mode Toggle (Pro Only) */}
              {user.plan === 'pro' && (
                <button
                  onClick={() => setPressureMode(!pressureMode)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    pressureMode
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    Pressure Mode
                  </div>
                </button>
              )}

              {/* End Session Button */}
              <button 
                onClick={handleEndSession}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all"
              >
                End Session
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Side - Question Panel */}
            <div className="w-1/2 bg-slate-900 border-r border-slate-700 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Question Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Two Sum</h2>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-900/50 text-green-300 border border-green-700 rounded-full text-sm font-medium">
                      Easy
                    </span>
                    <span className="px-3 py-1 bg-blue-900/50 text-blue-300 border border-blue-700 rounded-full text-sm font-medium">
                      Arrays
                    </span>
                  </div>
                </div>

                {/* Question Statement */}
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Problem Statement</h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Given an array of integers <code className="bg-slate-700 px-2 py-1 rounded text-blue-300">nums</code> and an integer <code className="bg-slate-700 px-2 py-1 rounded text-blue-300">target</code>, return indices of the two numbers such that they add up to target.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    You may assume that each input would have exactly one solution, and you may not use the same element twice.
                  </p>
                </div>

                {/* Examples */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Examples</h3>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="text-sm text-slate-400 mb-2">Example 1:</div>
                    <div className="font-mono text-sm space-y-1">
                      <div className="text-slate-300"><span className="text-blue-400">Input:</span> nums = [2,7,11,15], target = 9</div>
                      <div className="text-slate-300"><span className="text-green-400">Output:</span> [0,1]</div>
                      <div className="text-slate-400"><span className="text-slate-500">Explanation:</span> Because nums[0] + nums[1] == 9, we return [0, 1].</div>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="text-sm text-slate-400 mb-2">Example 2:</div>
                    <div className="font-mono text-sm space-y-1">
                      <div className="text-slate-300"><span className="text-blue-400">Input:</span> nums = [3,2,4], target = 6</div>
                      <div className="text-slate-300"><span className="text-green-400">Output:</span> [1,2]</div>
                    </div>
                  </div>
                </div>

                {/* Hint Section */}
                <div className="space-y-3">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg border border-slate-600 transition-all flex items-center justify-between"
                  >
                    <span>💡 Show Hint</span>
                    <svg className={`w-5 h-5 transition-transform ${showHint ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showHint && (
                    <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
                      <p className="text-yellow-200 text-sm">
                        Try using a hash map to store the numbers you've seen so far. For each number, check if target - number exists in the hash map.
                      </p>
                    </div>
                  )}
                </div>

                {/* Solution Section (shown after submit) */}
                {showSolution && (
                  <div className="space-y-4 border-t border-slate-700 pt-6">
                    <h3 className="text-lg font-semibold text-white">Solution & Explanation</h3>
                    
                    <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
                      <h4 className="text-green-300 font-semibold mb-2">Approach: Hash Map</h4>
                      <p className="text-slate-300 text-sm leading-relaxed mb-3">
                        The optimal solution uses a hash map to store each number and its index as we iterate through the array. For each number, we check if the complement (target - current number) exists in the hash map. If it does, we've found our answer. If not, we add the current number to the hash map and continue.
                      </p>
                      <div className="text-sm text-slate-400">
                        <div>Time Complexity: O(n)</div>
                        <div>Space Complexity: O(n)</div>
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                      <div className="text-sm text-slate-400 mb-2">Solution Code:</div>
                      <pre className="font-mono text-sm text-slate-300 overflow-x-auto">
{`function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Code Editor / Notes Area */}
            <div className="w-1/2 bg-slate-950 flex flex-col">
              {/* Language Selector & Tabs */}
              <div className="bg-slate-900 border-b border-slate-700 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-slate-800 text-white rounded-t-lg font-medium text-sm">
                    Notes
                  </button>
                  <button className="px-4 py-2 text-slate-400 hover:text-slate-200 rounded-t-lg font-medium text-sm">
                    Approach
                  </button>
                </div>
                
                {/* Language Selector */}
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-200 border border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes Area */}
              <div className="flex-1 p-6">
                <textarea
                  className="w-full h-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Take notes here...

• Think about the problem
• Write your approach
• Track edge cases
• Note time/space complexity"
                  defaultValue="Approach:
1. Use a hash map to store numbers and their indices
2. For each number, check if (target - number) exists
3. Return the indices when found

Time: O(n)
Space: O(n)"
                />
              </div>

              {/* Bottom Action Bar */}
              <div className="bg-slate-900 border-t border-slate-700 px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-slate-400">
                  Auto-saved 2 minutes ago
                </div>
                <button 
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all"
                >
                  {showSolution ? 'Solution Shown' : 'Submit & Get Feedback'}
                </button>
              </div>
            </div>
          </div>

          {/* 2-Minute Warning */}
          {showWarning && timeRemaining > 0 && (
            <div className="fixed top-24 right-8 bg-red-600 text-white px-6 py-4 rounded-lg shadow-2xl border-2 border-red-500 animate-bounce">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-bold">2 Minutes Remaining!</div>
                  <div className="text-sm text-red-100">Document your thought process in notes!</div>
                </div>
                <button 
                  onClick={() => setShowWarning(false)}
                  className="ml-4 text-red-200 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Pressure Mode Popup (Pro Only) */}
          {pressurePopup && user.plan === 'pro' && (
            <div className="fixed bottom-8 right-8 bg-orange-600 text-white px-6 py-4 rounded-lg shadow-2xl border-2 border-orange-500 animate-pulse">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-bold">Pressure Mode</div>
                  <div className="text-sm text-orange-100">{pressurePopup}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
