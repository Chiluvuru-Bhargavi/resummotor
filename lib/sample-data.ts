import { RoastResult, PersonaId } from './types';

export const SAMPLE_TIER3_RESUME_TEXT = `
RAHUL SHARMA
Email: rahul.sharma.coder2024@gmail.com | Phone: +91 98765 43210
LinkedIn: linkedin.com/in/rahul-sharma-tech-learner | GitHub: github.com/rahul-sharma-dev
Address: Room 204, Boys Hostel, Sri Venkateshwara Institute of Engineering & Technology, Bangalore

CAREER OBJECTIVE:
To work in a challenging and competitive environment where I can utilize my knowledge and technical skills to contribute towards the growth of the prestigious organization while continuously learning new technologies.

EDUCATION:
- B.Tech in Computer Science & Engineering (2020 - 2024)
  Sri Venkateshwara Institute of Technology, Affiliated to VTU
  CGPA: 7.18 / 10.0 (Cleared 2 backlogs in 4th semester)
- Class XII (CBSE) - 71.4% (PCM with Physical Education)
- Class X (CBSE) - 81.2%

TECHNICAL SKILLS:
- Programming Languages: C (Proficient), C++, Core Java (Basic), Python (Basics), HTML5, CSS3, JavaScript (ES6)
- Web Technologies: React.js (Beginner), Node.js, Express.js, MongoDB (MERN Stack)
- Developer Tools: VS Code, Git, GitHub, Postman, Turbo C++, MS Office (Word, PowerPoint, Excel)
- Emerging Technologies: Machine Learning (Attended workshop), Artificial Intelligence, Cloud Computing

ACADEMIC & PERSONAL PROJECTS:
1. Online Library Management System (Major Final Year Project)
   - Technologies: C++, Object Oriented Programming, File Handling
   - Developed a console-based software application to issue, return, and search books in a college library.
   - Used file handling concepts to save book data into text files so data is not lost when program closes.
   - Handled user login for admin and student with password verification.

2. Responsive Calculator Web Application
   - Technologies: HTML, CSS, JavaScript, React.js
   - Built a calculator that can perform addition, subtraction, multiplication, and division operations.
   - Handled decimal points and backspace button smoothly without crashing.
   - Hosted on GitHub Pages with 100% responsive design for mobile screens.

3. Weather Forecast App
   - Technologies: React.js, Fetch API, OpenWeatherMap API, Tailwind CSS
   - Connected with OpenWeather free API to fetch live temperature and humidity of any city entered by user.
   - Displayed sunny or rainy icons based on weather condition.

4. Netflix Clone UI (Frontend)
   - Technologies: HTML5, CSS3, Bootstrap
   - Created exact clone of Netflix homepage hero banner and movie poster carousels.

CERTIFICATIONS & WORKSHOPS:
- Completed 2-Day National Level Workshop on "Generative AI and ChatGPT" conducted by IITian trainers (Certificate of Participation).
- Python for Beginners Certificate from Udemy (10 hours video course).
- 5-Star Golden Badge in Problem Solving on HackerRank (Bronze level).

EXTRACURRICULAR ACTIVITIES:
- Active Member of College Cultural Fest Technical Organizing Committee (handled mic and projector setup).
- Participated in Inter-College Chess Tournament (Quarterfinalist).
- Class Representative for Section B during 3rd year.
`.trim();

export const SAMPLE_GITHUB_USERNAME = "rohit-codes-2024";

export const SAMPLE_GITHUB_SUMMARY_TEXT = `
GITHUB PROFILE ROAST DATA:
- Username: @rohit-codes-2024
- Name: Rohit Verma (Aspiring SDE | MERN Stack | Web3 Curious)
- Bio: "Building things that matter 🚀 | 3rd Year CSE @ Tier 3 College | Learning Next.js & DSA | DM for collabs"
- Location: Bengaluru, India
- Company/College: Engineering Student
- Public Repositories: 7
- Followers: 2 | Following: 148
- Account Age: Member since Aug 2023
- Total Stars across sampled repos: 1
- Forked Repos in sample: 4 out of 7
- Primary Languages Detected: JavaScript, HTML, PHP, Python

RECENT & TOP REPOSITORIES:
1. react-todo-list (ORIGINAL)
   - Language: JavaScript | Stars: 0 | Forks: 0
   - Description: A simple todo app with add, edit, and delete functionality created using React.
   - Topics: react, beginner, todo-app

2. college-mini-project-hospital (ORIGINAL)
   - Language: PHP | Stars: 1 | Forks: 0
   - Description: Hospital management system with MySQL for 5th semester database lab submission.
   - Topics: php, mysql, college-project

3. striver-sde-sheet (FORKED)
   - Language: C++ | Stars: 0 | Forks: 0
   - Description: Forked from takeUforward/striver-sde-sheet. Last commit was 11 months ago.
   - Topics: dsa, leetcode

4. calculator-app (ORIGINAL)
   - Language: HTML | Stars: 0 | Forks: 0
   - Description: Basic calculator with dark mode toggle.
   - Topics: html, css, js

5. netflix-clone (ORIGINAL)
   - Language: CSS | Stars: 0 | Forks: 0
   - Description: Netflix homepage UI clone following YouTube tutorial by Clever Programmer.
   - Topics: frontend, clone

6. python-machine-learning-workshop (FORKED)
   - Language: Jupyter Notebook | Stars: 0 | Forks: 0
   - Description: Code from 2-day workshop on Linear Regression.
   - Topics: ml, ai
`.trim();

