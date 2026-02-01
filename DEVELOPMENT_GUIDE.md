# 🎓 Mentor Me - Mentorship Platform

A modern, interactive mentorship platform connecting students and newcomers with experienced mentors. Built with React, TypeScript, Clerk Authentication, and beautiful UI/UX.

## ✨ Features

### 🔐 Authentication
- **Clerk Integration**: Secure authentication with email/password, social logins (Google, GitHub, etc.)
- **Protected Routes**: Dashboard and Profile pages only accessible to signed-in users
- **User Management**: Automatic user profile creation and management

### 🏠 Home Page
- Beautiful hero section with gradient backgrounds
- Feature highlights showcasing platform benefits
- Clear call-to-action buttons for sign-up and sign-in
- Responsive design for all devices
- Smooth animations with Framer Motion

### 📊 Dashboard
- **Mentor Discovery**: Browse and search through available mentors
- **Advanced Filtering**: Filter mentors by specialization/field
- **Smart Search**: Search by name, title, or expertise
- **Matching Algorithm**: Best matches displayed first based on compatibility
- **Connection Tracking**: See your mentorship connections
- **Statistics**: View total available mentors and fields of expertise
- **Interactive Cards**: Beautiful mentor cards with ratings and skills

### 👤 Profile Management
- **Profile Editing**: Update personal information, bio, skills, and interests
- **Role Selection**: Choose between mentee, mentor, or both
- **Availability Status**: Set your current availability status
- **Skills & Interests**: Add and manage your professional skills and interests
- **Professional Info**: Add your title, location, and bio

### 🎨 UI/UX Highlights
- **Modern Design System**: Consistent color scheme with CSS variables
- **Smooth Animations**: Framer Motion animations throughout
- **Responsive Layout**: Mobile-first design that works on all screen sizes
- **Interactive Components**: Hover effects, smooth transitions, and feedback
- **Accessibility**: Proper semantic HTML and focus states
- **Dark Mode Ready**: CSS variables allow easy theme switching

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 + TypeScript
- **Routing**: React Router v7
- **Authentication**: Clerk React
- **Animation**: Framer Motion
- **Styling**: Modern CSS with CSS Variables
- **Backend**: Supabase (PostgreSQL)
- **Build Tool**: Vite
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── components/
│   ├── NavBar.tsx           # Navigation bar with responsive menu
│   ├── MentorCard.tsx       # Reusable mentor card component
│   └── IconButton.tsx       # Icon button component
├── pages/
│   ├── Home.tsx             # Landing page
│   ├── Dashboard.tsx        # Mentor discovery & browsing
│   └── Profile.tsx          # User profile management
├── hooks/
│   └── useEnsureUser.ts     # Custom hook for user management
├── lib/
│   └── supabase.ts          # Supabase client configuration
├── styles/
│   ├── home.css             # Home page styles
│   ├── dashboard.css        # Dashboard styles
│   ├── profile.css          # Profile page styles
│   ├── navbar.css           # Navigation bar styles
│   └── mentorcard.css       # Mentor card styles
├── App.tsx                  # Main application component
├── App.css                  # Global application styles
├── index.css                # Global styles
└── main.tsx                 # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Clerk account (for authentication)
- Supabase account (for database)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd clerk-react
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🔑 Key Components

### NavBar Component
- Sticky header with responsive mobile menu
- Logo with branding
- User authentication button
- Navigation links for authenticated users
- Smooth animations and transitions

### MentorCard Component
- Professional mentor profile display
- Rating system with star visualization
- Skills and specialization badges
- Availability status indicator
- Connection/Message buttons
- Responsive grid layout

### Dashboard Page
- Mentor grid with smooth animations
- Real-time search functionality
- Filter pills for specialization
- Statistics cards showing platform insights
- Loading states with spinner animation
- No results message with helpful copy

### Profile Page
- User avatar and basic information
- Editable profile fields
- Skills and interests management
- Role selection (mentee/mentor/both)
- Availability settings
- Save/Cancel action buttons

## 🎨 Design System

### Color Palette
```css
--primary: #6366f1       /* Indigo */
--secondary: #8b5cf6     /* Purple */
--success: #10b981       /* Emerald */
--danger: #ef4444        /* Red */
--warning: #f59e0b       /* Amber */
```

### Spacing Scale
- 0.25rem, 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem, 3rem, 4rem, 6rem

### Typography
- Font Family: System fonts for optimal performance
- Headings: Bold (700) with proper hierarchy
- Body Text: Regular (400) with readable line height

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px
- **Small Mobile**: 480px and below

## 🔄 Data Flow

1. **Authentication**: User signs up/in via Clerk
2. **User Creation**: Automatic user record in Supabase
3. **Profile Setup**: Users complete their profile information
4. **Mentor Discovery**: Dashboard fetches and displays mentors
5. **Connections**: Users send mentorship requests
6. **Profile Updates**: Users can update their information anytime

## 🎯 Mock Data

The dashboard includes mock mentor data for demonstration:
- Sarah Johnson - Software Engineer
- Michael Chen - Product Manager
- Emma Rodriguez - UX/UI Designer
- David Kim - Data Scientist
- Lisa Wang - Business Consultant
- Alex Thompson - DevOps Engineer

Replace with real data from your Supabase backend when ready.

## 📝 Database Schema (Supabase)

### users table
```sql
- id (UUID, primary key)
- email (string)
- full_name (string)
- created_at (timestamp)
```

### profiles table
```sql
- user_id (UUID, foreign key)
- name (string)
- title (string)
- bio (text)
- skills (array)
- interests (array)
- availability (string)
- location (string)
- role (string: mentee/mentor/both)
- updated_at (timestamp)
```

### matches table
```sql
- id (UUID, primary key)
- mentor_id (UUID)
- mentee_id (UUID)
- status (string: pending/accepted/rejected)
- created_at (timestamp)
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy Options
- **Vercel**: Recommended for Next.js/React apps
- **Netlify**: Simple drag-and-drop deployment
- **Railway**: Full-stack deployment with database
- **Heroku**: Traditional PaaS deployment

## 🔒 Security Considerations

1. **API Keys**: Keep Supabase and Clerk keys in environment variables
2. **Authentication**: Clerk handles OAuth securely
3. **Database**: Supabase provides Row Level Security (RLS) policies
4. **CORS**: Configure proper CORS headers
5. **Rate Limiting**: Implement rate limiting for API endpoints

## 🐛 Troubleshooting

### Clerk Authentication Not Working
- Verify VITE_CLERK_PUBLISHABLE_KEY is set correctly
- Check Clerk dashboard for application settings
- Ensure redirect URLs are configured

### Supabase Connection Issues
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Check Supabase project status
- Verify CORS settings in Supabase

### Styling Issues
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check CSS variable names for typos
- Verify CSS files are imported in components

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [Clerk Documentation](https://clerk.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Framer Motion Guide](https://www.framer.com/motion/)
- [React Router Documentation](https://reactrouter.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Next Steps

1. **Connect to Real Backend**: Replace mock data with Supabase queries
2. **Add Messaging**: Implement real-time messaging between mentors and mentees
3. **Notifications**: Add push notifications for match requests
4. **Reviews & Ratings**: Let users review and rate mentors
5. **Scheduling**: Add calendar integration for mentorship sessions
6. **Search Optimization**: Implement Elasticsearch for better search
7. **Analytics**: Track user engagement and platform metrics
8. **Premium Features**: Add subscription tiers with premium mentoring

## 💡 Questions or Support

For questions, issues, or suggestions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ for connecting mentors and students**
