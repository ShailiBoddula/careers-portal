from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.base import get_db
from app.models.models import User, CareerPage, PageSection
from app.schemas.schemas import CareerPageUpdate, CareerPageOut
from app.security.auth import require_recruiter
from app.exceptions.handlers import NotFoundError

router = APIRouter(prefix="/api/company/me/careers", tags=["careers"])


def get_or_create_career_page(company_id: str, db: Session) -> CareerPage:
    page = db.query(CareerPage).filter(CareerPage.company_id == company_id).first()
    if not page:
        page = CareerPage(company_id=company_id, headline="", description="", published=False)
        db.add(page)
        db.commit()
        db.refresh(page)
    return page


@router.get("", response_model=CareerPageOut)
def get_career_page(
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    return get_or_create_career_page(current_user.company_id, db)


@router.put("", response_model=CareerPageOut)
def update_career_page_draft(
    payload: CareerPageUpdate,
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    page = get_or_create_career_page(current_user.company_id, db)
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(page, key, value)
    db.commit()
    db.refresh(page)
    return page


@router.post("/publish", response_model=CareerPageOut)
def publish_career_page(
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    page = get_or_create_career_page(current_user.company_id, db)
    # Promote all active visible sections to published state
    sections = db.query(PageSection).filter(PageSection.career_page_id == page.id).all()
    for s in sections:
        s.is_published = s.is_visible

    page.published = True
    db.commit()
    db.refresh(page)
    return page


@router.post("/unpublish", response_model=CareerPageOut)
def unpublish_career_page(
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    page = get_or_create_career_page(current_user.company_id, db)
    page.published = False
    db.commit()
    db.refresh(page)
    return page
