const { Client } = require('pg');

async function checkStudentsTable() {
  const client = new Client({
    user: 'postgres.zuqiowzprzbshjrywzkf',
    password: 'Arun@6844123',
    host: 'aws-0-ap-northeast-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  const res = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'students';");
  console.log('students table columns:', res.rows);

  const res2 = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles';");
  console.log('profiles table columns:', res2.rows);

  await client.end();
}

checkStudentsTable();
