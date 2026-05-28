from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel


class CaseStudyOut(BaseModel):
    id: int
    title: str
    summary: str
    problem_statement: Optional[str] = None
    architecture: Optional[str] = None
    impact: Optional[str] = None
    tech_stack: list[str]
    date: date
    created_at: datetime

    model_config = {"from_attributes": True}


class BlogSummaryOut(BaseModel):
    id: int
    title: str
    publish_date: date
    tags: list[str]

    model_config = {"from_attributes": True}


class BlogPostOut(BlogSummaryOut):
    content: str
    created_at: datetime


class MetricPoint(BaseModel):
    timestamp: str
    value: float


class MetricSeries(BaseModel):
    name: str
    category: Optional[str] = None
    data: list[MetricPoint]


class CategorySummary(BaseModel):
    min: float
    max: float
    avg: float
    count: int


class DashboardMetricsOut(BaseModel):
    series: list[MetricSeries]
    summary: dict[str, CategorySummary]
    generated_at: str


class GraphNodeOut(BaseModel):
    id: int
    label: str
    group: Optional[str] = None
    weight: float

    model_config = {"from_attributes": True}


class GraphEdgeOut(BaseModel):
    id: int
    source: int
    target: int
    weight: float

    model_config = {"from_attributes": True}


class DashboardGraphOut(BaseModel):
    nodes: list[GraphNodeOut]
    links: list[GraphEdgeOut]
