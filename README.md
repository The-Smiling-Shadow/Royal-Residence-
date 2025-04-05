**The Smiling Shadow Royal Residence Hotel Booking System**

The Smiling Shadow Royal Residence is a modern hotel booking and management platform designed for seamless hospitality operations. This system combines a user-friendly interface with robust backend functionality, leveraging cutting-edge web technologies like React, TypeScript, TailwindCSS, and Supabase.

Features
Responsive Design: Clean and mobile-friendly user interface.

Authentication: Secure user login and registration powered by Supabase.

Admin Dashboard: Tools for managing bookings, hotels, and user data.

Dynamic Pages: Includes pages for Home, Hotels, Booking, Contact, About, Admin Dashboard, and more.

Real-Time Analytics: Live booking updates and reporting for administrators.

Tech Stack
Frontend: React 18, TypeScript, TailwindCSS

Backend: Supabase (PostgreSQL database)

Build Tool: Vite

Styling: TailwindCSS with custom theme configurations

Linting: ESLint with TypeScript support

Package Manager: npm

Getting Started
Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v16 or higher)

npm (v8 or higher)

Installation
Clone the repository:

bash
git clone https://github.com/The-Smiling-Shadow/Royal-Residence.git
cd Royal-Residence
Install dependencies:

bash
npm install
Configure environment variables by creating a .env file in the root directory:

text
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
Start the development server:

bash
npm run dev
Open your browser and navigate to http://localhost:5173.

Directory Structure
Here’s an overview of the project structure:

text
Royal-Residence/
├── README.md               # Project documentation
├── eslint.config.js        # ESLint configuration for TypeScript and React
├── index.html              # Main HTML file for the app
├── package.json            # Project metadata and dependencies
├── postcss.config.js       # PostCSS configuration for TailwindCSS
├── tailwind.config.js      # TailwindCSS theme settings and plugins
├── tsconfig.app.json       # TypeScript configuration for app files
├── tsconfig.json           # Base TypeScript configuration
├── tsconfig.node.json      # TypeScript configuration for Node.js files
├── vite.config.ts          # Vite build tool configuration
├── src/                    # Source code directory
│   ├── App.tsx             # Main application component with routing logic
│   ├── index.css           # Global CSS styles using TailwindCSS
│   ├── main.tsx            # Application entry point for rendering React components
│   ├── vite-env.d.ts       # Vite environment type definitions
│   ├── components/         # Reusable UI components (e.g., Navigation, AdminLayout)
│   ├── contexts/           # Context providers (e.g., AuthContext)
│   ├── lib/                # Utility libraries (e.g., Supabase client)
│   ├── pages/              # Page components (e.g., Home, Hotels, Booking)
│   ├── styles/             # Styling utilities (e.g., colors.ts)
│   └── types/              # TypeScript type definitions (e.g., supabase.ts)
├── supabase/               # Supabase-related files including migrations
│   └── migrations/         # Database migration scripts in SQL format
└── .bolt/                  # Miscellaneous configurations for Bolt framework or tools
    ├── config.json         # Bolt configuration file
    └── prompt              # Bolt prompt file or script
Admin Dashboard
The administrative interface implements role-based access control with nested routing. Key features include:

Real-Time Booking Analytics

User Role Administration

Hotel Inventory Management

Revenue Reporting

Example structure of the admin panel:

tsx
// AdminLayout.tsx
export function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-grow p-8">
        <Outlet />
      </main>
    </div>
  );
}
Styling System
Design Tokens
Custom theme configurations in tailwind.config.js:

javascript
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#e7a32b',
          navy: '#030341',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
};
Component-level styles are defined using Tailwind's @layer directive:

css
@layer components {
  .btn-primary {
    @apply bg-brand-gold text-brand-navy px-6 py-3 rounded-lg transition-all duration-300 hover:bg-brand-gold/90;
  }
}
Database Schema Management
Migration Strategy
Database changes are managed through timestamped SQL files:

sql
-- 20250306151655_red_dream.sql
CREATE TABLE hotels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location GEOGRAPHY(POINT),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
The migration system supports three primary tables:

Users: Authentication and profile management.

Hotels: Property details and geolocation data.

Bookings: Reservation records with temporal constraints.

Deployment Strategy
Production Build
Generate optimized assets for deployment:

bash
npm run build
The build process outputs files to the dist directory, ready for deployment to platforms like Vercel or Netlify.

Quality Assurance
Static Analysis
ESLint configurations enforce TypeScript best practices:

javascript
export default tseslint.config({
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
  },
});
Linting rules include:

Strict null checks.

React hooks dependencies validation.

Detection of unused variables and parameters.

Contributing
Contributions are welcome! Follow these steps to contribute:

Fork the repository.

Create a new branch (git checkout -b feature-name).

Implement your changes.

Write tests or update documentation where applicable.

Submit a pull request.

License
This project is licensed under the MIT License.

Contact
For any inquiries or support:

Email: your-email@example.com

GitHub Profile: your-github-profile
