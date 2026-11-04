import { PersonaId, RoastResult } from './types';
import { PRESET_SAMPLE_ROASTS } from './sample-data';

interface ParsedProfileMetrics {
  isGitHub: boolean;
  name: string;
  username: string;
  publicRepos: number;
  totalStars: number;
  followers: number;
  forkedCount: number;
  totalSampled: number;
  languages: string[];
  rawText: string;
  isEssentiallyEmpty: boolean;
  hasCalculator: boolean;
  hasWeather: boolean;
  hasTodo: boolean;
  hasClone: boolean;
  hasObjective: boolean;
  hasTurboC: boolean;
  hasBacklog: boolean;
  hasCloud: boolean;
  hasModernBackend: boolean;
  hasMetrics: boolean;
  hasExperience: boolean;
  hasCompetitiveCoding: boolean;
}

function parseProfileMetrics(
  text: string,
  targetName?: string,
  sourceType: 'pdf' | 'github' | 'sample' = 'pdf'
): ParsedProfileMetrics {
  const lower = text.toLowerCase();
  const isGitHub = sourceType === 'github' || lower.includes('github profile roast data:');

  // Extract GitHub metrics if present
  const repoMatch = text.match(/Public Repositories:\s*(\d+)/i);
  const publicRepos = repoMatch ? parseInt(repoMatch[1], 10) : 0;

  const starMatch = text.match(/Total Stars[^:]*:\s*(\d+)/i);
  const totalStars = starMatch ? parseInt(starMatch[1], 10) : 0;

  const followersMatch = text.match(/Followers:\s*(\d+)/i);
  const followers = followersMatch ? parseInt(followersMatch[1], 10) : 0;

  const forkMatch = text.match(/Forked Repos in sample:\s*(\d+)\s*out of\s*(\d+)/i);
  const forkedCount = forkMatch ? parseInt(forkMatch[1], 10) : 0;
  const totalSampled = forkMatch ? parseInt(forkMatch[2], 10) : 0;

  const userMatch = text.match(/Username:\s*@?([a-zA-Z0-9_-]+)/i);
  const username = userMatch ? userMatch[1] : '';

  const langMatch = text.match(/Primary Languages Detected:\s*([^\n]+)/i);
  const languages = langMatch && !langMatch[1].toLowerCase().includes('none')
    ? langMatch[1].split(',').map((l) => l.trim())
    : [];

  const extractedName =
    targetName ||
    username ||
    (lower.includes('rahul') ? 'Rahul' : 'Candidate');

  // Empty / worthless check
  const isEssentiallyEmpty = isGitHub
    ? publicRepos === 0 ||
      lower.includes('no public repositories found') ||
      (publicRepos <= 2 && totalStars === 0 && followers <= 1 && (forkedCount === totalSampled || languages.length === 0))
    : text.trim().length < 180;

  // Signal detection
  const hasCalculator = lower.includes('calculator');
  const hasWeather = lower.includes('weather');
  const hasTodo = lower.includes('todo') || lower.includes('to-do');
  const hasClone =
    lower.includes('clone') ||
    lower.includes('netflix') ||
    lower.includes('spotify') ||
    lower.includes('amazon') ||
    lower.includes('e-commerce');
  const hasObjective =
    lower.includes('career objective') ||
    lower.includes('challenging environment') ||
    lower.includes('dynamic organization');
  const hasTurboC = lower.includes('turbo c') || lower.includes('turboc');
  const hasBacklog = lower.includes('backlog') || lower.includes('arrear') || lower.includes('kt');
  const hasCloud =
    lower.includes('aws') ||
    lower.includes('gcp') ||
    lower.includes('docker') ||
    lower.includes('kubernetes') ||
    lower.includes('k8s');
  const hasModernBackend =
    lower.includes('redis') ||
    lower.includes('kafka') ||
    lower.includes('postgres') ||
    lower.includes('golang') ||
    lower.includes('rust') ||
    lower.includes('system design');
  const hasMetrics =
    /[0-9]+%|[0-9]+\s*ms|[0-9]+k\s*users|million|optimized by|reduced by/i.test(text);
  const hasExperience =
    lower.includes('software engineer') ||
    lower.includes('sde') ||
    lower.includes('intern') ||
    lower.includes('founding engineer');
  const hasCompetitiveCoding =
    lower.includes('leetcode') ||
    lower.includes('codeforces') ||
    lower.includes('codechef') ||
    lower.includes('guardian') ||
    lower.includes('knight');

  return {
    isGitHub,
    name: extractedName,
    username,
    publicRepos,
    totalStars,
    followers,
    forkedCount,
    totalSampled,
    languages,
    rawText: text,
    isEssentiallyEmpty,
    hasCalculator,
    hasWeather,
    hasTodo,
    hasClone,
    hasObjective,
    hasTurboC,
    hasBacklog,
    hasCloud,
    hasModernBackend,
    hasMetrics,
    hasExperience,
    hasCompetitiveCoding,
  };
}

