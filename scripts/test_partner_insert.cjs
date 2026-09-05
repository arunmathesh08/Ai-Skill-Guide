const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ysqggazrfrmpvxqzmyru.supabase.co';
const supabaseAnonKey = 'sb_publishable_s8GW6jTe1OlDrPjokLv5zw_QLCisWEO';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsertPartner() {
  console.log('Testing inserting Rolex partner into Supabase...');

  const { data, error } = await supabase.from('partners').upsert({
    id: `p-${Date.now()}`,
    name: 'Rolex Tech Innovations',
    initials: 'RT',
    color: 'bg-emerald-600',
    location: 'Geneva / Bengaluru (Hybrid)',
    active_postings: 2,
    students_hired: 12,
    mou_title: 'Precision Timekeeping & Embedded IoT Center of Excellence',
    mou_status: 'Active (2026-2029)',
    tier: 'Platinum Tier Partner',
  }).select();

  if (error) {
    console.error('❌ Insert failed:', error);
  } else {
    console.log('✅ INSERT SUCCEEDED! Inserted data in Supabase:', data);
  }

  const { data: allPartners, error: fetchErr } = await supabase.from('partners').select('*');
  if (fetchErr) {
    console.error('Fetch error:', fetchErr);
  } else {
    console.log(`Live partners in Supabase now (${allPartners.length}):`);
    allPartners.forEach(p => console.log(` - [${p.id}] ${p.name} (${p.tier})`));
  }
}

testInsertPartner();
