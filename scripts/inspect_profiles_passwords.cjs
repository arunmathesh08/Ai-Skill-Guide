const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ysqggazrfrmpvxqzmyru.supabase.co';
const supabaseKey = 'sb_publishable_s8GW6jTe1OlDrPjokLv5zw_QLCisWEO';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectProfiles() {
  const { data, error } = await supabase.from('profiles').select('id, name, username, email, password, role');
  if (error) {
    console.error('Error fetching profiles:', error);
    return;
  }
  console.log(`Total profiles in DB: ${data.length}`);
  data.forEach((p, idx) => {
    console.log(`${idx + 1}. Name: ${p.name} | Username: @${p.username} | Email: ${p.email} | Password: ${p.password || 'NULL'} | Role: ${p.role}`);
  });
}

inspectProfiles();
