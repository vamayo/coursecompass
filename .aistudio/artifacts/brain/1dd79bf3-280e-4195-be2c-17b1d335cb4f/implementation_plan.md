# CourseCompass: Personalized College Course Recommendation & AI Academic Advisor

CourseCompass is an intelligent, institution-agnostic course discovery and academic advising platform designed for college students. Moving beyond mechanical calendar schedule-builders, CourseCompass matches student intellectual passions, career ambitions, and work-style preferences with structured degree requirements and high-value electives. The platform launches with Indiana University Bloomington as its premier flagship campus, engineered on a multi-institution architecture that allows students to explore and adapt course pathways across higher-education institutions.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following product decisions incorporate user feedback and guide the implementation:

- **Platform Brand Identity**: **CourseCompass** (School-agnostic brand identity, replacing the IU-specific "HoosierPath" moniker).
- **Flagship Campus Launch**: Indiana University Bloomington is the active flagship institution, featuring authentic school programs and catalog data:
  - **Luddy School of Informatics, Computing, and Engineering**: Computer Science (B.S.), Informatics (B.S.)
  - **Kelley School of Business**: Finance (B.S.), Marketing (B.S.)
  - **College of Arts and Sciences**: Psychology (B.S. / B.A.)
  - General Education & Cross-School Interdisciplinary Pathways
- **Campus Selector Architecture**: Institutional switcher in the top navigation allowing quick preview of upcoming campus catalogs (e.g., Purdue University, University of Illinois Urbana-Champaign, University of Michigan) with Indiana University Bloomington pre-configured and active.
- **Student Interest Profiling**: Multi-dimensional onboarding capturing intellectual curiosities, target career roles, learning format preferences (hands-on projects vs. exams), and skill acquisition tags.
- **AI Academic Advisor**: Context-aware advisor powered by `@google/genai` (`gemini-3.8-flash`), analyzing degree completion requirements, prerequisite readiness, workload distribution, and career relevance.

---

### 1. Overview & Core Concept

- **What It Does**: Bridges the gap between what students are passionate about and what they need to graduate. By analyzing student curiosity profiles, career ambitions, and active degree audits, CourseCompass surfaces courses students will find genuinely meaningful, discovers hidden-gem electives, and flags prerequisite bottlenecks.
- **Target Audience / Persona**:
  - *Undergraduates & Declared Majors*: Seeking electives and upper-level tracks aligned with industry aspirations.
  - *Double Majors & Minors*: Managing cross-college requirement intersections without advisor delays.
  - *Exploring & Undeclared Undergrads*: Discovering high-satisfaction introductory courses that fulfill general education foundations.
- **Key Value**: Emphasizes *course fit and intellectual discovery* rather than just time-slot fitting. Answers: *"What classes will give me the skills I want, fit my study style, and advance my degree?"*

---

### 2. User Experience & Visual Design

#### Key User Flows

1. **Campus Selection & Student Interest Studio**:
   - Campus switcher displays active institution (Indiana University Bloomington) with quick access to institutional metadata.
   - Interactive profile builder:
     - *Academic Standing*: Major, minor, year (Freshman through Senior), completed course checklist.
     - *Career Aspirations*: e.g., AI/ML Product Manager, Quantitative Analyst, UX Researcher, Healthcare Data Scientist.
     - *Intellectual Themes*: e.g., Ethical Tech, Behavioral Economics, Cognitive Systems, Cloud Infrastructure.
     - *Learning Preferences*: Project-based vs. exam-heavy, code-intensive vs. discussion seminar, writing load.
2. **Personalized Course Recommendation Engine**:
   - Scored recommendations dynamically weighted by the student's interest profile and degree audit status.
   - Course cards present clean, unboxed metadata and explicit match rationales:
     - *"Fulfills Luddy Upper-Level Track B while building full-stack prototyping skills for your Product Management goal."*
   - Interactive filtering by school/department, requirement category, difficulty level, and semester offering.
