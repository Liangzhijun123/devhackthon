'use client';

/**
 * DemoInitializer Component
 * Initializes demo users on app startup
 */

import { useEffect } from 'react';
import { initializeDemoUsers } from '@/lib/demoUsers';

export function DemoInitializer() {
  useEffect(() => {
    // Initialize demo users on mount
    initializeDemoUsers();
  }, []);

  return null; // This component doesn't render anything
}