function calculateCookedScore(m: ParsedProfileMetrics): number {
  if (m.isEssentiallyEmpty) {
    // If completely empty (0 repos, 0 stars, 0 followers) -> 96% - 99% cooked!
    if (m.isGitHub && m.publicRepos === 0) return 98;
    return 95;
  }

  if (m.isGitHub) {
    // Highly capable GitHub account: 30+ stars, 15+ repos, multiple languages, not all forked
    if (m.totalStars >= 30 && m.publicRepos >= 8 && m.languages.length >= 2 && m.forkedCount < m.publicRepos) {
      if (m.totalStars >= 100 || m.followers >= 50) return 18; // Elite
      return 32; // Solid mid/senior
    }

    // Decent GitHub: 5-25 stars, original repos
    if (m.totalStars >= 5 && m.publicRepos >= 4 && m.forkedCount < m.publicRepos) {
      return 54;
    }

    // Tutorial hell: 1-4 repos, 0-2 stars, calculator/weather/todo/clones or only forked repos
    let score = 84;
    if (m.totalStars === 0) score += 5;
    if (m.publicRepos <= 2) score += 4;
    if (m.forkedCount === m.totalSampled && m.totalSampled > 0) score += 6; // only forks!
    if (m.hasCalculator || m.hasWeather || m.hasTodo) score += 4;
    return Math.min(score, 98);
  }

  // Resume PDF Scoring
  let score = 68; // neutral baseline

  // Negative weights
  if (m.hasCalculator) score += 8;
  if (m.hasWeather) score += 7;
  if (m.hasTodo) score += 8;
  if (m.hasClone) score += 6;
  if (m.hasObjective) score += 7;
  if (m.hasTurboC) score += 14;
  if (m.hasBacklog) score += 10;
  if (!m.hasMetrics) score += 6;

  // Positive weights (reduces cooked percentage)
  if (m.hasCloud) score -= 12;
  if (m.hasModernBackend) score -= 14;
  if (m.hasMetrics) score -= 10;
  if (m.hasExperience) score -= 8;
  if (m.hasCompetitiveCoding) score -= 9;

  return Math.min(Math.max(score, 18), 98);
}

