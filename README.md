# 🚀 CareerBuddy – AI-Powered Career Transformation Platform

CareerBuddy is a full-stack web application that transforms users from job-seekers into job-ready professionals. From skill analysis to smart resume building, and even live job discovery – CareerBuddy is your one-stop AI companion on the journey to employment.

---

## ✨ Features

🔍 **Smart Job Matching**  
AI-driven engine that maps your skills to the most relevant job roles using NLP and vector similarity (FAISS + Sentence Transformers).

📊 **Skill Gap Analysis**  
Compare your current skill set with job requirements to identify what's missing.

📚 **Personalized Learning Recommendations**  
Based on skill gaps, get course suggestions to upskill quickly and efficiently.

📄 **AI Resume Builder**  
Generate or Optimise ATS-friendly resumes tailored to job descriptions.

🛠️ **Live Job Feed**  
Integrated real-time job listings with save-for-later functionality.

🔐 **Secure JWT-Based Authentication**  
Robust login flow to protect and personalize user experiences.

🧠 **Profile-Based Suggestions**  
Recommendations based on user goals, location, and current expertise.

---

## 🧰 Tech Stack

### 🔹 Frontend
- React.js (Vite)
- Tailwind CSS
- PDF.js (for resume generation)

### 🔹 Backend
- Express.js
- Playwright

### 🔹 ML Model
- BERT Sentence Transformer (for Skill To Job Matching)
- FAISS (Vector DB)
- FastAPI (Python)
- Pandas, NumPy

### 🔹 Database
- MongoDB (for user profiles, saved jobs, saved job roles, saved courses, cached courses, etc.)

### 🔹 Deployment
- Frontend: Vercel
- Backend: Render
- ML Model: Hugging Face Spaces (FastAPI)
- DB: MongoDB Atlas

---

## Architecture



## ⚙️ Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/yourusername/careerbuddy.git
cd careerbuddy
