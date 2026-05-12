const fs = require('fs');
const htmlToDocx = require('html-to-docx');
const path = require('path');

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Final Project Report</title>
</head>
<body style="font-family: Arial, sans-serif;">

  <!-- Cover Page -->
  <div style="text-align: center; margin-top: 150px;">
    <h1 style="font-size: 36px; color: #2C3E50;">CENTRALIZED JOB LISTING PORTAL</h1>
    <h2 style="font-size: 24px; color: #7F8C8D; margin-top: 20px;">Final Project Report</h2>
    <br><br><br>
    <p style="font-size: 18px; color: #34495E;">Developed using the MERN Stack</p>
    <p style="font-size: 18px; color: #34495E;">(MongoDB, Express.js, React.js, Node.js)</p>
    <br><br><br><br>
    <p style="font-size: 16px;"><strong>Submitted by:</strong></p>
    <p style="font-size: 16px;">Developer Intern</p>
  </div>

  <div style="page-break-before: always;"></div>

  <!-- Abstract -->
  <h2>1. Abstract</h2>
  <p>The <strong>Centralized Job Listing Portal</strong> is a comprehensive, full-stack web application developed to bridge the gap between talented job seekers and industry-leading employers. Built on the modern MERN stack, the platform offers a seamless, highly responsive, and secure environment for modern recruitment processes.</p>
  <p>For job seekers, the platform provides intuitive tools to build dynamic profiles, upload resumes, search for highly relevant jobs using advanced filters, and apply with a single click. For employers, it acts as an integrated Applicant Tracking System (ATS), enabling them to post job openings, manage candidates across various pipeline stages, and streamline their hiring workflows.</p>

  <!-- Introduction -->
  <h2>2. Introduction</h2>
  <h3>2.1 Problem Statement</h3>
  <p>Traditional recruitment processes are often fragmented, involving multiple emails, manual resume screening, and poor communication between employers and candidates. There is a strong need for a centralized platform where both parties can interact seamlessly, track application progress in real-time, and manage profiles securely.</p>
  
  <h3>2.2 Objectives</h3>
  <ul>
    <li>To develop a secure, dual-role (Seeker and Employer) authentication system.</li>
    <li>To create an efficient job posting and browsing ecosystem with advanced filtering capabilities.</li>
    <li>To implement a built-in Application Tracking System (ATS) for employers to manage candidate pipelines.</li>
    <li>To ensure high performance, security, and responsive UI across all devices.</li>
  </ul>

  <!-- Technology Stack -->
  <h2>3. Technology Stack</h2>
  <p>The application leverages a robust set of modern web technologies designed for scalability and high performance:</p>
  <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
    <tr>
      <th style="padding: 8px; background-color: #ecf0f1;">Domain</th>
      <th style="padding: 8px; background-color: #ecf0f1;">Technology Used</th>
    </tr>
    <tr>
      <td style="padding: 8px;"><strong>Frontend Architecture</strong></td>
      <td style="padding: 8px;">React 18, Vite Engine, React Router DOM</td>
    </tr>
    <tr>
      <td style="padding: 8px;"><strong>State Management & Networking</strong></td>
      <td style="padding: 8px;">React Context API, Axios</td>
    </tr>
    <tr>
      <td style="padding: 8px;"><strong>Backend REST Server</strong></td>
      <td style="padding: 8px;">Node.js, Express.js 5.x</td>
    </tr>
    <tr>
      <td style="padding: 8px;"><strong>Database Ecosystem</strong></td>
      <td style="padding: 8px;">MongoDB Atlas, Mongoose ODM</td>
    </tr>
    <tr>
      <td style="padding: 8px;"><strong>Authentication & Security</strong></td>
      <td style="padding: 8px;">JSON Web Tokens (JWT), bcrypt.js hashing</td>
    </tr>
    <tr>
      <td style="padding: 8px;"><strong>File Processing (Resumes)</strong></td>
      <td style="padding: 8px;">Multer (Multipart/form-data handler)</td>
    </tr>
  </table>

  <!-- System Architecture -->
  <h2>4. System Architecture</h2>
  <p>The system follows a strict Client-Server decoupled architecture:</p>
  <ul>
    <li><strong>Client Tier (Vite + React):</strong> Manages the dynamic user interface, client-side routing, and context-based state management. All views are fully responsive.</li>
    <li><strong>Application Tier (Express + Node):</strong> Serves as the REST API hub. It processes incoming JSON/FormData requests, validates inputs via <code>express-validator</code>, applies authentication middleware, and executes business logic.</li>
    <li><strong>Data Tier (MongoDB):</strong> A NoSQL document database used for its flexibility in handling complex nested arrays like skills, responsibilities, and application history.</li>
  </ul>

  <!-- Core Features -->
  <h2>5. Core Features & Modules</h2>
  
  <h3>5.1 Job Seeker Module</h3>
  <ul>
    <li><strong>Profile Management:</strong> Seekers can update their personal details, professional summary, skills, and securely upload PDF/DOCX resumes.</li>
    <li><strong>Job Search Engine:</strong> A comprehensive job board allowing seekers to filter active listings by keyword, location, job type (Full-Time, Internship, etc.), and salary range.</li>
    <li><strong>One-Click Applications:</strong> Seamless application process that automatically links the seeker's uploaded resume to the specific job listing.</li>
    <li><strong>Application Dashboard:</strong> A real-time tracking interface showing the current status of all applied jobs (e.g., Under Review, Shortlisted, Rejected).</li>
    <li><strong>Saved Jobs:</strong> Functionality to bookmark jobs for later review.</li>
  </ul>

  <h3>5.2 Employer Module</h3>
  <ul>
    <li><strong>Company Profiling:</strong> Employers can set up their corporate identity, including industry, company size, location, and corporate descriptions.</li>
    <li><strong>Job Posting Management:</strong> Complete CRUD (Create, Read, Update, Delete) capabilities over job listings. Employers can specify qualifications, responsibilities, tags, and deadlines.</li>
    <li><strong>Integrated ATS Workflow:</strong> A centralized dashboard where employers can view all applicants for their listings, download resumes directly, and update application statuses dynamically.</li>
    <li><strong>Analytics & Metrics:</strong> View counts on job postings and applicant volume tracking.</li>
  </ul>

  <!-- Database Schema Design -->
  <h2>6. Database Schema Design</h2>
  <p>The platform implements an interconnected NoSQL database model with the following core collections:</p>
  <ul>
    <li><strong>User:</strong> Stores core authentication credentials, encrypted passwords, and role identifiers (seeker/employer).</li>
    <li><strong>SeekerProfile:</strong> Linked (1-to-1) to the User model. Stores education, experience, and the file path to the resume.</li>
    <li><strong>EmployerProfile:</strong> Linked (1-to-1) to the User model. Stores company meta-data.</li>
    <li><strong>Job:</strong> Linked (1-to-Many) to the Employer. Contains job details, search indexes, and visibility statuses.</li>
    <li><strong>Application:</strong> Acts as the junction collection linking a Seeker to a specific Job. It tracks the application timestamp, the snapshot of the resume used, and the current evaluation status.</li>
    <li><strong>Notification:</strong> System-generated alerts triggered during application status changes.</li>
  </ul>

  <!-- Security Implementation -->
  <h2>7. Security Implementations</h2>
  <p>Security was a paramount focus during development:</p>
  <ul>
    <li><strong>Password Cryptography:</strong> All user passwords undergo salting and hashing via <code>bcrypt.js</code> prior to database storage.</li>
    <li><strong>Stateless Authentication:</strong> Sessions are managed via JWT. The token is securely transmitted via Authorization headers and strictly verified in protected routes.</li>
    <li><strong>Role-Based Access Control (RBAC):</strong> Custom middleware explicitly blocks Seekers from accessing Employer endpoints and vice versa, preventing unauthorized data manipulation.</li>
    <li><strong>File Upload Security:</strong> The Multer storage engine explicitly filters file extensions (only allowing PDF/DOCX for resumes) and enforces strict file size limits to prevent malicious uploads.</li>
  </ul>

  <!-- Conclusion & Future Enhancements -->
  <h2>8. Conclusion & Future Enhancements</h2>
  <p>The Centralized Job Listing Portal successfully resolves many friction points within traditional hiring workflows. By providing a clean, fast, and feature-rich interface backed by a robust REST API, the platform delivers immense value to both seekers and employers.</p>
  
  <p><strong>Future Enhancements planned for Phase 2:</strong></p>
  <ul>
    <li><strong>AI Resume Parsing:</strong> Integrating NLP models to automatically extract skills from uploaded PDFs and suggest matches to employers.</li>
    <li><strong>In-App Messaging:</strong> Real-time WebSocket-based chat between employers and shortlisted candidates.</li>
    <li><strong>Interview Scheduling:</strong> Calendar integrations (Google Calendar/Outlook) to schedule video interviews directly through the portal.</li>
  </ul>
</body>
</html>
`;

async function generateReport() {
  try {
    const fileBuffer = await htmlToDocx(htmlContent, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });
    
    const outputPath = path.join(__dirname, '..', 'Job_Listing_Portal_Final_Report.docx');
    fs.writeFileSync(outputPath, fileBuffer);
    console.log('✅ Document successfully generated at:', outputPath);
  } catch (error) {
    console.error('❌ Error generating document:', error);
  }
}

generateReport();
