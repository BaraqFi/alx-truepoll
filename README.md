# TruePoll - Modern Polling Application

A modern polling application built with Next.js 15, Supabase, and Shadcn UI components.

## Features

- 🔐 User authentication with Supabase
- 📊 Create and manage polls
- 🗳️ Vote on polls (one vote per user per poll)
- 📱 Responsive design with modern UI
- 🔒 Row Level Security (RLS) for data protection
- ⚡ Real-time updates

## Tech Stack

- **Frontend**: Next.js 15 with App Router
- **UI Components**: Shadcn UI with Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd truepoll
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase Database:
	- Go to your Supabase project dashboard
	- Navigate to the SQL Editor
	- Run the SQL commands from `database-schema.sql`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses three main tables:

- **polls**: Stores poll information
- **poll_options**: Stores poll options
- **votes**: Stores user votes

All tables have Row Level Security (RLS) enabled for data protection.

## Project Structure

```
truepoll/
├── app/
│   ├── auth/                # Authentication pages
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── logout/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── polls/               # Poll management
│   │   ├── page.tsx
│   │   └── create/
│   │       └── page.tsx
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── layout/              # Main layout and navigation
│   ├── polls/               # Poll-related components
│   ├── shared/              # Shared components
│   └── ui/                  # Shadcn UI components
├── contexts/
│   └── AuthContext.tsx      # Auth context provider
├── lib/
│   ├── supabase-server.ts   # Supabase server client
│   ├── supabase.ts          # Supabase client
│   ├── utils.ts             # Utility functions
│   └── actions/             # Poll and vote actions
├── middleware.ts            # Auth middleware
├── types/
│   └── supabase.ts          # TypeScript definitions
├── public/                  # Static assets
├── database-schema.sql      # Database schema
├── database-schema-fixed.sql # Fixed database schema
└── database-voting-policies-fix.sql # Voting policies fix
```

## Authentication Flow

1. Users register/login through the auth pages
2. Middleware protects routes and redirects unauthenticated users
3. AuthContext provides user state throughout the app
4. RLS policies ensure users can only access appropriate data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
