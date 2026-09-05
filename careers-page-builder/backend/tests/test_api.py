import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database.base import Base, get_db
from app.models.models import User, Company, CareerPage, PageSection, Job
from app.security.auth import hash_password

# Use in-memory SQLite with StaticPool for fast, isolated tests
TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()

    # Company A (Acme)
    comp_a = Company(
        id="comp-a-id",
        name="Acme Corp",
        slug="acme",
        primary_color="#2563eb",
        secondary_color="#1e40af",
    )
    db.add(comp_a)

    user_a = User(
        id="user-a-id",
        email="recruiter@acme.com",
        password_hash=hash_password("password123"),
        role="recruiter",
        company_id=comp_a.id,
    )
    db.add(user_a)

    page_a = CareerPage(
        id="page-a-id",
        company_id=comp_a.id,
        headline="Join Acme",
        published=True,
    )
    db.add(page_a)

    sec_a1 = PageSection(
        id="sec-a1-id",
        career_page_id=page_a.id,
        section_type="hero",
        title="Acme Hero",
        content="Welcome to Acme",
        display_order=0,
        is_visible=True,
        is_published=True,
    )
    sec_a2 = PageSection(
        id="sec-a2-id",
        career_page_id=page_a.id,
        section_type="about",
        title="About Acme",
        content="We build software",
        display_order=1,
        is_visible=True,
        is_published=True,
    )
    db.add_all([sec_a1, sec_a2])

    job_a1 = Job(
        id="job-a1-id",
        company_id=comp_a.id,
        title="Senior Python Backend Engineer",
        location="San Francisco, CA",
        job_type="Full-time",
        department="Engineering",
        description="Build distributed backend services",
        is_active=True,
    )
    job_a2 = Job(
        id="job-a2-id",
        company_id=comp_a.id,
        title="Product Designer",
        location="Remote",
        job_type="Contract",
        department="Design",
        description="Design intuitive workflows",
        is_active=True,
    )
    job_a_inactive = Job(
        id="job-a-inactive-id",
        company_id=comp_a.id,
        title="Archived Role",
        location="New York, NY",
        job_type="Part-time",
        department="Operations",
        description="Archived position",
        is_active=False,
    )
    db.add_all([job_a1, job_a2, job_a_inactive])

    # Company B (NovaLabs)
    comp_b = Company(
        id="comp-b-id",
        name="NovaLabs AI",
        slug="novalabs",
        primary_color="#7c3aed",
        secondary_color="#5b21b6",
    )
    db.add(comp_b)

    user_b = User(
        id="user-b-id",
        email="recruiter@novalabs.ai",
        password_hash=hash_password("password123"),
        role="recruiter",
        company_id=comp_b.id,
    )
    db.add(user_b)

    page_b = CareerPage(
        id="page-b-id",
        company_id=comp_b.id,
        headline="Join NovaLabs",
        published=False,  # unpublished
    )
    db.add(page_b)

    sec_b = PageSection(
        id="sec-b-id",
        career_page_id=page_b.id,
        section_type="hero",
        title="NovaLabs Hero",
        display_order=0,
        is_visible=True,
        is_published=False,
    )
    db.add(sec_b)

    job_b = Job(
        id="job-b-id",
        company_id=comp_b.id,
        title="AI Researcher",
        location="Boston, MA",
        job_type="Full-time",
        department="Research",
        is_active=True,
    )
    db.add(job_b)

    db.commit()
    db.close()

    yield

    Base.metadata.drop_all(bind=engine)


def auth_header(email="recruiter@acme.com", password="password123"):
    resp = client.post("/api/auth/login", json={"email": email, "password": password})
    assert resp.status_code == 200
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


# ─────────────────────────────────────────────────────────────
# 1. AUTH & JWT TESTS
# ─────────────────────────────────────────────────────────────

