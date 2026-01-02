🩸 Blood Bank Management System

A modern, full-stack Blood Bank Management System built using React (Vite), Tailwind CSS, Supabase, and Framer Motion.
The platform connects blood donors, patients, and administrators through a secure, fast, and user-friendly web interface

🌐 Live Demo: https://bloodbank-amber.vercel.app/

🚀 Live Features Overview
🌐 Public Features

Modern landing page with animated hero background

Donation camp notices fetched live from database

About & Contact sections

Fully responsive & mobile-friendly UI

👤 User Features

Secure authentication (Login / Register)

Become a blood donor

Search blood by group & city

View available donors

Protected user dashboard

🧑‍💼 Admin Features

Admin-only dashboard

Manage donors & users

Post and update camp notices

Role-based access using Supabase RLS

🔐 Security

Supabase Authentication

Row Level Security (RLS)

Environment-based API keys

🛠️ Tech Stack
Layer	       Technology
Frontend	 | React (Vite)
Styling	   | Tailwind CSS
Animations | Framer Motion
Backend	   | Supabase
Database	 | PostgreSQL (Supabase)
Auth	     | Supabase Auth

⚙️ Local Setup & Run (Step-by-Step)

1️⃣ Clone Repository
git clone https://github.com/sahu-Shivam111/blood_bank
cd blood-bank



2️⃣ Install Dependencies
npm install



3️⃣ Setup Supabase Project

Go to https://supabase.com

Create a new project

Note down:

Project URL

Anon Public Key



4️⃣ Setup Database Schema (IMPORTANT)

Open your Supabase project

Go to SQL Editor

Create a new query

Copy the SQL from:

/supabase/schema.sql


Paste it into the SQL Editor

Click Run

✅ This will:

Create all tables

Enable Row Level Security (RLS)

Add admin & user access rules

Secure the database properly


5️⃣ Setup Environment Variables

Create a .env file in the root directory:

VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here


⚠️ Never commit .env to GitHub

6️⃣ Run Development Server
npm run dev


App will run at:
👉 http://localhost:5173



🧠 Notes

Admin access is controlled via the profiles.role = 'admin'

RLS ensures users can only access their own data

Backend is fully serverless using Supabase
