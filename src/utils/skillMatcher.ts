import { SkillScore, RequiredSkill, Opportunity, CareerPath, SkillGapItem, ProficiencyTier } from '../types';

export function getProficiencyTier(score: number): {
  tier: ProficiencyTier;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  barColor: string;
} {
  if (score >= 80) {
    return {
      tier: 'advanced',
      label: 'Advanced',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeText: 'text-emerald-700',
      badgeBorder: 'border-emerald-300',
      barColor: 'bg-emerald-500'
    };
  }
  if (score >= 60) {
    return {
      tier: 'proficient',
      label: 'Proficient',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      badgeText: 'text-blue-700',
      badgeBorder: 'border-blue-300',
      barColor: 'bg-blue-600'
    };
  }
  if (score >= 40) {
    return {
      tier: 'developing',
      label: 'Developing',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeText: 'text-amber-700',
      badgeBorder: 'border-amber-300',
      barColor: 'bg-amber-500'
    };
  }
  return {
    tier: 'beginner',
    label: 'Beginner',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-300',
    barColor: 'bg-rose-500'
  };
}

export function findMatchingSkill(skillName: string, studentSkills: SkillScore[]): SkillScore | undefined {
  if (!studentSkills || studentSkills.length === 0) return undefined;
  const normTarget = skillName.toLowerCase().trim();
  
  // 1. Direct exact match
  let match = studentSkills.find(s => s.name.toLowerCase().trim() === normTarget);
  if (match) return match;

  // 2. Key phrase token matching (e.g. "SQL & Queries" vs "SQL & Database Design" vs "SQL")
  const tokens = normTarget.split(/[\s&,/]+/).filter(t => t.length >= 3);
  match = studentSkills.find(s => {
    const normS = s.name.toLowerCase().trim();
    if (normS.includes(normTarget) || normTarget.includes(normS)) return true;
    return tokens.some(t => normS.includes(t));
  });

  return match;
}

export function calculateCareerReadiness(career: CareerPath, studentSkills: SkillScore[]): number {
  if (!career.requiredSkills || career.requiredSkills.length === 0) return 70;
  
  let totalScore = 0;
  let totalWeight = 0;

  career.requiredSkills.forEach(req => {
    const weight = req.weight || 1.0;
    const studentSkill = findMatchingSkill(req.skillName, studentSkills);
    const studentScore = studentSkill ? studentSkill.score : 0;
    
    const ratio = Math.min(1.0, studentScore / (req.requiredScore || 1));
    totalScore += ratio * 100 * weight;
    totalWeight += weight;
  });

  return Math.round(totalScore / (totalWeight || 1));
}

export function calculateSkillGaps(requiredSkills: RequiredSkill[], studentSkills: SkillScore[]): {
  gaps: SkillGapItem[];
  overallMatchScore: number;
  biggestOpportunity: string;
  strongSkillsCount: number;
  gapSkillsCount: number;
} {
  const gaps: SkillGapItem[] = [];
  let totalReadinessPoints = 0;

  requiredSkills.forEach(req => {
    const studentSkill = findMatchingSkill(req.skillName, studentSkills);
    const studentScore = studentSkill ? studentSkill.score : 0;
    const isStrong = studentScore >= req.requiredScore;
    const gapDelta = studentScore - req.requiredScore;

    const item: SkillGapItem = {
      skillName: req.skillName,
      requiredScore: req.requiredScore,
      studentScore,
      status: isStrong ? 'strong' : 'gap',
      gapDelta
    };

    gaps.push(item);
    
    const skillReadiness = Math.min(100, Math.round((studentScore / (req.requiredScore || 1)) * 100));
    totalReadinessPoints += skillReadiness;
  });

  const overallMatchScore = requiredSkills.length > 0
    ? Math.round(totalReadinessPoints / requiredSkills.length)
    : 0;

  // Find worst gaps (where studentScore < requiredScore)
  const gapList = gaps.filter(g => g.status === 'gap').sort((a, b) => a.gapDelta - b.gapDelta);

  let biggestOpportunity = 'You have met or exceeded all required skill benchmarks for this target role!';
  if (gapList.length === 1) {
    biggestOpportunity = `Improve ${gapList[0].skillName} to increase your role readiness score significantly.`;
  } else if (gapList.length >= 2) {
    biggestOpportunity = `Improve ${gapList[0].skillName} and ${gapList[1].skillName} to increase your role readiness score significantly.`;
  }

  const strongSkillsCount = gaps.filter(g => g.status === 'strong').length;
  const gapSkillsCount = gaps.filter(g => g.status === 'gap').length;

  return {
    gaps,
    overallMatchScore,
    biggestOpportunity,
    strongSkillsCount,
    gapSkillsCount
  };
}

export function calculateOpportunityMatch(
  opportunity: Opportunity,
  studentSkills: SkillScore[]
): {
  matchPercentage: number;
  strongSkills: string[];
  developingSkills: string[];
  missingSkills: string[];
  isHighMatch: boolean;
} {
  const strongSkills: string[] = [];
  const developingSkills: string[] = [];
  const missingSkills: string[] = [];

  let matchPoints = 0;
  const total = opportunity.requiredSkills.length || 1;

  opportunity.requiredSkills.forEach(req => {
    const studentSkill = findMatchingSkill(req.skillName, studentSkills);
    const score = studentSkill ? studentSkill.score : 0;

    if (score >= req.minScore) {
      strongSkills.push(req.skillName);
      matchPoints += 1.0;
    } else if (score >= req.minScore - 15) {
      developingSkills.push(req.skillName);
      matchPoints += 0.7;
    } else {
      missingSkills.push(req.skillName);
      matchPoints += 0.4;
    }
  });

  const matchPercentage = Math.round((matchPoints / total) * 100);

  return {
    matchPercentage: Math.min(98, Math.max(40, matchPercentage)),
    strongSkills,
    developingSkills,
    missingSkills,
    isHighMatch: matchPercentage >= 80
  };
}