function getPredictedCTC(score: number, persona: PersonaId, m: ParsedProfileMetrics): string {
  // Bracket 1: Incinerated / Worthless / Zero Output (Score >= 92)
  if (score >= 92) {
    switch (persona) {
      case 'mass-recruiter':
        return '₹1.8 LPA (Non-Voice BPO Night Shift)';
      case 'startup-cto':
        return '₹0 (Unpaid 16-Hour Intern)';
      case 'faang-bhaiya':
        return '₹0 LPA (Auto-Rejected in 0.1s)';
      case 'placement-hod':
        return 'Debarred from Campus Drive (0 Offers)';
    }
  }

  // Bracket 2: Tutorial Hell / Very Weak (Score 80 - 91)
  if (score >= 80) {
    switch (persona) {
      case 'mass-recruiter':
        return '₹3.36 LPA (2-Yr Bond + Mysore Training)';
      case 'startup-cto':
        return '₹3.6 LPA + Unlimited ESOPs (Worth ₹0)';
      case 'faang-bhaiya':
        return '₹4.0 LPA (Off-Campus Waiting List)';
      case 'placement-hod':
        return '₹2.8 LPA (Day 4 Mass Drive Referral)';
    }
  }

  // Bracket 3: Average Junior Dev (Score 62 - 79)
  if (score >= 62) {
    switch (persona) {
      case 'mass-recruiter':
        return '₹5.5 LPA (Ninja / Elevate Cadre)';
      case 'startup-cto':
        return '₹7.5 LPA + Beanbag (Indiranagar Basement)';
      case 'faang-bhaiya':
        return '₹8.0 LPA (Tier-2 Product Firm)';
      case 'placement-hod':
        return '₹5.5 LPA (Category-B Dream Offer)';
    }
  }

  // Bracket 4: Solid / Competent Dev (Score 40 - 61)
  if (score >= 40) {
    switch (persona) {
      case 'mass-recruiter':
        return '₹9.0 LPA (Digital Specialist Engineer)';
      case 'startup-cto':
        return '₹15 LPA - ₹18 LPA (Core Fullstack SDE)';
      case 'faang-bhaiya':
        return '₹16 LPA - ₹22 LPA (SDE-1 Tier-1 Product)';
      case 'placement-hod':
        return '₹14 LPA (Campus Super Dream Offer)';
    }
  }

  // Bracket 5: Elite / Cracked (Score < 40)
  switch (persona) {
    case 'mass-recruiter':
      return 'Overqualified (HR Escalated to Vice President)';
    case 'startup-cto':
      return '₹32 LPA + 0.25% Equity (Founding Engineer)';
    case 'faang-bhaiya':
      return '₹45 LPA (L4 SDE-2 at Uber / Google)';
    case 'placement-hod':
      return '₹36 LPA (College Front Page Banner Offer)';
  }
}

function getVerdictBadge(score: number, persona: PersonaId, m: ParsedProfileMetrics): string {
  if (m.isEssentiallyEmpty) {
    if (m.isGitHub) {
      switch (persona) {
        case 'mass-recruiter':
          return 'NO COMMITS DETECTED';
        case 'startup-cto':
          return 'GHOST TOWN REPOSITORY';
        case 'faang-bhaiya':
          return 'NULL POINTER OCTOCAT';
        case 'placement-hod':
          return 'DEBARRED FOR INACTIVITY';
      }
    }
    return 'SUBMISSION DISQUALIFIED';
  }

  if (score >= 85) {
    if (m.isGitHub) {
      if (m.forkedCount === m.totalSampled && m.totalSampled > 0) return 'PROFESSIONAL FORK COLLECTOR';
      if (m.totalStars === 0) return 'ZERO STAR WONDER';
      return 'TUTORIAL CLONE CASUAL';
    }
    if (m.hasTurboC) return 'ARCHAIC TURBO-C DINOSAUR';
    if (m.hasCalculator || m.hasTodo) return 'CERTIFIED TUTORIAL HELL';
    return 'MASS RECRUITER BAIT';
  }

  if (score >= 65) {
    return 'MEDIOCRE TIER-3 SURVIVOR';
  }

  if (score >= 40) {
    return 'SURPRISINGLY EMPLOYABLE';
  }

  return 'ACTUALLY CRACKED SDE';
}

