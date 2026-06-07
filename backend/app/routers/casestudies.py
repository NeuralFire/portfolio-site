from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import CaseStudy
from app.schemas import CaseStudyOut

router = APIRouter(prefix="/api/casestudies", tags=["casestudies"])


@router.get("", response_model=list[CaseStudyOut])
def get_casestudies(db: Session = Depends(get_db)):
    """Get all case studies ordered by date (newest first)."""
    case_studies = db.query(CaseStudy).order_by(CaseStudy.date.desc()).all()
    return case_studies


@router.get("/{case_study_id}", response_model=CaseStudyOut)
def get_case_study(case_study_id: int, db: Session = Depends(get_db)):
    """Retrieve a single case study by ID."""
    case_study = db.query(CaseStudy).filter(CaseStudy.id == case_study_id).first()
    if case_study is None:
        raise HTTPException(status_code=404, detail="Case study not found")

    return case_study
