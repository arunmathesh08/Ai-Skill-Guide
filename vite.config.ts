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

// In-memory fallback store when PostgreSQL is unreachable
const memoryStore: Map<string, any> = new Map();
let useMemoryFallback = false;
let dbCheckDone = false;

async function checkDbAvailability(): Promise<boolean> {
  if (dbCheckDone) return !useMemoryFallback;
  try {
    const client = await dbPool.connect();
    await client.query('SELECT 1');
    client.release();
    dbCheckDone = true;
    useMemoryFallback = false;
    console.log('[DB API] ✅ PostgreSQL database is reachable');
    return true;
  } catch (err: any) {
    dbCheckDone = true;
    useMemoryFallback = true;
    console.warn(`[DB API] ⚠️ PostgreSQL unreachable: ${err.message}`);
    console.log('[DB API] 📦 Using in-memory fallback store for authentication');
    return false;
  }
}

function databaseApiPlugin(): Plugin {
  return {
    name: 'database-api-plugin',
    configureServer(server) {
      // Check DB availability on server start
      checkDbAvailability();

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

        // Ensure DB check is done
        if (!dbCheckDone) await checkDbAvailability();

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

            const userId = `usr-${role.slice(0, 3)}-${Date.now()}`;
            const initials = name
              .split(' ')
              .map((w: string) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            if (useMemoryFallback) {
              // --- IN-MEMORY FALLBACK ---

              // Check for duplicate email or username
              for (const [, profile] of memoryStore) {
                if (profile.email?.toLowerCase() === cleanEmail) {
                  return sendJson(409, { success: false, message: 'An account with this email address already exists. Please sign in.' });
                }
                if (profile.username?.toLowerCase() === cleanUsername) {
                  return sendJson(409, { success: false, message: 'This username is already taken. Please choose a different username.' });
                }
              }

              const savedUser = {
                id: userId,
                name: name.trim(),
                username: cleanUsername,
                email: cleanEmail,
                password,
                role,
                organization: organization.trim(),
                title: title || (role === 'student' ? 'Student' : 'Professional'),
                avatar: initials || 'SB',
                roll_no: rollNo || null,
                department: department || null,
                batch: batch || null,
                cgpa: cgpa || null,
                location: location || null,
                specialization: specialization || null,
                career_readiness: 0,
                career_readiness_delta: 0,
                target_career_id: 'cp-fullstack',
                has_taken_assessment: false,
              };

              memoryStore.set(cleanEmail, savedUser);
              memoryStore.set(cleanUsername, savedUser);

              console.log(`[DB API] ✅ Registered user in memory store: ${savedUser.name} (${savedUser.email})`);

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
                  cgpa: savedUser.cgpa,
                },
                message: 'Account created successfully!'
              });
            }

            // --- POSTGRESQL PATH ---

            // Pre-check for duplicate username or email
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
              role === 'student' ? 0 : 90,
              0,
              'cp-fullstack'
            ];

            const result = await dbPool.query(query, values);
            const savedUser = result.rows[0];

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
              message: 'Account created and saved to database!'
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

            if (useMemoryFallback) {
              // --- IN-MEMORY FALLBACK ---
              const user = memoryStore.get(cleanIdent);
              if (!user) {
                return sendJson(404, { success: false, message: 'User not found with that username or email.' });
              }
              if (password && user.password && user.password !== password) {
                return sendJson(401, { success: false, message: 'Incorrect password.' });
              }

              console.log(`[DB API] ✅ Logged in user from memory store: ${user.name} (${user.email})`);

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
                  cgpa: user.cgpa,
                },
                role: user.role,
                message: `Welcome back, ${user.name}!`
              });
            }

            // --- POSTGRESQL PATH ---
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
          if (useMemoryFallback) {
            return sendJson(200, {
              connected: true,
              project: 'memory-fallback',
              profilesCount: memoryStore.size,
              mode: 'in-memory'
            });
          }

          try {
            const resProfiles = await dbPool.query('SELECT count(*) FROM public.profiles;');
            return sendJson(200, {
              connected: true,
              project: 'zuqiowzprzbshjrywzkf',
              profilesCount: Number(resProfiles.rows[0].count),
              mode: 'postgresql'
            });
          } catch (err: any) {
            // Switch to memory fallback on failure
            useMemoryFallback = true;
            return sendJson(200, {
              connected: true,
              project: 'memory-fallback',
              profilesCount: memoryStore.size,
              mode: 'in-memory'
            });
          }
        }

        // 4. POST /api/assessment-results (Record assessment submission & sync verified skills)
        if (req.url === '/api/assessment-results' && req.method === 'POST') {
          try {
            const body = await parseBody();
            const {
              assessmentId,
              studentId,
              skillName,
              score,
              passed,
              timeSpentSeconds,
              questionResults,
              skillBreakdown = [],
              careerReadiness,
              targetCareerId
            } = body;

            const recordId = `asr-${Date.now()}`;

            if (useMemoryFallback) {
              const userKey = Array.from(memoryStore.keys()).find(k => memoryStore.get(k)?.id === studentId);
              if (userKey) {
                const u = memoryStore.get(userKey);
                u.has_taken_assessment = true;
                if (careerReadiness !== undefined) u.career_readiness = careerReadiness;
                if (targetCareerId) u.target_career_id = targetCareerId;
                if (!u.assessmentHistory) u.assessmentHistory = [];
                u.assessmentHistory.unshift({
                  id: recordId,
                  assessmentId,
                  skillName,
                  score,
                  passed,
                  timeSpentSeconds,
                  completedAt: new Date().toISOString()
                });
                memoryStore.set(userKey, u);
              }
              return sendJson(200, { success: true, message: 'Assessment result saved in memory store.' });
            }

            // Insert into public.assessment_results
            try {
              await dbPool.query(`
                INSERT INTO public.assessment_results (id, assessment_id, student_id, skill_name, score, passed, time_spent_seconds, question_results)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
              `, [recordId, assessmentId, studentId, skillName, score, passed, timeSpentSeconds, JSON.stringify(questionResults || [])]);
            } catch (insErr: any) {
              console.warn('[DB API] assessment_results insert note:', insErr.message);
            }

            // Upsert verified skills in public.skills
            if (skillBreakdown && Array.isArray(skillBreakdown) && skillBreakdown.length > 0) {
              for (const sb of skillBreakdown) {
                const skId = `sk-${sb.skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${studentId.slice(-4)}`;
                try {
                  await dbPool.query(`
                    INSERT INTO public.skills (id, student_id, name, category, score, verified, last_assessed)
                    VALUES ($1, $2, $3, 'Technical', $4, true, 'Just now')
                    ON CONFLICT (id) DO UPDATE SET
                      score = EXCLUDED.score,
                      verified = true,
                      last_assessed = 'Just now';
                  `, [skId, studentId, sb.skill, sb.percentage]);
                } catch (skErr) {
                  console.warn('[DB API] skill update note:', skErr);
                }
              }
            } else if (skillName) {
              const skId = `sk-${skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${studentId.slice(-4)}`;
              try {
                await dbPool.query(`
                  INSERT INTO public.skills (id, student_id, name, category, score, verified, last_assessed)
                  VALUES ($1, $2, $3, 'Technical', $4, true, 'Just now')
                  ON CONFLICT (id) DO UPDATE SET
                    score = EXCLUDED.score,
                    verified = true,
                    last_assessed = 'Just now';
                `, [skId, studentId, skillName, score]);
              } catch (skErr) {
                console.warn('[DB API] skill update note:', skErr);
              }
            }

            // Update student profile career readiness in public.profiles
            if (careerReadiness !== undefined) {
              try {
                await dbPool.query(`
                  UPDATE public.profiles
                  SET career_readiness = $1, career_readiness_delta = 5, target_career_id = COALESCE($2, target_career_id)
                  WHERE id = $3;
                `, [careerReadiness, targetCareerId || null, studentId]);
              } catch (prErr) {
                console.warn('[DB API] profile update note:', prErr);
              }
            }

            console.log(`[DB API] ✅ Recorded assessment result for student ${studentId}: ${score}%`);
            return sendJson(200, { success: true, message: 'Assessment result and skills saved to PostgreSQL.' });
          } catch (err: any) {
            console.error('[DB API] Assessment save error:', err);
            return sendJson(500, { success: false, message: err.message || 'Error recording assessment' });
          }
        }

        // 5. GET /api/assessment-results?studentId=...
        if (req.url?.startsWith('/api/assessment-results') && req.method === 'GET') {
          try {
            const urlObj = new URL(req.url, 'http://localhost');
            const studentId = urlObj.searchParams.get('studentId');

            if (!studentId) {
              return sendJson(400, { success: false, message: 'studentId required' });
            }

            if (useMemoryFallback) {
              const userKey = Array.from(memoryStore.keys()).find(k => memoryStore.get(k)?.id === studentId);
              const u = userKey ? memoryStore.get(userKey) : null;
              return sendJson(200, {
                success: true,
                results: u?.assessmentHistory || [],
                hasTakenAssessment: Boolean(u?.has_taken_assessment || (u?.assessmentHistory && u.assessmentHistory.length > 0))
              });
            }

            const res = await dbPool.query(`
              SELECT * FROM public.assessment_results
              WHERE student_id = $1
              ORDER BY created_at DESC;
            `, [studentId]);

            return sendJson(200, {
              success: true,
              results: res.rows,
              hasTakenAssessment: res.rows.length > 0
            });
          } catch (err: any) {
            return sendJson(200, { success: true, results: [], hasTakenAssessment: false });
          }
        }

        // 6. GET /api/student-skills?studentId=...
        if (req.url?.startsWith('/api/student-skills') && req.method === 'GET') {
          try {
            const urlObj = new URL(req.url, 'http://localhost');
            const studentId = urlObj.searchParams.get('studentId');

            if (!studentId) {
              return sendJson(400, { success: false, message: 'studentId required' });
            }

            if (useMemoryFallback) {
              return sendJson(200, { success: true, skills: [] });
            }

            const res = await dbPool.query(`
              SELECT id, name, category, score, verified, last_assessed as "lastAssessed"
              FROM public.skills
              WHERE student_id = $1;
            `, [studentId]);

            return sendJson(200, { success: true, skills: res.rows });
          } catch (err: any) {
            return sendJson(200, { success: true, skills: [] });
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
