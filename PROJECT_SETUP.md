# Interview Buddy Platform - Project Setup

## Overview

This is a Next.js 14+ application with TypeScript and Tailwind CSS, built for the Interview Buddy Platform hackathon project.

## Technology Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS v4
- **Package Manager**: npm

## Project Structure

```
/
├── app/              # Next.js App Router pages and layouts
├── components/       # React components organized by feature
├── services/         # Service layer (Auth, Session, Analytics, Storage)
├── lib/              # Utility functions, question banks, mock data
├── types/            # TypeScript type definitions
├── public/           # Static assets
└── node_modules/     # Dependencies
```

## Configuration

### TypeScript
- Strict mode: ✅ Enabled
- Target: ES2017
- Module: ESNext
- Path aliases: `@/*` maps to root directory

### Tailwind CSS
Custom theme colors configured in `app/globals.css`:
- Primary: Blue (#3b82f6)
- Secondary: Purple (#8b5cf6)
- Accent: Amber (#f59e0b)
- Plan badges: Basic (Gray), Premium (Purple), Pro (Amber)

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Next Steps

Follow the implementation plan in `.kiro/specs/interview-buddy-platform/tasks.md`:
1. ✅ Task 1: Project initialization (COMPLETE)
2. Task 2: Define TypeScript interfaces
3. Task 3: Implement StorageService
4. Task 4: Create mock data and question bank
5. ... (see tasks.md for full plan)

## Development Notes

- All data is stored in localStorage (no backend)
- Mock authentication for hackathon demo
- Feature gating based on user plan (Basic, Premium, Pro)
- 3-day build timeline with incremental testing
