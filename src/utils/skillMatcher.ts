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

export function calculateCareerReadiness(career: CareerPath, studentSkills: SkillScore[]): number {
  if (!career.requiredSkills || career.requiredSkills.length === 0) return 70;
  
  let totalScore = 0;
  let totalWeight = 0;

  career.requiredSkills.forEach(req => {
    const weight = req.weight || 1.0;
    const studentSkill = studentSkills.find(s => s.name.toLowerCase() === req.skillName.toLowerCase());
    const studentScore = studentSkill ? studentSkill.score : 30; // default baseline if not assessed
    
    // Ratio capped at 1.05
    const ratio = Math.min(1.05, studentScore / req.requiredScore);
    totalScore += ratio * 100 * weight;
    totalWeight += weight;
  });

  return Math.round(totalScore / totalWeight);
}

export function calculateSkillGaps(requiredSkills: RequiredSkill[], studentSkills: SkillScore[]): {
  gaps: SkillGapItem[];
  overallMatchScore: number;
  biggestOpportunity: string;
  strongSkillsCount: number;
  gapSkillsCount: number;
} {
  const gaps: SkillGapItem[] = [];
  let totalScore = 0;
  let gapItems: SkillGapItem[] = [];

  requiredSkills.forEach(req => {
    const studentSkill = studentSkills.find(s => s.name.toLowerCase() === req.skillName.toLowerCase());
    const studentScore = studentSkill ? studentSkill.score : 30;
    const gapDelta = studentScore - req.requiredScore;

    let status: 'strong' | 'moderate' | 'gap' = 'moderate';
    if (studentScore >= req.requiredScore) {
      status = 'strong';
    } else if (req.requiredScore - studentScore > 15) {
      status = 'gap';
    } else {
      status = 'moderate';
    }

    const item: SkillGapItem = {
      skillName: req.skillName,
      requiredScore: req.requiredScore,
      studentScore,
      status,
      gapDelta
    };
    
    gaps.push(item);
    if (status === 'gap' || status === 'moderate') {
      gapItems.push(item);
    }
    totalScore += Math.min(100, (studentScore / req.requiredScore) * 100);
  });

  const overallMatchScore = Math.round(totalScore / (requiredSkills.length || 1));
  
  // Sort gaps by worst delta
  gapItems.sort((a, b) => a.gapDelta - b.gapDelta);
  const worstGaps = gapItems.slice(0, 2).map(g => g.skillName);
  
  let biggestOpportunity = 'You have a solid foundation across core areas. Focus on deep-dive project development.';
  if (worstGaps.length === 1) {
    biggestOpportunity = `Improve ${worstGaps[0]} to increase your role readiness score significantly.`;
  } else if (worstGaps.length >= 2) {
    biggestOpportunity = `Improve ${worstGaps[0]} and ${worstGaps[1]} to increase your career readiness for target roles.`;
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
    const studentSkill = studentSkills.find(s => s.name.toLowerCase() === req.skillName.toLowerCase());
    const score = studentSkill ? studentSkill.score : 30;

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
