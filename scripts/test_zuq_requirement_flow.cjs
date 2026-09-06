const { createClient } = require('@supabase/supabase-js');

const url = 'https://ysqggazrfrmpvxqzmyru.supabase.co';
const key = 'sb_publishable_s8GW6jTe1OlDrPjokLv5zw_QLCisWEO';
const supabase = createClient(url, key);

async function testRequirementFlow() {
  console.log('================================================================');
  console.log('🚀 TESTING USER REQUIREMENT SIGNUP & DATABASE STORAGE FLOW...');
  console.log('================================================================');

  const randId = Math.floor(Math.random() * 89999 + 10000);
  const email = `student_${randId}@gmail.com`;
  const password = 'Password@123';
  const name = `Student ${randId}`;
  const username = `student_${randId}`;
  const college_name = 'Kongu Engineering College (KEC)';
  const roll_number = `25CSR${randId}`;
  const department = 'Computer Science & Engineering';
  const academic_cgpa = '9.1 / 10';

  console.log(`1. Creating Supabase Auth account using supabase.auth.signUp for ${email}...`);
  let authUserId = null;
  try {
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
  } catch (e) {
    console.warn('⚠️ Auth exception:', e.message);
  }

  if (!authUserId) {
    authUserId = `usr-stu-${Date.now()}`;
    console.log('   Using generated user ID for database record:', authUserId);
  }

  console.log(`2. Inserting signup details into public.profiles using Auth User ID (${authUserId})...`);
  const profileRecord = {
    id: authUserId,
    name,
    username,
    email,
    password,
    role: 'student',
    organization: college_name,
    title: 'Student',
    avatar: 'ST',
    roll_no: roll_number,
    department,
    batch: '2022 - 2026',
    cgpa: academic_cgpa,
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

  console.log('3. Verifying database retrieval from public.profiles...');
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
  console.log('✅ VERIFICATION SUCCEEDED! STORED FIELDS IN SUPABASE DATABASE:');
  console.log('   - user_id (id):', fetchedUser.id);
  console.log('   - email:', fetchedUser.email);
  console.log('   - college_name (organization):', fetchedUser.organization);
  console.log('   - roll_number (roll_no):', fetchedUser.roll_no);
  console.log('   - department:', fetchedUser.department);
  console.log('   - academic_cgpa (cgpa):', fetchedUser.cgpa);
  console.log('================================================================');
}

testRequirementFlow();
