const { Client } = require('pg');

async function checkRLS() {
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

  const res = await client.query(`
    SELECT tablename, policyname, roles, cmd, qual, with_check
    FROM pg_policies
    WHERE schemaname = 'public';
  `);

  console.log('Public table RLS policies:', res.rows);

  // Ensure permissive RLS policies on profiles & students
  await client.query(`
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Public Profiles All" ON public.profiles;
    DROP POLICY IF EXISTS "Allow All Profiles" ON public.profiles;
    CREATE POLICY "Allow All Profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public Students All" ON public.students;
    DROP POLICY IF EXISTS "Allow All Students" ON public.students;
    CREATE POLICY "Allow All Students" ON public.students FOR ALL USING (true) WITH CHECK (true);

    GRANT ALL ON public.profiles TO anon, authenticated, service_role;
    GRANT ALL ON public.students TO anon, authenticated, service_role;
  `);

  console.log('✅ RLS policies and grants updated for profiles & students!');
  await client.end();
}

checkRLS();
