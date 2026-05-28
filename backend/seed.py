#!/usr/bin/env python3
"""
Seed script for populating the database with sample data.
Run from the backend/ directory: python seed.py
"""

import random
from datetime import datetime, timedelta
from app.models import CaseStudy, BlogPost, Metric, GraphNode, GraphEdge
from app.database import SessionLocal


def seed_database():
    """Clear and repopulate the database with seed data."""
    random.seed(42)
    session = SessionLocal()

    try:
        # Clear existing data in FK-safe order
        print("Clearing existing data...")
        session.query(GraphEdge).delete()
        session.query(GraphNode).delete()
        session.query(Metric).delete()
        session.query(BlogPost).delete()
        session.query(CaseStudy).delete()
        session.commit()
        print("✓ Database cleared")

        # Seed CaseStudy records
        print("\nSeeding CaseStudy records...")
        case_studies = [
            CaseStudy(
                title="Real-Time ETL Pipeline with Apache Kafka",
                summary="Built a scalable event streaming infrastructure processing 1M+ events daily",
                problem_statement="Legacy batch processing was unable to handle real-time analytics requirements",
                architecture="Kafka → Spark Streaming → PostgreSQL, with Redis caching for hot data",
                impact="Reduced data latency from 6 hours to <2 minutes; 40% infrastructure cost savings",
                tech_stack=["Kafka", "Apache Spark", "PostgreSQL", "Redis", "Python"],
                date=(datetime.utcnow() - timedelta(days=120)).date()
            ),
            CaseStudy(
                title="ML Model Serving at Scale with FastAPI",
                summary="Deployed scikit-learn models via REST API with 99.9% uptime SLA",
                problem_statement="Manual model serving caused bottlenecks; needed async, scalable inference",
                architecture="FastAPI application with Gunicorn workers, Docker containerization, K8s orchestration",
                impact="Served 10K+ predictions/day; reduced inference latency by 60%",
                tech_stack=["FastAPI", "scikit-learn", "Docker", "Kubernetes", "Python"],
                date=(datetime.utcnow() - timedelta(days=80)).date()
            ),
            CaseStudy(
                title="PostgreSQL Query Optimization for Analytics",
                summary="Optimized slow analytics queries through indexing and partitioning strategies",
                problem_statement="Dashboard queries taking 45+ seconds, affecting business intelligence workflows",
                architecture="Composite indexes on fact tables, time-based partitioning, query plan analysis",
                impact="Reduced query time 80% (45s → 9s); enabled real-time dashboard updates",
                tech_stack=["PostgreSQL", "SQL", "Python", "Apache Superset"],
                date=(datetime.utcnow() - timedelta(days=45)).date()
            ),
        ]
        for cs in case_studies:
            session.add(cs)
        session.commit()
        print(f"✓ Inserted {len(case_studies)} CaseStudy records")

        # Seed BlogPost records
        print("\nSeeding BlogPost records...")
        blog_posts = [
            BlogPost(
                title="Building High-Performance APIs with FastAPI",
                content="""# Building High-Performance APIs with FastAPI

FastAPI is a modern web framework for building APIs with Python 3.6+.

## Key Features
- **Async/await support** for handling concurrent requests
- **Automatic OpenAPI documentation** (Swagger UI)
- **Type hints** for validation and IDE support
- **Built-in security** utilities for authentication

## Performance Tips
1. Use async functions for I/O-bound operations
2. Implement caching with Redis
3. Profile with APScheduler for background tasks
4. Deploy with Gunicorn + Uvicorn workers

Typical throughput: 5K-10K requests/second on modest hardware.""",
                publish_date=(datetime.utcnow() - timedelta(days=30)).date(),
                tags=["FastAPI", "Python", "Web Development", "Performance"]
            ),
            BlogPost(
                title="Data Visualization with D3.js and React",
                content="""# Data Visualization with D3.js and React

Combining D3.js with React enables interactive, dynamic visualizations.

## Integration Patterns
- Use React for component lifecycle management
- Delegate DOM manipulation to D3 within useEffect hooks
- Maintain separation of concerns: React state, D3 rendering

## Example: Time-Series Chart
```javascript
const TimeSeriesChart = ({ data }) => {
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    // D3 code here
  }, [data]);
  return <svg ref={svgRef} />;
};
```

Performance scales to 10K+ data points with proper memoization.""",
                publish_date=(datetime.utcnow() - timedelta(days=20)).date(),
                tags=["D3", "React", "Visualization", "JavaScript"]
            ),
            BlogPost(
                title="Apache Kafka for Event-Driven Architectures",
                content="""# Apache Kafka for Event-Driven Architectures

Kafka is a distributed event streaming platform designed for high-throughput, fault-tolerant data pipelines.

## Core Concepts
- **Topics**: Named event streams (e.g., "user-events", "transactions")
- **Partitions**: Parallelism mechanism; enables horizontal scaling
- **Consumer Groups**: Multiple consumers read from same topic independently

## Use Cases
1. Real-time analytics and dashboards
2. Log aggregation across microservices
3. Event sourcing patterns
4. Stream processing (Kafka Streams, Spark)

## Best Practices
- Set replication factor ≥ 2 for fault tolerance
- Monitor consumer lag to detect processing delays
- Use schema registry for data governance

Kafka can handle millions of events/second reliably.""",
                publish_date=(datetime.utcnow() - timedelta(days=10)).date(),
                tags=["Kafka", "Data Engineering", "Streaming", "Architecture"]
            ),
        ]
        for bp in blog_posts:
            session.add(bp)
        session.commit()
        print(f"✓ Inserted {len(blog_posts)} BlogPost records")

        # Seed Metric records (time-series: 90 rows, 3 categories, 30 days each)
        print("\nSeeding Metric records...")
        metrics = []
        categories = ["pipeline_throughput", "model_latency_ms", "db_query_ms"]

        # Generate 30 data points per category over the last 90 days
        for cat_idx, category in enumerate(categories):
            for day in range(30):
                timestamp = datetime.utcnow() - timedelta(days=day)
                if category == "pipeline_throughput":
                    value = random.gauss(1000, 100)  # avg 1000 events/sec, σ=100
                    value = max(800, min(1200, value))  # clamp to 800-1200
                elif category == "model_latency_ms":
                    value = random.gauss(30, 8)  # avg 30ms, σ=8
                    value = max(15, min(45, value))  # clamp to 15-45
                else:  # db_query_ms
                    value = random.gauss(45, 15)  # avg 45ms, σ=15
                    value = max(10, min(80, value))  # clamp to 10-80

                metrics.append(Metric(
                    name=f"{category}_day{day}",
                    value=round(value, 2),
                    category=category,
                    timestamp=timestamp
                ))

        for metric in metrics:
            session.add(metric)
        session.commit()
        print(f"✓ Inserted {len(metrics)} Metric records")

        # Seed GraphNode records (tech stack)
        print("\nSeeding GraphNode records...")
        nodes = [
            GraphNode(label="FastAPI", group="backend", weight=1.0),
            GraphNode(label="PostgreSQL", group="backend", weight=1.0),
            GraphNode(label="Redis", group="backend", weight=0.8),
            GraphNode(label="Kafka", group="data", weight=0.9),
            GraphNode(label="React", group="frontend", weight=1.0),
            GraphNode(label="D3", group="frontend", weight=0.7),
        ]
        for node in nodes:
            session.add(node)
        session.commit()
        print(f"✓ Inserted {len(nodes)} GraphNode records")

        # Seed GraphEdge records (logical connections)
        print("\nSeeding GraphEdge records...")
        node_map = {node.label: node.id for node in session.query(GraphNode).all()}

        edges = [
            GraphEdge(source_id=node_map["React"], target_id=node_map["FastAPI"], weight=1.0),
            GraphEdge(source_id=node_map["FastAPI"], target_id=node_map["PostgreSQL"], weight=1.0),
            GraphEdge(source_id=node_map["FastAPI"], target_id=node_map["Redis"], weight=0.8),
            GraphEdge(source_id=node_map["Kafka"], target_id=node_map["PostgreSQL"], weight=0.9),
            GraphEdge(source_id=node_map["Kafka"], target_id=node_map["FastAPI"], weight=0.7),
            GraphEdge(source_id=node_map["React"], target_id=node_map["D3"], weight=1.0),
        ]
        for edge in edges:
            session.add(edge)
        session.commit()
        print(f"✓ Inserted {len(edges)} GraphEdge records")

        print("\n" + "="*50)
        print("✓ Database seeding complete!")
        print("="*50)

    except Exception as e:
        session.rollback()
        print(f"✗ Error during seeding: {e}")
        raise
    finally:
        session.close()


if __name__ == "__main__":
    seed_database()
