const { Client } = require('pg');

async function main() {
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
    const res = await client.query("SELECT current_setting('app.settings.jwt_secret', true) as secret;");
    console.log('JWT Secret query:', res.rows);
  } catch (err) {
    console.error('Error fetching secret:', err);
  }

  await client.end();
}

main();