def test_login_success():
    resp = client.post(
        "/api/auth/login",
        json={"email": "recruiter@acme.com", "password": "password123"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["email"] == "recruiter@acme.com"
    assert data["role"] == "recruiter"
    assert data["company_slug"] == "acme"


def test_login_invalid_password():
    resp = client.post(
        "/api/auth/login",
        json={"email": "recruiter@acme.com", "password": "wrong-password"},
    )
    assert resp.status_code == 401


def test_unauthorized_access_fails():
    resp = client.get("/api/company/me")
    assert resp.status_code in [401, 403]


# ─────────────────────────────────────────────────────────────
# 2. MULTI-TENANCY & CROSS-COMPANY ACCESS PREVENTION
# ─────────────────────────────────────────────────────────────

def test_company_profile_isolation():
    headers_a = auth_header("recruiter@acme.com")
    resp_a = client.get("/api/company/me", headers=headers_a)
    assert resp_a.status_code == 200
    assert resp_a.json()["slug"] == "acme"

    headers_b = auth_header("recruiter@novalabs.ai")
    resp_b = client.get("/api/company/me", headers=headers_b)
    assert resp_b.status_code == 200
    assert resp_b.json()["slug"] == "novalabs"


def test_cross_company_job_manipulation_blocked():
    headers_b = auth_header("recruiter@novalabs.ai")

    # Recruiter B attempts to modify Recruiter A's job
    resp_update = client.put(
        "/api/company/me/jobs/job-a1-id",
        headers=headers_b,
        json={"title": "Hacked Title"},
    )
    assert resp_update.status_code == 403

    # Recruiter B attempts to delete Recruiter A's job
    resp_delete = client.delete("/api/company/me/jobs/job-a1-id", headers=headers_b)
    assert resp_delete.status_code == 403


def test_cross_company_section_manipulation_blocked():
    headers_b = auth_header("recruiter@novalabs.ai")

    # Recruiter B attempts to edit Recruiter A's section
    resp = client.put(
        "/api/company/me/sections/sec-a1-id",
        headers=headers_b,
        json={"title": "Unauthorized Title Change"},
    )
    assert resp.status_code == 403


# ─────────────────────────────────────────────────────────────
# 3. COMPANY & BRANDING UPDATES
# ─────────────────────────────────────────────────────────────

def test_update_company_branding():
    headers = auth_header("recruiter@acme.com")
    resp = client.put(
        "/api/company/me",
        headers=headers,
        json={
            "name": "Acme Global Technologies",
            "primary_color": "#10b981",
            "secondary_color": "#047857",
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["name"] == "Acme Global Technologies"
    assert data["primary_color"] == "#10b981"


# ─────────────────────────────────────────────────────────────
# 4. CAREER PAGE DRAFT & PUBLISH LIFECYCLE
# ─────────────────────────────────────────────────────────────

def test_publish_and_unpublish_lifecycle():
    headers = auth_header("recruiter@novalabs.ai")

    # Initially unpublished
    resp_initial = client.get("/api/public/novalabs/careers")
    assert resp_initial.status_code == 404

    # Publish
    resp_pub = client.post("/api/company/me/careers/publish", headers=headers)
    assert resp_pub.status_code == 200
    assert resp_pub.json()["published"] is True

    # Now publicly visible
    resp_check = client.get("/api/public/novalabs/careers")
    assert resp_check.status_code == 200
    assert resp_check.json()["company"]["slug"] == "novalabs"

    # Unpublish
    resp_unpub = client.post("/api/company/me/careers/unpublish", headers=headers)
    assert resp_unpub.status_code == 200
    assert resp_unpub.json()["published"] is False

    # Should be 404 again
    resp_check_unpub = client.get("/api/public/novalabs/careers")
    assert resp_check_unpub.status_code == 404


# ─────────────────────────────────────────────────────────────
# 5. SECTION CRUD & REORDERING
# ─────────────────────────────────────────────────────────────

def test_section_crud_and_reorder():
    headers = auth_header("recruiter@acme.com")

    # List sections
    resp_list = client.get("/api/company/me/sections", headers=headers)
    assert resp_list.status_code == 200
    sections = resp_list.json()
    assert len(sections) == 2

    # Create new section
    resp_create = client.post(
        "/api/company/me/sections",
        headers=headers,
        json={
            "section_type": "benefits",
            "title": "Amazing Benefits",
            "content": "Health + 401k",
            "display_order": 2,
            "is_visible": True,
        },
    )
    assert resp_create.status_code == 200
    new_sec = resp_create.json()
    assert new_sec["section_type"] == "benefits"

    # Reorder sections
    resp_reorder = client.post(
        "/api/company/me/sections/reorder",
        headers=headers,
        json={
            "sections": [
                {"id": new_sec["id"], "display_order": 0},
                {"id": "sec-a1-id", "display_order": 1},
                {"id": "sec-a2-id", "display_order": 2},
            ]
        },
    )
    assert resp_reorder.status_code == 200
    reordered = resp_reorder.json()
    assert reordered[0]["id"] == new_sec["id"]
    assert reordered[0]["display_order"] == 0


# ─────────────────────────────────────────────────────────────
# 6. JOB CRUD & SEARCH / FILTERS
# ─────────────────────────────────────────────────────────────

def test_job_crud():
    headers = auth_header("recruiter@acme.com")

    # Create job
    resp_create = client.post(
        "/api/company/me/jobs",
        headers=headers,
        json={
            "title": "Machine Learning Engineer",
            "location": "Remote",
            "job_type": "Full-time",
            "department": "AI",
            "description": "Train LLMs",
            "is_active": True,
        },
    )
    assert resp_create.status_code == 200
    created_job = resp_create.json()
    assert created_job["title"] == "Machine Learning Engineer"

    # Update job (deactivate)
    resp_update = client.put(
        f"/api/company/me/jobs/{created_job['id']}",
        headers=headers,
        json={"is_active": False},
    )
    assert resp_update.status_code == 200
    assert resp_update.json()["is_active"] is False

    # Delete job
    resp_delete = client.delete(f"/api/company/me/jobs/{created_job['id']}", headers=headers)
    assert resp_delete.status_code == 204


def test_public_jobs_filtering_combinations():
    # 1. Search by title
    resp_search = client.get("/api/public/acme/jobs?search=Python")
    assert resp_search.status_code == 200
    jobs = resp_search.json()
    assert len(jobs) == 1
    assert jobs[0]["title"] == "Senior Python Backend Engineer"

    # 2. Filter by location
    resp_loc = client.get("/api/public/acme/jobs?location=Remote")
    assert resp_loc.status_code == 200
    assert len(resp_loc.json()) == 1

    # 3. Filter by jobType
    resp_type = client.get("/api/public/acme/jobs?jobType=Contract")
    assert resp_type.status_code == 200
    assert len(resp_type.json()) == 1

    # 4. Combined filter with no match
    resp_none = client.get("/api/public/acme/jobs?search=Python&location=Remote")
    assert resp_none.status_code == 200
    assert len(resp_none.json()) == 0

    # 5. Inactive jobs must NOT appear on public endpoint
    resp_all = client.get("/api/public/acme/jobs")
    titles = [j["title"] for j in resp_all.json()]
    assert "Archived Role" not in titles


def test_public_job_details():
    resp = client.get("/api/public/acme/jobs/job-a1-id")
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == "job-a1-id"
    assert data["title"] == "Senior Python Backend Engineer"
