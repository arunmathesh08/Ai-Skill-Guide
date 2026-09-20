import {
  SkillScore,
  RequiredSkill,
  Opportunity,
  CareerPath,
  SkillGapItem,
  SkillStatus,
  ProficiencyTier,
  BridgeCourse,
  RoadmapPhase
} from '../types';

/**
 * 3. DYNAMIC SCORE LOGIC
 * 90–100%: Status = Excellent
 * 75–89%: Status = Strong
 * 60–74%: Status = Developing
 * 40–59%: Status = Skill Gap
 * 0–39%: Status = Critical Gap
 */
export function getSkillStatus(score: number, hasAssessed: boolean = true): {
  status: SkillStatus;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  barColor: string;
} {
  if (!hasAssessed) {
    return {
      status: 'unassessed',
      label: 'Not Assessed',
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      badgeText: 'text-slate-700 dark:text-slate-300',
      badgeBorder: 'border-slate-300 dark:border-slate-700',
      barColor: 'bg-slate-300 dark:bg-slate-600'
    };
  }
  if (score >= 90) {
    return {
      status: 'excellent',
      label: 'Excellent',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      badgeText: 'text-emerald-800',
      badgeBorder: 'border-emerald-300',
      barColor: 'bg-emerald-500'
    };
  }
  if (score >= 75) {
    return {
      status: 'strong',
      label: 'Strong',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeText: 'text-emerald-700',
      badgeBorder: 'border-emerald-200',
      barColor: 'bg-emerald-500'
    };
  }
  if (score >= 60) {
    return {
      status: 'developing',
      label: 'Developing',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeText: 'text-amber-700',
      badgeBorder: 'border-amber-200',
      barColor: 'bg-amber-500'
    };
  }
  if (score >= 40) {
    return {
      status: 'gap',
      label: 'Skill Gap',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      badgeText: 'text-rose-700',
      badgeBorder: 'border-rose-200',
      barColor: 'bg-rose-500'
    };
  }
  return {
    status: 'critical_gap',
    label: 'Critical Gap',
    badgeBg: 'bg-red-100 text-red-800 border-red-300',
    badgeText: 'text-red-800',
    badgeBorder: 'border-red-300',
    barColor: 'bg-red-600'
  };
}

export function getProficiencyTier(score: number, hasAssessed: boolean = true): {
  tier: ProficiencyTier;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  barColor: string;
} {
  const statusInfo = getSkillStatus(score, hasAssessed);
  let tier: ProficiencyTier = 'beginner';
  if (score >= 80) tier = 'advanced';
  else if (score >= 60) tier = 'proficient';
  else if (score >= 40) tier = 'developing';

  return {
    tier,
    label: statusInfo.label,
    badgeBg: statusInfo.badgeBg,
    badgeText: statusInfo.badgeText,
    badgeBorder: statusInfo.badgeBorder,
    barColor: statusInfo.barColor
  };
}

/**
 * Robust skill alias matcher ensuring skills across assessments, careers, and jobs match reliably
 */
export function findMatchingSkill(skillName: string, studentSkills: SkillScore[]): SkillScore | undefined {
  if (!studentSkills || studentSkills.length === 0) return undefined;
  const target = skillName.toLowerCase().trim();

  // Direct exact match
  const exact = studentSkills.find(s => s.name.toLowerCase().trim() === target);
  if (exact) return exact;

  // Domain Alias Map
  const aliases: Record<string, string[]> = {
    'react': ['react.js', 'react', 'react 19', 'react fundamentals', 'frontend components'],
    'javascript': ['javascript', 'js', 'es6+', 'modern javascript', 'ts/js'],
    'typescript': ['typescript', 'ts'],
    'sql': ['sql', 'sql & queries', 'sql & database design', 'sql queries', 'relational database', 'database design', 'postgresql'],
    'node': ['node.js', 'node.js & express', 'node', 'nodejs', 'express.js', 'express', 'backend apis', 'rest apis'],
    'html': ['html', 'html/css', 'html5 & modern css', 'html & css', 'css', 'modern css'],
    'git': ['git', 'git & version control', 'github', 'version control'],
    'python': ['python', 'python programming', 'python data'],
    'data analysis': ['data analysis', 'exploratory data analysis', 'pandas'],
    'statistics': ['statistics & probability', 'statistics', 'probability'],
    'data visualization': ['data visualization', 'power bi', 'tableau', 'bi dashboards'],
    'business intelligence': ['business intelligence', 'bi', 'executive bi dashboards'],
    'docker': ['docker', 'docker & containers', 'containers', 'containerization'],
    'kubernetes': ['kubernetes', 'k8s', 'cluster orchestration'],
    'aws': ['aws', 'aws infrastructure', 'cloud deployment', 'cloud infrastructure'],
    'ci/cd': ['ci/cd', 'ci/cd pipelines', 'github actions', 'continuous integration'],
    'machine learning': ['machine learning', 'ml', 'scikit-learn', 'deep learning & pytorch', 'nlp & large language models'],
    'algorithms': ['data structures & algorithms', 'dsa', 'algorithms']
  };

  for (const [key, aliasList] of Object.entries(aliases)) {
    const isTargetInGroup = aliasList.some(a => target.includes(a) || a.includes(target));
    if (isTargetInGroup) {
      const match = studentSkills.find(s => {
        const sNorm = s.name.toLowerCase().trim();
        return aliasList.some(a => sNorm.includes(a) || a.includes(sNorm));
      });
      if (match) return match;
    }
  }

  // Fallback token matching
  const tokens = target.split(/[\s&,/]+/).filter(t => t.length >= 3);
  return studentSkills.find(s => {
    const normS = s.name.toLowerCase().trim();
    if (normS.includes(target) || target.includes(normS)) return true;
    return tokens.some(t => normS.includes(t));
  });
}

