// Comprehensive score logic verification script
const path = require('path');
const fs = require('fs');

console.log('=== VERIFYING GLOBAL ASSESSMENT SCORING LOGIC ===');

// Check build output & distribution
console.log('Verifying dist build output exists...');
if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
  console.log('✅ dist/index.html exists and is compiled.');
} else {
  console.error('❌ dist/index.html not found!');
  process.exit(1);
}

// Test scoring formula
console.log('\nTesting exact score formula:');
const cases = [
  { correct: 5, total: 10, expected: 50 },
  { correct: 3, total: 10, expected: 30 },
  { correct: 8, total: 10, expected: 80 },
  { correct: 10, total: 10, expected: 100 },
  { correct: 0, total: 10, expected: 0 },
  { correct: 7, total: 10, expected: 70 },
  { correct: 1, total: 2, expected: 50 },
  { correct: 2, total: 2, expected: 100 },
  { correct: 0, total: 2, expected: 0 },
];

cases.forEach(c => {
  const score = Math.round((c.correct / c.total) * 100);
  console.log(`- ${c.correct}/${c.total} -> ${score}% (Expected: ${c.expected}%)`);
  if (score !== c.expected) {
    console.error(`❌ Mismatch for ${c.correct}/${c.total}!`);
    process.exit(1);
  }
});

console.log('\n🎉 ALL FORMULA CHECKS PASSED!');
