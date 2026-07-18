# Insight

> **Explainable AI for Smarter Investing**

Insight is a modern AI-powered financial intelligence platform that helps investors understand **why** an investment may be good or bad—not just what the numbers are. It combines financial data, technical indicators, company fundamentals, risk analysis, and AI-generated explanations into a single intuitive platform.

This repository contains the **Next.js frontend** for Insight.

---

## ✨ Features

- **🧠 Explainable AI**: Understand *why* an investment is recommended with human-readable, AI-generated reasoning.
- **📊 Financial Intelligence**: Deep-dive into company fundamentals, earnings reports, and financial statements.
- **📈 Technical Analysis**: Real-time technical indicators to gauge market momentum and trends.
- **🛡️ Risk Engine**: Comprehensive risk profiling and portfolio exposure tracking.
- **📰 News & Sentiment**: Real-time market sentiment analysis driven by the latest news.
- **💼 Portfolio & Watchlist**: Track your investments and keep a close eye on stocks you're interested in.

---

# Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | React Framework |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Lucide React | Icons |

---

# Project Structure

```text
insight-project/
│
├── frontend/               <-- Next.js Application
│   ├── app/                <-- Next.js Routing Layer
│   ├── components/         <-- React Components
│   ├── hooks/              <-- Custom React Hooks
│   ├── lib/                <-- Utility libraries
│   ├── services/           <-- API Integrations
│   ├── store/              <-- Global State (Zustand)
│   ├── types/              <-- TypeScript Definitions
│   └── package.json
│
└── backend/                <-- Backend Server (Upcoming)
```

---

# Current Progress

### Landing Page

- ✅ Animated Navbar
- ✅ Hero Section
- ✅ Features Section
- 🚧 How It Works
- 🚧 Pricing
- 🚧 FAQ
- 🚧 Footer

### Dashboard

- 🚧 Dashboard Layout
- 🚧 Company Analysis
- 🚧 Portfolio
- 🚧 Watchlist
- 🚧 Screener

---

# Getting Started

## Clone the repository

```bash
git clone https://github.com/shikhar0x/Insight-frontend.git

cd Insight-frontend
```

---

## Install dependencies

Make sure you are in the `frontend` directory before installing dependencies.

```bash
cd frontend
npm install
```

### Important Dependencies

The frontend relies on several key packages. If you encounter any missing module errors, make sure the following are installed:

- `framer-motion` (Animations)
- `@tanstack/react-query` (Data fetching)
- `zustand` (State management)
- `lucide-react` & `react-icons` (Icons)
- `recharts` (Charts)
- `zod` & `react-hook-form` (Forms)
- `clsx` & `tailwind-merge` (Styling utilities)

If you ever need to manually install them all at once:
```bash
npm install framer-motion @tanstack/react-query zustand lucide-react react-icons recharts zod react-hook-form clsx tailwind-merge
```

---

## Start the development server

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

---

# Scripts

```bash
npm run dev      # Development server

npm run build    # Production build

npm run start    # Start production server

npm run lint     # ESLint
```

---

# Roadmap

- Landing Page
- Authentication
- AI Chat Assistant
- Stock Search
- Explainable AI Dashboard
- Company Analysis
- Portfolio Tracking
- Watchlist
- Financial Statements
- Technical Analysis
- Risk Engine
- News & Sentiment Analysis
- Responsive Dashboard
- Dark Theme Improvements

---

# Contributing

Contributions are welcome.

If you'd like to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a Pull Request.

---

# License

This project is currently under active development.

A license will be added before the first stable release.

---

# Authors

**Shikhar Upadhyay**

GitHub: https://github.com/shikhar0x

---

## Status

🚧 **Insight is currently under active development.**
