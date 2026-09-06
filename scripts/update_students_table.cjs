const { Client } = require('pg');

async function updateStudentsSchema() {
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

  await client.query(`
    ALTER TABLE public.students
      ADD COLUMN IF NOT EXISTS college TEXT,
      ADD COLUMN IF NOT EXISTS roll_no TEXT,
      ADD COLUMN IF NOT EXISTS department TEXT,
      ADD COLUMN IF NOT EXISTS cgpa TEXT;
  `);

  console.log('✅ Added college, roll_no, department, cgpa columns to public.students table!');
  await client.end();
}

updateStudentsSchema();
