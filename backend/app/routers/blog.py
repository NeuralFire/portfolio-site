from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models import BlogPost
from app.schemas import BlogSummaryOut, BlogPostOut

router = APIRouter(prefix="/api/blog", tags=["blog"])


@router.get("", response_model=list[BlogSummaryOut])
def get_all_blog_posts(db: Session = Depends(get_db)):
    """Retrieve all blog posts as summaries, ordered by publish_date descending."""
    posts = db.query(BlogPost).order_by(desc(BlogPost.publish_date)).all()
    return posts


@router.get("/{post_id}", response_model=BlogPostOut)
def get_blog_post(post_id: int, db: Session = Depends(get_db)):
    """Retrieve a single blog post by ID."""
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post
