🩸 Blood Bank Management System

A modern, full‑stack Blood Bank Management System built using React (Vite), Tailwind CSS, Supabase, and Framer Motion. The platform connects blood donors, patients, and administrators through a secure, fast, and user‑friendly web interface.



🚀 Live Features Overview

🌐 Public Features

Modern Landing Page with animated hero background

Donation camp notices fetched live from database

About & Contact sections

Responsive and mobile‑friendly UI



👤 User Features

Secure authentication (Login / Register)

Become a blood donor

Search blood by group & city

View available donors

Protected dashboard



🧑‍💼 Admin Features

Admin‑only dashboard

Manage donors & users

Post and update camp notices

Role‑based access using Supabase RLS



🔐 Security

Supabase Authentication

Row Level Security (RLS)

Environment‑based API keys

🛠️ Tech Stack

Layer        |       Technology

Frontend     |      React (Vite)

Styling      |       Tailwind CSS

Animations   |       Framer Motion

Backend      |       Supabase

Database     |       PostgreSQL (Supabase)

Auth         |       Supabase Auth



⚙️ Local Setup & Run (Step‑by‑Step)

1️⃣ Clone Repository

git clone https://github.com/sahu-Shivam111/blood-bank 
cd blood-bank

2️⃣ Install Dependencies

npm install

3️⃣ Setup Environment Variables

Create a .env file in the root directory:

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

⚠️ Never commit .env to GitHub



4️⃣ Run Development Server

npm run dev

App will run at:
👉 http://localhost:5173

