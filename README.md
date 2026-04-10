# 🚀 Job Listing Portal (MERN Stack)

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) 
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

A brilliantly designed, robust, and full-featured Job Listing Portal engineered using the MERN stack. Designed specifically to bridge the gap between talented job seekers and leading employers, this platform features a massively scalable architecture mapped underneath a gorgeous, premium, light-themed global design system.

---

## ✨ Core Features

### 🏢 For Employers
- **Job Creation & Management:** Spin up rich job postings specifying skills, deadlines, salaries, and benefits seamlessly.
- **Dynamic Applicant Tracking (ATS):** A fully comprehensive pipeline dashboard to review applicants. Instantly jump from "Submitted" to "Shortlisted" to "Offer Extended" in real-time.
- **Company Branding:** Interactive forms to modify your corporate footprint (Company sizes, Logos, Industry footprints).

### 👨‍💻 For Job Seekers
- **Search & Filter Paradigm:** Blazing-fast dynamic filtering mechanism leveraging URL queries (Search by Location, Keywords, Job Types).
- **One-Click Apply Pipeline:** Instantly blast applications retaining your built-in profile credentials directly to employers.
- **Resume Hub:** Integrated NodeJS backend Multer workflows to store and attach resumes locally without cloud dependencies.
- **Saved Opportunities:** Maintain a bookmark stash for jobs you want to monitor over the long term.

### 🛡️ Foundational Architecture
- **JWT Hybrid Authorization:** Segregated logic enforcing that job-postings can only originate from `employer` accounts, and applications can only trigger from `seeker` accounts.
- **Custom Global CSS Engine:** Completely vanilla robust `.css` stylesheets leveraging glassmorphism layers, dynamic keyframe float animations, CSS grid integrations, and upscale inter-font typography, achieving a look entirely unique without relying on external libraries like Tailwind.

---

## 💻 Tech Stack

### Frontend
- **React.js 18** (Vite bundler) for lightning-quick HMR
- **React Router v6** for nested dashboard endpoints & protected routing wrappers.
- **React Hot Toast** for beautiful interactive UI popups.
- **React Icons** (Feather library subset).

### Backend
- **Node.js & Express** serving fully scalable REST endpoints.
- **MongoDB** linked through Mongoose (with 7 fully-relational isolated Schemas).
- **JWT (JSON Web Tokens) & bcryptjs** dedicated to hashing and secure stateless cookies.
- **Multer** managing multipart/form-data for PDF/DOCX and Image parsing directly on disk.

---

## ⚙️ Installation & Usage

To spin this repository up locally, you need two terminals. Make sure you have your local instance of MongoDB running beforehand on `mongodb://localhost:27017/job_listing_portal`.

**1. Install Dependencies & Boot Backend:**
```bash
cd backend
npm install
npm run dev
```

**2. Install Dependencies & Boot Frontend:**
```bash
# In a new, separate terminal window:
cd frontend
npm install
npm run dev
```

*The application will boot concurrently. Open [http://localhost:5173/](http://localhost:5173/) or [http://localhost:5174/](http://localhost:5174/) based on your Vite port generation.*

---

## 📁 Repository Structure
```
Job-Listing-Portal/
├── backend/
│   ├── config/          # MongoDB configuration bindings
│   ├── controllers/     # MVC controller pipeline
│   ├── middleware/      # JWT auth, File interceptors
│   ├── models/          # 7x Mongoose Schemas (User, Job, applications...)
│   └── routes/          # RESTful endpoints logic
└── frontend/
    ├── public/
    └── src/
        ├── components/  # Layout elements (Navbar, Job Cards, Modals)
        ├── context/     # Auth Context
        ├── pages/       # Public Views (Landing, Split-Screen Auth, Dashboards)
        ├── services/    # Axios global configuration with Interceptors
        └── utils/       # Date formatters, string parsers
```

---
*Built as a highly-professional project demonstration.*
