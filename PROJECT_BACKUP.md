# TruePoll Project Backup

## Project Overview
TruePoll is a polling application built with Next.js 15, Supabase, and Tailwind CSS.

## Key Features (To Be Rebuilt)
- User authentication (login/register/logout)
- Poll creation with multiple choice options
- Voting system (single and multiple choice)
- Poll results with real-time updates
- QR code generation for poll sharing
- Public/private poll settings
- User profiles and statistics

## Technology Stack
- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI components
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Forms**: React Hook Form, Zod validation
- **Icons**: Lucide React
- **QR Codes**: qrcode.react

## Database Schema
The complete SQL schema is saved in `supabase-schema.sql` with:
- polls table
- poll_options table  
- votes table
- user_profiles table
- poll_categories table
- poll_tags table
- poll_analytics table
- Views, functions, triggers, and RLS policies

## File Structure (Before Cleanup)
```
app/
├── auth/ (login, register, logout pages)
├── polls/ (browse, create, individual poll pages)
├── layout.tsx
├── page.tsx
└── globals.css

components/
├── layout/ (MainLayout, Navigation)
├── polls/ (PollCard, CreatePollForm, VotingForm, PollResults, QRCodeDisplay)
├── shared/ (EmptyState)
└── ui/ (Shadcn components)

contexts/
└── AuthContext.tsx

lib/
├── actions/ (polls.ts, votes.ts)
├── supabase.ts
├── supabase-server.ts
└── utils.ts

types/
└── supabase.ts
```

## Dependencies (package.json)
- Next.js 15.5.2
- React 18
- Supabase client and SSR
- Tailwind CSS 3.4.0
- Shadcn UI components
- React Hook Form
- Zod validation
- Lucide React icons
- qrcode.react

## Notes
- All functionality has been removed for a fresh start
- UI components and styling remain intact
- Database schema is preserved for future implementation
- Authentication flow was complex due to Next.js 15 + Supabase SSR issues
