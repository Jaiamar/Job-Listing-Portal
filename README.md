# 💼 JobPortalNetwork

> A professional, LinkedIn-style job listing platform and professional network built with the MERN stack.

![JobPortalNetwork Demo Banner](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2071)
*(Note: Example Banner image)*

JobPortalNetwork is a full-stack web application designed to connect **Job Seekers** with **Employers**. It features a robust authentication system, distinct role-based dashboards, and premium user interfaces built for a seamless user experience.

---

## ✨ Features

### 👤 For Job Seekers
- **Dynamic Profiles:** Visually stunning profiles featuring custom avatars, profile banners, and dynamic user headlines.
- **Experience & Education Tracking:** Interactive modules to accurately record work history and university degrees fully linked to user profiles.
- **Skills Tagging:** Quickly add and remove interactive skill tags to showcase technical and soft competencies.

### 🏢 For Employers
- **Company Branding:** Interactive business profiles highlighting company summary, industry, size, and headquarters.
- **Job Creation Hub (Upcoming):** Employers have dedicated spaces to securely post and track real-time job listings to applicants on the platform.

### 🛡️ For Administrators
- **Admin Dashboard:** A secured, protected route specifically designed for system administrators.
- **User Auditing:** View and monitor all users continuously enrolled on the platform dynamically sorted through MongoDB queries.
- *Default Admin Access:* Comes pre-seeded with a default system Admin (`admin@admin.com`) on initial database boot.

### 🔒 Core Platform Features
- **JWT Standard Authentication:** High-security access tracking using access tokens and automatically rotated HTTP-only refresh tokens.
- **Account Protection:** Express Rate Limiting protects the server and authentication systems organically from brute-force botnets and credential-stuffing attacks.

---

## 🛠️ Tech Stack

**Frontend Framework:** React 18 & Vite
**Styling Architecture:** Tailwind CSS v3 & core standard Lucide Icons
**Routing:** React Router v6
**Backend Runtime:** Node.js & Express.js
**Database ORM:** Mongoose / MongoDB
**Security Validation:** Bcryptjs / JSONWebToken

---

## 🚀 Running Locally

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
- Node.js installed locally
- MongoDB installed and running locally, or access to a MongoDB Atlas Cluster URI string.

### Setup Instructions

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/Jaiamar/Job-Listing-Portal.git
   cd Job-Listing-Portal
   \`\`\`

2. **Frontend Setup (React):**
   \`\`\`bash
   cd client
   npm install
   npm run dev
   \`\`\`
   *Your frontend will boot on `http://localhost:5173/`*

3. **Backend Setup (Express/Node):**
   Open a secondary terminal:
   \`\`\`bash
   cd server
   npm install
   # Create a .env file here optionally for MongoDB URIs and JWT secrets.
   npm start
   \`\`\`
   *Your backend logic will automatically connect to MongoDB and operate on `http://localhost:5000/`*
   *The default admin account (`admin@admin.com` - `adminpassword`) will be organically created for exploration.*

---

## 🤝 Contributing

Contributions, issues, and feature requests are always welcome! Feel free to check the issues page.

## 📝 License

This project is open-source and available under the terms of the MIT License.
