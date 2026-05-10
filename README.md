# GitHub Analyzer AI

An AI-powered GitHub profile analysis platform designed for developers and recruiters.
The application analyzes GitHub profiles and repositories to generate AI-based insights, developer summaries, and recruiter-focused candidate evaluations.

---

## Features

### Developer Mode

* GitHub profile analysis
* AI-generated developer summary
* Technology stack identification
* Repository insights
* Developer focus detection

### Recruiter Mode

* Candidate evaluation based on recruiter requirements
* AI-generated match score
* Strengths and weakness analysis
* Technical fit assessment

### Authentication

* Login & Signup system
* Session-based authentication
* Logout functionality

### UI Features

* Modern responsive UI
* Animated background effects
* Search history suggestions
* Keyboard shortcut support
* Smooth transitions and interactions

---

## Tech Stack

### Frontend

* React.js
* CSS3
* Vite

### Backend

* Node.js
* Express.js

### APIs & AI

* GitHub REST API
* Groq API
* Llama 3.1 8B Instant

---

## Project Workflow

```text
GitHub Username
      ↓
GitHub API Fetch
      ↓
Backend Processing
      ↓
Groq AI Analysis
      ↓
Formatted AI Response
      ↓
Frontend Visualization
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/manjugowda-l/github-analyzer.git
```

### Frontend Setup

```bash
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
node server.js
```

---

## Environment Variables

Create a `.env` file inside the backend folder:

```env
GROQ_API_KEY=your_api_key_here
```

---

## Deployment

* Frontend: Vercel
* Backend: Render

---

## Author

Manju Gowda
