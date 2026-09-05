from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.base import get_db
from app.models.models import User, Job
from app.schemas.schemas import JobCreate, JobUpdate, JobOut
from app.security.auth import require_recruiter
from app.exceptions.handlers import NotFoundError, ForbiddenError

router = APIRouter(prefix="/api/company/me/jobs", tags=["jobs"])


def _get_owned_job(job_id: str, company_id: str, db: Session) -> Job:
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise NotFoundError("Job not found")
    if job.company_id != company_id:
        raise ForbiddenError("Access forbidden: You do not own this job")
    return job


@router.get("", response_model=List[JobOut])
def list_company_jobs(
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    return (
        db.query(Job)
        .filter(Job.company_id == current_user.company_id)
        .order_by(Job.posted_at.desc())
        .all()
    )


@router.post("", response_model=JobOut)
def create_company_job(
    payload: JobCreate,
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    job = Job(
        company_id=current_user.company_id,
        title=payload.title,
        description=payload.description,
        location=payload.location,
        job_type=payload.job_type,
        department=payload.department,
        requirements=payload.requirements,
        responsibilities=payload.responsibilities,
        benefits=payload.benefits,
        application_url=payload.application_url,
        is_active=payload.is_active,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.put("/{job_id}", response_model=JobOut)
def update_company_job(
    job_id: str,
    payload: JobUpdate,
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    job = _get_owned_job(job_id, current_user.company_id, db)
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(job, key, value)
    db.commit()
    db.refresh(job)
    return job


@router.delete("/{job_id}", status_code=204)
def delete_company_job(
    job_id: str,
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    job = _get_owned_job(job_id, current_user.company_id, db)
    db.delete(job)
    db.commit()