/**
 * Calculates Career Readiness strictly from user's actual assessed skills vs career requirements.
 * Overall Readiness = weighted average of min(1.0, user_score / required_score)
 * Low scores produce low readiness (e.g. 35%), never artificial numbers.
 */
export function calculateCareerReadiness(career: CareerPath, studentSkills: SkillScore[], hasAssessed: boolean = true): number {
  if (!hasAssessed || !studentSkills || studentSkills.length === 0) return 0;
  if (!career.requiredSkills || career.requiredSkills.length === 0) return 0;

  let totalPoints = 0;
  let totalWeight = 0;

  career.requiredSkills.forEach(req => {
    const weight = req.weight || 1.0;
    const studentSkill = findMatchingSkill(req.skillName, studentSkills);
    const studentScore = studentSkill ? studentSkill.score : 0;

    totalPoints += studentScore * weight;
    totalWeight += weight;
  });

  const readiness = Math.round(totalPoints / (totalWeight || 1));
  return Math.min(100, Math.max(0, readiness));
}

/**
 * 2. SKILL GAP ANALYSIS ENGINE
 * Calculates gaps and dynamically generates AI Strategic Recommendation based on score tiers.
 */
export function calculateSkillGaps(
  requiredSkills: RequiredSkill[],
  studentSkills: SkillScore[],
  targetRoleTitle: string = 'Full Stack Developer',
  hasAssessed: boolean = true,
  overrideScore?: number
): {
  gaps: SkillGapItem[];
  overallMatchScore: number;
  readinessStatus: string;
  biggestOpportunity: string;
  strategicExplanation: string;
  strongSkillsCount: number;
  developingSkillsCount: number;
  gapSkillsCount: number;
  criticalGapCount: number;
  sortedGaps: SkillGapItem[];
} {
  const gaps: SkillGapItem[] = [];
  let totalPoints = 0;
  let totalWeight = 0;

  if (!hasAssessed || !studentSkills || studentSkills.length === 0) {
    requiredSkills.forEach(req => {
      gaps.push({
        skillName: req.skillName,
        requiredScore: req.requiredScore,
        studentScore: 0,
        status: 'unassessed',
        statusLabel: 'Not Assessed',
        gapDelta: -req.requiredScore,
        gapPercentage: req.requiredScore
      });
    });

    return {
      gaps,
      overallMatchScore: 0,
      readinessStatus: 'Not Assessed',
      biggestOpportunity: 'Complete your initial skill assessment to uncover your verified skill gaps and personalized learning roadmap.',
      strategicExplanation: 'No verified skill data found. Take a proctored assessment to establish your baseline competency score.',
      strongSkillsCount: 0,
      developingSkillsCount: 0,
      gapSkillsCount: 0,
      criticalGapCount: 0,
      sortedGaps: gaps
    };
  }

  requiredSkills.forEach(req => {
    const weight = req.weight || 1.0;
    const studentSkill = findMatchingSkill(req.skillName, studentSkills);
    const studentScore = studentSkill ? studentSkill.score : 0;
    const statusObj = getSkillStatus(studentScore);

    const gapDelta = studentScore - req.requiredScore;
    const gapPercentage = Math.max(0, req.requiredScore - studentScore);

    gaps.push({
      skillName: req.skillName,
      requiredScore: req.requiredScore,
      studentScore,
      status: statusObj.status,
      statusLabel: statusObj.label,
      gapDelta,
      gapPercentage
    });

    totalPoints += studentScore * weight;
    totalWeight += weight;
  });

  const overallMatchScore = typeof overrideScore === 'number'
    ? overrideScore
    : (requiredSkills.length > 0 ? Math.round(totalPoints / (totalWeight || 1)) : 0);

  // Counts by status
  const strongSkillsCount = gaps.filter(g => g.status === 'excellent' || g.status === 'strong').length;
  const developingSkillsCount = gaps.filter(g => g.status === 'developing').length;
  const gapSkillsCount = gaps.filter(g => g.status === 'gap' || g.status === 'critical_gap').length;
  const criticalGapCount = gaps.filter(g => g.status === 'critical_gap').length;

  // Sort gaps so largest gaps appear first (worst gapDelta first)
  const sortedGaps = [...gaps].sort((a, b) => a.gapDelta - b.gapDelta);
  const worstGaps = sortedGaps.filter(g => g.gapDelta < 0);

  // Dynamic Readiness Status Label
  let readinessStatus = 'Needs Improvement';
  if (overallMatchScore >= 80) {
    readinessStatus = 'Strong Readiness';
  } else if (overallMatchScore >= 60) {
    readinessStatus = 'Developing Readiness';
  }

  // 4 & 5. DYNAMIC AI RECOMMENDATIONS (Low, Medium, High Behavior)
  let biggestOpportunity = '';
  let strategicExplanation = '';

  if (overallMatchScore < 50) {
    // LOW SCORE BEHAVIOR
    const keyGaps = worstGaps.slice(0, 3).map(g => g.skillName);
    const gapText = keyGaps.length > 0 ? keyGaps.join(', ') : 'core technical fundamentals';
    biggestOpportunity = `Your current assessment indicates several foundational skill gaps. Focus on ${gapText} before progressing to advanced ${targetRoleTitle} development.`;
    strategicExplanation = `Your assessment shows that your current ${targetRoleTitle} readiness is ${overallMatchScore}%. Focus on fundamental bridge courses to build your core proficiency step-by-step.`;
  } else if (overallMatchScore < 75) {
    // MEDIUM SCORE BEHAVIOR
    if (worstGaps.length >= 2) {
      biggestOpportunity = `Improve ${worstGaps[0].skillName} and ${worstGaps[1].skillName} to increase your role readiness score significantly.`;
    } else if (worstGaps.length === 1) {
      biggestOpportunity = `Improve ${worstGaps[0].skillName} to increase your role readiness score significantly.`;
    } else {
      biggestOpportunity = `Your profile demonstrates a developing ${targetRoleTitle} foundation. Strengthen core API integration to move toward job-ready proficiency.`;
    }
    strategicExplanation = `Your profile demonstrates a developing ${targetRoleTitle} foundation. Strengthen key gaps to move toward tier-1 shortlist eligibility (85%+).`;
  } else {
    // HIGH SCORE BEHAVIOR
    const missingFew = worstGaps.map(g => g.skillName);
    if (missingFew.length > 0) {
      biggestOpportunity = `Your ${targetRoleTitle} foundation is strong (${overallMatchScore}%). Polish ${missingFew.join(' and ')} to achieve 95%+ mastery.`;
      strategicExplanation = `Your ${targetRoleTitle} foundation is strong. Focus on system design, cloud deployment, CI/CD, performance optimization, and production-level architecture.`;
    } else {
      biggestOpportunity = `Outstanding proficiency! You meet or exceed all industry requirement benchmarks for ${targetRoleTitle}.`;
      strategicExplanation = `Your profile qualifies for top tier-1 software engineering and technical leadership roles. Focus on system architecture and open-source contributions.`;
    }
  }

  return {
    gaps,
    overallMatchScore,
    readinessStatus,
    biggestOpportunity,
    strategicExplanation,
    strongSkillsCount,
    developingSkillsCount,
    gapSkillsCount,
    criticalGapCount,
    sortedGaps
  };
}