3. **Interactive Degree Audit & Requirement Tracker**:
   - Visual breakdown of degree plan categories (Foundations, Major Core, Specialization Tracks, General Education, Upper-Level Electives).
   - Real-time credit completion tally with 1-click discovery: clicking any unfulfilled requirement category instantly filters catalog recommendations to matching courses.
4. **Contextual AI Academic Advisor (Persistent Chat Drawer & Full-Page View)**:
   - Full-context conversation: the advisor automatically knows the student's major, completed coursework, interests, and target graduation timeline.
   - Quick-prompt suggestions: *"Find an elective with high student ratings that teaches cloud architecture"*, *"What classes best prepare me for product design interviews?"*, *"Review my planned semester workload for burnout risk"*.
   - Assistant responses embed interactive course cards that can be added to the student's plan with a single click.
5. **Multi-Semester Course Planner Workbench**:
   - Organize bookmarked and recommended courses across upcoming terms (e.g., Fall 2026, Spring 2027, Fall 2027).
   - Live workload meter calculating total credits, technical intensity, and prerequisite validation warnings.

#### Visual Identity & Theme

- **Aesthetic Direction**: Modern academic editorial platform. Professional, crisp, and collegiate with high typographic dignity.
- **Color Palette & Discipline (60-30-10 Rule)**:
  - **60% Dominant Canvas**: Clean off-white linen (`#FAFAF8` light mode, `#0E131F` dark mode).
  - **30% Structural Surfaces**: Pure white (`#FFFFFF`) / deep midnight surfaces (`#161E2E`), hairline neutral borders (`#E5E5E3` / `#232E42`), and high-contrast slate typography.
  - **10% Accent System**: Deep academic crimson accent (`#990000` / `#A31D1D`) with subtle cream highlights (`#F5F5F0`) reflecting the flagship Indiana University heritage, complemented by accessible emerald (`#059669`) and amber (`#D97706`) requirement statuses.
- **Typography**:
  - *Headings & Display*: `Plus Jakarta Sans` with confident, modern structural proportions.
  - *Body & Syllabus Content*: `Plus Jakarta Sans` / `DM Sans` for comfortable reading across course syllabi.
  - *Course Codes & Data*: Tabular numerals (`font-mono tabular-nums`) for course identifiers (`CSCI-B 351`, `BUS-F 303`, `INFO-I 300`) and credit counts.
- **Zero-Pill Discipline**:
  - Unboxed inline metadata separated by subtle middots (`CSCI-B 351 · 3 Credits · Luddy School · Spring 2027 · Prereq: CSCI-C 212`).
  - No decorative pulsing dots, no fake system latency tags, and no nested cards within cards.

---

### 3. Key Product Decisions & Trade-Offs

#### Decision 1: School-Agnostic Core with Indiana University Flagship Data
- **Chosen Approach**: Establish a generic institutional schema (`University`, `School`, `DegreePlan`, `CourseCatalog`) and launch with comprehensive Indiana University Bloomington data (Luddy, Kelley, and College of Arts & Sciences) while providing an intuitive campus switcher showcasing multi-campus expansion.
- **Why**: Fulfills the user's directive to keep the product brand non-specific to one school while delivering complete, high-fidelity IU course and degree logic on day one.
- **Alternatives Considered**: Keeping IU in the brand name ("HoosierPath") would limit future adoption and violate user feedback.

#### Decision 2: Full-Stack Express Server with `@google/genai`
- **Chosen Approach**: Node.js/Express server (`server.ts`) hosting secure `/api/advisor/chat` and `/api/advisor/recommend` endpoints using `@google/genai` with `gemini-3.8-flash`.
- **Why**: Keeps API keys strictly server-side, enables grounded prompt engineering with the active degree plan and course catalog, and formats course recommendations with structured JSON.
- **Fallback Resilience**: Deterministic local scoring algorithms ensure that recommendations and filtering continue to function instantly in any network condition.

