const fs = require('fs');
const PDFDocument = require('pdfkit');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 45, bottom: 45, left: 45, right: 45 },
  bufferPages: true
});

const outputPath = 'Smart_Medication_Adherence_Viva_Guide.pdf';
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Color Palette
const COLORS = {
  primary: '#2E5A36',     // Deep Sage Green
  secondary: '#4A6B53',   // Medium Sage
  accent: '#A65B71',      // Rose / Coral
  darkText: '#1E293B',    // Slate Dark
  bodyText: '#334155',    // Slate Body
  mutedText: '#64748B',   // Muted Gray
  lightBg: '#F8FAFC',     // Light Background
  boxBg: '#F1F5F9',       // Box Background
  greenLight: '#DCFCE7',  // Soft Green Box
  greenBorder: '#16A34A', // Green Border
  borderColor: '#CBD5E1'  // Table Border
};

// Helper: Section Header
function addSectionHeader(title, subtitle) {
  doc.moveDown(0.8);
  doc.rect(45, doc.y, 505, 26).fill(COLORS.primary);
  doc.fillColor('#FFFFFF')
     .font('Helvetica-Bold')
     .fontSize(13)
     .text(title.toUpperCase(), 55, doc.y - 20, { width: 485 });
  doc.moveDown(0.6);
  if (subtitle) {
    doc.fillColor(COLORS.mutedText)
       .font('Helvetica-Oblique')
       .fontSize(9.5)
       .text(subtitle, 45, doc.y, { width: 505 });
    doc.moveDown(0.4);
  }
}

// Helper: Subheader
function addSubHeader(title) {
  doc.moveDown(0.5);
  doc.fillColor(COLORS.secondary)
     .font('Helvetica-Bold')
     .fontSize(11)
     .text(title, 45, doc.y);
  doc.moveDown(0.2);
}

// Helper: Paragraph
function addParagraph(text) {
  doc.fillColor(COLORS.bodyText)
     .font('Helvetica')
     .fontSize(9.5)
     .text(text, 45, doc.y, { width: 505, lineGap: 2.5 });
  doc.moveDown(0.4);
}

// Helper: Callout Box
function addCallout(text, title, type = 'info') {
  const boxY = doc.y;
  const padding = 10;
  const boxWidth = 505;
  
  doc.font('Helvetica').fontSize(9);
  const textHeight = doc.heightOfString(text, { width: boxWidth - 25 });
  const totalHeight = textHeight + (title ? 24 : 16);

  const bgColor = type === 'success' ? '#F0FDF4' : COLORS.lightBg;
  const borderColor = type === 'success' ? COLORS.greenBorder : COLORS.secondary;

  doc.rect(45, boxY, boxWidth, totalHeight).fillAndStroke(bgColor, borderColor);
  doc.rect(45, boxY, 4, totalHeight).fill(borderColor);

  let currentY = boxY + 8;
  if (title) {
    doc.fillColor(borderColor)
       .font('Helvetica-Bold')
       .fontSize(9.5)
       .text(title, 58, currentY);
    currentY += 14;
  }

  doc.fillColor(COLORS.darkText)
     .font('Helvetica')
     .fontSize(8.5)
     .text(text, 58, currentY, { width: boxWidth - 25, lineGap: 2 });

  doc.y = boxY + totalHeight + 8;
}

// Helper: Bullet point
function addBullet(label, text) {
  doc.fillColor(COLORS.primary).font('Helvetica-Bold').fontSize(9).text('• ', 48, doc.y, { continued: true });
  doc.fillColor(COLORS.darkText).font('Helvetica-Bold').fontSize(9).text(label + ': ', { continued: true });
  doc.fillColor(COLORS.bodyText).font('Helvetica').fontSize(9).text(text, { lineGap: 1.5 });
  doc.moveDown(0.2);
}

// ================= COVER PAGE =================
doc.rect(35, 35, 525, 750).stroke(COLORS.primary);
doc.rect(38, 38, 519, 744).stroke(COLORS.secondary);

doc.moveDown(2.5);
doc.fillColor(COLORS.primary)
   .font('Helvetica-Bold')
   .fontSize(22)
   .text('ELOWEN HEALTHCARE PLATFORM', { align: 'center' });

doc.moveDown(0.4);
doc.fillColor(COLORS.secondary)
   .font('Helvetica-Bold')
   .fontSize(15)
   .text('Smart Medication Adherence Dashboard', { align: 'center' });

