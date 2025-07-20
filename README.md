# 🚀 CareerBuddy – AI-Powered Career Transformation Platform

CareerBuddy is a full-stack web application that transforms users from job-seekers of all domain into job-ready professionals. From skill analysis to smart resume building, and even live job discovery – CareerBuddy is your one-stop AI companion on the journey to employment.

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

## 📦 Key Modules

**1. Authentication**
- User logs in via JWT Auth
- Tokens stored client-side securely

**2. User Profile System**
- Stores:
    - Personal Info
    - Skills
    - Experience, Education
    - Projects, Certificates

**3. Job Role Suggestion Engine**
- Triggered after profile update
- Uses FastAPI service with:
    - BERT for sentence embedding*
    - FAISS for vector similarity
    - Suggests roles matching skills

**4. Job Vacancies Explorer**
- Uses Adzuna API
- User can:
    - View job details
    - Save to favorites or applied
    - Filter/search
    - Shows skill gap analysis for each job using profile vs job vector difference
- "Apply" redirects to external URL

**5. Skill Gap & Course Recommendation**
- Skill differences → Scrapes courses on the fly
- Live scraping filters:
    - Free/Paid
    - Difficulty: Beginner / Intermediate / Advanced
    - Certificate: Yes / No

**6. Resume Builder + Optimizer**
- Users can:
    - Manually upload a resume
    - Or use app’s resume builder
- Optimized via:
    - Gemini 2.5 Flash
    - Section-wise feedback
    - Missing JD keywords
    - ATS score + suggestions

**7. Saved Items**
- User can save:
    - Job roles
    - Vacancies
    - Courses
    - Applied jobs

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

### 🔹 DataSet Used
- 1.3M Linkedin Jobs & Skills (2024):
    - Scraped Jobs from Linkedin. Augmented with Job Skills
    - [Link📎](https://www.kaggle.com/datasets/asaniczka/1-3m-linkedin-jobs-and-skills-2024)

---

## Architecture

                             ┌────────────────────────┐
                             │     React Frontend     │
                             └──────────┬─────────────┘
                                        │
                            JWT Auth, API Calls
                                        │
                             ┌──────────▼────────────┐
                             │  Node.js + Express.js │  ← REST API Gateway
                             └┌──┬───────┬───┬──┬────┘
                              |  │       |   │  |  
    ┌────────────────────┐    │  |       │   |  │     ┌──────────────────────────┐
    │  MongoDB (Atlas)   │◄───┘  |       │   |  └────►│  Adzuna API (Job Search) │
    │User & Job Metadata │       |       │   |        └──────────────────────────┘
    └────────────────────┘  ┌────┘       │   └──────────────────┬
                            |     ┌──────▼──────┐               |
    ┌───────────────────────▼─┐   │ FastAPI ML  │               |
    │  Course Scraper (Live)  │   │  (Python)   │               | 
    └─────────────────────────┘   └──────┬──────┘               |
                                         │                      | 
                        ┌────────────────▼────────────────┐     |
                        │   BERT + FAISS (Skill Matcher)  │     |
                        └─────────────────────────────────┘     |
                                                                |        
        ┌────────────────────────┐        ┌─────────────────────▼──┐
        │  Gemini Resume Engine  │◄───────┤   Resume Optimizer API │
        └────────────────────────┘        └────────────────────────┘


---

## ⚙️ Getting Started

# Before you begin, make sure you have the following installed:

- Node.js (v18 or later)
- npm or yarn
- Python 3.10+ with pip
- MongoDB Atlas Account
- Adzuna API Key (for job search integration)
- FAISS-compatible system 
- Hugging Face Transformers (sentence-transformers)
- Gemini API key (for resume generation)

### 1. Clone the Repo
```bash
git clone https://github.com/Satirtha-Ghosal/AI_Job_Matcher.git
```

### 2. Setup .env file
```bash
GEMINI_API_KEY=
JWT_SECRET=
MONGODB_PASSWORD=
ADZUNA_APP_ID=
ADZUNA_APP_KEY=
```

### 2. Run ML Engine (FastAPI)
```bash
cd mlEngine
pip install -r requirements.txt
uvicorn main:app -reload
cd ../
```

### 3. Run Backend (Express.js)
```bash
cd backend
npm install
npm run start
cd ../
```

### 4. Run Frontend (Vite + React.js)
```bash
cd frontend
npm install
npm run dev
cd ../
```