export const PRESET_SAMPLE_ROASTS: Record<PersonaId, RoastResult> = {
  'mass-recruiter': {
    cookedPercentage: 88,
    verdictTitle: "Certified Mass Recruiter Day-1 Candidate",
    predictedPackage: "₹3.36 LPA (with 2-year service bond & 90-day notice)",
    roastSummary: "Dear Candidate, kindly note that while your career objective is straight out of a 2008 engineering template, your 71.4% in 12th board just barely escapes our automated Excel filter. We appreciate that you included MS Word and Turbo C++ under Technical Skills, which confirms you are emotionally prepared to maintain our legacy banking system from 1999 while waiting in the Hinjewadi cafeteria for your 3.2 LPA CTC breakdown email.",
    redFlags: [
      "Still listing Turbo C++ and MS Office as hardcore technical competencies in 2026.",
      "Major project is a C++ console Library Management System using text files instead of an actual database.",
      "Attended a 2-day weekend workshop on AI and immediately added 'Machine Learning & Cloud' to technical skills."
    ],
    greenFlags: [
      "Cleared both 4th semester backlogs on the first re-attempt, showing true tier-3 survival resilience.",
      "Has a 5-star HackerRank problem solving badge, which our aptitude test screening portal respects."
    ],
    bulletRewrites: [
      {
        original: "Developed a console-based software application to issue, return, and search books in a college library using file handling.",
        fixed: "Architected a C++ library inventory engine supporting 1,000+ catalog items with persistent file I/O and O(log n) binary search lookup.",
        whyItWorks: "Replaces student lab terminology with engineering specifications, data volume, and algorithmic complexity."
      },
      {
        original: "Connected with OpenWeather free API to fetch live temperature and humidity of any city entered by user.",
        fixed: "Built an asynchronous React weather dashboard integrating OpenWeatherMap REST API with client-side caching and dynamic SVG weather states.",
        whyItWorks: "Highlights asynchronous state management, network optimization, and modern frontend design principles instead of a basic API fetch."
      },
      {
        original: "Active Member of College Cultural Fest Technical Organizing Committee (handled mic and projector setup).",
        fixed: "Spearheaded technical operations and AV streaming infrastructure for annual 3-day college festival hosting 2,500+ attendees.",
        whyItWorks: "Transforms mundane AV setup duties into event-scale operational leadership with tangible attendance metrics."
      }
    ]
  },

  'startup-cto': {
    cookedPercentage: 94,
    verdictTitle: "Chronically Trapped in YouTube Tutorial Hell",
    predictedPackage: "₹4.5 LPA + 0.0001% phantom ESOPs (Indiranagar beanbag included)",
    roastSummary: "Bro, with all due respect, looking at your project portfolio gave my Redis cluster a segmentation fault. You have built the Holy Trinity of unhireable tier-3 resumes: a React Calculator, a Weather App that wraps a single GET request, and a C++ Library Management System that writes plaintext to a TXT file like it's 1994. In Koramangala, we don't care about your 10-hour Udemy Python certificate; we care if you can handle 50,000 concurrent webhooks without crashing the Node.js event loop.",
    redFlags: [
      "The 'Major Project' uses Turbo C++ file handling for data persistence in an era of distributed key-value stores.",
      "Built a calculator in React and proudly claimed 100% responsive design as an architectural triumph.",
      "Committed OpenWeatherMap free tier API keys directly into public GitHub repo commits."
    ],
    greenFlags: [
      "At least you didn't call yourself an 'AI Thought Leader' after using ChatGPT to write your career objective.",
      "Has experience with Git, Postman, and basic component architecture."
    ],
    bulletRewrites: [
      {
        original: "Built a calculator that can perform addition, subtraction, multiplication, and division operations smoothly without crashing.",
        fixed: "Engineered an expression-evaluating calculator engine in React with zero-runtime edge-case handling for division-by-zero and floating-point precision.",
        whyItWorks: "Focuses on runtime edge cases and mathematical precision instead of boasting that basic arithmetic didn't crash."
      },
      {
        original: "Connected with OpenWeather free API to fetch live temperature and humidity of any city entered by user.",
        fixed: "Implemented a debounced geolocation weather client with HTTP status error boundaries and localized localStorage caching reducing API overhead by 60%.",
        whyItWorks: "Demonstrates production engineering concepts: debouncing, defensive error boundaries, and client caching."
      },
      {
        original: "Created exact clone of Netflix homepage hero banner and movie poster carousels.",
        fixed: "Engineered a high-performance Netflix web interface clone featuring lazy-loaded image carousels, responsive grid breakpoints, and modular CSS architecture.",
        whyItWorks: "Emphasizes performance optimizations like lazy loading and responsive architectural patterns over passive cloning."
      }
    ]
  },

  'faang-bhaiya': {
    cookedPercentage: 86,
    verdictTitle: "DSA Sheet Procrastinator & Metric-Free SDE",
    predictedPackage: "₹6 LPA off-campus or ₹45 LPA in YouTube thumbnail dreams",
    roastSummary: "Arre bhaiya/didi, what is this career objective? 'To work in a challenging and competitive environment...' Did you copy this from a 2012 GeeksforGeeks placement article? Where is your STAR format? Where are the quantitative metrics? You put 'Proficient in C and C++' but there is no mention of your LeetCode contest rating, no graph traversals, and your final year project is running in a terminal. Even my Telegram group members with 3-month gaps write better impact-driven bullets.",
    redFlags: [
      "Zero quantified metrics: no latency numbers, no user count, no database benchmark numbers.",
      "No mention of LeetCode contest rating or GitHub contribution streaks, just an ancient HackerRank bronze badge.",
      "Vague 'Emerging Tech' claims without a single committed line of PyTorch, TensorFlow, or real backend code."
    ],
    greenFlags: [
      "Strong foundation in C/C++ OOP fundamentals which makes grinding graph & tree algorithms much faster.",
      "Consistent academic record with progressive improvement after 4th semester."
    ],
    bulletRewrites: [
      {
        original: "Developed a console-based software application to issue, return, and search books in a college library.",
        fixed: "Designed and implemented an OOP-driven library management system in C++, reducing book checkout latency by 40% using custom hashing algorithms.",
        whyItWorks: "Applies the FAANG STAR format with measurable latency reduction and explicit algorithmic implementation."
      },
      {
        original: "Connected with OpenWeather free API to fetch live temperature and humidity of any city entered by user.",
        fixed: "Built an interactive weather forecast application serving real-time meteorological metrics across 200+ cities with sub-300ms API response handling.",
        whyItWorks: "Introduces scale (200+ cities) and quantified service-level performance targets (sub-300ms)."
      },
      {
        original: "Class Representative for Section B during 3rd year.",
        fixed: "Elected Class Representative representing 70+ engineering students; coordinated academic schedules with faculty and resolved 15+ departmental issues.",
        whyItWorks: "Quantifies the cohort size (70+) and operational output, proving tangible leadership credibility."
      }
    ]
  },

  'placement-hod': {
    cookedPercentage: 92,
    verdictTitle: "Debarred from Day-1 Campus Recruitment",
    predictedPackage: "₹2.8 LPA (TPO Special Off-Campus Referral)",
    roastSummary: "Mr. Rahul Sharma, Section B. First of all, who authorized this non-standard resume font? Training and Placement Cell circular #42 clearly instructed Times New Roman 12-point format with 1-inch margins! You have mentioned 2 backlogs in 4th semester—do you think the visiting Japanese MNC panel will applaud your backlog clearing ceremony? Furthermore, handling the mic and projector in the cultural fest does NOT count as technical leadership. Report to Room 102 tomorrow in formal black trousers and tie or face immediate debarment!",
    redFlags: [
      "Career objective is 100% copied from previous year's passed-out seniors' placement file.",
      "Cleared 2 backlogs in 4th semester which violates the strict Day-1 dream company zero-history criteria.",
      "Claiming 'Projector and Mic setup' under Extracurricular Technical Organizing Committee."
    ],
    greenFlags: [
      "Passed 10th and 12th board exams with >70% aggregate, which barely saves you from Day-0 Mass Recruiter rejection.",
      "Maintained above 75% attendance criteria in final year labs."
    ],
    bulletRewrites: [
      {
        original: "Active Member of College Cultural Fest Technical Organizing Committee (handled mic and projector setup).",
        fixed: "Managed technical stage systems and audio-visual hardware operations for college annual symposium with 2,000+ registered attendees.",
        whyItWorks: "Presents institutional event management formally and avoids sounding like an amateur lab assistant."
      },
      {
        original: "Developed a console-based software application to issue, return, and search books in a college library.",
        fixed: "Engineered a digitized library record management system in C++ automating manual register workflows for 500+ daily departmental transactions.",
        whyItWorks: "Positions the academic project as a formal institutional automation workflow."
      },
      {
        original: "Completed 2-Day National Level Workshop on 'Generative AI and ChatGPT' conducted by IITian trainers.",
        fixed: "Certified participant in National Technical Workshop on Generative AI Architectures and Prompt Engineering methodologies.",
        whyItWorks: "Removes informal 'IITian trainers' phrase and presents technical workshop training with professional rigor."
      }
    ]
  }
};