doc.moveDown(0.3);
doc.fillColor(COLORS.mutedText)
   .font('Helvetica')
   .fontSize(10.5)
   .text('Comprehensive Technical Viva Voce & Project Defense Guide', { align: 'center' });

doc.moveDown(2);

// Summary Table on Cover
const specs = [
  ['System Architecture', 'Decoupled Client-Server SPA with RESTful API & Stateless JWT'],
  ['Backend Technology', 'Java 17 LTS, Spring Boot 3.2.5, Spring Security 6, Spring Data JPA'],
  ['Frontend Technology', 'React 19, TypeScript 5.7, Tailwind CSS v4, Vite 8 Development Server'],
  ['Database Engine', 'H2 Relational Database with Persistent File Storage (./data/adherence_db)'],
  ['ORM / Mapping', 'Hibernate 6.4 with Auto DDL schema generation'],
  ['Authentication', 'HMAC-SHA256 Signed JSON Web Tokens (JJWT 0.12.5) with BCrypt'],
  ['Application Server', 'Embedded Apache Tomcat 10.1 (Built into Spring Boot executable JAR)'],
  ['Core Innovation', 'NLP Heuristic Scheduler, Auto Pill Decrement & 30-Day Adherence Analytics']
];

let tableY = doc.y;
specs.forEach(([col1, col2], idx) => {
  const rowHeight = 26;
  const isEven = idx % 2 === 0;
  doc.rect(55, tableY, 485, rowHeight).fill(isEven ? '#F8FAFC' : '#FFFFFF');
  doc.rect(55, tableY, 485, rowHeight).stroke(COLORS.borderColor);

  doc.fillColor(COLORS.primary)
     .font('Helvetica-Bold')
     .fontSize(8.5)
     .text(col1, 65, tableY + 8, { width: 140 });

  doc.fillColor(COLORS.bodyText)
     .font('Helvetica')
     .fontSize(8.5)
     .text(col2, 215, tableY + 8, { width: 315 });

  tableY += rowHeight;
});

doc.y = tableY + 20;

addCallout(
  'This document covers all theoretical and practical concepts required for project examination: architectural design patterns, authentication mechanics, relational database schemas, algorithm formulation, REST endpoints, and answers to the top 25 viva questions.',
  'VIVA EXAMINATION PURPOSE & SCOPE',
  'success'
);

doc.moveDown(2);
doc.fillColor(COLORS.mutedText)
   .font('Helvetica')
   .fontSize(8.5)
   .text('Generated for Academic Defense & Project Evaluation • Confidential & Academic Use', { align: 'center' });

// ================= PAGE 2: PROJECT OVERVIEW & ARCHITECTURE =================
doc.addPage();

addSectionHeader('1. Project Overview & Clinical Problem Statement');

addSubHeader('1.1 The Clinical Challenge (Medication Non-Adherence)');
addParagraph(
  'According to World Health Organization (WHO) statistics, over 50% of patients with chronic diseases (such as hypertension, diabetes, and cardiovascular disorders) fail to take their prescribed medicines correctly. Non-adherence leads to severe clinical complications, preventable emergency hospitalizations, and over $100 billion in avoidable healthcare expenditures annually.'
);

addSubHeader('1.2 The Elowen Solution');
addParagraph(
  'Elowen is a modern full-stack medication management platform combining empathetic patient UX with clinical rigor. It empowers patients to maintain healthy routines while providing caregivers and clinicians with transparent adherence data.'
);

addBullet('Interactive Daily Schedule', 'Live dose confirmation with state management (Upcoming, Due Soon, Taken, Snoozed, Missed).');
addBullet('Automated Inventory Decrement', 'Marking a dose as "Taken" automatically deducts remaining pills and triggers dynamic refill date predictions.');
addBullet('Real-Time Clinical Scoring', 'Calculates 30-day sliding adherence metrics and consecutive streak days.');
addBullet('Natural Language Processing (NLP)', 'Allows patients to schedule routines via plain English sentences (e.g. "Take Metformin with dinner every weekday at 7:30 PM").');
addBullet('Consent-Based Care Circle', 'Enables family members and healthcare providers to monitor patient consistency based on permission tiers.');

addSectionHeader('2. Full-Stack System Architecture');
addParagraph(
  'The platform is built on a 3-Tier Layered Architecture with strict decoupling between the Presentation Tier, Application Business Logic Tier, and Data Persistence Tier.'
);

