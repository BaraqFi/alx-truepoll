# TruePoll - Next.js Polling Application

TruePoll is a modern web application built with Next.js that allows users to create, share, and vote on polls. This project uses the App Router, TypeScript, Tailwind CSS, and Shadcn UI components.

## Features

- **User Authentication**: Register, login, and manage user accounts
- **Poll Creation**: Create custom polls with multiple options
- **Poll Voting**: Vote on polls and see real-time results
- **Poll Browsing**: Browse and search through available polls

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── auth/                 # Authentication pages
│   │   ├── login/            # Login page
│   │   └── register/         # Registration page
│   ├── polls/                # Poll-related pages
│   │   ├── [id]/             # Individual poll view
│   │   └── create/           # Poll creation page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/               # React components
│   ├── layout/               # Layout components
│   │   ├── MainLayout.tsx    # Main layout wrapper
│   │   └── Navigation.tsx    # Navigation bar
│   ├── polls/                # Poll-related components
│   │   └── PollCard.tsx      # Poll card component
│   ├── shared/               # Shared components
│   │   └── EmptyState.tsx    # Empty state component
│   └── ui/                   # Shadcn UI components
├── contexts/                 # React contexts
│   └── AuthContext.tsx       # Authentication context
├── lib/                      # Utility functions
│   └── utils.ts              # Helper utilities
└── public/                   # Static assets
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation
- **TypeScript**: Typed JavaScript for better developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Reusable UI components built with Radix UI and Tailwind CSS
- **React Hook Form**: Form validation library
- **Zod**: TypeScript-first schema validation

## Future Enhancements

- Add backend API integration
- Implement real-time updates with WebSockets
- Add analytics for poll creators
- Support for more poll types (multiple choice, ranked choice, etc.)
- Social sharing features
