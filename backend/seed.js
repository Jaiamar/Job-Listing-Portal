require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const EmployerProfile = require('./models/EmployerProfile');
const Job = require('./models/Job');

const employers = [
  { name: 'Google India', email: 'hr@google-india.com', company: { companyName: 'Google India', industry: 'Technology', companySize: '500+', website: 'https://careers.google.com', description: 'Google India is one of the largest tech offices outside the US, working on Search, Maps, Pay, and AI products.', location: 'Bangalore, India', isVerified: true } },
  { name: 'Infosys HR', email: 'hr@infosys.com', company: { companyName: 'Infosys Limited', industry: 'IT Services', companySize: '500+', website: 'https://www.infosys.com/careers', description: 'Infosys is a global leader in next-generation digital services and consulting.', location: 'Pune, India', isVerified: true } },
  { name: 'Swiggy Talent', email: 'talent@swiggy.com', company: { companyName: 'Swiggy', industry: 'Food Tech', companySize: '500+', website: 'https://careers.swiggy.com', description: "India's leading on-demand delivery platform.", location: 'Bangalore, India', isVerified: true } },
  { name: 'Razorpay People', email: 'people@razorpay.com', company: { companyName: 'Razorpay', industry: 'FinTech', companySize: '201-500', website: 'https://razorpay.com/jobs', description: "India's leading payments solution provider.", location: 'Bangalore, India', isVerified: true } },
  { name: 'BYJU\'S Careers', email: 'careers@byjus.com', company: { companyName: "BYJU'S", industry: 'EdTech', companySize: '500+', website: 'https://byjus.com/careers', description: 'The world\'s most valuable EdTech company.', location: 'Bangalore, India', isVerified: true } },
];

