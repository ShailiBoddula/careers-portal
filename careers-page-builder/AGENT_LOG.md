# Engineering & Agent Log

## Project: Multi-Tenant ATS Careers Page Builder
**Engineering Assistance Log & Rationale Documentation**

---

### Log Entry 1: Project Scaffolding & Clean Architecture Setup
- **Date**: 2026-09-05
- **Task**: Initializing directory tree, dependency manifests, and architectural scaffolding.
- **Goal**: Establish strict separation of concerns for FastAPI backend and React + Tailwind frontend, complying with all technology constraints (no Next.js, no TypeScript, no Redux, no external drag-and-drop libraries).
- **AI Contribution**: Synthesized clean project structure (`backend/app/{api, config, database, exceptions, models, schemas, security}`, `frontend/src/{components, context, pages, services}`).
- **Accepted Suggestions**: Modular routing per entity (`auth`, `company`, `careers`, `sections`, `jobs`, `public`).
- **Rejected Suggestions**: Monolithic routing files or combined schema/model declarations.
- **Reasoning**: Ensures testability, isolation, and seamless navigation for future maintainers.

---

### Log Entry 2: Security & Multi-Tenancy Boundary Enforcement
- **Date**: 2026-09-05
- **Task**: Designing authentication and tenant isolation mechanisms.
- **Goal**: Guarantee that authenticated recruiters can never access or modify data belonging to competing companies.
- **AI Contribution**: Generated strict dependency injection helpers (`get_current_user`, `require_recruiter`) that extract identity strictly from signed JWT payloads.
- **Accepted Suggestions**: Strict backend ownership verification:
  ```python
  if entity.company_id != current_user.company_id:
      raise ForbiddenError("Access forbidden: Tenant boundary violated")
  ```
- **Rejected Suggestions**: Trusting tenant ID or company slug sent in request bodies from the client.
- **Testing & Validation**: Verified via pytest test cases (`test_company_profile_isolation`, `test_cross_company_job_manipulation_blocked`, `test_cross_company_section_manipulation_blocked`). All returned `403 Forbidden` as expected.

---

### Log Entry 3: Page Builder UX & Accessible Reordering
- **Date**: 2026-09-05
- **Task**: Implementing the Recruiter Builder interface without third-party drag-and-drop libraries.
- **Goal**: Meet strict constraint avoiding `dnd-kit` or `react-dnd` while maintaining an intuitive, accessible user experience.
- **AI Contribution**: Designed keyboard-accessible Up/Down chevron controls with explicit ARIA labels and live visual updates, backed by an atomic `/api/company/me/sections/reorder` endpoint.
- **Human/Engineer Decisions**: Included live Desktop vs. Mobile device frame preview switcher to simulate responsive candidate viewpoints in real time.

---

### Log Entry 4: SEO & JobPosting JSON-LD Structured Data
- **Date**: 2026-09-05
- **Task**: Providing search engine crawlability and rich search card previews.
- **Goal**: Deliver Google-compliant `JobPosting` schema without relying on Next.js server-side rendering.
- **AI Contribution**: Created reactive document head updater and `<script type="application/ld+json">` DOM injection on `JobDetail.jsx` and `PublicCareers.jsx`.
- **Validation**: Schema inspected against Google Search Central requirements for valid schema fields (`title`, `hiringOrganization`, `jobLocation`, `employmentType`, `datePosted`).

---

### Log Entry 5: Automated Testing & Verification
- **Date**: 2026-09-05
- **Task**: Running comprehensive test suite across Auth, CRUD, Reorder, Filters, and Lifecycle.
- **Goal**: Execute 100% genuine automated tests without mock or faked results.
- **Action Taken**: Ran `pytest backend/tests -v` using isolated in-memory SQLite with StaticPool.
- **Result**: 12/12 tests passed successfully.
