const { Client } = require('pg');

async function updateZuqSchema() {
  const client = new Client({
    user: 'postgres.zuqiowzprzbshjrywzkf',
    password: 'Arun@6844123',
    host: 'aws-0-ap-northeast-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected to zuqiowzprzbshjrywzkf database');

  await client.query(`
    -- 1. Ensure students table has all column aliases
    ALTER TABLE public.students
      ADD COLUMN IF NOT EXISTS user_id TEXT,
      ADD COLUMN IF NOT EXISTS college TEXT,
      ADD COLUMN IF NOT EXISTS college_name TEXT,
      ADD COLUMN IF NOT EXISTS roll_no TEXT,
      ADD COLUMN IF NOT EXISTS roll_number TEXT,
      ADD COLUMN IF NOT EXISTS department TEXT,
      ADD COLUMN IF NOT EXISTS cgpa TEXT,
      ADD COLUMN IF NOT EXISTS academic_cgpa TEXT;

    -- 2. Ensure profiles table has all column aliases
    ALTER TABLE public.profiles
      ADD COLUMN IF NOT EXISTS user_id TEXT,
      ADD COLUMN IF NOT EXISTS college_name TEXT,
      ADD COLUMN IF NOT EXISTS roll_number TEXT,
      ADD COLUMN IF NOT EXISTS academic_cgpa TEXT;

    -- 3. Update RLS policies to be completely open for INSERT/SELECT/UPDATE for authenticated and anon users
    ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Allow All Students" ON public.students;
    DROP POLICY IF EXISTS "Public Students All" ON public.students;
    CREATE POLICY "Allow All Students" ON public.students FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow All Profiles" ON public.profiles;
    DROP POLICY IF EXISTS "Public Profiles All" ON public.profiles;
    CREATE POLICY "Allow All Profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

    GRANT ALL ON public.students TO anon, authenticated, service_role;
    GRANT ALL ON public.profiles TO anon, authenticated, service_role;
    GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
  `);

  console.log('✅ Updated database schema & RLS policies in zuqiowzprzbshjrywzkf successfully!');
  await client.end();
}

updateZuqSchema();
