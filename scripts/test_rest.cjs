const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ysqggazrfrmpvxqzmyru.supabase.co';
const supabaseKey = 'sb_publishable_s8GW6jTe1OlDrPjokLv5zw_QLCisWEO';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRest() {
  console.log('Testing Supabase REST API connection...');
  try {
    const { data, error } = await supabase.from('opportunities').select('*').limit(5);
    if (error) {
      console.log('REST response:', error.message, error.code, error.details);
    } else {
      console.log('✅ REST connected successfully! Row count:', data ? data.length : 0);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testRest();
