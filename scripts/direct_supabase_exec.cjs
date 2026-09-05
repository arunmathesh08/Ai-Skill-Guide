const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Connecting with pg client to aws-0-ap-northeast-1.pooler.supabase.com:6543...');

  const client = new Client({
    user: 'postgres.zuqiowzprzbshjrywzkf',
    password: 'Arun@6844123',
    host: 'aws-0-ap-northeast-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000
  });

  try {
    await client.connect();
    console.log('🎉 CONNECTED TO SUPABASE POSTGRESQL DIRECTLY!');

    const schemaPath = path.join(__dirname, '..', 'supabase_schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing database schema and seed data...');
    await client.query(sql);
    console.log('✅ ALL TABLES CREATED AND SEEDED SUCCESSFULLY IN SUPABASE!');

    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('----------------------------------------------------');
    console.log('Public tables in Supabase:');
    res.rows.forEach(r => console.log(` - ${r.table_name}`));
    console.log('----------------------------------------------------');

    const counts = await client.query(`
      SELECT 
        (SELECT count(*) FROM public.profiles) as profiles_count,
        (SELECT count(*) FROM public.skills) as skills_count,
        (SELECT count(*) FROM public.opportunities) as opps_count,
        (SELECT count(*) FROM public.applications) as apps_count,
        (SELECT count(*) FROM public.courses) as courses_count,
        (SELECT count(*) FROM public.partners) as partners_count;
    `);

    console.log('Live Data Counts in Supabase:');
    console.log(counts.rows[0]);
    console.log('----------------------------------------------------');

  } catch (err) {
    console.error('❌ Connection error:', err);
  } finally {
    await client.end();
  }
}

main();