/**
 * 8. ADAPTIVE CAREER ROADMAP GENERATOR
 * Generates sequential milestone phases dynamically adapted to student's actual assessment score.
 * If user scored high in a skill, skips beginner basics and introduces advanced milestones.
 */
export function generatePersonalizedRoadmap(
  career: CareerPath,
  studentSkills: SkillScore[],
  hasAssessed: boolean = true
): RoadmapPhase[] {
  const isHighScorer = (skillName: string) => {
    const s = findMatchingSkill(skillName, studentSkills);
    return s ? s.score >= 75 : false;
  };

  const getScore = (skillName: string) => {
    const s = findMatchingSkill(skillName, studentSkills);
    return s ? s.score : 0;
  };

  const jsScore = getScore('JavaScript');
  const reactScore = getScore('React.js');
  const sqlScore = getScore('SQL & Database Design');
  const nodeScore = getScore('Node.js & Express');
  const gitScore = getScore('Git & Version Control');

  // PHASE 1 — Foundations
  const isPhase1Done = hasAssessed && (jsScore >= 75 && gitScore >= 60);
  const phase1: RoadmapPhase = {
    phaseNumber: 1,
    phaseTitle: 'Phase 1: Engineering Foundations & Modern Syntax',
    phaseDescription: isPhase1Done
      ? '✓ Foundational JavaScript, HTML/CSS, and Version Control verified strong. Skipping basic syntax.'
      : 'Master fundamental programming structures, DOM manipulation, asynchronous ES6+ syntax, and Git version control.',
    status: isPhase1Done ? 'completed' : 'in-progress',
    milestones: [
      {
        id: 'm-1-1',
        title: isPhase1Done ? 'Advanced JavaScript & Async Concurrency' : 'JavaScript Core & ES6+ Fundamentals',
        description: isPhase1Done
          ? 'Event Loop, Web Workers, Microtasks vs Macrotasks, Memory Leaks, and WeakMap patterns.'
          : 'Closures, Prototypes, Array methods, Promises, and DOM manipulation.',
        skills: ['JavaScript'],
        status: isPhase1Done ? 'completed' : 'in-progress',
        level: isPhase1Done ? 'Advanced' : 'Foundational',
        topics: ['ES6 Syntax', 'Event Loop', 'Async/Await', 'Scope & Closures']
      },
      {
        id: 'm-1-2',
        title: 'Git Version Control & Branching Strategies',
        description: 'Interactive rebasing, merge conflict resolution, trunk-based development, and pull request workflows.',
        skills: ['Git & Version Control'],
        status: gitScore >= 65 ? 'completed' : 'in-progress',
        level: 'Foundational',
        topics: ['Git Rebase', 'Branching Models', 'Submodules', 'GitHub Actions']
      }
    ]
  };

  // PHASE 2 — Frontend Architecture
  const isPhase2Done = hasAssessed && (reactScore >= 75);
  const phase2: RoadmapPhase = {
    phaseNumber: 2,
    phaseTitle: 'Phase 2: Stateful Frontend & Component Architecture',
    phaseDescription: isPhase2Done
      ? '✓ React UI engineering verified proficient. Progressing to advanced state machines and Web Vitals.'
      : 'Master React hooks, component lifecycle, rendering optimization, custom hooks, and TypeScript integration.',
    status: isPhase2Done ? 'completed' : isPhase1Done ? 'in-progress' : 'upcoming',
    milestones: [
      {
        id: 'm-2-1',
        title: isPhase2Done ? 'Advanced React Architecture & Performance' : 'React 19 Hooks & UI Composition',
        description: isPhase2Done
          ? 'Server Components (RSC), Suspense streaming, custom state machines (Zustand), and memoization profiling.'
          : 'Functional components, useState, useEffect, context API, and synthetic event handling.',
        skills: ['React.js', 'TypeScript'],
        status: isPhase2Done ? 'completed' : isPhase1Done ? 'in-progress' : 'upcoming',
        level: isPhase2Done ? 'Advanced' : 'Intermediate',
        topics: ['Custom Hooks', 'State Management', 'Web Vitals (LCP/CLS)', 'TypeScript Generics']
      }
    ]
  };

  // PHASE 3 — Backend Systems & APIs
  const isPhase3Done = hasAssessed && (nodeScore >= 70);
  const phase3: RoadmapPhase = {
    phaseNumber: 3,
    phaseTitle: 'Phase 3: Server-side APIs & Microservices',
    phaseDescription: 'Architect high-throughput RESTful and GraphQL endpoints with Node.js, Express, and JWT authentication.',
    status: isPhase3Done ? 'completed' : isPhase2Done ? 'in-progress' : 'upcoming',
    milestones: [
      {
        id: 'm-3-1',
        title: 'RESTful Microservices & Authentication Gateways',
        description: 'Libuv thread pool, stateless JWT auth, middleware chaining, rate limiting, and input validation.',
        skills: ['Node.js & Express', 'REST & GraphQL APIs'],
        status: isPhase3Done ? 'completed' : isPhase2Done ? 'in-progress' : 'upcoming',
        level: 'Intermediate',
        topics: ['Express Middleware', 'JWT/OAuth', 'Rate Limiting', 'Error Handling']
      }
    ]
  };

  // PHASE 4 — Database Design & Query Tuning
  const isPhase4Done = hasAssessed && (sqlScore >= 70);
  const phase4: RoadmapPhase = {
    phaseNumber: 4,
    phaseTitle: 'Phase 4: Relational Databases & Performance Tuning',
    phaseDescription: 'Design normalized relational schemas, manage ACID transactions, and optimize complex B-tree indexes.',
    status: isPhase4Done ? 'completed' : isPhase3Done ? 'in-progress' : 'upcoming',
    milestones: [
      {
        id: 'm-4-1',
        title: 'SQL Schema Architecture & EXPLAIN Query Plans',
        description: 'Window functions, CTEs, B-Tree index tuning, connection pooling, and ORM N+1 resolution.',
        skills: ['SQL & Database Design'],
        status: isPhase4Done ? 'completed' : isPhase3Done ? 'in-progress' : 'upcoming',
        level: 'Intermediate',
        topics: ['Indexing Strategies', 'ACID Transactions', 'Connection Pooling', 'Query Profiling']
      }
    ]
  };

  // PHASE 5 — Full Stack & Cloud Deployment
  const phase5: RoadmapPhase = {
    phaseNumber: 5,
    phaseTitle: 'Phase 5: Full Stack Integration & Cloud CI/CD',
    phaseDescription: 'Containerize multi-tier applications with Docker, configure automated CI/CD pipelines, and deploy to AWS/Vercel.',
    status: (isPhase1Done && isPhase2Done && isPhase3Done && isPhase4Done) ? 'in-progress' : 'upcoming',
    milestones: [
      {
        id: 'm-5-1',
        title: 'Docker Containerization & Cloud Deployment',
        description: 'Multi-stage Docker builds, AWS S3/EC2 deployment, automated GitHub Actions CI/CD, and monitoring.',
        skills: ['Git & Version Control', 'System Architecture'],
        status: 'upcoming',
        level: 'Advanced',
        topics: ['Multi-stage Docker', 'GitHub Actions', 'AWS Cloud Infrastructure', 'Observability']
      }
    ]
  };

  // PHASE 6 — Real-World Capstone Project
  const phase6: RoadmapPhase = {
    phaseNumber: 6,
    phaseTitle: 'Phase 6: Production-Grade Engineering Capstone',
    phaseDescription: 'Construct a complete end-to-end enterprise platform with real-time WebSockets, background workers, and automated test coverage.',
    status: 'upcoming',
    milestones: [
      {
        id: 'm-6-1',
        title: 'Enterprise Distributed Web Platform',
        description: 'Build a production SaaS application implementing all verified skills: React frontend, Node microservices, PostgreSQL with caching, and full CI/CD deployment.',
        skills: career.requiredSkills.map(r => r.skillName),
        status: 'upcoming',
        level: 'Capstone',
        topics: ['End-to-End System', 'Distributed Caching', 'Integration Testing', 'Production Launch']
      }
    ]
  };

  return [phase1, phase2, phase3, phase4, phase5, phase6];
}

