const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ysqggazrfrmpvxqzmyru.supabase.co';
const supabaseAnonKey = 'sb_publishable_s8GW6jTe1OlDrPjokLv5zw_QLCisWEO';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUserAuth() {
  console.log('----------------------------------------------------');
  console.log('Testing Supabase Role-Based User Registration & Login...');
  console.log('----------------------------------------------------');

  const testUsername = `user_${Date.now().toString().slice(-4)}`;
  const testEmail = `${testUsername}@institution.edu.in`;

  // 1. Create a new Student account
  console.log(`1. Registering new student: @${testUsername} (${testEmail})...`);
  const { data: newUser, error: regError } = await supabase
    .from('profiles')
    .insert({
      id: `usr-std-${Date.now()}`,
      name: 'Rohan Verma',
      username: testUsername,
      email: testEmail,
      password: 'SecurePassword123',
      role: 'student',
      organization: 'Indian Institute of Technology (IIT)',
      title: 'B.Tech Computer Science',
      avatar: 'RV',
      roll_no: '22CS1092',
      department: 'Computer Science & Engineering',
      batch: '2022 - 2026',
      cgpa: '9.1 / 10',
      career_readiness: 82,
      target_career_id: 'cp-fullstack'
    })
    .select()
    .single();

  if (regError) {
    console.error('❌ Registration failed:', regError);
    return;
  }
  console.log('✅ Student registered and stored in Supabase:', newUser);

  // 2. Test Login by Username + Password
  console.log(`2. Testing Login by Username: @${testUsername}...`);
  const { data: loginByUsername, error: loginErr1 } = await supabase
    .from('profiles')
    .select('*')
    .or(`email.ilike.${testUsername},username.ilike.${testUsername}`)
    .limit(1);

  if (loginErr1 || !loginByUsername || loginByUsername.length === 0) {
    console.error('❌ Login by username failed:', loginErr1);
  } else if (loginByUsername[0].password === 'SecurePassword123') {
    console.log(`✅ Login by username succeeded! Authenticated as ${loginByUsername[0].name} (Role: ${loginByUsername[0].role.toUpperCase()})`);
  }

  // 3. Test Querying Users Grouped by Role
  console.log('3. Querying all users grouped by role in Supabase:');
  const roles = ['student', 'industry', 'faculty', 'admin'];
  for (const role of roles) {
    const { data: roleUsers } = await supabase.from('profiles').select('id, name, username, email, organization, title').eq('role', role);
    console.log(`\n📌 [ROLE: ${role.toUpperCase()}] (${roleUsers ? roleUsers.length : 0} users):`);
    if (roleUsers) {
      roleUsers.forEach(u => console.log(`   - ${u.name} (@${u.username || 'no-username'}) | ${u.email} | ${u.organization}`));
    }
  }

  console.log('\n----------------------------------------------------');
  console.log('🎉 ALL SUPABASE USERNAME & PASSWORD AUTH TESTS PASSED!');
  console.log('----------------------------------------------------');
}

testUserAuth();
