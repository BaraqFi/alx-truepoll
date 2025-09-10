# TruePoll Setup Instructions

## Prerequisites

1. **Node.js 20+** (recommended) or Node.js 18+ (with warnings)
2. **Supabase Account** - Sign up at [supabase.com](https://supabase.com)

## Setup Steps

### 1. Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**To get these values:**
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the "Project URL" and "anon public" key

### 2. Database Setup

1. In your Supabase project, go to the SQL Editor
2. Copy and paste the entire contents of `supabase-schema.sql`
3. Run the SQL script to create all tables, indexes, and functions

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Features

### ✅ Implemented Functionality

- **User Authentication**
  - Login/Register with email and password
  - Protected routes with middleware
  - User session management
  - Automatic redirects after login

- **Poll Management**
  - Create polls with multiple options
  - Single choice and multiple choice polls
  - Public/private poll settings
  - Real-time poll results

- **Voting System**
  - Cast votes on polls
  - Prevent duplicate voting (single choice)
  - Allow multiple votes (multiple choice)
  - Real-time results display

- **User Interface**
  - Responsive design with Tailwind CSS
  - Loading states and error handling
  - Toast notifications
  - QR code generation for poll sharing

### 🔧 Technical Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context API

### 📊 Database Schema

The application uses a comprehensive PostgreSQL schema with:
- User profiles and authentication
- Polls with options and metadata
- Voting system with constraints
- Analytics and statistics
- Row Level Security (RLS) policies

## Troubleshooting

### Common Issues

1. **Build Errors**: Make sure all environment variables are set correctly
2. **Database Errors**: Ensure the SQL schema has been applied to your Supabase project
3. **Authentication Issues**: Check that RLS policies are enabled and configured correctly

### Development Tips

- Use the Supabase dashboard to monitor database activity
- Check the browser console for client-side errors
- Use the Network tab to debug API calls
- The middleware handles route protection automatically

## Next Steps

The application is now fully functional with:
- Complete authentication system
- Poll creation and management
- Voting functionality
- Real-time results
- Error handling and validation

You can now:
1. Create user accounts
2. Create and share polls
3. Vote on polls
4. View real-time results
5. Customize the UI and add new features
