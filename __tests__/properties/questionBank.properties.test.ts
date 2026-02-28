/**
 * Property-Based Tests for Question Bank Structure
 * Tests universal properties that should hold for question bank organization
 */

import fc from 'fast-check';
import { questionBank, getQuestionsByPlan } from '@/lib/questions';
import { Question, Plan } from '@/types';

// ============================================================================
// Arbitraries (Generators) for Property-Based Testing
// ============================================================================

/**
 * Generate valid Plan values
 */
const planArbitrary = (): fc.Arbitrary<Plan> => {
  return fc.constantFrom<Plan>('basic', 'premium', 'pro');
};

// ============================================================================
// Property Tests
// ============================================================================

describe('Question Bank Property Tests', () => {
  describe('Property 10: Basic plan has minimum 15 questions', () => {
    /**
     * **Validates: Requirements 3.1**
     * 
     * For any Basic plan user, the accessible question bank should contain
     * at least 15 questions.
     * 
     * This property ensures that Basic tier users have sufficient question
     * variety for meaningful practice sessions.
     */
    it('should provide at least 15 questions for basic plan', () => {
      fc.assert(
        fc.property(fc.constant('basic' as Plan), (plan) => {
          // Get questions accessible to basic plan
          const basicQuestions = getQuestionsByPlan(plan);
          
          // Should have at least 15 questions
          expect(basicQuestions.length).toBeGreaterThanOrEqual(15);
          
          // All questions should be marked as basic tier
          basicQuestions.forEach(question => {
            expect(question.planRequired).toBe('basic');
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should maintain minimum 15 questions regardless of filtering', () => {
      // Verify that the basic question count is stable
      const basicQuestions = getQuestionsByPlan('basic');
      expect(basicQuestions.length).toBeGreaterThanOrEqual(15);
      
      // Verify each question has required fields
      basicQuestions.forEach(question => {
        expect(question.id).toBeDefined();
        expect(question.title).toBeDefined();
        expect(question.statement).toBeDefined();
        expect(question.difficulty).toBeDefined();
        expect(question.category).toBeDefined();
      });
    });
  });

  describe('Property 11: Premium/Pro plans have minimum 30 questions', () => {
    /**
     * **Validates: Requirements 3.2**
     * 
     * For any Premium or Pro plan user, the accessible question bank should
     * contain at least 30 questions.
     * 
     * This property ensures that paid tier users have access to an expanded
     * question bank with more variety and advanced topics.
     */
    it('should provide at least 30 questions for premium plan', () => {
      fc.assert(
        fc.property(fc.constant('premium' as Plan), (plan) => {
          // Get questions accessible to premium plan
          const premiumQuestions = getQuestionsByPlan(plan);
          
          // Should have at least 30 questions
          expect(premiumQuestions.length).toBeGreaterThanOrEqual(30);
          
          // Questions should be either basic or premium tier
          premiumQuestions.forEach(question => {
            expect(['basic', 'premium']).toContain(question.planRequired);
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should provide at least 30 questions for pro plan', () => {
      fc.assert(
        fc.property(fc.constant('pro' as Plan), (plan) => {
          // Get questions accessible to pro plan
          const proQuestions = getQuestionsByPlan(plan);
          
          // Should have at least 30 questions
          expect(proQuestions.length).toBeGreaterThanOrEqual(30);
          
          // Pro plan should have access to all question tiers
          const planTypes = new Set(proQuestions.map(q => q.planRequired));
          expect(planTypes.size).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });

    it('should provide more questions to premium/pro than basic', () => {
      fc.assert(
        fc.property(
          fc.constantFrom<Plan>('premium', 'pro'),
          (plan) => {
            const basicQuestions = getQuestionsByPlan('basic');
            const paidQuestions = getQuestionsByPlan(plan);
            
            // Paid plans should have more questions than basic
            expect(paidQuestions.length).toBeGreaterThan(basicQuestions.length);
            
            // Paid plans should have at least 30 questions
            expect(paidQuestions.length).toBeGreaterThanOrEqual(30);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 12: Pro plan includes specialized question types', () => {
    /**
     * **Validates: Requirements 3.3**
     * 
     * For any Pro plan user, the accessible question bank should include
     * questions with categories "behavioral" and "system-design".
     * 
     * This property ensures that Pro tier users have access to specialized
     * interview question types beyond coding problems.
     */
    it('should include behavioral questions for pro plan', () => {
      fc.assert(
        fc.property(fc.constant('pro' as Plan), (plan) => {
          // Get questions accessible to pro plan
          const proQuestions = getQuestionsByPlan(plan);
          
          // Should have at least one behavioral question
          const behavioralQuestions = proQuestions.filter(
            q => q.category === 'behavioral'
          );
          
          expect(behavioralQuestions.length).toBeGreaterThan(0);
          
          // Verify behavioral questions are marked as pro tier
          behavioralQuestions.forEach(question => {
            expect(question.planRequired).toBe('pro');
            expect(question.category).toBe('behavioral');
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should include system-design questions for pro plan', () => {
      fc.assert(
        fc.property(fc.constant('pro' as Plan), (plan) => {
          // Get questions accessible to pro plan
          const proQuestions = getQuestionsByPlan(plan);
          
          // Should have at least one system-design question
          const systemDesignQuestions = proQuestions.filter(
            q => q.category === 'system-design'
          );
          
          expect(systemDesignQuestions.length).toBeGreaterThan(0);
          
          // Verify system-design questions are marked as pro tier
          systemDesignQuestions.forEach(question => {
            expect(question.planRequired).toBe('pro');
            expect(question.category).toBe('system-design');
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should include both behavioral and system-design for pro plan', () => {
      fc.assert(
        fc.property(fc.constant('pro' as Plan), (plan) => {
          // Get questions accessible to pro plan
          const proQuestions = getQuestionsByPlan(plan);
          
          // Get specialized question categories
          const categories = new Set(proQuestions.map(q => q.category));
          
          // Should include both specialized types
          expect(categories.has('behavioral')).toBe(true);
          expect(categories.has('system-design')).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should not include specialized questions for basic or premium plans', () => {
      fc.assert(
        fc.property(
          fc.constantFrom<Plan>('basic', 'premium'),
          (plan) => {
            // Get questions accessible to basic/premium plan
            const questions = getQuestionsByPlan(plan);
            
            // Should not have behavioral questions
            const behavioralQuestions = questions.filter(
              q => q.category === 'behavioral'
            );
            expect(behavioralQuestions.length).toBe(0);
            
            // Should not have system-design questions
            const systemDesignQuestions = questions.filter(
              q => q.category === 'system-design'
            );
            expect(systemDesignQuestions.length).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 14: Question display includes required fields', () => {
    /**
     * **Validates: Requirements 3.5**
     * 
     * For any question displayed during an interview, both the problem
     * statement and difficulty level should be present and non-empty.
     * 
     * This property ensures that all questions have the minimum required
     * information for users to understand and attempt them.
     */
    it('should have non-empty problem statement for all questions', () => {
      fc.assert(
        fc.property(planArbitrary(), (plan) => {
          // Get questions accessible to this plan
          const questions = getQuestionsByPlan(plan);
          
          // Every question should have a non-empty statement
          questions.forEach(question => {
            expect(question.statement).toBeDefined();
            expect(typeof question.statement).toBe('string');
            expect(question.statement.length).toBeGreaterThan(0);
            expect(question.statement.trim()).not.toBe('');
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should have valid difficulty level for all questions', () => {
      fc.assert(
        fc.property(planArbitrary(), (plan) => {
          // Get questions accessible to this plan
          const questions = getQuestionsByPlan(plan);
          
          // Every question should have a valid difficulty
          questions.forEach(question => {
            expect(question.difficulty).toBeDefined();
            expect(['easy', 'medium', 'hard']).toContain(question.difficulty);
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should have both statement and difficulty for all questions', () => {
      fc.assert(
        fc.property(planArbitrary(), (plan) => {
          // Get questions accessible to this plan
          const questions = getQuestionsByPlan(plan);
          
          // Every question should have both required fields
          questions.forEach(question => {
            // Problem statement
            expect(question.statement).toBeDefined();
            expect(question.statement.length).toBeGreaterThan(0);
            
            // Difficulty level
            expect(question.difficulty).toBeDefined();
            expect(['easy', 'medium', 'hard']).toContain(question.difficulty);
          });
        }),
        { numRuns: 100 }
      );
    });

    it('should have all required display fields for every question in the bank', () => {
      // Test all questions in the entire bank
      questionBank.forEach(question => {
        // Required for display (Requirement 3.5)
        expect(question.statement).toBeDefined();
        expect(question.statement.length).toBeGreaterThan(0);
        expect(question.difficulty).toBeDefined();
        expect(['easy', 'medium', 'hard']).toContain(question.difficulty);
        
        // Additional required fields for proper functioning
        expect(question.id).toBeDefined();
        expect(question.id.length).toBeGreaterThan(0);
        expect(question.title).toBeDefined();
        expect(question.title.length).toBeGreaterThan(0);
        expect(question.category).toBeDefined();
        expect(question.hint).toBeDefined();
        expect(question.planRequired).toBeDefined();
        expect(['basic', 'premium', 'pro']).toContain(question.planRequired);
      });
    });

    it('should maintain required fields across all plan tiers', () => {
      fc.assert(
        fc.property(planArbitrary(), (plan) => {
          const questions = getQuestionsByPlan(plan);
          
          // Verify every question has all required fields
          questions.forEach(question => {
            // Core display fields
            expect(question.statement).toBeTruthy();
            expect(question.difficulty).toBeTruthy();
            
            // Supporting fields
            expect(question.id).toBeTruthy();
            expect(question.title).toBeTruthy();
            expect(question.category).toBeTruthy();
            expect(question.hint).toBeTruthy();
            expect(question.planRequired).toBeTruthy();
          });
          
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Question Bank Integrity', () => {
    it('should have unique question IDs across all questions', () => {
      const ids = questionBank.map(q => q.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have consistent plan hierarchy', () => {
      const basicQuestions = getQuestionsByPlan('basic');
      const premiumQuestions = getQuestionsByPlan('premium');
      const proQuestions = getQuestionsByPlan('pro');
      
      // Premium should include all basic questions
      basicQuestions.forEach(basicQ => {
        expect(premiumQuestions.some(q => q.id === basicQ.id)).toBe(true);
      });
      
      // Pro should include all premium questions (which includes basic)
      premiumQuestions.forEach(premiumQ => {
        expect(proQuestions.some(q => q.id === premiumQ.id)).toBe(true);
      });
    });
  });
});
