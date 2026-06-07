from datetime import datetime, date, timezone
from sqlalchemy import (
    Column, Integer, String, Text, Date, DateTime,
    Float, ForeignKey, JSON
)
from sqlalchemy.orm import relationship

from app.database import Base


class CaseStudy(Base):
    __tablename__ = "case_studies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=False)
    problem_statement = Column(Text)
    architecture = Column(Text)
    impact = Column(Text)
    tech_stack = Column(JSON, nullable=False, default=list)
    external_links = Column(JSON)
    impact_metric = Column(JSON)
    visualization = Column(JSON)
    date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    publish_date = Column(Date, nullable=False)
    tags = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Metric(Base):
    """Time-series data for D3 line/area charts."""
    __tablename__ = "metrics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    value = Column(Float, nullable=False)
    category = Column(String(100), index=True)
    timestamp = Column(DateTime, nullable=False, index=True)


class GraphNode(Base):
    """Network graph nodes for D3 force-directed viz."""
    __tablename__ = "graph_nodes"

    id = Column(Integer, primary_key=True, index=True)
    label = Column(String(255), nullable=False)
    group = Column(String(100))
    weight = Column(Float, default=1.0)

    edges_out = relationship(
        "GraphEdge",
        foreign_keys="GraphEdge.source_id",
        back_populates="source",
        cascade="all, delete-orphan",
    )
    edges_in = relationship(
        "GraphEdge",
        foreign_keys="GraphEdge.target_id",
        back_populates="target",
    )


class GraphEdge(Base):
    """Network graph edges for D3 force-directed viz."""
    __tablename__ = "graph_edges"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("graph_nodes.id"), nullable=False)
    target_id = Column(Integer, ForeignKey("graph_nodes.id"), nullable=False)
    weight = Column(Float, default=1.0)

    source = relationship("GraphNode", foreign_keys=[source_id], back_populates="edges_out")
    target = relationship("GraphNode", foreign_keys=[target_id], back_populates="edges_in")


class ContactSubmission(Base):
    __tablename__ = "contact_submissions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    subject = Column(String(160))
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
