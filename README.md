# Job-Listing-Portal

A dynamic and professional job portal connecting seekers and employers with an intuitive interface. Users can search for jobs with filters, create profiles, upload resumes, and apply directly. Employers can post detailed listings. It provides real-time updates, secure login, and advanced dashboards to help manage applications efficiently.

## 🚀 Features

- **User & Employer Roles**: Distinct experiences and dashboards for job seekers and employers.
- **Job Search & Filtering**: Advanced search functionality with category and location filters for job seekers.
- **Profile Management**: Users can build their profiles, upload resumes, and manage their applications.
- **Job Posting**: Employers can post, edit, and manage job listings with ease.
- **Secure Authentication**: Robust authentication and authorization using JWT and bcrypt.
- **Responsive Design**: Modern and clean user interface built with React and Tailwind CSS, fully responsive across all devices.
- **Security**: Features security best practices with Helmet and express-rate-limit.

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS 4** - Utility-first styling framework

### Backend
- **Node.js & Express 5** - Server framework
- **MongoDB & Mongoose** - NoSQL Database and ODM
- **JWT (JSON Web Tokens)** - Authentication
- **Bcryptjs** - Password hashing
- **Helmet & Express-Rate-Limit** - Security middlewares
- **Cors** - Cross-origin resource sharing

## 📂 Project Structure

```text
Job-Listing-Portal/
├── client/                 # React Frontend (Vite + Tailwind CSS)
│   ├── src/                # Source files
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── server/                 # Node.js Backend (Express + MongoDB)
│   ├── index.js            # Entry point for backend
│   └── package.json        # Backend dependencies
├── .gitignore              # Git ignore file
└── README.md               # Project documentation
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB locally installed or a MongoDB Atlas connection string.

### 1. Clone the repository
```bash
git clone https://github.com/Jaiamar/Job-Listing-Portal.git
cd Job-Listing-Portal
```

### 2. Setup Backend
```bash
cd server
npm install
```
- Create a `.env` file in the `server` directory and configure the necessary environment variables (e.g., `PORT`, `MONGO_URI`, `JWT_SECRET`).
- Start the backend server:
```bash
npm start
```

### 3. Setup Frontend
Open a new terminal and navigate to the client directory:
```bash
cd client
npm install
```
- Start the frontend development server:
```bash
npm run dev
```

## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