const jobTemplates = [
  {
    ei: 0, title: 'Senior Software Engineer – Backend', jobType: 'Full-Time', department: 'Engineering',
    location: 'Bangalore, India', salaryRange: { min: 2800000, max: 4500000 },
    description: 'Join our Core Infrastructure team to design and build highly scalable backend systems that serve billions of users. You will work on distributed systems, performance optimisation, and cross-functional projects that shape the future of Google products in India.',
    qualifications: ['B.Tech/M.Tech in Computer Science or related field', '5+ years of backend development experience', 'Proficiency in Go, Java, or C++', 'Strong knowledge of distributed systems', 'Experience with large-scale databases (Spanner, Bigtable)'],
    responsibilities: ['Design and implement large-scale distributed systems', 'Lead technical design reviews and mentor junior engineers', 'Collaborate with product and SRE teams', 'Drive performance improvements across critical services', 'Contribute to open-source infrastructure projects'],
    tags: ['Go', 'Java', 'Distributed Systems', 'Cloud', 'Backend'],
    deadline: new Date('2026-07-31'), status: 'Active'
  },
  {
    ei: 0, title: 'Product Manager – Google Pay', jobType: 'Full-Time', department: 'Product',
    location: 'Bangalore, India', salaryRange: { min: 3000000, max: 5000000 },
    description: 'Drive the strategy and execution for Google Pay features that are used by over 100 million Indians. You will define the product roadmap, work closely with engineering, design, and business teams, and launch features that solve real-world financial challenges.',
    qualifications: ['5+ years of product management experience', 'Strong analytical and data-driven decision making', 'Experience with payments or fintech products', 'Excellent communication and stakeholder management skills'],
    responsibilities: ['Define product vision and roadmap for GPay features', 'Translate business goals into detailed requirements', 'Partner with engineering, UX, legal and compliance teams', 'Monitor key metrics and iterate based on data', 'Represent the product in leadership reviews'],
    tags: ['Product Management', 'Fintech', 'Payments', 'Strategy', 'Agile'],
    deadline: new Date('2026-08-15'), status: 'Active'
  },
  {
    ei: 1, title: 'Full Stack Developer (React + Node.js)', jobType: 'Full-Time', department: 'Engineering',
    location: 'Pune, India', salaryRange: { min: 1200000, max: 2000000 },
    description: 'Infosys is looking for a passionate Full Stack Developer to join our Digital Engineering practice. You will work on enterprise applications for Fortune 500 clients, building modern, responsive UIs and robust REST APIs.',
    qualifications: ['3+ years of experience with React and Node.js', 'Familiarity with cloud platforms (AWS/Azure/GCP)', 'Strong understanding of REST API design', 'Experience with SQL and NoSQL databases'],
    responsibilities: ['Build and maintain full-stack web applications', 'Participate in agile sprints and code reviews', 'Optimize application performance', 'Collaborate with client-facing teams to gather requirements', 'Write unit and integration tests'],
    tags: ['React', 'Node.js', 'Full Stack', 'JavaScript', 'AWS'],
    deadline: new Date('2026-07-20'), status: 'Active'
  },
  {
    ei: 1, title: 'DevOps Engineer', jobType: 'Full-Time', department: 'Infrastructure',
    location: 'Hyderabad, India', salaryRange: { min: 1400000, max: 2200000 },
    description: 'Join Infosys Infrastructure Engineering to build and maintain CI/CD pipelines, manage cloud infrastructure, and ensure the reliability of enterprise systems for global clients across banking, insurance, and retail sectors.',
    qualifications: ['3+ years DevOps/SRE experience', 'Hands-on with Docker, Kubernetes, and Terraform', 'Experience with Jenkins, GitLab CI/CD', 'Strong scripting skills in Bash or Python'],
    responsibilities: ['Design and manage CI/CD pipelines', 'Provision and maintain cloud infrastructure using IaC', 'Monitor system health and implement alerting', 'Work with dev teams to improve deployment processes', 'Conduct capacity planning and disaster recovery drills'],
    tags: ['DevOps', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD'],
    deadline: new Date('2026-07-25'), status: 'Active'
  },
  {
    ei: 2, title: 'Data Scientist – Personalisation', jobType: 'Full-Time', department: 'Data Science',
    location: 'Bangalore, India', salaryRange: { min: 1800000, max: 3000000 },
    description: 'Swiggy\'s Data Science team is building the next generation of personalisation models that recommend restaurants, dishes, and offers to millions of users. You will work with petabytes of real-time data and deploy models that directly impact user engagement and revenue.',
    qualifications: ['MS/PhD in Statistics, ML, or Computer Science', '3+ years of experience in ML/Data Science', 'Proficiency in Python, PyTorch or TensorFlow', 'Experience with recommendation systems or ranking models', 'Strong SQL and data pipeline skills'],
    responsibilities: ['Build and ship ML models for food recommendation', 'Design A/B experiments and analyse results', 'Work with data engineers to build feature pipelines', 'Present insights to product and business stakeholders', 'Continuously monitor and improve model performance'],
    tags: ['Machine Learning', 'Python', 'Recommendation Systems', 'TensorFlow', 'SQL'],
    deadline: new Date('2026-08-10'), status: 'Active'
  },
  {
    ei: 2, title: 'iOS Developer – Consumer App', jobType: 'Full-Time', department: 'Mobile',
    location: 'Bangalore, India', salaryRange: { min: 1600000, max: 2600000 },
    description: 'Join Swiggy\'s Mobile team to craft beautiful, high-performance iOS experiences for India\'s most-used food delivery app. You\'ll work on features used by tens of millions of daily active users, from ordering to live tracking.',
    qualifications: ['3+ years of iOS development with Swift', 'Strong understanding of UIKit and SwiftUI', 'Experience with RESTful APIs and offline-first architecture', 'Familiarity with Core Data and performance profiling'],
    responsibilities: ['Develop and maintain the Swiggy iOS application', 'Implement new features from design specs', 'Ensure smooth performance and low crash rates', 'Write unit and UI tests', 'Collaborate with backend and design teams'],
    tags: ['iOS', 'Swift', 'SwiftUI', 'Mobile', 'UIKit'],
    deadline: new Date('2026-07-30'), status: 'Active'
  },
  {
    ei: 3, title: 'Frontend Engineer – Dashboard', jobType: 'Full-Time', department: 'Engineering',
    location: 'Bangalore, India', salaryRange: { min: 1500000, max: 2500000 },
    description: 'Razorpay is looking for a Frontend Engineer to build the next generation of merchant dashboards and analytics tools. You will work with a product-centric team to create pixel-perfect, accessible, and blazing-fast interfaces.',
    qualifications: ['2+ years of experience with React.js', 'Strong CSS and responsive design skills', 'Experience with TypeScript', 'Familiarity with testing frameworks like Jest and Cypress'],
    responsibilities: ['Build new features for the Razorpay merchant dashboard', 'Collaborate closely with designers and backend engineers', 'Write maintainable, well-tested frontend code', 'Participate in design system contributions', 'Optimise web performance metrics (LCP, CLS, FID)'],
    tags: ['React', 'TypeScript', 'Frontend', 'CSS', 'Dashboard'],
    deadline: new Date('2026-08-01'), status: 'Active'
  },
  {
    ei: 3, title: 'Backend Engineer – Payments Core', jobType: 'Full-Time', department: 'Engineering',
    location: 'Bangalore, India', salaryRange: { min: 2000000, max: 3500000 },
    description: 'Build the core payment processing engine at Razorpay. You will work on systems that process millions of transactions daily, ensuring correctness, reliability, and sub-second latency for India\'s top businesses.',
    qualifications: ['4+ years of backend development experience', 'Experience with Java or Golang', 'Knowledge of payment protocols (UPI, Cards, Netbanking)', 'Strong understanding of concurrency and database transactions'],
    responsibilities: ['Design and build high-throughput payment processing systems', 'Implement integrations with banks and payment networks', 'Drive reliability through load testing and chaos engineering', 'Write thorough documentation and RFCs', 'Mentor junior engineers'],
    tags: ['Java', 'Golang', 'Payments', 'Backend', 'FinTech'],
    deadline: new Date('2026-08-20'), status: 'Active'
  },
  {
    ei: 4, title: 'Content Creator – K-12 Mathematics', jobType: 'Full-Time', department: 'Content',
    location: 'Bangalore, India', salaryRange: { min: 700000, max: 1200000 },
    description: 'Create engaging, curriculum-aligned video and interactive content for BYJU\'S K-12 Mathematics courses. You will collaborate with instructional designers, animators, and subject matter experts to make complex concepts simple and fun for students.',
    qualifications: ['Bachelor\'s in Mathematics, Education, or related', 'Excellent communication and presentation skills', 'Experience in content creation or teaching', 'Ability to simplify complex topics for young learners'],
    responsibilities: ['Script and record video lessons for Grades 6-10', 'Work with animators to storyboard visual explanations', 'Review and quality-check content before publication', 'Incorporate student feedback to improve modules', 'Stay updated on CBSE/ICSE curriculum changes'],
    tags: ['Content Creation', 'Mathematics', 'Education', 'K-12', 'eLearning'],
    deadline: new Date('2026-07-15'), status: 'Active'
  },
  {
    ei: 4, title: 'Sales Development Representative', jobType: 'Full-Time', department: 'Sales',
    location: 'Remote', salaryRange: { min: 500000, max: 900000 },
    description: 'Drive student enrolments for BYJU\'S flagship programs by connecting with parents and students across India. You will be the first point of contact, understanding their learning needs and guiding them towards the right BYJU\'S product.',
    qualifications: ['1+ year of sales or customer-facing experience', 'Excellent spoken and written communication', 'Passion for education and student success', 'Comfort with CRM tools and call targets'],
    responsibilities: ['Reach out to leads via calls, WhatsApp, and email', 'Understand student academic goals and recommend courses', 'Achieve weekly and monthly enrolment targets', 'Maintain accurate records in Salesforce CRM', 'Coordinate with academic counsellors for follow-ups'],
    tags: ['Sales', 'EdTech', 'Communication', 'CRM', 'Remote'],
    deadline: new Date('2026-07-10'), status: 'Active'
  },
  {
    ei: 0, title: 'UX Researcher', jobType: 'Full-Time', department: 'Design',
    location: 'Bangalore, India', salaryRange: { min: 2000000, max: 3200000 },
    description: 'Join Google\'s UX Research team to uncover deep user insights that shape products used by billions. You will run studies, synthesise findings, and partner with PMs and designers to influence product strategy.',
    qualifications: ['4+ years of UX research experience', 'Proficiency in both qualitative and quantitative methods', 'Experience with usability studies, surveys, and diary studies', 'Ability to communicate research findings to executive audiences'],
    responsibilities: ['Plan and execute mixed-method research studies', 'Synthesise findings into actionable recommendations', 'Build empathy for users across diverse Indian demographics', 'Collaborate with cross-functional product teams', 'Maintain a library of user insights'],
    tags: ['UX Research', 'User Research', 'Design', 'Qualitative', 'Google'],
    deadline: new Date('2026-09-01'), status: 'Active'
  },
  {
    ei: 1, title: 'Business Analyst – Banking Domain', jobType: 'Full-Time', department: 'Consulting',
    location: 'Chennai, India', salaryRange: { min: 900000, max: 1600000 },
    description: 'Work as a Business Analyst within Infosys\' Financial Services practice, helping leading banks digitise their operations. You will gather requirements, create process maps, and bridge the gap between client stakeholders and delivery teams.',
    qualifications: ['2+ years as a Business Analyst in BFSI', 'Strong knowledge of core banking processes', 'Proficiency in JIRA, Confluence, and MS Visio', 'Excellent documentation and presentation skills'],
    responsibilities: ['Elicit and document business requirements from banking clients', 'Create BRDs, user stories, and process flow diagrams', 'Facilitate workshops and UAT sessions', 'Manage stakeholder expectations and change requests', 'Support project managers in status reporting'],
    tags: ['Business Analysis', 'Banking', 'BFSI', 'Requirements', 'Consulting'],
    deadline: new Date('2026-07-18'), status: 'Active'
  },
  {
    ei: 2, title: 'Growth Marketing Manager', jobType: 'Full-Time', department: 'Marketing',
    location: 'Bangalore, India', salaryRange: { min: 1400000, max: 2200000 },
    description: 'Lead growth marketing initiatives for Swiggy Instamart. You will own user acquisition, retention campaigns, and referral programs, working closely with data, product, and creative teams to hit aggressive growth targets.',
    qualifications: ['4+ years in growth or performance marketing', 'Strong proficiency in SQL and marketing analytics tools', 'Experience managing large-scale paid campaigns (Google, Meta)', 'Background in consumer internet or e-commerce preferred'],
    responsibilities: ['Own the growth roadmap for Instamart user acquisition', 'Run and optimise paid, organic, and referral campaigns', 'Work with product on in-app growth loops', 'Track CAC, LTV, and retention metrics', 'Manage agency partners and marketing budget'],
    tags: ['Growth Marketing', 'Performance Marketing', 'SQL', 'E-commerce', 'Analytics'],
    deadline: new Date('2026-08-05'), status: 'Active'
  },
  {
    ei: 3, title: 'QA Engineer – Automation', jobType: 'Full-Time', department: 'Quality',
    location: 'Bangalore, India', salaryRange: { min: 1100000, max: 1800000 },
    description: 'Ensure quality at every step of Razorpay\'s payment flow by building robust automated test suites. You will work with the engineering team to maintain high confidence in deployments and reduce regression risks in a fast-moving codebase.',
    qualifications: ['3+ years in QA automation', 'Proficiency in Selenium, Cypress, or Playwright', 'Experience testing REST APIs with Postman or RestAssured', 'Knowledge of payment flows is a plus'],
    responsibilities: ['Design and implement automated end-to-end test suites', 'Build and maintain API test frameworks', 'Integrate tests into the CI/CD pipeline', 'Report and triage bugs with engineering teams', 'Contribute to quality best practices and documentation'],
    tags: ['QA', 'Automation', 'Selenium', 'Cypress', 'Testing'],
    deadline: new Date('2026-07-22'), status: 'Active'
  },
  {
    ei: 4, title: 'Product Designer – Learning Experience', jobType: 'Full-Time', department: 'Design',
    location: 'Bangalore, India', salaryRange: { min: 1200000, max: 2000000 },
    description: 'Design the future of learning at BYJU\'S. You will create intuitive, delightful experiences for the BYJU\'S app used by millions of students, focusing on engagement, accessibility, and learning outcomes.',
    qualifications: ['3+ years of product/UX design experience', 'Strong portfolio demonstrating end-to-end design process', 'Proficiency in Figma', 'Understanding of mobile-first design and accessibility standards'],
    responsibilities: ['Own design for key learning features in the BYJU\'S app', 'Conduct user research and usability testing', 'Create wireframes, prototypes, and final design specs', 'Collaborate closely with product and engineering', 'Maintain and contribute to the design system'],
    tags: ['Product Design', 'UX', 'Figma', 'Mobile', 'EdTech'],
    deadline: new Date('2026-08-12'), status: 'Active'
  },
  {
    ei: 1, title: 'Cloud Architect – AWS', jobType: 'Contract', department: 'Architecture',
    location: 'Mumbai, India', salaryRange: { min: 3500000, max: 5500000 },
    description: 'Infosys is looking for a seasoned Cloud Architect to lead cloud migration and modernisation projects for a major retail client. You will design end-to-end cloud solutions on AWS, define architecture standards, and guide delivery teams.',
    qualifications: ['8+ years of IT experience with 4+ in cloud architecture', 'AWS Solutions Architect Professional certification preferred', 'Experience migrating monoliths to microservices', 'Strong knowledge of security and compliance in cloud'],
    responsibilities: ['Design cloud-native architectures on AWS', 'Lead client workshops and architecture reviews', 'Define cloud governance and cost optimisation strategies', 'Guide and mentor a team of cloud engineers', 'Produce architecture artefacts and ADRs'],
    tags: ['AWS', 'Cloud Architecture', 'Microservices', 'Migration', 'Contract'],
    deadline: new Date('2026-07-28'), status: 'Active'
  },
  {
    ei: 0, title: 'Machine Learning Engineer – Search', jobType: 'Full-Time', department: 'AI/ML',
    location: 'Hyderabad, India', salaryRange: { min: 3200000, max: 5000000 },
    description: 'Improve how billions of people find information on Google Search. You will develop and deploy production ML models for query understanding, ranking, and spam detection, working on one of the world\'s most complex engineering challenges.',
    qualifications: ['MS or PhD in ML, AI, or Computer Science', '4+ years of ML engineering experience', 'Strong Python and TensorFlow/JAX skills', 'Experience shipping ML models to production at scale'],
    responsibilities: ['Design and train large-scale ranking and retrieval models', 'Build ML pipelines for training, evaluation, and serving', 'Collaborate with research scientists to productionize new techniques', 'Drive quality improvements on core search metrics', 'Publish findings in internal and external forums'],
    tags: ['Machine Learning', 'Python', 'TensorFlow', 'Search', 'NLP'],
    deadline: new Date('2026-09-10'), status: 'Active'
  },
  {
    ei: 2, title: 'Operations Manager – Delivery', jobType: 'Full-Time', department: 'Operations',
    location: 'Delhi, India', salaryRange: { min: 1000000, max: 1600000 },
    description: 'Lead last-mile delivery operations for Swiggy in Delhi NCR. You will manage a large fleet of delivery partners, optimise zone-level operations, and ensure SLAs are met across thousands of daily orders.',
    qualifications: ['3+ years in logistics or last-mile operations', 'Strong data analysis skills (Excel/SQL)', 'Experience managing large field teams', 'Ability to thrive in a fast-paced, 24/7 environment'],
    responsibilities: ['Oversee end-to-end delivery operations for Delhi NCR', 'Manage and motivate delivery partner fleet', 'Analyse delivery metrics and implement process improvements', 'Coordinate with restaurant partners and city teams', 'Handle escalations and crisis situations'],
    tags: ['Operations', 'Logistics', 'Last-Mile Delivery', 'Management', 'Supply Chain'],
    deadline: new Date('2026-07-17'), status: 'Active'
  },
  {
    ei: 3, title: 'Security Engineer', jobType: 'Full-Time', department: 'Security',
    location: 'Bangalore, India', salaryRange: { min: 2200000, max: 3800000 },
    description: 'Protect Razorpay\'s payment infrastructure and customer data from evolving threats. You will conduct penetration testing, review code for vulnerabilities, respond to security incidents, and drive the security roadmap for critical payment services.',
    qualifications: ['4+ years in application or infrastructure security', 'CEH, OSCP, or similar certification preferred', 'Experience with OWASP Top 10 and payment security standards (PCI-DSS)', 'Proficiency in Python or Go for security tooling'],
    responsibilities: ['Conduct penetration tests on web apps and APIs', 'Review code and architecture for security vulnerabilities', 'Respond to and investigate security incidents', 'Drive PCI-DSS compliance programs', 'Build internal security awareness programs'],
    tags: ['Security', 'Penetration Testing', 'PCI-DSS', 'FinTech', 'OWASP'],
    deadline: new Date('2026-08-25'), status: 'Active'
  },
  {
    ei: 0, title: 'Software Engineering Intern', jobType: 'Internship', department: 'Engineering',
    location: 'Bangalore, India', salaryRange: { min: 60000, max: 80000 },
    description: 'Google\'s Software Engineering Internship is a 10-week programme where you will work on a real project that ships to users. Interns receive mentorship from senior engineers, attend tech talks, and participate in team activities.',
    qualifications: ['Pursuing B.Tech/M.Tech in CS or related (graduating 2026/2027)', 'Strong fundamentals in data structures and algorithms', 'Proficiency in at least one of: Python, Java, C++, Go', 'Problem solving mindset and eagerness to learn'],
    responsibilities: ['Work on a well-defined engineering project with a dedicated mentor', 'Write clean, testable code and participate in code reviews', 'Attend intern community events and tech talks', 'Present your project at the end-of-internship showcase', 'Collaborate with team members on day-to-day tasks'],
    tags: ['Internship', 'Software Engineering', 'Python', 'Java', 'Google'],
    deadline: new Date('2026-06-30'), status: 'Active'
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing seed data
    await Job.deleteMany({});
    console.log('🗑️  Cleared existing jobs');

    const createdEmployers = [];

    for (const emp of employers) {
      // Upsert user
      let user = await User.findOne({ email: emp.email });
      if (!user) {
        const salt = await bcrypt.genSalt(12);
        const hashed = await bcrypt.hash('Password@123', salt);
        user = await User.create({ name: emp.name, email: emp.email, password: hashed, role: 'employer' });
        console.log(`👤 Created user: ${emp.name}`);
      } else {
        console.log(`👤 Existing user: ${emp.name}`);
      }

      // Upsert employer profile
      let profile = await EmployerProfile.findOne({ userId: user._id });
      if (!profile) {
        profile = await EmployerProfile.create({ userId: user._id, ...emp.company });
        console.log(`🏢 Created profile: ${emp.company.companyName}`);
      } else {
        await EmployerProfile.findByIdAndUpdate(profile._id, emp.company);
        console.log(`🏢 Updated profile: ${emp.company.companyName}`);
      }

      createdEmployers.push({ user, profile });
    }

    // Create jobs
    for (const template of jobTemplates) {
      const { ei, ...jobData } = template;
      const employer = createdEmployers[ei];
      await Job.create({ employerId: employer.user._id, ...jobData });
      console.log(`💼 Created job: ${jobData.title}`);
    }

    console.log(`\n🎉 Seed complete! ${jobTemplates.length} jobs added across ${employers.length} companies.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