#### Decision 3: Course Fit & Exploration over Calendar Time-Blocking
- **Chosen Approach**: Prioritize intellectual interest alignment, skill acquisition, workload balance, and degree progress rather than dragging 15-minute time blocks onto a weekly calendar grid.
- **Why**: Addresses the core user problem: students struggle to know *which* courses are right for them, not when the classes occur.

---

### 4. Technical Architecture & Data Strategy

#### System & Component Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Client (React 19 + Vite)                        │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Top Navigation: CourseCompass Wordmark — Campus Selector         │  │
│  │ [IU Bloomington ▼] — Navigation Links — [Saved Plan: X Credits]  │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │                                  │
│  ┌──────────────────────────────────▼───────────────────────────────┐  │
│  │ Active Views:                                                    │  │
│  │  1. Discover: Interest-Ranked Courses with Match Rationales      │  │
│  │  2. Degree Audit: Interactive Requirement Progress               │  │
│  │  3. Interest Studio: Skill Tags, Career Goals & Study Preferences│  │
│  │  4. Academic Advisor: Context-Aware AI Chat & Course Cards       │  │
│  │  5. Course Planner: Term Workload & Prerequisite Validation      │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │                                  │
│             State Store (localStorage Sync + Live State)               │
│               - studentProfile, completedCourses, savedPlan            │
└─────────────────────────────────────┼──────────────────────────────────┘
                                      │ fetch('/api/advisor/*')
                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Server (Express + tsx)                          │
│                                                                        │
│  ┌────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │  /api/advisor/chat     │  │  /api/advisor/recommend              │  │
│  │  Context-Aware Gemini  │  │  JSON-Structured Course Recommendations│ │
│  └───────────┬────────────┘  └──────────────────┬───────────────────┘  │
│              │                                  │                      │
│  ┌───────────▼──────────────────────────────────▼───────────────────┐  │
│  │ @google/genai SDK (gemini-3.8-flash)                             │  │
│  │ System Instruction: University Degree Plan Rules & Course Catalog│  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

#### Core Data Entities

- **`University`**: Id, name, shortName, location, schools (`Luddy`, `Kelley`, `Arts & Sciences`), colors, activeStatus.
- **`Course`**: Id, code (`CSCI-B 351`), title, schoolId, credits, description, prerequisites, interestTags, workloadProfile (coding, writing, exam, project), termAvailability, fulfillsRequirements.
- **`StudentProfile`**: UniversityId, schoolId, majorId, minorId, currentYear, interestTags, careerGoals, preferredLearningStyle, completedCourseIds.
- **`DegreePlan`**: Major title, totalCreditsRequired (120), categories (Foundations, Major Core, Major Electives, GenEd), credit requirements, and eligible course IDs.
- **`SavedPlan`**: Map of semesters (e.g. `Fall 2026`, `Spring 2027`) to selected course IDs with real-time credit summation and prerequisite alerts.

---

### Verification & Testing Plan

1. **Compilation & Linting**:
   - Run `compile_applet` and `lint_applet` together to verify clean TypeScript builds, correct imports, and zero lint errors.
2. **Feature Testing**:
   - Verify that changing interest tags, career goals, or learning style immediately recalculates match scores.
   - Verify seamless switching between majors (Luddy CS, Informatics, Kelley Marketing, Kelley Finance, Psychology) with updated degree audit views.
   - Test AI Advisor chat responses with real course suggestions and interactive course card embeds.
   - Test adding/removing courses in the Semester Planner and confirm prerequisite warnings and credit totals.
3. **Design & Brand Verification**:
   - Verify school-agnostic brand identity ("CourseCompass") in the top bar, with Indiana University Bloomington prominently featured as the active campus.
   - Verify zero-pill metadata formatting, accessible contrast, and smooth responsive layout.
