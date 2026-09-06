const { Client } = require('pg');

async function getAnonKey() {
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
    const res = await client.query("SELECT * FROM auth.users LIMIT 5;");
    console.log('auth.users sample:', res.rows.map(u => ({ id: u.id, email: u.email })));
  } catch (err) {
    console.error('Error fetching auth users:', err.message);
  }

  try {
    const res2 = await client.query("SELECT name, value FROM pg_settings WHERE name LIKE '%jwt%';");
    console.log('jwt settings:', res2.rows);
  } catch (err) {
    console.error('Error fetching jwt settings:', err.message);
  }

  await client.end();
}

getAnonKey();
