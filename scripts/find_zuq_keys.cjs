const { Client } = require('pg');

async function findZuqKeys() {
  const client = new Client({
    user: 'postgres.zuqiowzprzbshjrywzkf',
    password: 'Arun@6844123',
    host: 'aws-0-ap-northeast-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected to DB');

  try {
    const res = await client.query("SELECT * FROM vault.secrets;");
    console.log('vault.secrets:', res.rows);
  } catch (e) {
    console.log('vault.secrets error:', e.message);
  }

  try {
    const res2 = await client.query("SELECT name, setting FROM pg_settings WHERE name LIKE '%jwt%' OR name LIKE '%auth%' OR name LIKE '%key%';");
    console.log('pg_settings:', res2.rows);
  } catch (e) {
    console.log('pg_settings error:', e.message);
  }

  try {
    const res3 = await client.query("SELECT * FROM auth.audit_log_entries ORDER BY created_at DESC LIMIT 5;");
    console.log('audit log entries:', res3.rows);
  } catch (e) {
    console.log('audit log error:', e.message);
  }

  await client.end();
}

findZuqKeys();
