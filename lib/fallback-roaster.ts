import { PersonaId, RoastResult } from './types';
import { PRESET_SAMPLE_ROASTS } from './sample-data';

export function generateHeuristicRoast(
  text: string,
  persona: PersonaId,
  targetName?: string,
  sourceType: 'pdf' | 'github' | 'sample' = 'pdf'
): RoastResult {
  const lower = text.toLowerCase();
  const name = targetName || (lower.includes('rahul') ? 'Rahul' : 'Candidate');

  // If it's the Tier-3 sample or closely matches it, use the master crafted preset
  if (sourceType === 'sample' || (lower.includes('rahul sharma') && lower.includes('library management'))) {
    const preset = PRESET_SAMPLE_ROASTS[persona];
    return {
      ...preset,
      personaId: persona,
      targetName: 'Rahul Sharma',
      sourceType,
    };
  }

  // Detect keywords
  const hasCalculator = lower.includes('calculator');
  const hasWeather = lower.includes('weather');
  const hasTodo = lower.includes('todo') || lower.includes('to-do');
  const hasClone = lower.includes('clone') || lower.includes('netflix') || lower.includes('spotify') || lower.includes('amazon');
  const hasCPlusPlus = lower.includes('c++') || lower.includes('turbo c');
  const hasJava = lower.includes('java') && !lower.includes('javascript');
  const hasMern = lower.includes('mern') || (lower.includes('react') && lower.includes('mongo'));
  const hasLeetcode = lower.includes('leetcode') || lower.includes('codechef') || lower.includes('hackerrank');
  const hasBacklog = lower.includes('backlog') || lower.includes('kt');
  const hasObjective = lower.includes('objective') || lower.includes('challenging environment');
  const hasAI = lower.includes('ai') || lower.includes('machine learning') || lower.includes('chatgpt') || lower.includes('deep learning');
  const isGitHub = sourceType === 'github' || lower.includes('github profile roast data');

  // Compute a dynamic cooked percentage based on generic project tropes
  let score = 70;
  if (hasCalculator) score += 9;
  if (hasWeather) score += 7;
  if (hasTodo) score += 8;
  if (hasClone) score += 6;
  if (hasObjective) score += 6;
  if (lower.includes('turbo c')) score += 12;
  if (hasBacklog) score += 8;
  if (score > 98) score = 98;
  if (score < 40) score = 40;

  if (persona === 'mass-recruiter') {
    return {
      cookedPercentage: score,
      verdictTitle: score > 80 ? "Certified Mass Recruiter Day-1 Candidate" : "Service Company Bench Material",
      predictedPackage: score > 85 ? "₹3.36 LPA (with 2-year service agreement)" : "₹3.8 LPA (Training in Mysore Campus)",
      roastSummary: `Dear ${name}, we have reviewed your profile through our automated campus drive spreadsheet. We noticed you listed ${
        hasCPlusPlus ? 'C++ and OOPs' : hasJava ? 'Core Java & JDBC' : 'modern web tools'
      } alongside MS Office. While your career objective has that authentic 2012 vibe, we are pleased to confirm that you will fit right into our legacy enterprise migration team in Hinjewadi Phase 3. Please ensure your 10th and 12th marksheet photocopies are attested before reporting to the cafeteria at 8:30 AM.`,
      redFlags: [
        hasObjective ? "Classic copy-pasted 'challenging environment' career objective from old senior's batch." : "Generic skill dump without verifiable enterprise production experience.",
        hasCalculator || hasWeather ? "Showcasing beginner tutorial apps (Calculator/Weather) as headline technical achievements." : "Projects lack unit tests, CI/CD pipelines, and database indexing.",
        hasAI ? "Claiming AI/ML proficiency after attending a weekend webinar on prompt engineering." : "No mention of 90-day notice period readiness or 2-year bond agreement acknowledgment."
      ],
      greenFlags: [
        "Resume follows standard sequential order which doesn't crash our ATS parser.",
        "Demonstrates basic programming literacy suitable for our 6-month Mysore training foundation."
      ],
      bulletRewrites: [
        {
          original: "Developed web application using React and Node.js with database integration.",
          fixed: "Architected a full-stack web portal utilizing React and Node.js REST APIs with relational database normalization.",
          whyItWorks: "Replaces generic buzzwords with architectural and relational database terminology."
        },
        {
          original: "Worked on bug fixes and added new features based on requirements.",
          fixed: "Resolved 25+ critical customer-reported defects and shipped 4 core features adhering to Agile sprint deadlines.",
          whyItWorks: "Introduces quantified delivery metrics (25+ defects, 4 features) and Agile methodology."
        },
        {
          original: "Handled user authentication and password security in login page.",
          fixed: "Implemented JWT-based authentication protocol with bcrypt salted hashing and RBAC session security.",
          whyItWorks: "Specifies the exact cryptographic algorithms and access-control patterns used."
        }
      ],
      personaId: persona,
      targetName: name,
      sourceType
    };
  }

  if (persona === 'startup-cto') {
    return {
      cookedPercentage: Math.min(score + 4, 99),
      verdictTitle: isGitHub ? "Ghost Town Repo Collector" : "Koramangala Beanbag Rejection",
      predictedPackage: "₹5 LPA + 0.001% phantom ESOPs (Subject to 4-year cliff)",
      roastSummary: `Look ${name}, I just scrolled through your ${isGitHub ? 'GitHub activity' : 'resume'} over an oat milk cold brew in Indiranagar. Bro, where is the systems thinking? You have built ${
        hasTodo ? 'a todo app' : hasCalculator ? 'a calculator' : 'cookie-cutter tutorial apps'
      } that any 10-minute AI prompt could generate in its sleep. Talk to me about p99 latency spikes, race conditions in concurrent transactions, or Redis caching strategies. Right now, this portfolio wouldn't survive 15 seconds in our staging Kubernetes cluster.`,
      redFlags: [
        isGitHub ? "High ratio of forked repos with zero user-authored commits or pull requests." : "Projects have zero real users, zero analytics, and zero production observability.",
        hasClone ? "Bragging about a frontend UI clone instead of building an original product that solves a real user problem." : "No telemetry, no logging (Datadog/Prometheus), and no distributed tracing mentioned.",
        "Lacks understanding of horizontal scaling, message brokers (Kafka/RabbitMQ), and database connection pooling."
      ],
      greenFlags: [
        "Has working familiarity with modern JavaScript/TypeScript ecosystem tools.",
        "Shows curiosity to build things outside college curriculum."
      ],
      bulletRewrites: [
        {
          original: "Built a weather application using React and OpenWeatherMap API.",
          fixed: "Constructed an edge-cached weather client in React with debounced geocoding and automated stale-while-revalidate caching.",
          whyItWorks: "Transforms a simple fetch call into a production-grade edge networking pattern."
        },
        {
          original: "Created backend API in Node.js and Express to save user data into MongoDB.",
          fixed: "Engineered scalable REST endpoints in Node.js/Express with MongoDB indexing, reducing median query latency by 35%.",
          whyItWorks: "Demonstrates database performance optimization and quantified latency reductions."
        },
        {
          original: "Collaborated with team members on GitHub using branches and pull requests.",
          fixed: "Streamlined Git branch workflows and automated GitHub Actions CI/CD pipelines, slashing PR review cycles by 40%.",
          whyItWorks: "Shifts from passive cooperation to driving automated DevOps efficiency."
        }
      ],
      personaId: persona,
      targetName: name,
      sourceType
    };
  }

  if (persona === 'faang-bhaiya') {
    return {
      cookedPercentage: score,
      verdictTitle: "Zero STAR Metric Syndrome",
      predictedPackage: "₹7.5 LPA off-campus (or ₹50 LPA in YouTube Clickbait)",
      roastSummary: `Arre ${name} bhaiya! I opened your resume and the first thing I asked is: Where is the STAR format? Situation, Task, Action, Result! You wrote sentences like 'Worked on project' without a single percentage, without user counts, and without mentioning your LeetCode contest rating. Bhaiya told you 100 times in my Telegram roadmap: Big tech recruiters spend 6 seconds on your PDF. If they don't see numbers and algorithmic depth, it goes straight to the recruiter recycle bin.`,
      redFlags: [
        "Not a single bullet point follows Google's X-Y-Z formula (Accomplished [X] as measured by [Y], by doing [Z]).",
        hasLeetcode ? "Mentioned competitive programming but omitted actual contest ratings and global ranks." : "No proof of strong DSA problem solving (Trees, Graphs, DP) or LeetCode contest milestones.",
        "Too many buzzwords listed under skills without verifiable production application in project descriptions."
      ],
      greenFlags: [
        "Core foundational computer science coursework is clearly documented.",
        "Eagerness to learn full-stack development tools early in career."
      ],
      bulletRewrites: [
        {
          original: "Created a student management portal with login and dashboard.",
          fixed: "Engineered a student management portal serving 1,200+ active campus users, reducing manual record retrieval time by 55% using indexed queries.",
          whyItWorks: "Applies the Google STAR formula with active user volume (1,200+) and percentage efficiency (55%)."
        },
        {
          original: "Used React to make the website faster and responsive.",
          fixed: "Optimized React frontend bundle size by 38% via code-splitting and dynamic imports, elevating Google Lighthouse score from 62 to 94.",
          whyItWorks: "Quantifies performance gains using industry-standard Lighthouse benchmarks."
        },
        {
          original: "Solved coding problems on data structures and algorithms.",
          fixed: "Solved 350+ algorithmic problems across LeetCode & Codeforces, achieving top 12% global rating in weekly algorithmic contests.",
          whyItWorks: "Proves problem-solving consistency with concrete numbers and percentile ranking."
        }
      ],
      personaId: persona,
      targetName: name,
      sourceType
    };
  }

  // Strict Placement Cell HOD
  return {
    cookedPercentage: Math.min(score + 6, 99),
    verdictTitle: "Notice of Debarment Issued by TPO",
    predictedPackage: "₹2.9 LPA (Subject to clearing all backlogs)",
    roastSummary: `Attention ${name}! As Head of the Training and Placement Cell, I am shocked by this lack of institutional discipline. Who instructed you to use this informal styling? T&P Regulation #14 explicitly mandates standard 1-inch margins, Times New Roman typeface, and strictly verified academic percentages! You have listed vague hobby projects while remaining silent about your internal semester attendance. Do you realize that visiting MNC delegations expect 100% formal decorum? Report to my cabin at 8:00 AM sharp with your parents' contact information.`,
    redFlags: [
      hasObjective ? "Career objective is verbatim copied from previous batch's TPO sample file." : "Formatting deviates from university placement cell standard guidelines.",
      hasBacklog ? "Has academic backlogs which violates Tier-1 Dream Company eligibility criteria." : "Did not specify 10th and 12th board percentages with official school board names.",
      "Extracurricular section includes non-technical recreational hobbies instead of institutional responsibilities."
    ],
    greenFlags: [
      "Candidate has submitted resume before the strict 5:00 PM portal deadline.",
      "Clear chronological presentation of undergraduate degree coursework."
    ],
    bulletRewrites: [
      {
        original: "Organized technical events and workshops in college fest.",
        fixed: "Coordinated logistics and student registrations for 3 national technical workshops, managing participation of 450+ delegates.",
        whyItWorks: "Validates event management with precise institutional delegate counts."
      },
      {
        original: "Worked on academic major project using database and frontend.",
        fixed: "Completed Departmental Capstone Project implementing a relational database schema compliant with IEEE software engineering standards.",
        whyItWorks: "Frames academic work within formal IEEE academic and engineering standards."
      },
      {
        original: "Participated in college coding competition.",
        fixed: "Secured 2nd rank among 120 competitors in Annual Inter-Departmental Algorithmic Hackathon organized by Computer Science Department.",
        whyItWorks: "Specifies exact rank, cohort size, and departmental authority."
      }
    ],
    personaId: persona,
    targetName: name,
    sourceType
  };
}
