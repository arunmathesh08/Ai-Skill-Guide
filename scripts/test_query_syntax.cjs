const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ysqggazrfrmpvxqzmyru.supabase.co';
const supabaseKey = 'sb_publishable_s8GW6jTe1OlDrPjokLv5zw_QLCisWEO';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const cleanIdent = 'student_9923';
  
  // Test query with double quotes
  const q1 = await supabase
    .from('profiles')
    .select('*')
    .or(`email.ilike."${cleanIdent}",username.ilike."${cleanIdent}"`)
    .limit(1);

  console.log('Q1 (with double quotes) - error:', q1.error, 'data length:', q1.data?.length);

  // Test query without double quotes
  const q2 = await supabase
    .from('profiles')
    .select('*')
    .or(`email.ilike.${cleanIdent},username.ilike.${cleanIdent}`)
    .limit(1);

  console.log('Q2 (without quotes) - error:', q2.error, 'data count:', q2.data?.length);

  // Test query with email address with double quotes
  const cleanEmail = 'student_9923@gmail.com';
  const q3 = await supabase
    .from('profiles')
    .select('*')
    .or(`email.ilike."${cleanEmail}",username.ilike."${cleanEmail}"`)
    .limit(1);

  console.log('Q3 (email with double quotes) - error:', q3.error, 'data count:', q3.data?.length);

  // Test query with email address without double quotes
  const q4 = await supabase
    .from('profiles')
    .select('*')
    .or(`email.ilike.${cleanEmail},username.ilike.${cleanEmail}`)
    .limit(1);

  console.log('Q4 (email without quotes) - error:', q4.error, 'data count:', q4.data?.length);
}

run();
