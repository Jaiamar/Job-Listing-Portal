This sounds like an excellent full-stack project. Before we dive into the documentation, I want to gently clarify one quick detail: there currently isn't a Google development tool or product called "antigravity." You might be thinking of Google's **Project IDX** (a cloud-based, AI-powered IDE), **AppSheet**, or perhaps using **Gemini Code Assist**. Interestingly, `import antigravity` is a famous, long-standing Python Easter egg that opens a web comic! 

Regardless of which IDE or AI coding assistant you choose to use, having a comprehensive specification document is the perfect first step. 

Here is the full technical documentation tailored for the MERN stack. You can feed this directly into your development environment or AI assistant to start generating the codebase.

---

# Project Documentation: Job Listing Portal

## 1. Project Overview
The Job Listing Portal is a dynamic, full-stack web application designed to connect job seekers with potential employers. It features separate user flows for applicants and employers, robust search capabilities, and secure application tracking.

## 2. Technology Stack (MERN)
* **MongoDB:** NoSQL database to store user profiles, job listings, and applications.
* **Express.js:** Backend web application framework for building RESTful APIs.
* **React.js:** Frontend library for building a dynamic, single-page application (SPA) user interface.
* **Node.js:** JavaScript runtime environment for executing the backend server.
* **Additional Libraries:**
    * *Authentication:* JWT (JSON Web Tokens) and bcrypt (for password hashing).
    * *File Uploads:* Multer (for handling resume/PDF uploads) and Cloudinary/AWS S3 (for storage).
    * *State Management:* Redux Toolkit or React Context API.
    * *Styling:* Tailwind CSS or Material-UI for a clean, responsive interface.

---

## 3. Database Schema (MongoDB)

The database will require four primary collections.

### 3.1. User Model (`User`)
* `_id`: ObjectId
* `role`: String (Enum: `['seeker', 'employer']`)
* `name`: String
* `email`: String (Unique)
* `password`: String (Hashed)
* `createdAt`: Timestamp

### 3.2. Job Seeker Profile Model (`SeekerProfile`)
* `userId`: ObjectId (Ref: `User`)
* `phone`: String
* `skills`: Array of Strings
* `education`: Array of Objects (Degree, Institution, Year)
* `resumeUrl`: String (URL to uploaded PDF)
* `experience`: String / Text block

### 3.3. Employer Profile Model (`EmployerProfile`)
* `userId`: ObjectId (Ref: `User`)
* `companyName`: String
* `companyDescription`: String
* `website`: String
* `location`: String
* `logoUrl`: String

### 3.4. Job Listing Model (`Job`)
* `employerId`: ObjectId (Ref: `User`)
* `title`: String
* `description`: String
* `qualifications`: Array of Strings
* `responsibilities`: Array of Strings
* `location`: String
* `jobType`: String (Enum: `['Full-time', 'Part-time', 'Contract', 'Internship']`)
* `salaryRange`: Object (`min`: Number, `max`: Number)
* `status`: String (Enum: `['Open', 'Closed']`)
* `createdAt`: Timestamp

### 3.5. Application Model (`Application`)
* `jobId`: ObjectId (Ref: `Job`)
* `applicantId`: ObjectId (Ref: `User`)
* `resumeUrl`: String (Snapshot of resume at time of applying)
* `coverLetter`: String
* `status`: String (Enum: `['Pending', 'Reviewed', 'Accepted', 'Rejected']`)
* `appliedAt`: Timestamp

---

## 4. RESTful API Endpoints (Node.js/Express)

### Authentication Routes
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Register a new user (Seeker/Employer) | Public |
| POST | `/api/auth/login` | Authenticate user & return JWT | Public |
| GET | `/api/auth/me` | Get current logged-in user data | Private |

### Profile Routes
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/api/profiles/seeker` | Get job seeker profile | Private (Seeker) |
| PUT | `/api/profiles/seeker` | Update seeker profile/resume | Private (Seeker) |
| GET | `/api/profiles/employer` | Get employer profile | Private (Employer) |
| PUT | `/api/profiles/employer` | Update company details | Private (Employer) |

### Job Routes
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/api/jobs` | Get all jobs (with search/filter query params) | Public |
| GET | `/api/jobs/:id` | Get single job details | Public |
| POST | `/api/jobs` | Create a new job listing | Private (Employer) |
| PUT | `/api/jobs/:id` | Update a job listing | Private (Employer) |
| DELETE| `/api/jobs/:id` | Delete a job listing | Private (Employer) |

### Application Routes
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/applications` | Apply to a job | Private (Seeker) |
| GET | `/api/applications/seeker`| Get all jobs user has applied to | Private (Seeker) |
| GET | `/api/applications/job/:id` | Get all applications for a specific job | Private (Employer) |
| PUT | `/api/applications/:id` | Update application status (e.g., Reviewed)| Private (Employer) |

---

## 5. Frontend Architecture (React)

### Core Views & Components
1.  **Public Views:**
    * `Home`: Landing page with a search bar and featured jobs.
    * `Login / Register`: Forms with role selection (Seeker vs. Employer).
    * `JobSearch`: Results page with sidebar filters (Type, Location, Keyword).
    * `JobDetails`: Full job description with an "Apply Now" button.
2.  **Job Seeker Dashboard (`/seeker-dashboard`):**
    * `ProfileEditor`: Form to update details and upload resume.
    * `ApplicationHistory`: Table showing applied jobs, dates, and current status.
3.  **Employer Dashboard (`/employer-dashboard`):**
    * `CompanyProfile`: Form to update company details.
    * `ManageJobs`: List of active/closed jobs with Edit/Delete buttons.
    * `CreateJob`: Form to post a new opening.
    * `ApplicantReview`: View showing all candidates for a specific job, with options to download resumes and update applicant status.

---

## 6. Implementation Phases

**Phase 1: Backend Foundation**
* Set up Express server and connect to MongoDB.
* Implement User models and JWT authentication.
* Test auth endpoints using Postman or Thunder Client.

**Phase 2: Core API Logic**
* Build out CRUD routes for Jobs and Profiles.
* Implement search and filtering logic on the `/api/jobs` GET route using MongoDB regex and query operators.
* Create Application logic (linking users to jobs).

**Phase 3: Frontend Setup & Auth**
* Initialize React app and set up routing (`react-router-dom`).
* Build UI components for Login/Registration.
* Implement context/state to keep the user logged in using the JWT.

**Phase 4: Dashboard & Features**
* Build out Employer capabilities (posting jobs, viewing applications).
* Build out Seeker capabilities (building profiles, searching, applying).
* Integrate file uploading logic for resumes.

**Phase 5: Polish & Security**
* Add real-time notifications or toast alerts for successful actions.
* Ensure UI is fully responsive.
* Secure API endpoints so users cannot edit or delete data that does not belong to them.