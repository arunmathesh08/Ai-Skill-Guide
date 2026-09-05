const { Client } = require('pg');

const hosts = [
  { host: 'db.ysqggazrfrmpvxqzmyru.supabase.co', port: 5432, user: 'postgres' },
  { host: 'aws-0-ap-south-1.pooler.supabase.com', port: 5432, user: 'postgres.ysqggazrfrmpvxqzmyru' },
  { host: 'aws-0-ap-south-1.pooler.supabase.com', port: 6543, user: 'postgres.ysqggazrfrmpvxqzmyru' },
];

async function testAll() {
  for (const h of hosts) {
    console.log(`Testing ${h.host}:${h.port} (user: ${h.user})...`);
    const client = new Client({
      user: h.user,
      password: 'GautamKRishna@07092007',
      host: h.host,
      port: h.port,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    });

    try {
      await client.connect();
      console.log(`✅ SUCCESS on ${h.host}:${h.port}`);
      await client.end();
      return h;
    } catch (err) {
      console.log(`❌ Failed on ${h.host}:${h.port}: ${err.message}`);
    }
  }
}

testAll();
