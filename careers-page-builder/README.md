# Multi-Tenant ATS Careers Page Builder

An enterprise-grade, multi-tenant ATS Careers Page Builder engineered for fast-scaling companies to create, design, customize, and publish branded company careers boards. Candidates can seamlessly browse open positions, filter by department, location, or work arrangement, and view detailed job requisitions with rich SEO metadata.

---

## 1. Problem Statement & Motivation
Modern hiring software often suffers from one of two extremes:
1. Rigid, cookie-cutter job lists that fail to convey employer brand, culture, and benefits.
2. Fragile custom-coded career portals that require dedicated engineering sprints every time recruiters want to reorder a section, update perks, or launch a new department opening.

This platform solves this challenge with a **clean, decoupled multi-tenant architecture**:
- **Recruiters** receive an intuitive visual page builder with live device previews, section reordering, brand identity controls, and job lifecycle management.
- **Candidates** enjoy ultra-fast, responsive, accessible, and crawlable career pages with real-time composite filtering and zero clutter.

---

## 2. Key Features

### For Recruiters:
- **Tenant-Isolated Authentication**: Secure JWT login with identity derived strictly from server-validated tokens.
- **Visual Section Builder**: Add, edit, remove, hide, and reorder modular page sections:
  - *Hero Section* (custom headlines, value propositions, badges)
  - *About Us* (company origin, mission, team size)
  - *Company Values* (structured principles rendered as polished cards)
  - *Life at Company* (day-to-day rhythm, focus blocks, offsites)
  - *Culture & Engineering* (technical craftsmanship, team habits)
  - *Benefits & Perks* (comprehensive health, 401k, remote stipends)
  - *Open Positions* (live positions listing)
- **Accessible Section Reordering**: Accessible keyboard controls (↑ / ↓) and browser-native ordering without heavy third-party drag-and-drop dependencies.
- **Brand Identity Studio**: Dynamic primary and secondary brand color pickers, logo customization, header banner imagery, and culture video embeds (YouTube / direct video).
- **Draft vs. Published Lifecycle**: Safe editing model. Recruiters make edits in draft mode. Changes never touch the live candidate page until deliberate publication. Unpublishing instantly revokes public visibility.
- **Job Requisition Management**: Add, edit, delete, activate, or deactivate jobs with full attribute validation (title, department, location, job type, description, responsibilities, requirements, benefits, and direct application URL).
- **Responsive Device Previews**: Toggle instantaneously between Desktop and Mobile viewport frames.

### For Candidates:
- **Public Career Boards**: Clean routes at `/:companySlug/careers` with zero login requirements.
- **Real-Time Job Filtering**:
  - Live full-text search across job titles, departments, and descriptions.
  - Location filtering (e.g. Remote, San Francisco, Cambridge, Austin).
  - Employment type filtering (Full-time, Contract, Internship, Part-time).
  - Combined multi-attribute filtering with automatic result count.
  - One-click filter reset.
- **Dedicated Job Detail Requisitions**: Deep links at `/:companySlug/careers/jobs/:jobId` with responsibilities, requirements, compensation, and one-click external application redirect.
- **Built-in SEO & Crawlability**: Dynamic OpenGraph tags, semantic HTML hierarchy, and automated Google `JobPosting` JSON-LD schema injection for search engine visibility.

---

## 3. Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Tailwind CSS, React Router DOM v6, Lucide Icons, Vite |
| **Backend** | Python 3.11+, FastAPI, SQLAlchemy 2.0 ORM, Pydantic v2 |
| **Database** | PostgreSQL / Neon (production-ready) & SQLite (zero-config local dev & tests) |
| **Authentication** | JWT (JSON Web Tokens via `python-jose`) with bcrypt password hashing |
| **DevOps & Containers** | Docker, Docker Compose, Nginx |
| **Testing** | Pytest, FastAPI TestClient, in-memory SQLite isolation |

---

## 4. Multi-Tenant Architecture & Security Model

Strict tenant boundary enforcement is baked directly into the backend data access layer:
1. **Never Trust Frontend Tenant IDs**: Recruiter requests derive user and company ownership solely from verified JWT claims (`sub`, `company_id`).
2. **Access Control Checks**: Every operation on a section or job verifies that `entity.company_id == current_user.company_id`. Any cross-company manipulation triggers a strict `403 Forbidden` exception.
3. **Public Isolation**: The public API strictly filters by `company.slug` and `is_published == True` + `is_active == True`. Draft sections and inactive jobs never leak into public candidate payloads.

---

## 5. Seed Recruiter Accounts & Demo Credentials

The database comes pre-seeded with 3 realistic companies:

| Company | Slug | Recruiter Email | Password | Primary Color |
|---|---|---|---|---|
| **Acme Corporation** | `acme` | `recruiter@acme.com` | `password123` | `#2563eb` (Blue) |
| **NovaLabs AI** | `novalabs` | `recruiter@novalabs.ai` | `password123` | `#7c3aed` (Purple) |
| **Vertex Health** | `vertex` | `recruiter@vertexhealth.com` | `password123` | `#059669` (Emerald) |

---

## 6. Local Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- (Optional) Docker and Docker Compose

### 1. Backend Setup
```bash
cd careers-page-builder/backend

# Create and activate virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations and seed realistic sample data
python seed.py

# Run FastAPI backend server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API will run at: `http://localhost:8000`  
Swagger API Docs: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd careers-page-builder/frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend will run at: `http://localhost:5173`

---

## 7. Running Tests

The test suite covers:
- User login and JWT issuance
- Invalid password and unauthorized access prevention
- Multi-tenancy and tenant isolation enforcement
- Cross-company job and section manipulation prevention (403 Forbidden)
- Company branding updates
- Career page draft vs. publish lifecycle
- Section CRUD and accessible reordering
- Job CRUD and active/inactive toggle
- Combined search, location, and job type filtering
- Public job detail rendering

Run tests with:
```bash
cd careers-page-builder
$env:PYTHONPATH = "backend"
.\.venv\Scripts\pytest backend/tests -v
```

**Result:** `12 passed in 6.88s`

---

## 8. Docker Deployment

To launch the full application with Docker Compose:
```bash
cd careers-page-builder
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`

---

## 9. Production Deployment Guide

### Database (Neon PostgreSQL)
1. Sign up at [neon.tech](https://neon.tech) and create a new project.
2. Copy your connection string: `postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require`
3. Supply this string as the `DATABASE_URL` environment variable.

### Backend (Railway)
1. In Railway, click **New Project** → **Deploy from GitHub repo**.
2. Set Root Directory to `/backend`.
3. Add environment variables:
   - `DATABASE_URL`: (Your Neon connection string)
   - `JWT_SECRET`: (A strong random 64-character secret)
   - `FRONTEND_URL`: (Your deployed Vercel frontend domain)
4. Deploy.

### Frontend (Vercel)
1. Import repository into Vercel.
2. Set Root Directory to `frontend`.
3. Configure build settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variable:
   - `VITE_API_BASE_URL`: (Your Railway backend URL, e.g. `https://careers-api.up.railway.app`)
5. Deploy.

---

## 10. Limitations & Improvement Plan
- **Asset Uploads**: Currently supports URL-based image/video links. Future milestone: S3/Cloudflare R2 direct file upload with presigned URLs.
- **Multi-language Support**: Future addition of i18n localization for global candidate portals.
- **Analytics & Telemetry**: Future dashboard showing candidate views, search queries, and click-through rates on Apply CTAs.
