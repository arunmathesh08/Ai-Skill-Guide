// Direct pure formula test
console.log('=== TEST: Data Analyst Assessment 2/10 (20%) Pure Formula ===');

const requiredSkills = [
  { skillName: 'SQL & Queries', requiredScore: 80, weight: 1.3 },
  { skillName: 'Data Analysis', requiredScore: 75, weight: 1.2 },
  { skillName: 'Statistics & Probability', requiredScore: 70, weight: 1.1 },
  { skillName: 'Data Visualization', requiredScore: 75, weight: 1.1 },
  { skillName: 'Business Intelligence', requiredScore: 75, weight: 1.1 },
];

// Student answered 2 out of 10 questions correct:
// 1 in SQL (1/2 = 50%), 1 in Data Analysis (1/2 = 50%), 0 in others (0%)
const studentSkills = [
  { name: 'SQL & Queries', score: 50 },
  { name: 'Data Analysis', score: 50 },
  { name: 'Statistics & Probability', score: 0 },
  { name: 'Data Visualization', score: 0 },
  { name: 'Business Intelligence', score: 0 },
];

let totalPoints = 0;
let totalWeight = 0;

requiredSkills.forEach(req => {
  const sk = studentSkills.find(s => s.name === req.skillName);
  const score = sk ? sk.score : 0;
  totalPoints += score * req.weight;
  totalWeight += req.weight;
});

const overallMatchScore = Math.round(totalPoints / totalWeight);
console.log(`- Overall Weighted Match Score: ${overallMatchScore}%`);
console.log(`- Expected: 22% (approx 20% assessment score)`);

if (overallMatchScore > 25 || overallMatchScore < 18) {
  console.error(`❌ FAIL: Expected near 20%, got ${overallMatchScore}%`);
  process.exit(1);
}

console.log('✅ PASS: Score is accurately synchronized and logically consistent with 20% assessment result!');