// Architecture Diagram Representation
const archY = doc.y;
doc.rect(45, archY, 505, 130).fillAndStroke('#F8FAFC', COLORS.borderColor);
doc.fillColor(COLORS.primary).font('Helvetica-Bold').fontSize(10).text('SYSTEM ARCHITECTURE & DATA FLOW', 55, archY + 8);

// Layer 1
doc.rect(60, archY + 26, 475, 26).fillAndStroke('#E0F2FE', '#0284C7');
doc.fillColor('#0369A1').font('Helvetica-Bold').fontSize(8.5)
   .text('1. PRESENTATION LAYER (React 19 + TypeScript + Tailwind CSS on Port 8443 / 5173)', 70, archY + 34);

// Arrow 1
doc.fillColor(COLORS.mutedText).font('Helvetica').fontSize(7.5)
   .text('HTTP REST API calls • JSON Payloads • Authorization: Bearer <JWT Token>', 150, archY + 54);

// Layer 2
doc.rect(60, archY + 64, 475, 26).fillAndStroke('#DCFCE7', '#16A34A');
doc.fillColor('#15803D').font('Helvetica-Bold').fontSize(8.5)
   .text('2. BUSINESS LOGIC LAYER (Spring Boot 3 + Spring Security + Embedded Tomcat on Port 8080)', 70, archY + 72);

// Arrow 2
doc.fillColor(COLORS.mutedText).font('Helvetica').fontSize(7.5)
   .text('Spring Data JPA • Hibernate ORM Dialect • JDBC Connection Pooling (HikariCP)', 150, archY + 92);

// Layer 3
doc.rect(60, archY + 102, 475, 20).fillAndStroke('#FEF3C7', '#D97706');
doc.fillColor('#B45309').font('Helvetica-Bold').fontSize(8.5)
   .text('3. DATA PERSISTENCE LAYER (H2 Relational Database: ./data/adherence_db)', 70, archY + 107);

doc.y = archY + 140;

// ================= PAGE 3: SECURITY, FLOW & NLP =================
doc.addPage();

addSectionHeader('3. Authentication, Security & NLP Engine');

addSubHeader('3.1 Stateless JWT Authentication Mechanics');
addParagraph(
  'Authentication is implemented without server-side HTTP sessions. When a patient logs in (POST /api/auth/login), Spring Security verifies credentials using BCrypt. Upon success, JJWT generates a digitally signed token using HMAC-SHA256 containing userId, email subject, and a 24-hour expiration timestamp.'
);
addParagraph(
  'For every subsequent request, the frontend sends the token in the Authorization header. Spring Security’s JwtAuthenticationFilter intercepts the request, verifies signature integrity, extracts user details, and injects an authenticated principal into the SecurityContextHolder.'
);

addSubHeader('3.2 Dose Confirmation & Inventory Transaction Cycle');
addParagraph(
  'When a user clicks "Take now", an ACID transaction executes in DoseService (@Transactional):'
);
addBullet('Step 1', 'Searches for existing today’s log or instantiates a new DoseLog with status = "Taken".');
addBullet('Step 2', 'Fetches the associated Medication entity and decrements remaining pillCount by 1.');
addBullet('Step 3', 'Commits the transaction to physical storage in the H2 database.');
addBullet('Step 4', 'React receives 200 OK, updates dose badges, and triggers a live recalculation of the 30-day adherence rate.');

addSubHeader('3.3 Natural Language Processing (NLP) Heuristic Engine');
addParagraph(
  'Unlike third-party cloud AI APIs that introduce latency and API subscription costs, Elowen includes an internal heuristic NLP scheduling parser in ScheduleService.java:'
);
addBullet('Entity Extraction', 'Uses compiled regex patterns to extract explicit times (e.g. "7:30 PM", "8am") and maps meal/lifestyle keywords ("breakfast" -> 8:00 AM, "lunch" -> 1:00 PM, "dinner" -> 7:30 PM).');
addBullet('Frequency Tagging', 'Identifies routine frequencies such as "weekdays", "weekends", "daily", or "twice daily".');
addBullet('Medication Matching', 'Cross-references tokens against registered medicines in the database and automatically inserts a new active routine.');

addSubHeader('3.4 Adherence Calculation Formula');
addCallout(
  'Adherence Rate (%) = [ Total Doses Taken / (Total Taken + Total Missed + Total Skipped) ] * 100\n\nCurrent Streak = Consecutive daily sequence where no scheduled dose is in "MISSED" status.\nRefill Prediction = Today + (Remaining Pills / Daily Dose Frequency) Days.',
  'Mathematical Formulation',
  'info'
);

