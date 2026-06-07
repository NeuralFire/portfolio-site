from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.limiter import limiter
from app.models import ContactSubmission
from app.schemas import ContactSubmissionAck, ContactSubmissionCreate

router = APIRouter(prefix="/api/contact", tags=["contact"])


@router.post("", response_model=ContactSubmissionAck, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/hour")
def create_contact_submission(request: Request, payload: ContactSubmissionCreate, db: Session = Depends(get_db)):
    submission = ContactSubmission(
        name=payload.name.strip(),
        email=payload.email.strip(),
        subject=payload.subject.strip() if payload.subject else None,
        message=payload.message.strip(),
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    return ContactSubmissionAck(
        id=submission.id,
        detail="Message received. I will follow up soon.",
    )