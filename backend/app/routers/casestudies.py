from fastapi import APIRouter, Depends
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