// ================= PAGE 4: DATABASE SCHEMA & REST APIS =================
doc.addPage();

addSectionHeader('4. Database Schema & REST API Specifications');

addSubHeader('4.1 Relational Database Schema (H2 Persistent Engine)');

const schemaTables = [
  ['USERS', 'id (PK), email (UNIQUE), password (BCrypt hash), name, timezone, push_notifs, email_reports, caregiver_alerts'],
  ['MEDICATIONS', 'id (PK), user_id (FK), name, dosage, detail, pill_count, total_capacity, color, icon, schedule_time, refill_date'],
  ['DOSE_LOGS', 'id (PK), user_id (FK), medication_id (FK), medication_name, scheduled_time, dose_date, status, notes, logged_at'],
  ['SCHEDULES', 'id (PK), user_id (FK), title, frequency, time_str, medication_name, active'],
  ['CARE_CIRCLE', 'id (PK), user_id (FK), name, relationship, status (Active/Pending), email, phone']
];

let dbY = doc.y;
schemaTables.forEach(([tName, cols]) => {
  doc.rect(45, dbY, 110, 22).fillAndStroke(COLORS.primary, COLORS.borderColor);
  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(8.5).text(tName, 52, dbY + 6);

  doc.rect(155, dbY, 395, 22).fillAndStroke('#FFFFFF', COLORS.borderColor);
  doc.fillColor(COLORS.darkText).font('Helvetica').fontSize(7.8).text(cols, 162, dbY + 6, { width: 380 });
  dbY += 23;
});

doc.y = dbY + 12;

addSubHeader('4.2 Core REST API Endpoint Reference');

const apiEndpoints = [
  ['POST', '/api/auth/login', 'Authenticates email & password; returns JWT token & UserDto profile.'],
  ['POST', '/api/auth/register', 'Creates new user account with BCrypt password hashing.'],
  ['POST', '/api/auth/google', 'One-click instant authentication for demo evaluation.'],
  ['GET', '/api/dashboard/overview', 'Aggregated live metrics: adherence %, streak, today doses, trend chart, stock.'],
  ['GET/POST', '/api/medications', 'List user medications or register a new medicine with pill inventory.'],
  ['DELETE', '/api/medications/{id}', 'Removes medication and cascade-cleans associated references.'],
  ['POST', '/api/doses/action', 'Records dose (TAKEN/SNOOZED/MISSED) and auto-decrements stock.'],
  ['GET', '/api/doses/history', 'Full historical dose log for CSV audit export.'],
  ['POST', '/api/schedules/natural-language', 'Submits sentence prompt to NLP engine; outputs created schedule.'],
  ['GET/POST', '/api/care-circle', 'Manages caregivers, clinician contacts, and permission levels.'],
  ['PUT', '/api/user/profile', 'Updates patient name, email, or preferred timezone.'],
  ['PUT', '/api/user/notifications', 'Persists notification toggles (Push, Email, Caregiver).']
];

let apiY = doc.y;
apiEndpoints.forEach(([verb, path, desc]) => {
  const vColor = verb === 'POST' ? '#16A34A' : verb === 'GET' ? '#0284C7' : verb === 'PUT' ? '#D97706' : '#DC2626';
  doc.rect(45, apiY, 50, 18).fill(vColor);
  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(7.5).text(verb, 48, apiY + 5, { align: 'center', width: 44 });

  doc.rect(95, apiY, 180, 18).fillAndStroke('#F1F5F9', COLORS.borderColor);
  doc.fillColor(COLORS.darkText).font('Helvetica-Bold').fontSize(7.5).text(path, 100, apiY + 5);

  doc.rect(275, apiY, 275, 18).fillAndStroke('#FFFFFF', COLORS.borderColor);
  doc.fillColor(COLORS.bodyText).font('Helvetica').fontSize(7.5).text(desc, 280, apiY + 4, { width: 265 });

  apiY += 19;
});

doc.y = apiY + 15;

// ================= PAGE 5: VIVA QUESTIONS (PART 1) =================
doc.addPage();

addSectionHeader('5. Top 25 Viva Questions & Model Answers (Part 1)');

