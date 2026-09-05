import { Assessment, CourseCategoryConfig } from '../types';

export const COURSE_CONFIGS: CourseCategoryConfig[] = [
  {
    id: 'fullstack',
    title: 'Full Stack Developer (Critical Demand)',
    demandTag: 'Critical Demand',
    badge: 'Full Stack Engineer',
    skillsCovered: ['React.js', 'Node.js & Express', 'REST & GraphQL APIs', 'SQL & Database Design', 'System Architecture', 'Git & Version Control'],
    description: 'Master end-to-end web applications. Evaluate proficiency in React frontends, Node.js microservices, SQL query tuning, and API design.',
    durationMinutes: 15,
    totalQuestions: 10,
    passingScore: 60,
    difficulty: 'Intermediate'
  },
  {
    id: 'frontend',
    title: 'Frontend Engineer (Very High)',
    demandTag: 'Very High',
    badge: 'Frontend Specialist',
    skillsCovered: ['HTML5 & Modern CSS', 'JavaScript', 'React.js', 'TypeScript', 'Frontend Architecture', 'Git & Version Control'],
    description: 'Assess modern client-side engineering capabilities, including DOM optimization, state management, custom React hooks, and TypeScript generics.',
    durationMinutes: 15,
    totalQuestions: 10,
    passingScore: 60,
    difficulty: 'Intermediate'
  },
  {
    id: 'backend',
    title: 'Backend Systems Engineer (Critical Demand)',
    demandTag: 'Critical Demand',
    badge: 'Backend Architect',
    skillsCovered: ['Node.js', 'Express.js', 'REST APIs', 'SQL & Database Design', 'Authentication', 'Backend Architecture'],
    description: 'Benchmark your backend system design, database indexing strategies, JWT/OAuth authentication security, and high-concurrency Node.js execution.',
    durationMinutes: 15,
    totalQuestions: 10,
    passingScore: 60,
    difficulty: 'Intermediate'
  },
  {
    id: 'devops',
    title: 'Cloud & DevOps Engineer (Very High)',
    demandTag: 'Very High',
    badge: 'Cloud & DevOps Pro',
    skillsCovered: ['Docker & Containers', 'Kubernetes', 'CI/CD Pipelines', 'AWS Infrastructure', 'Terraform & IaC', 'Linux Systems'],
    description: 'Demonstrate competency in containerizing applications, orchestration using Kubernetes, automating GitHub Actions CI/CD pipelines, and cloud security.',
    durationMinutes: 15,
    totalQuestions: 10,
    passingScore: 60,
    difficulty: 'Intermediate'
  },
  {
    id: 'ai-data',
    title: 'AI & Data Science Engineer (Critical Demand)',
    demandTag: 'Critical Demand',
    badge: 'AI & ML Engineer',
    skillsCovered: ['Python Programming', 'Machine Learning', 'Deep Learning & PyTorch', 'NLP & Large Language Models', 'Data Preprocessing', 'MLOps'],
    description: 'Test your capabilities in building ML pipelines, training neural network architectures, optimizing prompt embeddings, and deploying AI models.',
    durationMinutes: 15,
    totalQuestions: 10,
    passingScore: 60,
    difficulty: 'Advanced'
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst & BI Specialist (High)',
    demandTag: 'High',
    badge: 'Data & BI Specialist',
    skillsCovered: ['SQL & Queries', 'Data Analysis', 'Statistics & Probability', 'Data Visualization', 'Business Intelligence'],
    description: 'Measure your ability to write complex SQL aggregations, build executive BI dashboards, perform statistical hypothesis testing, and extract business insights.',
    durationMinutes: 15,
    totalQuestions: 10,
    passingScore: 60,
    difficulty: 'Intermediate'
  }
];

