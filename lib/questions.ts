/**
 * Question Bank for Interview Buddy Platform
 * Contains categorized coding questions for different subscription tiers
 */

import { Question } from '@/types';

/**
 * Complete question bank with 35 questions:
 * - 15 Basic tier questions (arrays, strings)
 * - 15 Premium/Pro questions (trees, graphs, dynamic programming)
 * - 5 Pro tier questions (behavioral, system design)
 */
export const questionBank: Question[] = [
  // ============================================================================
  // BASIC TIER QUESTIONS (15 questions - Arrays & Strings)
  // ============================================================================
  
  // Arrays - Easy
  {
    id: 'basic-array-1',
    title: 'Two Sum',
    difficulty: 'easy',
    category: 'arrays',
    statement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    hint: 'Try using a hash map to store the complement of each number as you iterate through the array.',
    planRequired: 'basic'
  },
  {
    id: 'basic-array-2',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'easy',
    category: 'arrays',
    statement: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction.',
    hint: 'Keep track of the minimum price seen so far and calculate the profit at each step.',
    planRequired: 'basic'
  },
  {
    id: 'basic-array-3',
    title: 'Contains Duplicate',
    difficulty: 'easy',
    category: 'arrays',
    statement: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    hint: 'Consider using a Set data structure to track elements you\'ve seen.',
    planRequired: 'basic'
  },
  {
    id: 'basic-array-4',
    title: 'Product of Array Except Self',
    difficulty: 'medium',
    category: 'arrays',
    statement: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. You must write an algorithm that runs in O(n) time and without using the division operation.',
    hint: 'Think about calculating prefix products and suffix products separately.',
    planRequired: 'basic'
  },
  {
    id: 'basic-array-5',
    title: 'Maximum Subarray',
    difficulty: 'medium',
    category: 'arrays',
    statement: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
    hint: 'Use Kadane\'s algorithm - keep track of the maximum sum ending at the current position.',
    planRequired: 'basic'
  },
  {
    id: 'basic-array-6',
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'medium',
    category: 'arrays',
    statement: 'Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Given the rotated array nums, return the minimum element of this array. You must write an algorithm that runs in O(log n) time.',
    hint: 'Use binary search. Compare the middle element with the rightmost element to determine which half contains the minimum.',
    planRequired: 'basic'
  },

  // Strings - Easy
  {
    id: 'basic-string-1',
    title: 'Valid Anagram',
    difficulty: 'easy',
    category: 'strings',
    statement: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    hint: 'Count the frequency of each character in both strings and compare.',
    planRequired: 'basic'
  },
  {
    id: 'basic-string-2',
    title: 'Valid Palindrome',
    difficulty: 'easy',
    category: 'strings',
    statement: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome, or false otherwise.',
    hint: 'Use two pointers, one at the start and one at the end, and move them towards each other.',
    planRequired: 'basic'
  },
  {
    id: 'basic-string-3',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
    category: 'strings',
    statement: 'Given a string s, find the length of the longest substring without repeating characters.',
    hint: 'Use a sliding window approach with a hash set to track characters in the current window.',
    planRequired: 'basic'
  },
  {
    id: 'basic-string-4',
    title: 'Longest Palindromic Substring',
    difficulty: 'medium',
    category: 'strings',
    statement: 'Given a string s, return the longest palindromic substring in s.',
    hint: 'Expand around each possible center (both single characters and pairs of characters).',
    planRequired: 'basic'
  },
  {
    id: 'basic-string-5',
    title: 'Group Anagrams',
    difficulty: 'medium',
    category: 'strings',
    statement: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
    hint: 'Use a hash map where the key is the sorted version of each string.',
    planRequired: 'basic'
  },
  {
    id: 'basic-string-6',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    category: 'strings',
    statement: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order.',
    hint: 'Use a stack to keep track of opening brackets.',
    planRequired: 'basic'
  },
  {
    id: 'basic-string-7',
    title: 'Encode and Decode Strings',
    difficulty: 'medium',
    category: 'strings',
    statement: 'Design an algorithm to encode a list of strings to a single string. The encoded string is then decoded back to the original list of strings.',
    hint: 'Use a delimiter with length prefix for each string to handle special characters.',
    planRequired: 'basic'
  },
  {
    id: 'basic-array-7',
    title: 'Container With Most Water',
    difficulty: 'medium',
    category: 'arrays',
    statement: 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water.',
    hint: 'Use two pointers starting from both ends. Move the pointer with the smaller height inward.',
    planRequired: 'basic'
  },
  {
    id: 'basic-array-8',
    title: '3Sum',
    difficulty: 'medium',
    category: 'arrays',
    statement: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.',
    hint: 'Sort the array first, then use a two-pointer approach for each element.',
    planRequired: 'basic'
  },

  // ============================================================================
  // PREMIUM/PRO TIER QUESTIONS (15 questions - Trees, Graphs, Dynamic Programming)
  // ============================================================================

  // Trees - Medium
  {
    id: 'premium-tree-1',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'easy',
    category: 'trees',
    statement: 'Given the root of a binary tree, return its maximum depth. A binary tree\'s maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
    hint: 'Use recursion: the depth is 1 + max(left subtree depth, right subtree depth).',
    planRequired: 'premium'
  },
  {
    id: 'premium-tree-2',
    title: 'Invert Binary Tree',
    difficulty: 'easy',
    category: 'trees',
    statement: 'Given the root of a binary tree, invert the tree, and return its root. Inverting means swapping the left and right children of all nodes.',
    hint: 'Recursively swap the left and right children of each node.',
    planRequired: 'premium'
  },
  {
    id: 'premium-tree-3',
    title: 'Validate Binary Search Tree',
    difficulty: 'medium',
    category: 'trees',
    statement: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST is defined as follows: The left subtree of a node contains only nodes with keys less than the node\'s key. The right subtree of a node contains only nodes with keys greater than the node\'s key. Both the left and right subtrees must also be binary search trees.',
    hint: 'Pass down the valid range (min, max) for each node as you traverse.',
    planRequired: 'premium'
  },
  {
    id: 'premium-tree-4',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'medium',
    category: 'trees',
    statement: 'Given the root of a binary tree, return the level order traversal of its nodes\' values. (i.e., from left to right, level by level).',
    hint: 'Use a queue for breadth-first search (BFS).',
    planRequired: 'premium'
  },
  {
    id: 'premium-tree-5',
    title: 'Lowest Common Ancestor of a Binary Search Tree',
    difficulty: 'medium',
    category: 'trees',
    statement: 'Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST. The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants.',
    hint: 'Use the BST property: if both nodes are smaller, go left; if both are larger, go right; otherwise, you\'ve found the LCA.',
    planRequired: 'premium'
  },

  // Graphs - Medium
  {
    id: 'premium-graph-1',
    title: 'Number of Islands',
    difficulty: 'medium',
    category: 'graphs',
    statement: 'Given an m x n 2D binary grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
    hint: 'Use DFS or BFS to mark all connected land cells as visited when you find an island.',
    planRequired: 'premium'
  },
  {
    id: 'premium-graph-2',
    title: 'Clone Graph',
    difficulty: 'medium',
    category: 'graphs',
    statement: 'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node in the graph contains a value (int) and a list of its neighbors.',
    hint: 'Use a hash map to track original nodes to their clones, and perform DFS or BFS.',
    planRequired: 'premium'
  },
  {
    id: 'premium-graph-3',
    title: 'Pacific Atlantic Water Flow',
    difficulty: 'medium',
    category: 'graphs',
    statement: 'There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. Given an m x n matrix of non-negative integers representing the height of each unit cell, return a list of grid coordinates where water can flow to both the Pacific and Atlantic oceans.',
    hint: 'Run DFS from both ocean borders and find cells reachable from both.',
    planRequired: 'premium'
  },
  {
    id: 'premium-graph-4',
    title: 'Course Schedule',
    difficulty: 'medium',
    category: 'graphs',
    statement: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses. Otherwise, return false.',
    hint: 'This is a cycle detection problem in a directed graph. Use DFS with a visited state tracking.',
    planRequired: 'premium'
  },
  {
    id: 'premium-graph-5',
    title: 'Graph Valid Tree',
    difficulty: 'medium',
    category: 'graphs',
    statement: 'Given n nodes labeled from 0 to n-1 and a list of undirected edges, write a function to check whether these edges make up a valid tree. A valid tree must be connected and have no cycles.',
    hint: 'A tree with n nodes must have exactly n-1 edges, be connected, and have no cycles.',
    planRequired: 'premium'
  },

  // Dynamic Programming - Medium/Hard
  {
    id: 'premium-dp-1',
    title: 'Climbing Stairs',
    difficulty: 'easy',
    category: 'dynamic-programming',
    statement: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    hint: 'This is a Fibonacci sequence problem. The number of ways to reach step n is the sum of ways to reach step n-1 and n-2.',
    planRequired: 'premium'
  },
  {
    id: 'premium-dp-2',
    title: 'Coin Change',
    difficulty: 'medium',
    category: 'dynamic-programming',
    statement: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.',
    hint: 'Use dynamic programming: dp[i] = minimum coins needed for amount i.',
    planRequired: 'premium'
  },
  {
    id: 'premium-dp-3',
    title: 'Longest Increasing Subsequence',
    difficulty: 'medium',
    category: 'dynamic-programming',
    statement: 'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
    hint: 'Use dp[i] to store the length of the longest increasing subsequence ending at index i.',
    planRequired: 'premium'
  },
  {
    id: 'premium-dp-4',
    title: 'Word Break',
    difficulty: 'medium',
    category: 'dynamic-programming',
    statement: 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.',
    hint: 'Use dp[i] to indicate whether the substring s[0...i] can be segmented.',
    planRequired: 'premium'
  },
  {
    id: 'premium-dp-5',
    title: 'House Robber',
    difficulty: 'medium',
    category: 'dynamic-programming',
    statement: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night. Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.',
    hint: 'At each house, decide whether to rob it (and skip the previous) or skip it (and keep the max from previous).',
    planRequired: 'premium'
  },

  // ============================================================================
  // PRO TIER QUESTIONS (5 questions - Behavioral & System Design)
  // ============================================================================

  {
    id: 'pro-behavioral-1',
    title: 'Tell Me About a Time You Failed',
    difficulty: 'medium',
    category: 'behavioral',
    statement: 'Describe a situation where you failed to meet a deadline or deliver on a commitment. What happened, what did you learn, and how did you apply those lessons moving forward?',
    hint: 'Use the STAR method (Situation, Task, Action, Result). Be honest, focus on learning and growth.',
    planRequired: 'pro'
  },
  {
    id: 'pro-behavioral-2',
    title: 'Describe a Technical Disagreement',
    difficulty: 'medium',
    category: 'behavioral',
    statement: 'Tell me about a time when you disagreed with a team member or manager about a technical decision. How did you handle the disagreement, and what was the outcome?',
    hint: 'Show your ability to communicate technical ideas, listen to others, and find compromise or data-driven solutions.',
    planRequired: 'pro'
  },
  {
    id: 'pro-system-design-1',
    title: 'Design a URL Shortener',
    difficulty: 'hard',
    category: 'system-design',
    statement: 'Design a URL shortening service like bit.ly. The system should take long URLs and generate short, unique aliases. When users visit the short URL, they should be redirected to the original URL. Consider scalability, storage, and collision handling.',
    hint: 'Think about: hash function for generating short codes, database schema, caching strategy, and handling high traffic.',
    planRequired: 'pro'
  },
  {
    id: 'pro-system-design-2',
    title: 'Design a Rate Limiter',
    difficulty: 'hard',
    category: 'system-design',
    statement: 'Design a rate limiting system that restricts the number of requests a user can make to an API within a time window. The system should be scalable and handle distributed environments.',
    hint: 'Consider algorithms like token bucket, leaky bucket, or sliding window. Think about storage (Redis), distributed systems, and edge cases.',
    planRequired: 'pro'
  },
  {
    id: 'pro-system-design-3',
    title: 'Design a News Feed System',
    difficulty: 'hard',
    category: 'system-design',
    statement: 'Design a news feed system like Facebook or Twitter where users can post updates and see posts from people they follow. The system should handle millions of users and provide real-time updates.',
    hint: 'Consider: fan-out on write vs read, caching strategies, database design (SQL vs NoSQL), and how to handle celebrity users with millions of followers.',
    planRequired: 'pro'
  }
];

/**
 * Get questions accessible to a specific plan tier
 */
export function getQuestionsByPlan(plan: 'basic' | 'premium' | 'pro'): Question[] {
  if (plan === 'basic') {
    return questionBank.filter(q => q.planRequired === 'basic');
  } else if (plan === 'premium') {
    return questionBank.filter(q => q.planRequired === 'basic' || q.planRequired === 'premium');
  } else {
    // Pro users get all questions
    return questionBank;
  }
}

/**
 * Get questions by category
 */
export function getQuestionsByCategory(category: Question['category']): Question[] {
  return questionBank.filter(q => q.category === category);
}

/**
 * Get a question by ID
 */
export function getQuestionById(id: string): Question | undefined {
  return questionBank.find(q => q.id === id);
}

/**
 * Get questions by difficulty
 */
export function getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Question[] {
  return questionBank.filter(q => q.difficulty === difficulty);
}
