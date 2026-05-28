from collections import defaultdict
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import GraphEdge, GraphNode, Metric
from app.schemas import (
    CategorySummary,
    DashboardGraphOut,
    DashboardMetricsOut,
    GraphEdgeOut,
    GraphNodeOut,
    MetricPoint,
    MetricSeries,
)

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/metrics", response_model=DashboardMetricsOut)
def get_dashboard_metrics(
    category: Optional[str] = Query(None, description="Filter by category"),
    limit_per_series: Optional[int] = Query(None, ge=1, le=10000),
    db: Session = Depends(get_db),
):
    q = db.query(Metric).order_by(Metric.name, Metric.category, Metric.timestamp)
    if category:
        q = q.filter(Metric.category == category)

    metrics = q.all()

    # Group into named series keyed by (name, category)
    series_map: dict[tuple, list[MetricPoint]] = defaultdict(list)
    for m in metrics:
        key = (m.name, m.category)
        series_map[key].append(
            MetricPoint(timestamp=m.timestamp.isoformat(), value=m.value)
        )

    series = []
    for (name, cat), points in series_map.items():
        data = points[-limit_per_series:] if limit_per_series else points
        series.append(MetricSeries(name=name, category=cat, data=data))

    # Per-category aggregate stats via SQL (single round-trip)
    agg_q = db.query(
        Metric.category,
        func.min(Metric.value).label("min_val"),
        func.max(Metric.value).label("max_val"),
        func.avg(Metric.value).label("avg_val"),
        func.count(Metric.id).label("cnt"),
    ).group_by(Metric.category)

    if category:
        agg_q = agg_q.filter(Metric.category == category)

    summary = {
        (row.category or "uncategorized"): CategorySummary(
            min=round(row.min_val, 4),
            max=round(row.max_val, 4),
            avg=round(row.avg_val, 4),
            count=row.cnt,
        )
        for row in agg_q.all()
    }

    return DashboardMetricsOut(
        series=series,
        summary=summary,
        generated_at=datetime.utcnow().isoformat(),
    )


@router.get("/graph", response_model=DashboardGraphOut)
def get_dashboard_graph(db: Session = Depends(get_db)):
    nodes = db.query(GraphNode).all()
    edges = db.query(GraphEdge).all()

    return DashboardGraphOut(
        nodes=[
            GraphNodeOut(
                id=n.id,
                label=n.label,
                group=n.group,
                weight=n.weight or 1.0,
            )
            for n in nodes
        ],
        links=[
            GraphEdgeOut(
                id=e.id,
                source=e.source_id,
                target=e.target_id,
                weight=e.weight or 1.0,
            )
            for e in edges
        ],
    )
