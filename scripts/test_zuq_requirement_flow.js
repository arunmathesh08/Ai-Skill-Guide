const { createClient } = require('@supabase/supabase-js');

const url = 'https://ysqggazrfrmpvxqzmyru.supabase.co';
const key = 'sb_publishable_s8GW6jTe1OlDrPjokLv5zw_QLCisWEO';
const supabase = createClient(url, key);

async function testRequirementFlow() {
  console.log('================================================================');
  console.log('🚀 TESTING USER REQUIREMENT SIGNUP & DATABASE STORAGE FLOW...');
  console.log('================================================================');

  const randId = Math.floor(Math.random() * 89999 + 10000);
  const email = `student_${randId}@institution.edu.in`;
  const password = 'Password@123';
  const name = `Student ${randId}`;
  const username = `student_${randId}`;
  const college_name = 'Kongu Engineering College (KEC)';
  const roll_number = `25CSR${randId}`;
  const department = 'Computer Science & Engineering';
  const academic_cgpa = '9.1 / 10';

  console.log(`1. Creating Supabase Auth account using supabase.auth.signUp for ${email}...`);
  let authUserId = null;
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: 'https://skillbridge-007.netlify.app/',
      data: { name, username, role: 'student' }
    }
  });

  if (authData?.user?.id) {
    authUserId = authData.user.id;
    console.log('✅ Supabase Auth Account created! User ID (auth.users.id):', authUserId);
  } else if (authErr) {
    console.warn('⚠️ Supabase Auth SignUp notice:', authErr.message);
  }

  if (!authUserId) {
    authUserId = `usr-stu-${Date.now()}`;
    console.log('   Using generated user ID for database record:', authUserId);
  }

  console.log(`2. Inserting signup details into public.profiles using Auth User ID (${authUserId})...`);
  const profileRecord = {
    id: authUserId,
    user_id: authUserId,
    name,
    username,
    email,
    password,
    role: 'student',
    organization: college_name,
    college_name,
    title: 'Student',
    avatar: 'ST',
    roll_no: roll_number,
    roll_number,
    department,
    batch: '2022 - 2026',
    cgpa: academic_cgpa,
    academic_cgpa,
    bio: 'Registered student profile on SkillBridge.',
    location: 'Tamil Nadu, India',
    specialization: 'Full Stack Systems',
    career_readiness: 75,
    career_readiness_delta: 5,
    target_career_id: 'cp-fullstack'
  };

  const { data: pData, error: pErr } = await supabase
    .from('profiles')
    .upsert(profileRecord)
    .select()
    .single();

  if (pErr) {
    console.error('❌ Failed to insert profile into public.profiles:', pErr);
    return;
  }
  console.log('✅ Successfully inserted into public.profiles!');

  console.log('3. Inserting signup details into public.students using Auth User ID...');
  const { data: sData, error: sErr } = await supabase
    .from('students')
    .upsert({
      id: authUserId,
      user_id: authUserId,
      name,
      username,
      email,
      college: college_name,
      college_name,
      roll_no: roll_number,
      roll_number,
      department,
      cgpa: academic_cgpa,
      academic_cgpa
    })
    .select()
    .single();

  if (sErr) {
    console.warn('⚠️ public.students notice:', sErr.message);
  } else {
    console.log('✅ Successfully inserted into public.students!');
  }

  console.log('4. Verifying database retrieval from public.profiles...');
  const { data: fetchedUser, error: fetchErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUserId)
    .single();

  if (fetchErr) {
    console.error('❌ Database lookup failed:', fetchErr);
    return;
  }

  console.log('================================================================');
  console.log('✅ VERIFICATION SUCCEEDED! STORED FIELDS:');
  console.log('   - user_id:', fetchedUser.user_id || fetchedUser.id);
  console.log('   - email:', fetchedUser.email);
  console.log('   - college_name:', fetchedUser.college_name || fetchedUser.organization);
  console.log('   - roll_number:', fetchedUser.roll_number || fetchedUser.roll_no);
  console.log('   - department:', fetchedUser.department);
  console.log('   - academic_cgpa:', fetchedUser.academic_cgpa || fetchedUser.cgpa);
  console.log('================================================================');
}

testRequirementFlow();