export function generateHeuristicRoast(
  text: string,
  persona: PersonaId,
  targetName?: string,
  sourceType: 'pdf' | 'github' | 'sample' = 'pdf'
): RoastResult {
  const lower = text.toLowerCase();

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

  const m = parseProfileMetrics(text, targetName, sourceType);
  const score = calculateCookedScore(m);
  const predictedCTC = getPredictedCTC(score, persona, m);
  const verdictBadge = getVerdictBadge(score, persona, m);
  const delusionLevel =
    score >= 90 ? 'EXTREME' : score >= 75 ? 'HIGH' : score >= 50 ? 'MODERATE' : 'LOW';

  // Construct context-specific roast paragraphs, red flags, green flags, and bullet fixes
  if (persona === 'mass-recruiter') {
    let roastParagraph = '';
    if (m.isEssentiallyEmpty) {
      roastParagraph = `Dear ${m.name}, our automated campus ATS system scanned your profile and found nothing to process. With ${m.publicRepos} active public repositories and zero verifiable technical artifacts, even our 6-month legacy maintenance batch in Hinjewadi cannot accept this file. Please report to the cafeteria for mandatory aptitude screening re-enrollment.`;
    } else if (score >= 80) {
      roastParagraph = `Dear ${m.name}, our campus recruitment portal has cataloged your profile. We noticed you listed ${
        m.hasTurboC ? 'Turbo C++ and MS Office' : m.languages.length ? m.languages.join(' and ') : 'basic scripting'
      }. While your career objective has that authentic 2012 vibe and your projects look like standard YouTube walkthroughs, you fit right into our 3-year enterprise migration roster. Please keep your 10th and 12th original marksheets ready for background verification.`;
    } else {
      roastParagraph = `Dear ${m.name}, we reviewed your profile. Surprisingly, your technical depth exceeds our standard TCS Ninja cutoffs. While we appreciate your hands-on code, our HR department is worried you might resign within 6 months to join a Bengaluru startup. We can offer you our Digital Specialist band provided you sign our 2-year service agreement.`;
    }

    const redFlags = m.isEssentiallyEmpty
      ? [
          'Zero verifiable code or production deployments found on the profile.',
          'No evidence of hands-on problem solving or technical coursework completion.',
          'Screening algorithm scored this candidate in the lowest 2nd percentile.',
        ]
      : [
          m.hasObjective
            ? "Classic copy-pasted 'seeking a challenging environment' career objective from senior's batch."
            : 'Generic skill listings without verifiable enterprise production experience.',
          m.hasCalculator || m.hasWeather
            ? 'Showcasing beginner tutorial apps (Calculator/Weather) as flagship engineering achievements.'
            : 'Repository commits lack automated CI/CD checks and unit test suites.',
          m.hasBacklog
            ? 'Active backlogs violate Day-1 campus placement eligibility threshold.'
            : 'No formal acknowledgment of 90-day notice period or 2-year bond agreement.',
        ];

    const greenFlags = m.isEssentiallyEmpty
      ? [
          'Profile did not crash our text parsing engine.',
          'Candidate demonstrated capability to submit an online form.',
        ]
      : [
          'Resume layout is chronologically ordered and easy for human recruiters to skim in 6 seconds.',
          'Demonstrates sufficient programming aptitude for our foundational Mysore training program.',
        ];

    const bulletFixes = [
      {
        weakOriginal: m.isGitHub ? 'Created various small repository projects on GitHub.' : 'Developed web application using React and Node.js.',
        strongRewrite: 'Architected a full-stack portal using React and Node.js REST APIs with relational PostgreSQL database schema normalization.',
        reason: 'Replaces vague project claims with concrete architectural and relational database terminology.',
      },
      {
        weakOriginal: 'Fixed bugs and added features based on requirements.',
        strongRewrite: 'Resolved 25+ critical customer defects and shipped 4 key modules adhering strictly to 2-week Agile sprint cycles.',
        reason: 'Introduces quantified delivery metrics and institutional methodology.',
      },
      {
        weakOriginal: 'Handled user authentication in web application.',
        strongRewrite: 'Implemented JWT token-based authentication protocol with bcrypt salted password hashing and role-based access control (RBAC).',
        reason: 'Specifies exact cryptographic standards and security access patterns.',
      },
    ];

    return {
      cookedPercentage: score,
      verdictBadge,
      predictedCTC,
      delusionLevel,
      roastParagraph,
      redFlags,
      greenFlags,
      bulletFixes,
      verdictTitle: verdictBadge,
      predictedPackage: predictedCTC,
      roastSummary: roastParagraph,
      bulletRewrites: bulletFixes.map((b) => ({ original: b.weakOriginal, fixed: b.strongRewrite, whyItWorks: b.reason })),
      personaId: persona,
      targetName: m.name,
      sourceType,
    };
  }

  if (persona === 'startup-cto') {
    let roastParagraph = '';
    if (m.isEssentiallyEmpty) {
      roastParagraph = `Look ${m.name}, I opened your profile over an oat milk cold brew in Indiranagar and thought my WiFi dropped. Bro, where is the code? You have ${m.publicRepos} public repos and ${m.totalStars} stars. Even my automated staging healthcheck bot has more git commits than your entire digital existence. Right now, this portfolio wouldn't survive 10 seconds in our Slack interview channel.`;
    } else if (score >= 80) {
      roastParagraph = `Look ${m.name}, I just went through your ${m.isGitHub ? 'GitHub activity' : 'resume'}. Where is the systems thinking? You have built ${
        m.hasTodo ? 'a todo app' : m.hasCalculator ? 'a calculator' : 'cookie-cutter tutorial clones'
      } that any 10-second AI prompt generates in its sleep. Talk to me about p99 latency spikes, race conditions in database transactions, or Redis caching strategies. Right now, your code would melt the moment 50 concurrent users hit your endpoint.`;
    } else {
      roastParagraph = `Alright ${m.name}, credit where it is due: you actually have decent code. I see real architectural patterns, decent repo structure, and actual original thinking. You are barely cooked. If you can optimize our Docker container build times and handle database shard failovers, my founders would probably write you an offer on a paper napkin.`;
    }

    const redFlags = m.isEssentiallyEmpty
      ? [
          'Ghost town profile — total absence of real-world commits or pull requests.',
          'Zero original public repositories with architectural documentation.',
          'No traces of Docker, CI/CD, or deployment pipelines anywhere.',
        ]
      : [
          m.isGitHub && m.forkedCount > 0
            ? `${m.forkedCount} out of ${m.totalSampled} sampled repositories are forks with zero original contributions.`
            : 'Projects lack real production users, telemetry, or structured logging (Datadog/Prometheus).',
          m.hasClone
            ? 'Showcasing a frontend UI clone instead of an original product that solves real-world pain points.'
            : 'No mention of message queues (Kafka/RabbitMQ) or horizontal scaling strategies.',
          'Lacks database indexing, connection pooling, and edge-caching design patterns.',
        ];

    const greenFlags = m.isEssentiallyEmpty
      ? [
          'At least the GitHub username registration completed without merge conflicts.',
          'Zero commits means zero API secret keys accidentally leaked to the public internet.',
        ]
      : [
          `Familiarity with modern programming languages (${m.languages.length ? m.languages.slice(0, 3).join(', ') : 'modern tools'}).`,
          'Shows genuine technical initiative beyond traditional college course syllabi.',
        ];

    const bulletFixes = [
      {
        weakOriginal: m.isGitHub ? 'Pushed basic project files to GitHub repository.' : 'Built a web application using React and API calls.',
        strongRewrite: 'Constructed an edge-cached web client with debounced input searching, automated SWR caching, and sub-100ms render times.',
        reason: 'Transforms a beginner fetch call into a production-grade edge networking pattern.',
      },
      {
        weakOriginal: 'Created backend API in Node.js to save data into database.',
        strongRewrite: 'Engineered high-throughput Node.js REST endpoints with MongoDB compound indexing, slashing p95 query latency by 42%.',
        reason: 'Demonstrates database performance optimization and quantified latency reductions.',
      },
      {
        weakOriginal: 'Worked on Git branches and created pull requests.',
        strongRewrite: 'Automated GitHub Actions CI/CD pipeline with trunk-based branching, shrinking PR integration and deployment cycles by 35%.',
        reason: 'Shifts from passive Git usage to automated DevOps infrastructure.',
      },
    ];

    return {
      cookedPercentage: score,
      verdictBadge,
      predictedCTC,
      delusionLevel,
      roastParagraph,
      redFlags,
      greenFlags,
      bulletFixes,
      verdictTitle: verdictBadge,
      predictedPackage: predictedCTC,
      roastSummary: roastParagraph,
      bulletRewrites: bulletFixes.map((b) => ({ original: b.weakOriginal, fixed: b.strongRewrite, whyItWorks: b.reason })),
      personaId: persona,
      targetName: m.name,
      sourceType,
    };
  }

  if (persona === 'faang-bhaiya') {
    let roastParagraph = '';
    if (m.isEssentiallyEmpty) {
      roastParagraph = `Arre ${m.name} bhaiya/didi! I opened your profile expecting high-concurrency distributed systems or at least a 350-problem LeetCode contest rating, and I found ${m.publicRepos} repos and ${m.totalStars} stars! Zero algorithmic depth, zero open-source contributions! Even the GitHub contribution graph looks like an abandoned salt flat in the Thar desert. Big tech recruiters spend 6 seconds per candidate; with this profile, they will reject you in 0.1 seconds!`;
    } else if (score >= 80) {
      roastParagraph = `Arre ${m.name} bhaiya! I opened your ${m.isGitHub ? 'GitHub' : 'resume'} and the first question that popped into my head is: Where is the Google STAR format?! Situation, Task, Action, Result! You wrote vague sentences like 'worked on website' without a single percentage, without active user volumes, and without mentioning your DSA contest rank. Bhaiya told you 100 times in my Telegram roadmap: If recruiters do not see algorithmic metrics, your PDF goes straight to the recycle bin!`;
    } else {
      roastParagraph = `Bhaiya is actually impressed, ${m.name}! Your profile actually has quantified achievements, solid technical foundations, and proper architectural scope. You are barely cooked! If you brush up on your Dynamic Programming and System Design trade-offs (CAP theorem, consistent hashing), you can easily clear the phone screen for Tier-1 product companies.`;
    }

    const redFlags = m.isEssentiallyEmpty
      ? [
          'Profile has 0 stars and zero algorithmic contributions — recruiter screening bot will discard instantly.',
          'Not a single data structures or algorithmic problem-solving repository found.',
          'Total absence of quantified impact metrics or STAR format accomplishments.',
        ]
      : [
          'Not a single bullet point adheres to Google’s X-Y-Z formula (Accomplished [X] measured by [Y] doing [Z]).',
          m.hasCompetitiveCoding
            ? 'Mentioned competitive coding but omitted contest ratings and global percentiles.'
            : 'No verifiable proof of algorithmic problem solving (Trees, Graphs, DP, Contest ratings).',
          'Too many surface-level buzzwords without deep algorithmic implementation evidence.',
        ];

    const greenFlags = m.isEssentiallyEmpty
      ? [
          'Clean slate with zero bad algorithmic habits to unlearn.',
          'Can start following Striver’s 450 DSA Sheet immediately from Day 1.',
        ]
      : [
          'Clear technical interest in modern software development ecosystems.',
          'Demonstrates foundational grasp of core computer science fundamentals.',
        ];

    const bulletFixes = [
      {
        weakOriginal: 'Created a student portal with login and dashboard.',
        strongRewrite: 'Engineered a student portal serving 1,400+ active campus users, reducing manual record lookup times by 55% using indexed SQL queries.',
        reason: 'Applies Google’s STAR formula with user scale (1,400+) and efficiency metrics (55%).',
      },
      {
        weakOriginal: 'Made the web application responsive and faster.',
        strongRewrite: 'Optimized frontend bundle size by 40% via code-splitting and dynamic imports, boosting Google Lighthouse score from 64 to 96.',
        reason: 'Quantifies performance gains using industry-standard Lighthouse benchmarks.',
      },
      {
        weakOriginal: 'Practiced coding problems on data structures.',
        strongRewrite: 'Solved 380+ algorithmic problems across LeetCode & Codeforces, achieving top 15% global rating in weekly contests.',
        reason: 'Validates problem-solving discipline with verifiable numbers and percentile rankings.',
      },
    ];

    return {
      cookedPercentage: score,
      verdictBadge,
      predictedCTC,
      delusionLevel,
      roastParagraph,
      redFlags,
      greenFlags,
      bulletFixes,
      verdictTitle: verdictBadge,
      predictedPackage: predictedCTC,
      roastSummary: roastParagraph,
      bulletRewrites: bulletFixes.map((b) => ({ original: b.weakOriginal, fixed: b.strongRewrite, whyItWorks: b.reason })),
      personaId: persona,
      targetName: m.name,
      sourceType,
    };
  }

  // Placement Cell HOD
  let roastParagraph = '';
  if (m.isEssentiallyEmpty) {
    roastParagraph = `Attention ${m.name}! As Head of the Training and Placement Cell, I am appalled by this complete absence of academic and technical accountability. You have submitted a profile with zero verifiable achievements, zero repositories, and zero institutional contributions! As per T&P Circular #2024/7B, you are hereby debarred from all upcoming campus recruitment drives until your parents report to my office.`;
  } else if (score >= 80) {
    roastParagraph = `Attention ${m.name}! Who authorized this informal presentation? T&P Regulation #14 explicitly mandates 1-inch margins, Times New Roman typeface, and strictly verified academic percentages! You have listed hobby projects while remaining silent about your internal semester attendance and clearance status. Report to my cabin at 8:00 AM sharp with your departmental clearance signed in triplicate.`;
  } else {
    roastParagraph = `Candidate ${m.name}, your credentials have been verified by the Placement Cell committee. Your academic and project portfolio meets the baseline requirements for our Tier-1 Dream Company placement schedule. Ensure formal attire is worn and be seated in the auditorium by 7:45 AM.`;
  }

  const redFlags = m.isEssentiallyEmpty
    ? [
        'Candidate profile is completely empty — automatic debarment from Day-1 campus placement drives.',
        'Zero departmental capstone project work or verifiable laboratory submissions.',
        'Violates institutional placement committee minimum submission criteria.',
      ]
    : [
        m.hasObjective
          ? "Career objective is copy-pasted verbatim from previous batch's TPO sample file."
          : 'Formatting deviates from university placement cell standard guidelines.',
        m.hasBacklog
          ? 'Active academic backlogs violate Dream Company campus placement eligibility criteria.'
          : 'Missing verified 10th and 12th board marks with official schooling documentation.',
        'Extracurricular section includes non-academic recreational hobbies instead of institutional responsibilities.',
      ];

  const greenFlags = m.isEssentiallyEmpty
    ? [
        'Candidate profile registered before the final portal deadline.',
        'Institutional disciplinary record currently has no pending suspension notices.',
      ]
    : [
        'Candidate submitted profile data through proper institutional channels.',
        'Chronological educational coursework timeline is clearly documented.',
      ];

  const bulletFixes = [
    {
      weakOriginal: 'Organized technical events in college fest.',
      strongRewrite: 'Coordinated logistics and student registrations for 3 national technical symposia, managing participation of 500+ student delegates.',
      reason: 'Validates organizational leadership with verified delegate counts.',
    },
    {
      weakOriginal: 'Worked on final year engineering project.',
      strongRewrite: 'Completed Departmental Capstone Project implementing a relational schema compliant with IEEE software engineering standards.',
      reason: 'Frames project work within recognized IEEE academic and engineering standards.',
    },
    {
      weakOriginal: 'Participated in college hackathon.',
      strongRewrite: 'Secured 2nd rank among 140 competitors in Annual Inter-Departmental Algorithmic Hackathon organized by CSE Department.',
      reason: 'Validates competitive performance with specific ranking and departmental cohort size.',
    },
  ];

  return {
    cookedPercentage: score,
    verdictBadge,
    predictedCTC,
    delusionLevel,
    roastParagraph,
    redFlags,
    greenFlags,
    bulletFixes,
    verdictTitle: verdictBadge,
    predictedPackage: predictedCTC,
    roastSummary: roastParagraph,
    bulletRewrites: bulletFixes.map((b) => ({ original: b.weakOriginal, fixed: b.strongRewrite, whyItWorks: b.reason })),
    personaId: persona,
    targetName: m.name,
    sourceType,
  };
}