/**
 * 10. BRIDGE COURSES GENERATOR
 * Generates targeted remedial bridge courses adapted to the exact size of the user's skill gaps.
 */
export function generateBridgeCourses(gaps: SkillGapItem[]): BridgeCourse[] {
  return gaps.map(gap => {
    const isLargeGap = gap.studentScore < 50;
    const isModerateGap = gap.studentScore >= 50 && gap.studentScore < 75;

    let difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate';
    let title = `${gap.skillName} Mastery`;
    let duration = '8 Hours';
    let description = '';
    let topics: string[] = [];
    let practiceTasks: string[] = [];
    let miniProject = '';

    if (isLargeGap) {
      difficulty = 'Beginner';
      title = `${gap.skillName} Fundamentals → Core Proficiency`;
      duration = '12 Hours (Foundational)';
      description = `Bridge your foundational gap from ${gap.studentScore}% to ${gap.requiredScore}%. Start with core mental models, syntax rules, and hands-on exercises.`;
      topics = [
        'Core Syntax & Mental Models',
        'Fundamental Data Flows',
        'Standard Library Methods',
        'Debugging & Common Pitfalls'
      ];
      practiceTasks = [
        'Complete 10 hands-on code katas',
        'Build a basic interactive prototype',
        'Pass 5 unit tests verifying edge cases'
      ];
      miniProject = `Build a beginner-to-intermediate CRUD application demonstrating ${gap.skillName} basics.`;
    } else if (isModerateGap) {
      difficulty = 'Intermediate';
      title = `${gap.skillName}: Intermediate Patterns & Industry Standards`;
      duration = '6 Hours (Targeted)';
      description = `Elevate your proficiency from ${gap.studentScore}% to reach the ${gap.requiredScore}% industry hiring benchmark. Focus on enterprise design patterns.`;
      topics = [
        'Intermediate Architecture Patterns',
        'Performance Optimization',
        'State Management & Error Handlers',
        'Integration Testing & Mocking'
      ];
      practiceTasks = [
        'Refactor legacy modules to modern patterns',
        'Implement async error boundaries and fallbacks',
        'Profile and optimize memory usage'
      ];
      miniProject = `Build a production-ready module featuring scalable ${gap.skillName} workflows.`;
    } else {
      difficulty = 'Advanced';
      title = `${gap.skillName}: Advanced Architecture & Production Tuning`;
      duration = '4 Hours (Advanced)';
      description = `You currently score ${gap.studentScore}%. Master advanced optimizations to achieve 90%+ elite tier-1 level.`;
      topics = [
        'Under-the-hood Internal Mechanisms',
        'Concurrency & Memory Profiling',
        'High-Throughput Architectural Patterns',
        'Security Best Practices & Auditing'
      ];
      practiceTasks = [
        'Benchmark execution micro-optimizations',
        'Implement custom tooling / extensions',
        'Write complete automated integration suite'
      ];
      miniProject = `Design and benchmark a high-concurrency enterprise system using ${gap.skillName}.`;
    }

    return {
      id: `bridge-${gap.skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      skillName: gap.skillName,
      title,
      difficulty,
      estimatedDuration: duration,
      description,
      gapSize: Math.abs(gap.gapDelta),
      userScore: gap.studentScore,
      requiredScore: gap.requiredScore,
      learningObjectives: [
        `Understand core principles and common failure modes in ${gap.skillName}`,
        `Solve realistic industry interview scenarios and algorithmic problems`,
        `Achieve ${gap.requiredScore}%+ verified benchmark on proctored re-assessment`
      ],
      topics,
      practiceTasks,
      miniProject,
      status: gap.studentScore >= gap.requiredScore ? 'completed' : 'in-progress',
      completionScore: gap.studentScore
    };
  });
}

/**
 * Calculates Opportunity Job Match based on student's verified skills
 */
export function calculateOpportunityMatch(
  opportunity: Opportunity,
  studentSkills: SkillScore[],
  hasAssessed: boolean = true
): {
  matchPercentage: number;
  strongSkills: string[];
  developingSkills: string[];
  missingSkills: string[];
  isHighMatch: boolean;
} {
  if (!hasAssessed) {
    return {
      matchPercentage: 0,
      strongSkills: [],
      developingSkills: [],
      missingSkills: opportunity.requiredSkills.map(r => `${r.skillName} (Not Assessed)`),
      isHighMatch: false
    };
  }

  const strongSkills: string[] = [];
  const developingSkills: string[] = [];
  const missingSkills: string[] = [];

  let matchPoints = 0;
  const total = opportunity.requiredSkills.length || 1;

  opportunity.requiredSkills.forEach(req => {
    const studentSkill = findMatchingSkill(req.skillName, studentSkills);
    const score = studentSkill ? studentSkill.score : 0;

    if (score >= req.minScore) {
      strongSkills.push(`${req.skillName} (${score}%)`);
      matchPoints += 1.0;
    } else if (score >= req.minScore - 15) {
      developingSkills.push(`${req.skillName} (${score}% vs ${req.minScore}% req)`);
      matchPoints += 0.7;
    } else {
      missingSkills.push(`${req.skillName} (${score}% vs ${req.minScore}% req)`);
      matchPoints += 0.3;
    }
  });

  const rawMatch = Math.round((matchPoints / total) * 100);
  const matchPercentage = Math.min(100, Math.max(0, rawMatch));

  return {
    matchPercentage,
    strongSkills,
    developingSkills,
    missingSkills,
    isHighMatch: matchPercentage >= 80
  };
}
