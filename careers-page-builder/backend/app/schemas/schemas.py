from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, field_validator
import re


# ─── Auth Schemas ───────────────────────────────────────────

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    role: str
    company_id: Optional[str] = None
    company_slug: Optional[str] = None
    company_name: Optional[str] = None


# ─── User Schemas ───────────────────────────────────────────

class UserOut(BaseModel):
    id: str
    email: str
    role: str
    company_id: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Company Schemas ────────────────────────────────────────

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    banner_url: Optional[str] = None
    culture_video_url: Optional[str] = None

    @field_validator("primary_color", "secondary_color", mode="before")
    @classmethod
    def validate_hex_color(cls, v):
        if v is not None and not re.match(r"^#[0-9a-fA-F]{6}$", v):
            raise ValueError("Color must be a valid 6-digit hex format (e.g. #2563eb)")
        return v


class CompanyOut(BaseModel):
    id: str
    name: str
    slug: str
    logo_url: Optional[str] = None
    primary_color: str
    secondary_color: str
    banner_url: Optional[str] = None
    culture_video_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ─── Career Page Schemas ────────────────────────────────────

class CareerPageUpdate(BaseModel):
    headline: Optional[str] = None
    description: Optional[str] = None


class CareerPageOut(BaseModel):
    id: str
    company_id: str
    headline: Optional[str] = None
    description: Optional[str] = None
    published: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ─── Section Schemas ────────────────────────────────────────

class SectionCreate(BaseModel):
    section_type: str
    title: Optional[str] = None
    content: Optional[str] = None
    display_order: int = 0
    is_visible: bool = True

    @field_validator("section_type")
    @classmethod
    def validate_type(cls, v):
        allowed = {"hero", "about", "life", "culture", "benefits", "values", "open_positions"}
        if v not in allowed:
            raise ValueError(f"section_type must be one of: {', '.join(allowed)}")
        return v


class SectionUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_visible: Optional[bool] = None
    display_order: Optional[int] = None


class SectionReorderItem(BaseModel):
    id: str
    display_order: int


class SectionReorderRequest(BaseModel):
    sections: List[SectionReorderItem]


class SectionOut(BaseModel):
    id: str
    career_page_id: str
    section_type: str
    title: Optional[str] = None
    content: Optional[str] = None
    display_order: int
    is_visible: bool
    is_published: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ─── Job Schemas ────────────────────────────────────────────

class JobCreate(BaseModel):
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    department: Optional[str] = None
    requirements: Optional[str] = None
    responsibilities: Optional[str] = None
    benefits: Optional[str] = None
    application_url: Optional[str] = None
    is_active: bool = True

    @field_validator("title")
    @classmethod
    def title_non_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Job title is required and cannot be empty")
        return v.strip()


class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    department: Optional[str] = None
    requirements: Optional[str] = None
    responsibilities: Optional[str] = None
    benefits: Optional[str] = None
    application_url: Optional[str] = None
    is_active: Optional[bool] = None

    @field_validator("title")
    @classmethod
    def title_non_empty(cls, v):
        if v is not None and not v.strip():
            raise ValueError("Job title cannot be blank")
        return v.strip() if v else v


class JobOut(BaseModel):
    id: str
    company_id: str
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    department: Optional[str] = None
    requirements: Optional[str] = None
    responsibilities: Optional[str] = None
    benefits: Optional[str] = None
    application_url: Optional[str] = None
    is_active: bool
    posted_at: datetime
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ─── Public Schemas ─────────────────────────────────────────

class PublicJobOut(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    department: Optional[str] = None
    requirements: Optional[str] = None
    responsibilities: Optional[str] = None
    benefits: Optional[str] = None
    application_url: Optional[str] = None
    posted_at: datetime

    model_config = {"from_attributes": True}


class PublicCareerPageData(BaseModel):
    company: CompanyOut
    career_page: CareerPageOut
    sections: List[SectionOut]
    jobs: List[PublicJobOut]