const qasPart1 = [
  [
    'Q1: Why choose Spring Boot over traditional Java EE Servlets or Spring MVC?',
    'Spring Boot eliminates XML and manual deployment descriptors (web.xml). It offers opinionated starter dependencies (spring-boot-starter-web, spring-boot-starter-data-jpa) and bundles an embedded Apache Tomcat server directly into an executable JAR. This provides rapid deployment and reproducible execution.'
  ],
  [
    'Q2: How does the application implement stateless authentication?',
    'The server maintains zero session state in memory. Upon login, JJWT issues a cryptographically signed HMAC-SHA256 token containing identity claims and expiration. Clients include this token in the "Authorization: Bearer <token>" header. JwtAuthenticationFilter validates the cryptographic signature on every HTTP request.'
  ],
  [
    'Q3: Why use BCrypt for password hashing instead of MD5 or SHA-256?',
    'MD5 and SHA-256 are fast general-purpose hash algorithms, making them vulnerable to rainbow table attacks and GPU-accelerated brute force. BCrypt incorporates automatic salt generation and a configurable cost factor (work factor 10), requiring significant CPU time per attempt to thwart dictionary attacks.'
  ],
  [
    'Q4: Is the H2 database running in-memory or on disk? How is persistence guaranteed?',
    'It is configured in file-persistent mode: "jdbc:h2:file:./data/adherence_db;DB_CLOSE_DELAY=-1". Unlike in-memory H2 (jdbc:h2:mem:...) which wipes data when the JVM terminates, file-based H2 persists all tables, patient records, and dose logs onto physical disk storage.'
  ],
  [
    'Q5: How does the frontend communicate with the backend during development? What is CORS?',
    'React runs on Vite (port 8443) while Spring Boot runs on port 8080. Browsers enforce the Same-Origin Policy (SOP). We enabled Cross-Origin Resource Sharing (CORS) in Spring Security via a CorsConfigurationSource bean and added a Vite proxy in vite.config.ts routing /api requests directly to localhost:8080.'
  ],
  [
    'Q6: What happens under the hood when a patient marks a dose as "Taken"?',
    'A POST request hits /api/doses/action. Spring’s DoseService runs inside a @Transactional boundary: it updates/creates a DoseLog entry with status "Taken", fetches the Medication entity, decrements its remaining pillCount by 1, and commits the transaction. The UI immediately recalculates KPIs and streak metrics.'
  ]
];

qasPart1.forEach(([q, a]) => {
  doc.fillColor(COLORS.primary).font('Helvetica-Bold').fontSize(9.5).text(q, 45, doc.y);
  doc.moveDown(0.2);
  doc.fillColor(COLORS.bodyText).font('Helvetica').fontSize(8.5).text(a, 45, doc.y, { width: 505, lineGap: 1.5 });
  doc.moveDown(0.6);
});

// ================= PAGE 6: VIVA QUESTIONS (PART 2) =================
doc.addPage();

addSectionHeader('6. Top 25 Viva Questions & Model Answers (Part 2)');

const qasPart2 = [
  [
    'Q7: How does the Natural Language Processing (NLP) scheduler operate?',
    'The NLP engine in ScheduleService.java uses regex pattern matching and semantic dictionaries. It scans for explicit times ("8:00 AM", "7:30 PM") and time-of-day phrases ("morning", "lunch", "dinner"). It then detects recurrence frequencies ("weekdays", "daily") and matches medicine names against the user’s database inventory.'
  ],
  [
    'Q8: What is the distinction between JPA and Hibernate?',
    'JPA (Jakarta Persistence) is a standardized Java specification that defines interfaces and annotations (@Entity, @Id, @ManyToOne). Hibernate is the actual Object-Relational Mapping (ORM) provider that implements the JPA specification and handles raw SQL translation and JDBC connections.'
  ],
  [
    'Q9: What architectural design patterns are utilized in this project?',
    '1) Controller-Service-Repository Pattern: Strict 3-tier layering.\n2) DTO (Data Transfer Object) Pattern: Decouples DB entities from REST payloads.\n3) Interceptor/Filter Pattern: JwtAuthenticationFilter intercepts requests before controllers.\n4) Dependency Injection (IoC): Managed by Spring ApplicationContext.\n5) Singleton Pattern: Spring beans are singletons by default.'
  ],
  [
    'Q10: How does Spring Data JPA execute queries without explicit SQL implementations?',
    'Spring Data JPA uses dynamic proxy generation at startup. When declaring repository interfaces extending JpaRepository, Spring inspects method names (such as findByEmail or countByUserIdAndStatus) and generates the corresponding JPQL/SQL queries automatically.'
  ],
  [
    'Q11: What is the function of the DataInitializer class?',
    'DataInitializer implements Spring Boot’s CommandLineRunner interface. When the app boots, if the database is empty, it automatically populates demo patient accounts, medications, schedules, and 30 days of dose history so the dashboard displays live analytics immediately.'
  ],
  [
    'Q12: How does the frontend handle token storage and security?',
    'JWT tokens and sanitized user profile objects are stored in the browser’s localStorage. On every protected API call, the api.ts client attaches the token to the Authorization header. On HTTP 401 unauthorized errors, stored tokens are cleared and the user is redirected to the login view.'
  ]
];

