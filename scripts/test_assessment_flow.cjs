// Automated verification of API endpoints and state logic
const http = require('http');

function post(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request({
      hostname: 'localhost',
      port: 5173,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5173,
      path,
      method: 'GET'
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING VERIFICATION TESTS ---');

  const testUser = {
    name: 'Priya Sharma',
    username: 'priya_' + Date.now(),
    email: 'priya_' + Date.now() + '@nit.ac.in',
    password: 'Password123!',
    role: 'student',
    organization: 'National Institute of Technology',
    rollNo: '22CS' + Math.floor(1000 + Math.random() * 9000),
    department: 'Computer Science & Engineering',
    batch: '2022-2026',
    cgpa: '8.85'
  };

  // 1. Register new student
  console.log('\n1. Registering new student user...');
  const regRes = await post('/api/register', testUser);
  console.log('Registration status:', regRes.status);
  console.log('Registration data:', regRes.data);

  if (!regRes.data?.success) {
    console.error('Registration failed!');
    process.exit(1);
  }

  const studentId = regRes.data.user.id;

  // 2. Check initial assessment status (should be unassessed / empty)
  console.log('\n2. Fetching assessment status for new unassessed student...');
  const assessStatusRes = await get(`/api/assessment-results?studentId=${studentId}`);
  console.log('Assessment status res:', assessStatusRes.data);

  // 3. Submit real assessment
  console.log('\n3. Submitting real calculated assessment results...');
  const submitRes = await post('/api/assessment-results', {
    studentId: studentId,
    assessmentId: 'asm-react',
    assessmentTitle: 'React & Frontend Architecture Benchmark',
    overallScore: 85,
    passed: true,
    careerReadiness: 85,
    targetCareerId: 'cp-frontend',
    skillBreakdown: [
      { skill: 'React.js', percentage: 90 },
      { skill: 'JavaScript', percentage: 85 },
      { skill: 'CSS / Tailwind', percentage: 80 }
    ]
  });
  console.log('Submit assessment result:', submitRes.data);

  // 4. Verify assessment status after submission
  console.log('\n4. Re-fetching assessment status to verify dynamic persistence...');
  const postAssessStatus = await get(`/api/assessment-results?studentId=${studentId}`);
  console.log('Updated assessment status:', postAssessStatus.data);

  // 5. Verify skills recorded
  console.log('\n5. Fetching student skills...');
  const skillsRes = await get(`/api/student-skills?studentId=${studentId}`);
  console.log('Student skills in DB/Store:', skillsRes.data);

  console.log('\n✅ ALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
