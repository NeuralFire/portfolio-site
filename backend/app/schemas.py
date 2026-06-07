from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class CaseStudyLinkOut(BaseModel):
    label: str
    url: str


class CaseStudyImpactMetricOut(BaseModel):
    label: str
    value: str
    detail: Optional[str] = None


class CaseStudyChartSeriesOut(BaseModel):
    name: str
    values: list[float]


class CaseStudyChartOut(BaseModel):
    title: str
    subtitle: Optional[str] = None
    x: list[str]
    y_axis_label: str
    series: list[CaseStudyChartSeriesOut]


class CaseStudyOut(BaseModel):
    id: int
    title: str
    summary: str
    problem_statement: Optional[str] = None
    architecture: Optional[str] = None
    impact: Optional[str] = None
    tech_stack: list[str]
    external_links: list[CaseStudyLinkOut] = []
    impact_metric: Optional[CaseStudyImpactMetricOut] = None
    visualization: Optional[CaseStudyChartOut] = None
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


class ContactSubmissionCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr = Field(max_length=255)
    subject: Optional[str] = Field(default=None, max_length=160)
    message: str = Field(min_length=20, max_length=4000)


class ContactSubmissionOut(BaseModel):
    id: int
    name: str
    email: str
    subject: Optional[str] = None
    message: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ContactSubmissionAck(BaseModel):
    id: int
    detail: str
