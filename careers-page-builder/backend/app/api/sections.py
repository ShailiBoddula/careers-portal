from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.base import get_db
from app.models.models import User, CareerPage, PageSection
from app.schemas.schemas import SectionCreate, SectionUpdate, SectionReorderRequest, SectionOut
from app.security.auth import require_recruiter
from app.exceptions.handlers import NotFoundError, ForbiddenError

router = APIRouter(prefix="/api/company/me/sections", tags=["sections"])


def _get_owned_career_page(company_id: str, db: Session) -> CareerPage:
    page = db.query(CareerPage).filter(CareerPage.company_id == company_id).first()
    if not page:
        page = CareerPage(company_id=company_id, published=False)
        db.add(page)
        db.commit()
        db.refresh(page)
    return page


def _get_owned_section(section_id: str, career_page_id: str, db: Session) -> PageSection:
    section = db.query(PageSection).filter(PageSection.id == section_id).first()
    if not section:
        raise NotFoundError("Section not found")
    if section.career_page_id != career_page_id:
        raise ForbiddenError("Access forbidden: You do not own this section")
    return section


@router.get("", response_model=List[SectionOut])
def list_sections(
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    page = _get_owned_career_page(current_user.company_id, db)
    return (
        db.query(PageSection)
        .filter(PageSection.career_page_id == page.id)
        .order_by(PageSection.display_order.asc())
        .all()
    )


@router.post("", response_model=SectionOut)
def create_section(
    payload: SectionCreate,
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    page = _get_owned_career_page(current_user.company_id, db)
    # Determine default display order if not specified
    if payload.display_order == 0:
        count = db.query(PageSection).filter(PageSection.career_page_id == page.id).count()
        order = count
    else:
        order = payload.display_order

    section = PageSection(
        career_page_id=page.id,
        section_type=payload.section_type,
        title=payload.title,
        content=payload.content,
        display_order=order,
        is_visible=payload.is_visible,
        is_published=False,
    )
    db.add(section)
    db.commit()
    db.refresh(section)
    return section


@router.put("/{section_id}", response_model=SectionOut)
def update_section(
    section_id: str,
    payload: SectionUpdate,
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    page = _get_owned_career_page(current_user.company_id, db)
    section = _get_owned_section(section_id, page.id, db)

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(section, key, value)

    db.commit()
    db.refresh(section)
    return section


@router.delete("/{section_id}", status_code=204)
def delete_section(
    section_id: str,
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    page = _get_owned_career_page(current_user.company_id, db)
    section = _get_owned_section(section_id, page.id, db)
    db.delete(section)
    db.commit()


@router.post("/reorder", response_model=List[SectionOut])
def reorder_sections(
    payload: SectionReorderRequest,
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    page = _get_owned_career_page(current_user.company_id, db)
    for item in payload.sections:
        section = _get_owned_section(item.id, page.id, db)
        section.display_order = item.display_order

    db.commit()
    return (
        db.query(PageSection)
        .filter(PageSection.career_page_id == page.id)
        .order_by(PageSection.display_order.asc())
        .all()
    )
