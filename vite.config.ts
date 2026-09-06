import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import pg from 'pg';

const { Pool } = pg;

const dbPool = new Pool({
  user: 'postgres.zuqiowzprzbshjrywzkf',
  password: 'Arun@6844123',
  host: 'aws-0-ap-northeast-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
});

function databaseApiPlugin(): Plugin {
  return {
    name: 'database-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Only handle /api routes
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const parseBody = (): Promise<any> => {
          return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', chunk => (body += chunk));
            req.on('end', () => {
              try {
                resolve(body ? JSON.parse(body) : {});
              } catch (err) {
                resolve({});
              }
            });
            req.on('error', reject);
          });
        };

        const sendJson = (statusCode: number, data: any) => {
          res.statusCode = statusCode;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        // 1. POST /api/register
        if (req.url === '/api/register' && req.method === 'POST') {
          try {
            const body = await parseBody();
            const {
              name,
              username,
              email,
              password = 'password123',
              role = 'student',
              organization = 'Kongu Engineering College',
              title,
              rollNo,
              department,
              batch = '2022 - 2026',
              cgpa,
              location,
              specialization
            } = body;

            if (!name || !email) {
              return sendJson(400, { success: false, message: 'Name and email are required.' });
            }

            const cleanEmail = email.toLowerCase().trim();
            const cleanUsername = (username || cleanEmail.split('@')[0]).toLowerCase().trim().replace(/^@/, '');

            // Pre-check for duplicate username or email in students / profiles
            const dupCheck = await dbPool.query(`
              SELECT id, email, username FROM public.profiles 
              WHERE lower(email) = $1 OR lower(username) = $2
              LIMIT 1;
            `, [cleanEmail, cleanUsername]);

            if (dupCheck.rows.length > 0) {
              const existing = dupCheck.rows[0];
              if (existing.email && existing.email.toLowerCase() === cleanEmail) {
                return sendJson(409, { success: false, message: 'An account with this email address already exists. Please sign in.' });
              }
              return sendJson(409, { success: false, message: 'This username is already taken. Please choose a different username.' });
            }

            const userId = `usr-${role.slice(0, 3)}-${Date.now()}`;
            const initials = name
              .split(' ')
              .map((w: string) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            // Insert into public.students if student
            if (role === 'student') {
              try {
                await dbPool.query(`
                  INSERT INTO public.students (id, name, username, email)
                  VALUES ($1, $2, $3, $4)
                  ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    username = EXCLUDED.username,
                    email = EXCLUDED.email;
                `, [userId, name.trim(), cleanUsername, cleanEmail]);
                console.log(`[DB API] ✅ Inserted student record into public.students table for ${cleanEmail}`);
              } catch (stuErr) {
                console.warn('[DB API] Students table insert notice:', stuErr);
              }
            }

            // Insert into public.profiles
            const query = `
              INSERT INTO public.profiles (
                id, name, username, email, password, role, organization, 
                title, avatar, roll_no, department, batch, cgpa, 
                location, specialization, career_readiness, career_readiness_delta, target_career_id
              )
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
              ON CONFLICT (email) DO UPDATE SET
                name = EXCLUDED.name,
                username = EXCLUDED.username,
                password = EXCLUDED.password,
                organization = EXCLUDED.organization,
                roll_no = EXCLUDED.roll_no,
                department = EXCLUDED.department,
                cgpa = EXCLUDED.cgpa
              RETURNING *;
            `;

            const values = [
              userId,
              name.trim(),
              cleanUsername,
              cleanEmail,
              password,
              role,
              organization.trim(),
              title || (role === 'student' ? 'Student' : 'Professional'),
              initials || 'SB',
              rollNo || null,
              department || null,
              batch || null,
              cgpa || null,
              location || null,
              specialization || null,
              role === 'student' ? 75 : 90,
              5,
              'cp-fullstack'
            ];

            const result = await dbPool.query(query, values);
            const savedUser = result.rows[0];

            // If student, insert default skills
            if (role === 'student') {
              try {
                await dbPool.query(`
                  INSERT INTO public.skills (id, student_id, name, category, score, verified, last_assessed)
                  VALUES 
                    ($1, $2, 'JavaScript', 'Frontend', 78, true, 'Recently'),
                    ($3, $4, 'HTML5 & Modern CSS', 'Frontend', 85, true, 'Recently'),
                    ($5, $6, 'SQL & Database Design', 'Database', 70, false, 'Recently')
                  ON CONFLICT (id) DO NOTHING;
                `, [
                  `sk-js-${savedUser.id}`, savedUser.id,
                  `sk-html-${savedUser.id}`, savedUser.id,
                  `sk-sql-${savedUser.id}`, savedUser.id
                ]);
              } catch (e) {
                console.warn('[DB API] Skill seeding note:', e);
              }
            }

            console.log(`[DB API] ✅ Successfully registered user in Supabase: ${savedUser.name} (${savedUser.email})`);

            return sendJson(200, {
              success: true,
              user: {
                id: savedUser.id,
                name: savedUser.name,
                username: savedUser.username,
                email: savedUser.email,
                role: savedUser.role,
                organization: savedUser.organization,
                title: savedUser.title,
                avatar: savedUser.avatar,
                location: savedUser.location,
                specialization: savedUser.specialization,
                rollNo: savedUser.roll_no,
                department: savedUser.department,
                batch: savedUser.batch,
                cgpa: savedUser.cgpa
              },
              message: 'Account created and saved directly to Supabase PostgreSQL database!'
            });
          } catch (err: any) {
            console.error('[DB API] Register error:', err);
            return sendJson(500, { success: false, message: err.message || 'Database registration error' });
          }
        }

        // 2. POST /api/login
        if (req.url === '/api/login' && req.method === 'POST') {
          try {
            const body = await parseBody();
            const { identifier, password } = body;

            if (!identifier) {
              return sendJson(400, { success: false, message: 'Username or email is required.' });
            }

            const cleanIdent = identifier.trim().toLowerCase().replace(/^@/, '');
            const query = `
              SELECT * FROM public.profiles 
              WHERE lower(email) = $1 OR lower(username) = $1
              LIMIT 1;
            `;

            const result = await dbPool.query(query, [cleanIdent]);
            if (result.rows.length === 0) {
              return sendJson(404, { success: false, message: 'User not found with that username or email.' });
            }

            const user = result.rows[0];
            if (password && user.password && user.password !== password) {
              return sendJson(401, { success: false, message: 'Incorrect password.' });
            }

            console.log(`[DB API] ✅ Successfully logged in user: ${user.name} (${user.email})`);

            return sendJson(200, {
              success: true,
              user: {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                organization: user.organization,
                title: user.title,
                avatar: user.avatar,
                location: user.location,
                specialization: user.specialization,
                rollNo: user.roll_no,
                department: user.department,
                batch: user.batch,
                cgpa: user.cgpa
              },
              role: user.role,
              message: `Welcome back, ${user.name}!`
            });
          } catch (err: any) {
            console.error('[DB API] Login error:', err);
            return sendJson(500, { success: false, message: err.message || 'Database login error' });
          }
        }

        // 3. GET /api/db-status
        if (req.url === '/api/db-status' && req.method === 'GET') {
          try {
            const resProfiles = await dbPool.query('SELECT count(*) FROM public.profiles;');
            return sendJson(200, {
              connected: true,
              project: 'zuqiowzprzbshjrywzkf',
              profilesCount: Number(resProfiles.rows[0].count)
            });
          } catch (err: any) {
            return sendJson(500, { connected: false, error: err.message });
          }
        }

        return next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), databaseApiPlugin()],
});
