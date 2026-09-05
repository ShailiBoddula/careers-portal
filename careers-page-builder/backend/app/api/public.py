from typing import List, Optional
from fastapi import APIRouter, Depends, Query
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