export const COURSE_ASSESSMENTS: Record<string, Assessment> = {
  fullstack: {
    id: 'asm-fullstack',
    courseCategoryId: 'fullstack',
    title: 'Full Stack Developer Skill Assessment',
    skillCategory: 'Full Stack Engineering',
    description: 'Comprehensive evaluation covering frontend components, backend Node.js APIs, database queries, and version control workflows.',
    durationMinutes: 15,
    totalQuestions: 10,
    passingScore: 60,
    badge: 'Full Stack Engineer',
    skillsCovered: ['React.js', 'Node.js & Express', 'REST & GraphQL APIs', 'SQL & Database Design', 'System Architecture', 'Git & Version Control'],
    difficulty: 'Intermediate',
    questions: [
      {
        id: 'fs-1',
        question: 'In a full-stack React + Node application, how should CORS (Cross-Origin Resource Sharing) be handled in Express to safely allow requests from your frontend origin?',
        codeSnippet: `const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'https://app.example.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));`,
        options: [
          'Set origin: "*" with credentials: true for maximum accessibility across all domains.',
          'Specify explicit allowed origins and set credentials: true if sending HTTP-only auth cookies.',
          'Disable CORS entirely because modern browsers bypass origin checks automatically.',
          'CORS can only be configured in HTML meta tags, not Express middleware.'
        ],
        correctOptionIndex: 1,
        explanation: 'When credentials (cookies or authorization headers) are sent, browsers disallow wildcard "*" origins. You must specify exact trusted origin URLs.',
        skill: 'REST & GraphQL APIs',
        difficulty: 'intermediate'
      },
      {
        id: 'fs-2',
        question: 'What is the primary difference between useEffect and useLayoutEffect in React when handling DOM layout calculations?',
        codeSnippet: `useLayoutEffect(() => {
  const { height } = ref.current.getBoundingClientRect();
  setHeight(height);
}, []);`,
        options: [
          'useEffect fires before DOM mutations; useLayoutEffect fires after browser paint.',
          'useLayoutEffect executes synchronously after DOM mutations but before browser paint, preventing visual flicker.',
          'useEffect can only be used with state variables, whereas useLayoutEffect is reserved for refs.',
          'There is no difference; useLayoutEffect is a deprecated legacy alias.'
        ],
        correctOptionIndex: 1,
        explanation: 'useLayoutEffect runs synchronously immediately after React mutates the DOM, allowing synchronous layout measurements before the user sees any paint flicker.',
        skill: 'React.js',
        difficulty: 'intermediate'
      },
      {
        id: 'fs-3',
        question: 'When designing a REST API in Node/Express for an e-commerce platform, which HTTP method and status code are most appropriate when successfully creating a new user order?',
        options: [
          'PUT /orders with HTTP 200 OK',
          'POST /orders with HTTP 201 Created',
          'GET /orders/new with HTTP 302 Found',
          'PATCH /orders with HTTP 204 No Content'
        ],
        correctOptionIndex: 1,
        explanation: 'POST requests create new resources at a collection endpoint, and 201 Created indicates successful resource creation.',
        skill: 'REST & GraphQL APIs',
        difficulty: 'beginner'
      },
      {
        id: 'fs-4',
        question: 'In SQL database modeling, what is the purpose of an Index and how does it affect write operations (INSERT/UPDATE)?',
        options: [
          'Indexes speed up both SELECT reads and INSERT writes equally.',
          'Indexes accelerate SELECT read queries but introduce slight overhead during INSERT/UPDATE because the index B-tree must be updated.',
          'Indexes prevent duplicate records from being written to the database.',
          'Indexes encrypt sensitive database columns.'
        ],
        correctOptionIndex: 1,
        explanation: 'B-Tree indexes provide logarithmic O(log N) lookup speed for reads, but each write operation requires updating tree node pointers.',
        skill: 'SQL & Database Design',
        difficulty: 'intermediate'
      },
      {
        id: 'fs-5',
        question: 'How does Node.js handle non-blocking asynchronous I/O operations despite running single-threaded JavaScript execution?',
        options: [
          'Node.js spawns a new OS process for every incoming HTTP request.',
          'Node.js delegates I/O tasks to Libuv background worker threads and handles completion callbacks in its Event Loop.',
          'Node.js compiles JavaScript into synchronous C assembly code.',
          'Node.js uses multi-threaded V8 engines that share global variables concurrently.'
        ],
        correctOptionIndex: 1,
        explanation: 'Node uses Libuv thread pool for asynchronous file/network I/O tasks, keeping the main JS event loop responsive.',
        skill: 'Node.js & Express',
        difficulty: 'intermediate'
      },
      {
        id: 'fs-6',
        question: 'Which Git command allows you to combine feature commits onto main in a clean, linear history without creating a merge commit?',
        options: [
          'git merge --no-ff feature',
          'git rebase main',
          'git stash pop',
          'git branch -d main'
        ],
        correctOptionIndex: 1,
        explanation: '`git rebase main` replays your feature commits on top of the tip of main, producing a straight linear commit graph.',
        skill: 'Git & Version Control',
        difficulty: 'intermediate'
      },
      {
        id: 'fs-7',
        question: 'What is the purpose of JWT (JSON Web Tokens) in a stateless full-stack architecture?',
        options: [
          'To store session state directly in server memory for fast retrieval.',
          'To securely transmit cryptographically signed user claims between client and server without requiring database session lookups on every request.',
          'To compress payload payloads sent over WebSocket connections.',
          'To automatically encrypt the database tables on disk.'
        ],
        correctOptionIndex: 1,
        explanation: 'JWTs contain signed claims verified via a secret key, enabling stateless authentication across microservices.',
        skill: 'System Architecture',
        difficulty: 'intermediate'
      },
      {
        id: 'fs-8',
        question: 'Why should you avoid using array index keys when rendering dynamic list items in React?',
        codeSnippet: `{items.map((item, index) => (
  <ListItem key={index} data={item} />
))}`,
        options: [
          'Index keys trigger infinite loops during render.',
          'When items are reordered, inserted, or deleted, index keys cause state mismatch and unnecessary DOM recreations.',
          'React throws a runtime syntax exception if numeric keys are detected.',
          'Index keys disable component garbage collection.'
        ],
        correctOptionIndex: 1,
        explanation: 'React uses keys to track item identity across renders. Indices shift when list items reorder, leading to subtle state bugs.',
        skill: 'React.js',
        difficulty: 'beginner'
      },
      {
        id: 'fs-9',
        question: 'In SQL, what ACID property guarantees that all operations in a multi-step transaction succeed completely or roll back entirely?',
        options: [
          'Atomicity',
          'Consistency',
          'Isolation',
          'Durability'
        ],
        correctOptionIndex: 0,
        explanation: 'Atomicity ensures an "all-or-nothing" execution guarantee for database transactions.',
        skill: 'SQL & Database Design',
        difficulty: 'beginner'
      },
      {
        id: 'fs-10',
        question: 'What is the primary benefit of using GraphQL over traditional REST endpoints for client data fetching?',
        options: [
          'GraphQL operates exclusively over UDP instead of TCP for faster speeds.',
          'GraphQL allows clients to request exactly the fields they need in a single request, eliminating over-fetching and under-fetching.',
          'GraphQL replaces SQL databases with direct client-side storage.',
          'GraphQL automatically generates React components from database schemas.'
        ],
        correctOptionIndex: 1,
        explanation: 'GraphQL empowers client queries to specify precise fields, reducing network payload size and roundtrips.',
        skill: 'REST & GraphQL APIs',
        difficulty: 'intermediate'
      }
    ]
  },

  frontend: {
    id: 'asm-frontend',
    courseCategoryId: 'frontend',
    title: 'Frontend Engineer Skill Assessment',
    skillCategory: 'Frontend Engineering',
    description: 'In-depth benchmark covering HTML5, CSS Flexbox/Grid, JavaScript modern standards, React hooks, TypeScript typing, and Web Vitals.',
    durationMinutes: 15,
    totalQuestions: 10,
    passingScore: 60,
    badge: 'Frontend Specialist',
    skillsCovered: ['HTML5 & Modern CSS', 'JavaScript', 'React.js', 'TypeScript', 'Frontend Architecture', 'Git & Version Control'],
    difficulty: 'Intermediate',
    questions: [
      {
        id: 'fe-1',
        question: 'What is the difference between `display: flex` and `display: grid` in modern CSS layout design?',
        options: [
          'Flexbox is two-dimensional (rows & columns simultaneously); Grid is one-dimensional.',
          'Flexbox is content-out and primarily one-dimensional (row OR column); Grid is layout-in and two-dimensional (rows AND columns simultaneously).',
          'Grid only works on mobile viewports; Flexbox is for desktop.',
          'There is no functional difference; Grid is an older CSS specification.'
        ],
        correctOptionIndex: 1,
        explanation: 'Flexbox manages 1D layouts along a main axis, whereas Grid handles complex 2D spatial layouts with defined rows and columns.',
        skill: 'HTML5 & Modern CSS',
        difficulty: 'beginner'
      },
      {
        id: 'fe-2',
        question: 'What does the JavaScript Event Loop do when a microtask (e.g. `Promise.then`) and a macrotask (e.g. `setTimeout`) are both pending in their queues?',
        codeSnippet: `setTimeout(() => console.log('Timeout'), 0);
Promise.resolve().then(() => console.log('Promise'));
console.log('Sync');`,
        options: [
          'Prints: Timeout, Promise, Sync',
          'Prints: Sync, Timeout, Promise',
          'Prints: Sync, Promise, Timeout',
          'Prints: Promise, Sync, Timeout'
        ],
        correctOptionIndex: 2,
        explanation: 'Synchronous code runs first ("Sync"), then the microtask queue is completely drained before processing macrotasks ("Promise", then "Timeout").',
        skill: 'JavaScript',
        difficulty: 'intermediate'
      },
      {
        id: 'fe-3',
        question: 'In React 18, what is the purpose of the `useTransition` hook?',
        codeSnippet: `const [isPending, startTransition] = useTransition();

function handleSearch(query) {
  setSearchText(query); // urgent
  startTransition(() => {
    setFilteredList(query); // non-urgent
  });
}`,
        options: [
          'To animate CSS transition effects on page route changes.',
          'To mark state updates as non-urgent transitions, keeping input fields responsive during heavy re-renders.',
          'To perform server-side rendering hydration automatically.',
          'To store state values in persistent browser cookies.'
        ],
        correctOptionIndex: 1,
        explanation: '`useTransition` prevents non-urgent render calculations from blocking urgent user interactions like typing or clicking.',
        skill: 'React.js',
        difficulty: 'intermediate'
      },
      {
        id: 'fe-4',
        question: 'In TypeScript, what is the difference between `unknown` and `any` types?',
        options: [
          '`any` turns off type checking allowing any operation; `unknown` requires type checking or narrowing before accessing properties.',
          '`unknown` can only hold strings and numbers.',
          '`any` is safe for production code, whereas `unknown` causes compiler errors.',
          'There is no difference; they are aliases for the same type.'
        ],
        correctOptionIndex: 0,
        explanation: '`unknown` is type-safe: TypeScript forces you to perform type guards/narrowing before calling methods or accessing properties.',
        skill: 'TypeScript',
        difficulty: 'intermediate'
      },
      {
        id: 'fe-5',
        question: 'Which Web Vitals metric measures visual stability by tracking unexpected layout shifts during page rendering?',
        options: [
          'Largest Contentful Paint (LCP)',
          'Interaction to Next Paint (INP)',
          'Cumulative Layout Shift (CLS)',
          'First Input Delay (FID)'
        ],
        correctOptionIndex: 2,
        explanation: 'CLS measures unexpected displacement of DOM elements while the page is loading.',
        skill: 'Frontend Architecture',
        difficulty: 'intermediate'
      },
      {
        id: 'fe-6',
        question: 'How do you temporarily shelve uncommitted working directory changes in Git to switch branches without committing dirty code?',
        options: [
          'git clean -fd',
          'git stash',
          'git revert HEAD',
          'git checkout --force'
        ],
        correctOptionIndex: 1,
        explanation: '`git stash` saves uncommitted changes to a temporary stack so your working copy is clean.',
        skill: 'Git & Version Control',
        difficulty: 'beginner'
      },
      {
        id: 'fe-7',
        question: 'What is the purpose of `React.memo()` in component optimization?',
        options: [
          'To perform deep equality checks on object props automatically.',
          'To memoize component renders by skipping re-renders when props have not changed (shallow comparison).',
          'To cache API network responses in browser memory.',
          'To convert functional components into class components.'
        ],
        correctOptionIndex: 1,
        explanation: 'React.memo wraps functional components to prevent renders when incoming props remain reference-equal.',
        skill: 'React.js',
        difficulty: 'intermediate'
      },
      {
        id: 'fe-8',
        question: 'In TypeScript, how do you define a Generic constraint that ensures a parameter has a `.length` property?',
        codeSnippet: `function logLength<T extends { length: number }>(item: T): number {
  return item.length;
}`,
        options: [
          'Using `T implements Length`',
          'Using `T extends { length: number }`',
          'Using `T typeof length`',
          'Using `T = { length: number }`'
        ],
        correctOptionIndex: 1,
        explanation: 'The `extends` keyword restricts generic type parameters to types containing defined shape properties.',
        skill: 'TypeScript',
        difficulty: 'advanced'
      },
      {
        id: 'fe-9',
        question: 'Which CSS selector has the HIGHEST specificity calculation?',
        options: [
          '`.card .title p` (Class selectors)',
          '`#header` (ID selector)',
          '`div header p` (Element selectors)',
          '`*` (Universal selector)'
        ],
        correctOptionIndex: 1,
        explanation: 'ID selectors (0,1,0,0) outweigh class selectors (0,0,1,0) and element selectors (0,0,0,1).',
        skill: 'HTML5 & Modern CSS',
        difficulty: 'beginner'
      },
      {
        id: 'fe-10',
        question: 'What happens when you pass a function to React state setter: `setCount(prev => prev + 1)`?',
        options: [
          'It updates state synchronously blocking UI execution.',
          'It ensures access to the latest pending state value avoiding stale closure issues inside callbacks.',
          'It prevents child components from updating.',
          'It automatically saves state to localStorage.'
        ],
        correctOptionIndex: 1,
        explanation: 'Functional state updates guarantee access to current committed state regardless of closure timing.',
        skill: 'React.js',
        difficulty: 'intermediate'
      }
    ]
  },

  backend: {
    id: 'asm-backend',
    courseCategoryId: 'backend',
    title: 'Backend Systems Engineer Skill Assessment',
    skillCategory: 'Backend Architecture',
    description: 'Assess server-side Node.js development, REST/RPC API patterns, SQL optimization, JWT/OAuth authentication, and backend scalability.',
    durationMinutes: 15,
    totalQuestions: 10,
    passingScore: 60,
    badge: 'Backend Architect',
    skillsCovered: ['Node.js', 'Express.js', 'REST APIs', 'SQL & Database Design', 'Authentication', 'Backend Architecture'],
    difficulty: 'Intermediate',
    questions: [
      {
        id: 'be-1',
        question: 'How should passwords be securely stored in a backend SQL database?',
        options: [
          'Encrypted using AES-256 reversible encryption with a secret key.',
          'Hashed using a salted, slow cryptographic hash algorithm like bcrypt or Argon2.',
          'Encoded in base64 string format.',
          'Stored as plain text with strict database user access permissions.'
        ],
        correctOptionIndex: 1,
        explanation: 'Salted one-way cryptographic hashes (bcrypt/Argon2) resist dictionary and rainbow table attacks.',
        skill: 'Authentication',
        difficulty: 'beginner'
      },
      {
        id: 'be-2',
        question: 'What is the primary function of Express middleware functions in Node.js?',
        codeSnippet: `app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.url}\`);
  next();
});`,
        options: [
          'To render HTML templates on the client browser.',
          'To intercept, modify HTTP request/response objects, execute custom logic, and pass control via `next()`.',
          'To manage database table indexing.',
          'To bundle JavaScript code into static production assets.'
        ],
        correctOptionIndex: 1,
        explanation: 'Middleware functions execute in pipeline sequence to process requests, perform auth, logging, or input validation.',
        skill: 'Express.js',
        difficulty: 'beginner'
      },
      {
        id: 'be-3',
        question: 'In SQL, what is the difference between `WHERE` and `HAVING` clauses?',
        options: [
          '`WHERE` filters individual rows before aggregation; `HAVING` filters aggregated group results after `GROUP BY`.',
          '`WHERE` can only filter text strings; `HAVING` filters numeric values.',
          '`HAVING` executes before `WHERE` in the database pipeline.',
          'There is no difference; they are interchangeable keywords.'
        ],
        correctOptionIndex: 0,
        explanation: '`WHERE` evaluates individual table records prior to grouping; `HAVING` evaluates aggregate calculations (e.g. `HAVING COUNT(*) > 5`).',
        skill: 'SQL & Database Design',
        difficulty: 'beginner'
      },
      {
        id: 'be-4',
        question: 'What is the "N+1 Query Problem" in backend ORM systems (e.g. Prisma or Sequelize) and how is it resolved?',
        options: [
          'It occurs when N users log in simultaneously; solved by restarting the database.',
          'It happens when fetching 1 parent record triggers N separate database queries for related child records; solved by eager loading/JOIN queries.',
          'It is an error caused by invalid SQL syntax.',
          'It refers to exceeding maximum open connection pools.'
        ],
        correctOptionIndex: 1,
        explanation: 'Eager loading (e.g., SQL JOIN or batching) fetches parent and child rows in a single or batched query instead of N individual roundtrips.',
        skill: 'Backend Architecture',
        difficulty: 'intermediate'
      },
      {
        id: 'be-5',
        question: 'Which HTTP header should be used to send JWT bearer tokens in RESTful API requests?',
        options: [
          '`Content-Type: application/jwt`',
          '`Authorization: Bearer <token>`',
          '`X-Access-Token: <token>`',
          '`Set-Cookie: jwt=<token>`'
        ],
        correctOptionIndex: 1,
        explanation: 'Standard HTTP authorization uses `Authorization: Bearer <token>` format.',
        skill: 'REST APIs',
        difficulty: 'beginner'
      },
      {
        id: 'be-6',
        question: 'What is the purpose of database Connection Pooling in Node.js backend servers?',
        options: [
          'To merge multiple SQL databases into a single server.',
          'To maintain a set of reusable active database connections, eliminating the heavy latency of establishing a new connection per API request.',
          'To automatically replicate database data across geographical regions.',
          'To convert relational tables into JSON files.'
        ],
        correctOptionIndex: 1,
        explanation: 'Connection pools eliminate TCP/TLS handshake overhead for every incoming database query.',
        skill: 'SQL & Database Design',
        difficulty: 'intermediate'
      },
      {
        id: 'be-7',
        question: 'What is a Idempotent HTTP method according to REST architecture principles?',
        options: [
          'A method that always returns HTTP 200 status code.',
          'A method where making multiple identical requests yields the same server state as a single request (e.g. GET, PUT, DELETE).',
          'A method that creates a new database record every time it is called.',
          'A method that requires WebSocket connections.'
        ],
        correctOptionIndex: 1,
        explanation: 'Idempotent methods (GET, PUT, DELETE) leave the server in the identical state regardless of request repetition.',
        skill: 'REST APIs',
        difficulty: 'intermediate'
      },
      {
        id: 'be-8',
        question: 'How does Rate Limiting protect backend API endpoints from abusive traffic?',
        options: [
          'By compressing JSON responses to reduce bandwidth.',
          'By tracking request counts per IP/user and returning HTTP 429 Too Many Requests when limits are exceeded.',
          'By requiring CAPTCHA verification for every single API request.',
          'By disabling database indexes during peak traffic hours.'
        ],
        correctOptionIndex: 1,
        explanation: 'Rate limiting prevents DDoS and brute force attacks by throttling excessive client requests.',
        skill: 'Backend Architecture',
        difficulty: 'intermediate'
      },
      {
        id: 'be-9',
        question: 'In Node.js, what happens if an unhandled promise rejection occurs and is not caught by `.catch()` or `try/catch`?',
        options: [
          'Node.js ignores it silently without logging.',
          'In modern Node versions, it triggers an UnhandledPromiseRejection event and terminates the Node process with non-zero exit code.',
          'Node.js automatically retries the operation 3 times.',
          'The server converts the rejection into an HTTP 200 response.'
        ],
        correctOptionIndex: 1,
        explanation: 'Unhandled rejections crash the Node process in modern environments to prevent corrupt, unpredictable runtime states.',
        skill: 'Node.js',
        difficulty: 'intermediate'
      },
      {
        id: 'be-10',
        question: 'What is the purpose of database Transaction Isolation Levels (e.g., Read Committed, Repeatable Read, Serializable)?',
        options: [
          'To control the physical disk storage size of database tables.',
          'To define the degree to which concurrent transactions are isolated from seeing uncommitted or conflicting updates made by other transactions.',
          'To format SQL output strings into XML.',
          'To enforce primary key auto-increment values.'
        ],
        correctOptionIndex: 1,
        explanation: 'Isolation levels balance performance against concurrency anomalies like dirty reads, non-repeatable reads, and phantom reads.',
        skill: 'SQL & Database Design',
        difficulty: 'advanced'
      }
    ]
  },

  devops: {
    id: 'asm-devops',
    courseCategoryId: 'devops',
    title: 'Cloud & DevOps Engineer Skill Assessment',
    skillCategory: 'Cloud & DevOps Engineering',
    description: 'Evaluate proficiency in Docker containers, Kubernetes orchestration, GitHub Actions CI/CD pipelines, AWS services, and Infrastructure as Code.',
    durationMinutes: 15,
    totalQuestions: 10,
    passingScore: 60,
    badge: 'Cloud & DevOps Pro',
    skillsCovered: ['Docker & Containers', 'Kubernetes', 'CI/CD Pipelines', 'AWS Infrastructure', 'Terraform & IaC', 'Linux Systems'],
    difficulty: 'Intermediate',
    questions: [
      {
        id: 'do-1',
        question: 'What is the primary difference between a Docker Container and a Virtual Machine (VM)?',
        options: [
          'Containers include a full guest OS kernel; VMs share the host OS kernel.',
          'Containers virtualize at the OS layer sharing the host kernel (lightweight); VMs virtualize hardware with dedicated guest OS kernels.',
          'VMs start in milliseconds; containers take minutes to boot.',
          'Containers can only run on Linux; VMs only run on Windows.'
        ],
        correctOptionIndex: 1,
        explanation: 'Containers share host kernel isolation for rapid startup and low footprint, whereas VMs run heavy isolated guest OS instances.',
        skill: 'Docker & Containers',
        difficulty: 'beginner'
      },
      {
        id: 'do-2',
        question: 'In Kubernetes, what is the smallest deployable compute object that wraps one or more application containers?',
        options: [
          'Deployment',
          'Pod',
          'Node',
          'Service'
        ],
        correctOptionIndex: 1,
        explanation: 'A Pod is the fundamental Kubernetes unit representing a set of running containers sharing storage/network.',
        skill: 'Kubernetes',
        difficulty: 'beginner'
      },
      {
        id: 'do-3',
        question: 'What is the purpose of Infrastructure as Code (IaC) tools like Terraform?',
        codeSnippet: `resource "aws_s3_bucket" "b" {
  bucket = "my-company-app-assets"
  acl    = "private"
}`,
        options: [
          'To write frontend UI layouts in declarative JSON format.',
          'To provision, manage, and version cloud infrastructure via human-readable declarative configuration files.',
          'To automatically refactor JavaScript code into Go.',
          'To monitor server RAM usage in real-time.'
        ],
        correctOptionIndex: 1,
        explanation: 'Terraform allows infrastructure to be version-controlled, reviewed, automated, and reliably reproduced across environments.',
        skill: 'Terraform & IaC',
        difficulty: 'intermediate'
      },
      {
        id: 'do-4',
        question: 'In a GitHub Actions CI/CD workflow, how do you securely store sensitive AWS access keys or database passwords?',
        options: [
          'Commit them directly into `.github/workflows/main.yml`.',
          'Store them in GitHub Repository Secrets and reference them via `file://envs` context.',
          'Write them into the Dockerfile `ENV` directives.',
          'Email them to the repository maintainer.'
        ],
        correctOptionIndex: 1,
        explanation: 'GitHub Encrypted Secrets prevent credentials from leaking in repository source code or CI build logs.',
        skill: 'CI/CD Pipelines',
        difficulty: 'beginner'
      },
      {
        id: 'do-5',
        question: 'Which AWS service provides scalable object storage accessible over HTTP via REST APIs?',
        options: [
          'AWS EC2',
          'AWS S3',
          'AWS RDS',
          'AWS DynamoDB'
        ],
        correctOptionIndex: 1,
        explanation: 'Amazon S3 (Simple Storage Service) is built for storing and retrieving unstructured object data.',
        skill: 'AWS Infrastructure',
        difficulty: 'beginner'
      },
      {
        id: 'do-6',
        question: 'In Linux permissions, what does the command `chmod 755 app.sh` execute?',
        options: [
          'Read, write, execute for Owner; Read & execute for Group and Others.',
          'Full access for everyone.',
          'Read-only access for Owner; no access for others.',
          'Deletes the file permanently.'
        ],
        correctOptionIndex: 0,
        explanation: '7 = rwx (owner), 5 = r-x (group), 5 = r-x (others).',
        skill: 'Linux Systems',
        difficulty: 'intermediate'
      },
      {
        id: 'do-7',
        question: 'What is a Multi-stage Docker build and why is it used?',
        codeSnippet: `FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html`,
        options: [
          'It runs Docker containers across multiple cloud providers simultaneously.',
          'It uses multiple `FROM` statements to separate build dependencies from the runtime image, drastically reducing final image size.',
          'It automatically scales container CPU usage.',
          'It enables multi-threading in single-threaded apps.'
        ],
        correctOptionIndex: 1,
        explanation: 'Multi-stage builds leave compiler tools in builder stages, producing slim, secure production runtime images.',
        skill: 'Docker & Containers',
        difficulty: 'intermediate'
      },
      {
        id: 'do-8',
        question: 'What is the role of a Kubernetes Ingress Controller?',
        options: [
          'To compile container source code.',
          'To manage external HTTP/HTTPS access routing to internal Kubernetes ClusterIP services based on hostname/path rules.',
          'To back up database tables to AWS S3.',
          'To monitor node CPU temperature.'
        ],
        correctOptionIndex: 1,
        explanation: 'Ingress acts as an intelligent entry proxy routing external web traffic to appropriate internal services.',
        skill: 'Kubernetes',
        difficulty: 'intermediate'
      },
      {
        id: 'do-9',
        question: 'What is Blue/Green Deployment strategy in DevOps deployment automation?',
        options: [
          'Deploying frontend code on blue servers and backend code on green servers.',
          'Maintaining two identical production environments (Blue active, Green new); traffic switches to Green after successful verification.',
          'Gradually updating 10% of users every week.',
          'Deploying without running unit tests.'
        ],
        correctOptionIndex: 1,
        explanation: 'Blue/Green deployment eliminates downtime and allows instant rollback if issues occur in the new release.',
        skill: 'CI/CD Pipelines',
        difficulty: 'intermediate'
      },
      {
        id: 'do-10',
        question: 'Which AWS service automatically scales EC2 compute capacity up or down based on traffic demand metrics?',
        options: [
          'AWS CloudFront',
          'AWS Auto Scaling Group',
          'AWS IAM',
          'AWS Route 53'
        ],
        correctOptionIndex: 1,
        explanation: 'Auto Scaling monitors application health and dynamically adjusts server fleet size based on scaling policies.',
        skill: 'AWS Infrastructure',
        difficulty: 'intermediate'
      }
    ]
  },

  'ai-data': {
    id: 'asm-ai-data',
    courseCategoryId: 'ai-data',
    title: 'AI & Data Science Engineer Skill Assessment',
    skillCategory: 'AI & Machine Learning',
    description: 'Comprehensive assessment covering Python data processing, Supervised/Unsupervised ML models, PyTorch deep learning, LLM embeddings, and MLOps.',
    durationMinutes: 15,
    totalQuestions: 10,
    passingScore: 60,
    badge: 'AI & ML Engineer',
    skillsCovered: ['Python Programming', 'Machine Learning', 'Deep Learning & PyTorch', 'NLP & Large Language Models', 'Data Preprocessing', 'MLOps'],
    difficulty: 'Advanced',
    questions: [
      {
        id: 'ai-1',
        question: 'In Machine Learning, what does Overfitting mean and how can it be mitigated?',
        options: [
          'Model performs poorly on training data; fixed by deleting features.',
          'Model learns training data noise perfectly but fails to generalize to unseen test data; mitigated by regularization, dropout, or more data.',
          'Model is too simple to capture data patterns; fixed by reducing model layers.',
          'Model runs out of GPU VRAM during training.'
        ],
        correctOptionIndex: 1,
        explanation: 'Overfitting occurs when high model capacity memorizes training data. Regularization (L1/L2, dropout) penalizes complexity.',
        skill: 'Machine Learning',
        difficulty: 'beginner'
      },
      {
        id: 'ai-2',
        question: 'In PyTorch, what is the purpose of `loss.backward()` followed by `optimizer.step()` during model training?',
        codeSnippet: `optimizer.zero_grad()
outputs = model(inputs)
loss = criterion(outputs, targets)
loss.backward()
optimizer.step()`,
        options: [
          'To save model checkpoints to disk.',
          '`loss.backward()` computes gradients via autograd backpropagation; `optimizer.step()` updates model weights using calculated gradients.',
          'To convert PyTorch tensors into NumPy arrays.',
          'To initialize random layer weights.'
        ],
        correctOptionIndex: 1,
        explanation: '`backward()` calculates partial derivatives of loss wrt parameters, and `step()` adjusts parameter weights using optimizer rules.',
        skill: 'Deep Learning & PyTorch',
        difficulty: 'intermediate'
      },
      {
        id: 'ai-3',
        question: 'In Large Language Models (LLMs), what is the core mechanism of the Transformer architecture described in "Attention Is All You Need"?',
        options: [
          'Recurrent hidden state loops processing tokens sequentially one by one.',
          'Self-Attention mechanism calculating contextual relevance weights between all pairs of tokens in parallel.',
          'Convolutional 2D filters scanning text matrices.',
          'Decision tree ensembles classifying words.'
        ],
        correctOptionIndex: 1,
        explanation: 'Self-attention allows Transformers to compute context relationships across entire input sequences simultaneously without sequential RNN bottlenecks.',
        skill: 'NLP & Large Language Models',
        difficulty: 'advanced'
      },
      {
        id: 'ai-4',
        question: 'In Python Pandas, which method is used to handle missing values by replacing NaN with the mean or forward-fill value?',
        codeSnippet: `import pandas as pd
df['age'] = df['age'].fillna(df['age'].mean())`,
        options: [
          '`df.dropna()`',
          '`df.fillna()`',
          '`df.replace_null()`',
          '`df.clean()`'
        ],
        correctOptionIndex: 1,
        explanation: '`fillna()` fills missing null/NaN values using specified strategies like constant values, column statistics, or interpolation.',
        skill: 'Data Preprocessing',
        difficulty: 'beginner'
      },
      {
        id: 'ai-5',
        question: 'What is RAG (Retrieval-Augmented Generation) in LLM system engineering?',
        options: [
          'Re-training an LLM foundation model from scratch on private data.',
          'Combining vector search retrieval over external documents with LLM prompt generation to produce accurate, grounded answers.',
          'Compressing neural network weights into 4-bit quantization.',
          'Converting text prompts into audio speech.'
        ],
        correctOptionIndex: 1,
        explanation: 'RAG fetches domain documents via vector similarity and includes them in the prompt context to prevent hallucination.',
        skill: 'NLP & Large Language Models',
        difficulty: 'intermediate'
      },
      {
        id: 'ai-6',
        question: 'What metric is best suited for evaluating a binary classification ML model on an imbalanced dataset (e.g. 99% negative, 1% positive)?',
        options: [
          'Standard Accuracy',
          'Precision, Recall, and F1-Score (or ROC-AUC)',
          'Mean Squared Error (MSE)',
          'R-Squared Score'
        ],
        correctOptionIndex: 1,
        explanation: 'Accuracy is misleading on imbalanced datasets (predicting all negative gives 99% accuracy). Precision/Recall/F1 evaluate minority class performance.',
        skill: 'Machine Learning',
        difficulty: 'intermediate'
      },
      {
        id: 'ai-7',
        question: 'In Python, what is a List Comprehension and what will `[x**2 for x in range(5) if x % 2 == 0]` output?',
        options: [
          '`[0, 1, 4, 9, 16]`',
          '`[0, 4, 16]`',
          '`[1, 9]`',
          '`[0, 2, 4]`'
        ],
        correctOptionIndex: 1,
        explanation: 'Range(5) yields 0,1,2,3,4. Even numbers are 0, 2, 4. Squares are 0, 4, 16.',
        skill: 'Python Programming',
        difficulty: 'beginner'
      },
      {
        id: 'ai-8',
        question: 'What is the primary role of MLOps platforms like MLflow or Weights & Biases?',
        options: [
          'To generate synthetic training data automatically.',
          'To track experiment metrics, hyperparameter runs, model artifacts, and manage deployment lifecycles.',
          'To design user interface dashboards.',
          'To host SQL databases.'
        ],
        correctOptionIndex: 1,
        explanation: 'MLOps tools enable reproducibility, tracking training runs, logging metrics, and managing model registries.',
        skill: 'MLOps',
        difficulty: 'intermediate'
      },
      {
        id: 'ai-9',
        question: 'What is the purpose of Softmax activation function in the final layer of a multi-class neural network classifier?',
        options: [
          'To set negative values to zero.',
          'To convert raw output logits into a normalized probability distribution where all class probabilities sum to 1.0.',
          'To compute matrix multiplication faster.',
          'To prevent gradient explosion during backpropagation.'
        ],
        correctOptionIndex: 1,
        explanation: 'Softmax exponentiates and normalizes outputs into valid probability scores for multi-class prediction.',
        skill: 'Deep Learning & PyTorch',
        difficulty: 'intermediate'
      },
      {
        id: 'ai-10',
        question: 'What is Vector Embedding in AI systems?',
        options: [
          'A graphic image format used for web buttons.',
          'A dense numerical vector representation of text/data in high-dimensional space capturing semantic similarity.',
          'A hardware chip inside GPUs.',
          'A method for encrypting database passwords.'
        ],
        correctOptionIndex: 1,
        explanation: 'Embeddings map words/documents into mathematical vector spaces where semantically similar concepts lie close together.',
        skill: 'NLP & Large Language Models',
        difficulty: 'intermediate'
      }
    ]
  },

  'data-analyst': {
    id: 'asm-data-analyst',
    courseCategoryId: 'data-analyst',
    title: 'Data Analyst & BI Specialist Skill Assessment',
    skillCategory: 'Data Analytics & Business Intelligence',
    description: 'Benchmark skills in SQL window functions, statistical inference, data visualization principles, business KPI metrics, and dashboard architecture.',
    durationMinutes: 15,
    totalQuestions: 10,
    passingScore: 60,
    badge: 'Data & BI Specialist',
    skillsCovered: ['SQL & Queries', 'Data Analysis', 'Statistics & Probability', 'Data Visualization', 'Business Intelligence'],
    difficulty: 'Intermediate',
    questions: [
      {
        id: 'da-1',
        question: 'In SQL, what is the purpose of Window Functions like `ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC)`?',
        codeSnippet: `SELECT 
  employee_id, department, salary,
  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as rank
FROM employees;`,
        options: [
          'To filter rows out of the query result set.',
          'To calculate row rankings across subset partitions without collapsing individual rows into a single GROUP BY summary row.',
          'To create a new physical SQL table on disk.',
          'To lock database rows against updates.'
        ],
        correctOptionIndex: 1,
        explanation: 'Window functions perform calculations across related row partitions while preserving full individual row granularity.',
        skill: 'SQL & Queries',
        difficulty: 'intermediate'
      },
      {
        id: 'da-2',
        question: 'What does a P-value less than 0.05 signify in statistical hypothesis testing?',
        options: [
          'The sample size is too small to draw conclusions.',
          'There is strong evidence to reject the Null Hypothesis in favor of the Alternative Hypothesis (statistically significant).',
          'The data contains 5% error margin.',
          'The experiment failed and must be restarted.'
        ],
        correctOptionIndex: 1,
        explanation: 'A p-value < 0.05 indicates less than 5% probability that observed results occurred by random chance under the null hypothesis.',
        skill: 'Statistics & Probability',
        difficulty: 'intermediate'
      },
      {
        id: 'da-3',
        question: 'Which chart type is most appropriate for displaying the distribution and identifying outliers in a continuous numerical variable (e.g. salary levels)?',
        options: [
          'Pie Chart',
          'Box Plot (Box-and-Whisker) or Histogram',
          'Gauge Chart',
          'Donut Chart'
        ],
        correctOptionIndex: 1,
        explanation: 'Box plots display median, quartiles, and outliers clearly; histograms show frequency distributions.',
        skill: 'Data Visualization',
        difficulty: 'beginner'
      },
      {
        id: 'da-4',
        question: 'In Business Intelligence, what is Customer Churn Rate and how is it calculated?',
        options: [
          'Percentage of new customers acquired per month.',
          'Percentage of existing customers who cancel or stop using a service during a given time period `(Lost Customers / Starting Customers) * 100`.',
          'Total revenue generated divided by employee count.',
          'Average session time spent on website.'
        ],
        correctOptionIndex: 1,
        explanation: 'Churn measures customer attrition rate, critical for calculating Customer Lifetime Value (LTV).',
        skill: 'Business Intelligence',
        difficulty: 'beginner'
      },
      {
        id: 'da-5',
        question: 'In SQL, what is the difference between `UNION` and `UNION ALL` when combining two query results?',
        options: [
          '`UNION` keeps duplicate rows; `UNION ALL` removes duplicate rows.',
          '`UNION` removes duplicate rows from the combined result set; `UNION ALL` preserves all rows including duplicates (faster).',
          '`UNION` only works on numbers; `UNION ALL` works on text.',
          'There is no difference in functionality.'
        ],
        correctOptionIndex: 1,
        explanation: '`UNION` performs duplicate elimination which incurs sorting overhead; `UNION ALL` simply concatenates result sets.',
        skill: 'SQL & Queries',
        difficulty: 'beginner'
      },
      {
        id: 'da-6',
        question: 'What is Cohort Analysis in product analytics?',
        options: [
          'Comparing overall company revenue year-over-year.',
          'Tracking the behavior and retention metrics of a specific group of users who share a common characteristic (e.g., signup month) over time.',
          'Testing server latency across geographical regions.',
          'Sorting database tables alphabetically.'
        ],
        correctOptionIndex: 1,
        explanation: 'Cohort analysis isolates groups over time to evaluate retention, feature adoption, and churn patterns.',
        skill: 'Data Analysis',
        difficulty: 'intermediate'
      },
      {
        id: 'da-7',
        question: 'Which statistical metric measures the strength and direction of a linear relationship between two continuous variables?',
        options: [
          'Standard Deviation',
          'Pearson Correlation Coefficient (r)',
          'Variance',
          'Median Absolute Deviation'
        ],
        correctOptionIndex: 1,
        explanation: 'Pearson r ranges from -1 (perfect negative correlation) to +1 (perfect positive correlation).',
        skill: 'Statistics & Probability',
        difficulty: 'beginner'
      },
      {
        id: 'da-8',
        question: 'What is a Star Schema in Data Warehousing and Business Intelligence design?',
        options: [
          'A database table with five columns.',
          'A data model featuring a central Fact table containing numeric metrics surrounded by normalized/denormalized Dimension tables.',
          'A network topology connecting servers.',
          'A security protocol for user passwords.'
        ],
        correctOptionIndex: 1,
        explanation: 'Star Schema simplifies analytical queries and improves BI dashboard aggregation performance.',
        skill: 'Business Intelligence',
        difficulty: 'intermediate'
      },
      {
        id: 'da-9',
        question: 'In Python Pandas, what is the output of df.groupby("category")["sales"].sum()?',
        options: [
          'Deletes the sales column.',
          'Groups rows by category and calculates the total sum of sales for each category.',
          'Returns the average sales across the entire dataset.',
          'Sorts rows by category name.'
        ],
        correctOptionIndex: 1,
        explanation: 'Groupby performs split-apply-combine aggregation summarizing values per category group.',
        skill: 'Data Analysis',
        difficulty: 'beginner'
      },
      {
        id: 'da-10',
        question: 'Why are Pie Charts generally discouraged in executive BI dashboards when comparing more than 5 categories?',
        options: [
          'Pie charts consume too much GPU memory.',
          'Human eyes struggle to accurately compare area angles of multiple slices, making Bar Charts far superior for quick quantitative comparison.',
          'Pie charts do not support colors.',
          'Pie charts cannot be exported to PDF.'
        ],
        correctOptionIndex: 1,
        explanation: 'Bar charts provide a common baseline alignment making precise visual magnitude comparison effortless.',
        skill: 'Data Visualization',
        difficulty: 'beginner'
      }
    ]
  }
};
