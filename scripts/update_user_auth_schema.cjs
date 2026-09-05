const { Client } = require('pg');

async function updateAuthSchema() {
  console.log('Connecting to Supabase PostgreSQL to update profiles schema for username & password auth...');

  const client = new Client({
    user: 'postgres.zuqiowzprzbshjrywzkf',
    password: 'Arun@6844123',
    host: 'aws-0-ap-northeast-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    await client.connect();
    console.log('Connected to Supabase!');

    await client.query(`
      ALTER TABLE public.profiles
        ADD COLUMN IF NOT EXISTS username TEXT,
        ADD COLUMN IF NOT EXISTS password TEXT,
        ADD COLUMN IF NOT EXISTS location TEXT,
        ADD COLUMN IF NOT EXISTS specialization TEXT;

      -- Update existing seed users with usernames and default password
      UPDATE public.profiles SET username = 'aarav.sharma', password = 'password123' WHERE id = 'usr-std-01';
      UPDATE public.profiles SET username = 'priya.sen', password = 'password123' WHERE id = 'usr-ind-01';
      UPDATE public.profiles SET username = 'ramesh.kumar', password = 'password123' WHERE id = 'usr-fac-01';
      UPDATE public.profiles SET username = 'ananya.iyer', password = 'password123' WHERE id = 'usr-adm-01';
    `);

    console.log('✅ Schema updated with username, password, location, and specialization columns!');

    const res = await client.query('SELECT id, name, username, email, role, password FROM public.profiles;');
    console.log('Current users in Supabase profiles:');
    res.rows.forEach(u => console.log(` - [${u.role.toUpperCase()}] ${u.name} (username: @${u.username}, email: ${u.email})`));

  } catch (err) {
    console.error('Error updating schema:', err);
  } finally {
    await client.end();
  }
}

updateAuthSchema();
