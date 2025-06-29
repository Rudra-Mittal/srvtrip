# Srvtrip

**Website:** [https://srvtrip.live](https://srvtrip.live)

Srvtrip is an AI-powered travel planning platform that generates personalized, detailed itineraries, aggregates authentic reviews, and provides actionable travel insights for destinations worldwide. The platform leverages advanced AI models, real-time web scraping, and a robust microservices architecture to deliver seamless travel planning experiences.

---

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Key Components](#key-components)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Web Scraper](#web-scraper)
  - [Load Balancer](#load-balancer)
- [AI & Data](#ai--data)
- [Authentication](#authentication)
- [APIs & Endpoints](#apis--endpoints)
- [Setup & Development](#setup--development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **AI-Generated Itineraries:**  
  Generate multi-day, budget-optimized, interest-based travel itineraries using Google Gemini and Groq AI models.

- **Review Aggregation & Summarization:**  
  Scrapes and summarizes thousands of authentic reviews for each place, providing actionable insights and ratings.

- **Interactive Timeline & Map:**  
  Visualize your trip with a day-wise timeline and interactive maps for all destinations and activities.

- **Personal AI Travel Assistant:**  
  Chatbot provides instant, detailed answers about any place in your itinerary.

- **User Authentication:**  
  Secure signup/signin with Firebase Auth, Google OAuth, and OTP-based flows.

- **Itinerary Management:**  
  Save, fetch, and manage multiple itineraries per user, with real-time updates.

- **Scalable Microservices:**  
  Distributed architecture with load-balanced web scrapers and robust backend APIs.

---

## Architecture Overview

Srvtrip is built as a distributed microservices system:

- **Frontend:**  
  React + TypeScript SPA, deployed on Vercel/Netlify.

- **Backend:**  
  Node.js/Express API server, Prisma ORM, PostgreSQL DB, deployed on a cloud VM.

- **Web Scraper Cluster:**  
  Multiple Node.js/Playwright-based scraper servers, managed via a custom load balancer.

- **Load Balancer:**  
  Node.js service that distributes scraping tasks and handles failover/retries.

- **AI Integration:**  
  Google Gemini, Groq, and Weaviate vector DB for semantic search and summarization.

---

## Tech Stack

- **Frontend:** React, TypeScript, Redux, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express, Prisma, PostgreSQL, dotenv, cookie-parser, rate-limiter
- **Authentication:** Firebase Auth, Google OAuth, OTP
- **AI/ML:** Google Gemini, Groq, Weaviate (vector DB), JinaAI, Mistral
- **Web Scraping:** Playwright (Chromium/Firefox)
- **Infrastructure:** Docker, Vercel/Netlify, Cloud VM, environment-based config

---

## Key Components

### Frontend

- Located in `/frontend`
- Modern SPA with animated UI, timeline, map, review aggregation, and chatbot
- Uses Redux for state management and hooks for SSE (Server-Sent Events) updates
- Responsive and mobile-friendly

### Backend

- Located in `/backend`
- Express API with endpoints for itinerary generation, user management, review summarization, and querying
- Prisma ORM for PostgreSQL database
- Rate limiting, CORS, and secure cookie/session management
- Integrates with AI models and orchestrates scraping via load balancer

### Web Scraper

- Located in `/web_scraper`
- Playwright-based scrapers for Google Maps reviews
- Handles concurrency, retries, and communicates with backend/load balancer
- Summarizes reviews and sends data to backend for storage

### Load Balancer

- Located in `/load_balancer`
- Receives scraping requests, selects best scraper, manages retries/failover
- Tracks request status and communicates results back to backend/frontend

---

## AI & Data

- **Itinerary Generation:**  
  Uses Google Gemini and Groq models to generate detailed, realistic, and budget-optimized itineraries in strict JSON format.

- **Review Summarization:**  
  Scrapes Google Maps reviews, stores them in Weaviate vector DB, and summarizes using Gemini/Mistral.

- **Semantic Search:**  
  Enables querying similar places and reviews using vector search.

---

## Authentication

- **Firebase Auth:**  
  Email/password, Google OAuth, and email OTP flows.

- **JWT & Sessions:**  
  Backend issues JWTs for authenticated sessions, with secure cookie storage.

---

## APIs & Endpoints

### Backend (`/backend`)

- `POST /signup` — User registration
- `POST /signin` — User login (email/password or Google)
- `POST /generate-otp` — Send OTP for email verification
- `POST /verify-otp` — Verify OTP and complete registration
- `POST /forgot-password/send-otp` — Forgot password OTP
- `POST /forgot-password/verify-otp` — Verify forgot password OTP
- `POST /forgot-password/reset` — Reset password
- `GET /api/auth/user` — Get current user info
- `POST /api/itenary` — Generate itinerary (AI, supports SSE)
- `GET /api/itineraries` — Fetch all user itineraries
- `POST /api/fetchitineraries` — Fetch new itineraries (excluding stored IDs)
- `POST /api/summarize` — Save summarized review (server-to-server)
- `GET /api/summarize` — Get summarized review for a place
- `POST /query` — Semantic search for places/reviews

### Web Scraper (`/web_scraper`)

- `POST /scraper` — Accepts scraping tasks (protected by server API key)
- `GET /status` — Returns scraper queue and active task status

### Load Balancer (`/load_balancer`)

- `POST /loadbalancer` — Receives new scraping requests, assigns to best scraper
- `POST /scraper-result` — Scrapers report success/failure for each request

---

## Setup & Development

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- Firebase project (for Auth)
- Google Gemini, Groq, and Weaviate API keys

### Environment Variables

Each service uses `.env` files for configuration. Key variables include:

- `FRONTEND_URL`, `BACKEND_URL`
- `WEAVIATE_URL`, `WEAVIATE_API_KEY`, `JINAAI_API_KEY`, `GOOGLE_API_KEY`
- `SERVER_API_KEY`, `LOAD_BALANCER_URL`
- `FIREBASE_*` (for Auth)
- `GEMINI_API_KEY`, `GROQ_API_KEY`

### Running Locally

1. **Clone the repo:**  
   `git clone https://github.com/Rudra-Mittal/srvtrip.git`

2. **Install dependencies:**  
   - Frontend: `cd frontend && npm install`
   - Backend: `cd backend && npm install`
   - Web Scraper: `cd web_scraper && npm install`
   - Load Balancer: `cd load_balancer && npm install`

3. **Configure `.env` files** for each service.

4. **Start services:**  
   - Backend: `npm run dev` (port 4000)
   - Frontend: `npm run dev` (port 5173)
   - Web Scraper: `npm run dev` (port 3000/3001)
   - Load Balancer: `npm run dev` (port 9000)

5. **Access the app:**  
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Deployment

- **Frontend:** Deploy on Vercel/Netlify, set environment variables in dashboard.
- **Backend:** Deploy on cloud VM or managed Node.js service, ensure DB and AI keys are set.
- **Web Scraper:** Deploy multiple instances for scalability, update scraper URLs in load balancer config.
- **Load Balancer:** Deploy on VM or managed Node.js service, ensure all scraper URLs are reachable.

---

## Contributing

Contributions are welcome! Please open issues or pull requests for improvements, bug fixes, or new features.

---

## License

Srvtrip is licensed under the MIT License.

---

**Srvtrip** — AI-powered travel, reimagined.  
[https://srvtrip.live](https://srvtrip.live)