qasPart2.forEach(([q, a]) => {
  doc.fillColor(COLORS.primary).font('Helvetica-Bold').fontSize(9.5).text(q, 45, doc.y);
  doc.moveDown(0.2);
  doc.fillColor(COLORS.bodyText).font('Helvetica').fontSize(8.5).text(a, 45, doc.y, { width: 505, lineGap: 1.5 });
  doc.moveDown(0.6);
});

// ================= PAGE 7: VIVA QUESTIONS (PART 3) & DEFENSE STRATEGY =================
doc.addPage();

addSectionHeader('7. Advanced Viva Questions & Production Scaling');

const qasPart3 = [
  [
    'Q13: How would you scale this application for enterprise healthcare production (1M+ users)?',
    '1) Database: Migrate from H2 to PostgreSQL/MySQL with read-replicas.\n2) Caching: Deploy Redis to cache dashboard metrics and user profiles.\n3) Connection Pooling: Fine-tune HikariCP parameters for high concurrency.\n4) Asynchronous Messaging: Use RabbitMQ/Apache Kafka to trigger SMS/Email caregiver alerts.\n5) Deployment: Package as Docker containers deployed on Kubernetes (EKS/GKE).'
  ],
  [
    'Q14: How does Spring Security protect against CSRF attacks in this application?',
    'Cross-Site Request Forgery (CSRF) relies on ambient credentials (browser cookies sent automatically). Because our API is completely stateless and uses custom Authorization: Bearer headers stored in localStorage, browsers do not automatically attach credentials, making CSRF protection unnecessary (csrf.disable()).'
  ],
  [
    'Q15: What is the difference between PUT and POST HTTP verbs in your API?',
    'POST is used for creating new resources (e.g. POST /api/medications, POST /api/auth/register). PUT is idempotent and used for updating/replacing existing resources (e.g. PUT /api/user/profile, PUT /api/user/notifications).'
  ]
];

qasPart3.forEach(([q, a]) => {
  doc.fillColor(COLORS.primary).font('Helvetica-Bold').fontSize(9.5).text(q, 45, doc.y);
  doc.moveDown(0.2);
  doc.fillColor(COLORS.bodyText).font('Helvetica').fontSize(8.5).text(a, 45, doc.y, { width: 505, lineGap: 1.5 });
  doc.moveDown(0.5);
});

addSubHeader('7.1 Examiner Defense Strategy (How to Answer During Viva)');
addBullet('Clarity Over Jargon', 'State the "Why" before the "What". For example, explain *why* JWT was used (stateless horizontal scaling) before explaining how it was configured.');
addBullet('Demonstrate Database Persistence', 'If asked whether data is stored in memory, emphasize that H2 is configured in persistent file mode at ./data/adherence_db.');
addBullet('Highlight Full-Stack Cohesion', 'Mention how taking a dose on the React UI sends a REST request to Spring Boot, triggers an ACID transaction in DoseService, decrements inventory, and dynamically refreshes the adherence percentage.');

doc.moveDown(1.5);
doc.rect(45, doc.y, 505, 30).fill(COLORS.boxBg);
doc.fillColor(COLORS.primary)
   .font('Helvetica-Bold')
   .fontSize(9.5)
   .text('PROJECT DEMO CREDENTIALS: alex@example.com / password123 | H2 Console: http://localhost:8080/h2-console', 55, doc.y - 20, { align: 'center', width: 485 });

// Number all pages in footer
const range = doc.bufferedPageRange();
for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  doc.fillColor(COLORS.mutedText)
     .font('Helvetica')
     .fontSize(8)
     .text(
       `Page ${i + 1} of ${range.count} • Elowen Smart Medication Adherence Platform • Technical Viva Guide`,
       45,
       795,
       { align: 'center', width: 505 }
     );
}

doc.end();

stream.on('finish', () => {
  console.log('PDF generation completed successfully: ' + outputPath);
});
