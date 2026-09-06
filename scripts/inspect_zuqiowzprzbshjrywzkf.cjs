const { Client } = require('pg');

async function inspectZuq() {
  const client = new Client({
    user: 'postgres.zuqiowzprzbshjrywzkf',
    password: 'Arun@6844123',
    host: 'aws-0-ap-northeast-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected to zuqiowzprzbshjrywzkf PostgreSQL database!');

  // Check columns of public.students
  const resStudents = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'students'
    ORDER BY ordinal_position;
  `);
  console.log('public.students columns:', resStudents.rows);

  // Check columns of public.profiles
  const resProfiles = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles'
    ORDER BY ordinal_position;
  `);
  console.log('public.profiles columns:', resProfiles.rows);

  await client.end();
}

inspectZuq();
