from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session

from app.database.base import get_db
from app.models.models import Company, CareerPage, PageSection, Job
from app.schemas.schemas import (
    CompanyOut,
    CareerPageOut,
    SectionOut,
    PublicJobOut,
    PublicCareerPageData,
)
from app.exceptions.handlers import NotFoundError

router = APIRouter(prefix="/api/public", tags=["public"])


def _get_published_company_bundle(slug: str, db: Session):
    company = db.query(Company).filter(Company.slug == slug).first()
    if not company:
        raise NotFoundError(f"Company with slug '{slug}' not found")

    career_page = (
        db.query(CareerPage)
        .filter(CareerPage.company_id == company.id, CareerPage.published == True)
        .first()
    )
    if not career_page:
        raise NotFoundError(f"Careers page for '{slug}' is not published or currently unavailable")

    return company, career_page


@router.get("/{companySlug}/careers", response_model=PublicCareerPageData)
def get_public_careers(companySlug: str, db: Session = Depends(get_db)):
    company, career_page = _get_published_company_bundle(companySlug, db)

    # Only retrieve published sections in display order
    sections = (
        db.query(PageSection)
        .filter(
            PageSection.career_page_id == career_page.id,
            PageSection.is_published == True,
            PageSection.is_visible == True,
        )
        .order_by(PageSection.display_order.asc())
        .all()
    )

    # Only retrieve active jobs
    jobs = (
        db.query(Job)
        .filter(Job.company_id == company.id, Job.is_active == True)
        .order_by(Job.posted_at.desc())
        .all()
    )

    return PublicCareerPageData(
        company=CompanyOut.model_validate(company),
        career_page=CareerPageOut.model_validate(career_page),
        sections=[SectionOut.model_validate(s) for s in sections],
        jobs=[PublicJobOut.model_validate(j) for j in jobs],
    )


@router.get("/{companySlug}/jobs", response_model=List[PublicJobOut])
def get_public_jobs(
    companySlug: str,
    search: Optional[str] = Query(None, description="Search by title, department or description"),
    location: Optional[str] = Query(None, description="Filter by location"),
    jobType: Optional[str] = Query(None, description="Filter by job type"),
    db: Session = Depends(get_db),
):
    company, _ = _get_published_company_bundle(companySlug, db)

    query = db.query(Job).filter(Job.company_id == company.id, Job.is_active == True)

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            (Job.title.ilike(term)) | (Job.department.ilike(term)) | (Job.description.ilike(term))
        )

    if location and location.strip():
        query = query.filter(Job.location.ilike(f"%{location.strip()}%"))

    if jobType and jobType.strip():
        query = query.filter(Job.job_type.ilike(f"%{jobType.strip()}%"))

    jobs = query.order_by(Job.posted_at.desc()).all()
    return [PublicJobOut.model_validate(j) for j in jobs]


@router.get("/{companySlug}/jobs/{jobId}", response_model=PublicJobOut)
def get_public_job_detail(
    companySlug: str,
    jobId: str,
    db: Session = Depends(get_db),
):
    company, _ = _get_published_company_bundle(companySlug, db)

    job = (
        db.query(Job)
        .filter(Job.id == jobId, Job.company_id == company.id, Job.is_active == True)
        .first()
    )
    if not job:
        raise NotFoundError("Job not found or has been deactivated")

    return PublicJobOut.model_validate(job)


