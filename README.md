# 🚀 JhaTech Growth - AI-Driven Digital Growth Platform

JhaTech Growth is a premium, modern MERN stack web platform designed to accelerate local Indian retail shops and services (such as saree shops, boutiques, bakeries, and salons) into the digital era. It combines automated AI audits, competitive intelligence, transparent billing, and a zero-educational-requirement referral program.

> [!NOTE]
> For a detailed breakdown of system data flows, database relationships, and technology choices, please review the [ARCHITECTURE.md](file:///c:/Users/Desktop/JhaTech-project/ARCHITECTURE.md) blueprint.

---

## 🌟 Key Platform Modules

### 1. 🤖 AI Business Pain-Point Analyzer
- **Interactive Questionnaire**: Business owners select their primary local challenges (low walk-in traffic, lack of online catalog, national competitor threats).
- **Custom Audits**: Triggers backend Gemini AI models to generate a customized digital roadmap featuring website recommendations, local marketing strategies, expected ROI, and next steps.
- **WhatsApp Integration**: Allows exporting reports and directly opening support consultations pre-filled with their customized audit findings.

### 2. 🧮 Transparent Quote Calculator & checkout
- **Live Estimate Builder**: Toggle base web templates (Showcase, Catalog, full E-Commerce) and add-on features (SEO, Google Maps configurations, WhatsApp FAQ auto-reply bots).
- **No Hidden Costs**: Visual breakdown detailing exactly where every Rupee goes, complete with value propositions explaining the benefits of each feature.
- **WhatsApp Checkout**: Builds a structured receipt text block and routes users to WhatsApp to initiate development.

### 3. 🤝 Referral Partner Program (Zero Qualifications Required)
- **Open Access**: Anyone can join to earn ₹1,000 commission on closed website sales. Requires only a Google login and UPI ID for payouts.
- **Partner Dashboard**: Track referral codes, copy personal sharing links, and review commission transaction ledgers.
- **Sale Simulator**: Built-in simulator box to log dummy referred sales and test ledger balances.
- **AI Sales Pitch Coach**: A dedicated doubt-clearing AI bot that answers questions and gives sales scripts (e.g., *"How do I pitch a website to a boutique owner?"*).

### 4. 📊 Competitor SWOT & Trend Engine
- **SWOT Profiler**: Enter your shop name and major competitors to generate a localized Strengths, Weaknesses, Opportunities, and Threats audit.
- **Feature Recommendations**: AI maps competitor weaknesses to specific trending website features (with implementation complexity ratings) to help you stand out.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Tailwind CSS v4, PostCSS, Vite, Lucide React, React Router 7 |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, Dotenv, Cors |
| **Artificial Intelligence** | Google Gemini AI Node SDK (`@google/generative-ai` / `gemini-1.5-flash`) |
| **Authentication** | Google Identity Services (Gmail Client JWT) |

---

## 🚀 How to Run Locally

### 1. Prerequisite Systems
- Install **Node.js** (v18+ recommended)
- Install **MongoDB** locally (ensure it is running on `mongodb://127.0.5000:27017`) or prepare a MongoDB Atlas connection string.

### 2. Backend Server Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables in `backend/.env` (see the `.env.example` file):
   - `PORT`: Set backend port (default `5000`)
   - `MONGODB_URI`: Connection string (falls back to local MongoDB automatically)
   - `GEMINI_API_KEY`: Paste your Gemini API key (API calls fall back to high-fidelity simulated response templates if left empty)
   - `GOOGLE_CLIENT_ID`: Paste your Google credentials client ID (enables Google Identity login)
   - `FRONTEND_URL`: `http://localhost:5173` (for local CORS authorization)
4. Start the development server:
   ```bash
   npm run dev
   ```

### 3. React Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install React dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `frontend/.env` (see `.env.example` file):
   - `VITE_API_BASE_URL`: `http://localhost:5000` (points to your local backend API)
4. Launch the local dev server:
   ```bash
   npm run dev
   ```
5. Open your browser to `http://localhost:5173`.

---

## 🌐 Production Deployment Configurations

### 1. Backend Hosting (e.g., Render, Railway)
Configure the following Environment Variables in your backend server dashboard:
- `MONGODB_URI` = `your-mongodb-atlas-connection-uri`
- `GEMINI_API_KEY` = `your-live-google-gemini-key`
- `GOOGLE_CLIENT_ID` = `your-google-oauth-client-id`
- `FRONTEND_URL` = `https://jha-tech-driven.vercel.app` (your production frontend URL)

### 2. Frontend Hosting (e.g., Vercel)
Configure the following Environment Variable in your Vercel project panel:
- `VITE_API_BASE_URL` = `https://localhost:5000` (your production backend URL)

*Note:* A `vercel.json` configuration file is pre-configured in the project root to ensure React client-side routing rewrites work correctly and prevent 404 errors on refreshes.
