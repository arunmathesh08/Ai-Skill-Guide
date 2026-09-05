const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ysqggazrfrmpvxqzmyru.supabase.co';
const supabaseAnonKey = 'sb_publishable_s8GW6jTe1OlDrPjokLv5zw_QLCisWEO';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyAllTables() {
  console.log('----------------------------------------------------');
  console.log('Testing live data from Supabase Cloud Project (ysqggazrfrmpvxqzmyru)...');
  console.log('----------------------------------------------------');

  const tables = ['profiles', 'skills', 'opportunities', 'applications', 'courses', 'partners'];
  let allGood = true;

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase.from(table).select('*', { count: 'exact' });
      if (error) {
        console.log(`❌ Table '${table}': ${error.message} (Code: ${error.code})`);
        allGood = false;
      } else {
        console.log(`✅ Table '${table}': LIVE! ${data.length} row(s) retrieved.`);
        if (data.length > 0) {
          console.log(`   Sample item id: ${data[0].id || 'N/A'}`);
        }
      }
    } catch (err) {
      console.log(`❌ Table '${table}' request failed: ${err.message}`);
      allGood = false;
    }
  }

  console.log('----------------------------------------------------');
  if (allGood) {
    console.log('🎉 ALL TABLES ARE FULLY CONNECTED AND VERIFIED IN SUPABASE!');
  } else {
    console.log('⚠️ Some tables may still need migration.');
  }
  console.log('----------------------------------------------------');
}

verifyAllTables();