@router.get("/{companySlug}/careers/view", response_class=HTMLResponse)
def get_public_careers_html(companySlug: str, db: Session = Depends(get_db)):
    """Server-rendered semantic HTML representation for crawlers, bot user-agents and SEO indexers."""
    import html
    import json
    company, career_page = _get_published_company_bundle(companySlug, db)
    sections = (
        db.query(PageSection)
        .filter(
            PageSection.career_page_id == career_page.id,
            PageSection.is_published == True,
            PageSection.is_visible == True,
        )
        .order_by(PageSection.display_order.asc())
        .all()
    )
    jobs = (
        db.query(Job)
        .filter(Job.company_id == company.id, Job.is_active == True)
        .order_by(Job.posted_at.desc())
        .all()
    )

    sections_html = ""
    for s in sections:
        t = html.escape(s.title or "")
        c = html.escape(s.content or "")
        sections_html += f"""
        <section class="section section-{html.escape(s.section_type)}">
            <h2>{t}</h2>
            <p>{c}</p>
        </section>
        """

    jobs_html = ""
    for j in jobs:
        jt = html.escape(j.title)
        jd = html.escape(j.department or "General")
        jl = html.escape(j.location or "Remote")
        jdesc = html.escape(j.description or "")
        jobs_html += f"""
        <article class="job-card">
            <h3><a href="/api/public/{companySlug}/jobs/{j.id}/view">{jt}</a></h3>
            <p><strong>Department:</strong> {jd} | <strong>Location:</strong> {jl} | <strong>Type:</strong> {html.escape(j.job_type or "Full-time")}</p>
            <p>{jdesc}</p>
        </article>
        """

    company_name = html.escape(company.name)
    headline = html.escape(career_page.headline or f"Careers at {company.name}")
    desc = html.escape(career_page.description or f"Join the team at {company.name}. View all open jobs and apply today.")

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Careers at {company_name} | Open Positions & Company Culture</title>
    <meta name="description" content="{desc}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6;">
    <header>
        <h1>{company_name} Careers</h1>
        <p><strong>{headline}</strong></p>
        <p>{desc}</p>
    </header>
    <main>
        {sections_html}
        <section id="open-positions">
            <h2>Open Positions ({len(jobs)})</h2>
            {jobs_html}
        </section>
    </main>
    <footer>
        <p>© {company_name}. Powered by Multi-Tenant ATS Page Builder.</p>
    </footer>
</body>
</html>"""


@router.get("/{companySlug}/jobs/{jobId}/view", response_class=HTMLResponse)
def get_public_job_html(companySlug: str, jobId: str, db: Session = Depends(get_db)):
    """Server-rendered semantic HTML representation with JobPosting JSON-LD for crawlers and Google Jobs."""
    import html
    import json
    company, _ = _get_published_company_bundle(companySlug, db)
    job = (
        db.query(Job)
        .filter(Job.id == jobId, Job.company_id == company.id, Job.is_active == True)
        .first()
    )
    if not job:
        raise NotFoundError("Job not found")

    title = html.escape(job.title)
    company_name = html.escape(company.name)
    dept = html.escape(job.department or "General")
    loc = html.escape(job.location or "Remote")
    job_type = html.escape(job.job_type or "Full-time")
    desc = html.escape(job.description or "")
    resp = html.escape(job.responsibilities or "")
    req = html.escape(job.requirements or "")
    benefits = html.escape(job.benefits or "")

    json_ld = {
        "@context": "https://schema.org/",
        "@type": "JobPosting",
        "title": job.title,
        "description": job.description or job.title,
        "datePosted": job.posted_at.isoformat() if job.posted_at else None,
        "employmentType": "FULL_TIME" if job.job_type == "Full-time" else "OTHER",
        "hiringOrganization": {
            "@type": "Organization",
            "name": company.name,
            "logo": company.logo_url or None,
        },
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": job.location or "Remote",
            }
        }
    }
    json_ld_str = json.dumps(json_ld)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{title} at {company_name} | Careers</title>
    <meta name="description" content="{title} opening at {company_name}. {desc[:150]}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script type="application/ld+json">
    {json_ld_str}
    </script>
</head>
<body style="font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6;">
    <header>
        <p><a href="/api/public/{companySlug}/careers/view">← Back to {company_name} Careers</a></p>
        <h1>{title}</h1>
        <p><strong>Department:</strong> {dept} | <strong>Location:</strong> {loc} | <strong>Type:</strong> {job_type}</p>
    </header>
    <main>
        <section>
            <h2>Overview</h2>
            <p>{desc}</p>
        </section>
        {f'<section><h2>Responsibilities</h2><p>{resp}</p></section>' if resp else ''}
        {f'<section><h2>Requirements</h2><p>{req}</p></section>' if req else ''}
        {f'<section><h2>Benefits</h2><p>{benefits}</p></section>' if benefits else ''}
        <section style="margin-top: 30px;">
            <a href="{html.escape(job.application_url or '#')}" style="display: inline-block; background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Apply for this Position</a>
        </section>
    </main>
    <footer style="margin-top: 50px; border-top: 1px solid #ccc; padding-top: 20px;">
        <p>© {company_name}. All rights reserved.</p>
    </footer>
</body>
</html>"""

