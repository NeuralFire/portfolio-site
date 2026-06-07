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
                title="MouseBytes v2 Analytics Platform",
                summary="Architected a next-generation time series processing platform with React, FastAPI, and PostgreSQL to support on-demand metrics and flexible metadata.",
                problem_statement="Large, high-dimensional time series datasets were difficult to reuse because analysis logic and metadata structures were too rigid for evolving research and reporting needs.",
                architecture="React frontend → FastAPI service layer → PostgreSQL storage → on-demand metric generation and flexible metadata handling.",
                impact="Created a stronger foundation for reusable analytics workflows, richer metadata, and faster access to derived metrics across complex datasets.",
                tech_stack=["React", "FastAPI", "Python", "PostgreSQL", "SQL"],
                external_links=[
                    {
                        "label": "Portfolio Repository",
                        "url": "https://github.com"
                    }
                ],
                impact_metric={
                    "label": "Platform focus",
                    "value": "On-demand metrics",
                    "detail": "The platform was designed to support dynamic metric calculation and more flexible dataset reuse instead of fixed reporting outputs."
                },
                visualization={
                    "title": "Analytics platform maturity",
                    "subtitle": "Illustrative progression from raw ingestion to reusable metric delivery.",
                    "x": ["Raw Data", "Structured Storage", "Metadata Layer", "On-Demand Metrics"],
                    "y_axis_label": "Capability Score",
                    "series": [
                        {"name": "Data usability", "values": [1, 2, 4, 5]},
                        {"name": "Analytical flexibility", "values": [1, 2, 3, 5]}
                    ]
                },
                date=(datetime.utcnow() - timedelta(days=120)).date()
            ),
            CaseStudy(
                title="Historical Scientific Data Migration",
                summary="Engineered a Python ETL pipeline to migrate 15 years of historical data from hundreds of distributed Access databases into structured outputs.",
                problem_statement="Legacy records were fragmented across many Access databases with inconsistent metadata, making migration and validation slow, manual, and error-prone.",
                architecture="Distributed Access sources → Python ETL workflows → fuzzy matching and metadata alignment → validation outputs for downstream SQL migration.",
                impact="Improved integrity and portability for long-lived datasets by automating extraction, alignment, and validation steps that would otherwise require significant manual review.",
                tech_stack=["Python", "ETL", "SQL", "Data Validation", "Fuzzy Matching"],
                external_links=[
                    {
                        "label": "Portfolio Repository",
                        "url": "https://github.com"
                    }
                ],
                impact_metric={
                    "label": "Data horizon",
                    "value": "15 years",
                    "detail": "The migration covered long-lived historical records stored across hundreds of fragmented data sources."
                },
                visualization={
                    "title": "Migration pipeline stages",
                    "subtitle": "Illustrative workflow from fragmented legacy inputs to validated outputs.",
                    "x": ["Extract", "Normalize", "Fuzzy Match", "Validate"],
                    "y_axis_label": "Workflow Coverage",
                    "series": [
                        {"name": "Automation", "values": [2, 3, 4, 5]},
                        {"name": "Data confidence", "values": [1, 2, 4, 5]}
                    ]
                },
                date=(datetime.utcnow() - timedelta(days=80)).date()
            ),
            CaseStudy(
                title="OpenBehaviourCamera Edge AI Application",
                summary="Built Rust binaries and Python control software for Raspberry Pi Zero 2 devices that capture synchronized footage and support live YOLO inference.",
                problem_statement="The system needed lightweight edge capture, synchronized hardware-state logging, and practical AI-assisted tracking on constrained hardware.",
                architecture="Rust capture binaries on Raspberry Pi Zero 2 → Python orchestration and recording workflows → live YOLO inference for behavioral tracking.",
                impact="Combined edge systems work and applied computer vision into a deployable AI application that supports automation, recording, and live analysis.",
                tech_stack=["Rust", "Python", "YOLO", "Raspberry Pi", "Computer Vision"],
                external_links=[
                    {
                        "label": "Portfolio Repository",
                        "url": "https://github.com"
                    }
                ],
                impact_metric={
                    "label": "Deployment target",
                    "value": "Pi Zero 2",
                    "detail": "The application was engineered for resource-constrained edge hardware while still supporting live AI-assisted workflows."
                },
                visualization={
                    "title": "Edge AI application capabilities",
                    "subtitle": "Illustrative progression from capture to live inference.",
                    "x": ["Capture", "Sync", "Automation", "Live Inference"],
                    "y_axis_label": "Capability Score",
                    "series": [
                        {"name": "System integration", "values": [2, 3, 4, 5]},
                        {"name": "Operational utility", "values": [2, 3, 4, 5]}
                    ]
                },
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
                title="Designing APIs for Event-Driven Analytics",
                content="""# Designing APIs for Event-Driven Analytics

Turning noisy event streams into reusable analytics products requires clean contracts at the ingestion boundary, traceable transformations, and API endpoints that support both raw access and derived metrics.""",
                publish_date=(datetime.utcnow() - timedelta(days=30)).date(),
                tags=["Data Engineering", "FastAPI", "Analytics"]
            ),
            BlogPost(
                title="Migrating Fragmented Legacy Data Without Losing Trust",
                content="""# Migrating Fragmented Legacy Data Without Losing Trust

Legacy migrations usually fail when teams focus only on extraction. The real work is schema alignment, fuzzy matching, validation, and preserving enough provenance for downstream users to trust the output.""",
                publish_date=(datetime.utcnow() - timedelta(days=20)).date(),
                tags=["ETL", "Data Quality", "SQL"]
            ),
            BlogPost(
                title="What Makes an AI Application Useful Beyond the Model",
                content="""# What Makes an AI Application Useful Beyond the Model

Applied AI systems succeed when inference is only one part of the product. Capture workflows, edge constraints, automation, validation, and operator feedback loops are what make the model usable in practice.""",
                publish_date=(datetime.utcnow() - timedelta(days=10)).date(),
                tags=["AI Applications", "Machine Learning", "Computer Vision"]
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

        # Seed GraphNode records (data science & ML tech stack)
        print("\nSeeding GraphNode records...")
        nodes = [
            GraphNode(label="Python", group="language", weight=1.0),
            GraphNode(label="R", group="language", weight=0.8),
            GraphNode(label="PyTorch", group="ml_ai", weight=0.9),
            GraphNode(label="DeepLabCut", group="ml_ai", weight=1.0),
            GraphNode(label="SLEAP", group="ml_ai", weight=0.9),
            GraphNode(label="YOLO", group="ml_ai", weight=0.9),
            GraphNode(label="NumPy / SciPy", group="analytics", weight=0.9),
            GraphNode(label="SQL", group="database", weight=0.8),
            GraphNode(label="TIBCO Spotfire", group="visualization", weight=0.7),
        ]
        for node in nodes:
            session.add(node)
        session.commit()
        print(f"✓ Inserted {len(nodes)} GraphNode records")

        # Seed GraphEdge records (logical connections)
        print("\nSeeding GraphEdge records...")
        node_map = {node.label: node.id for node in session.query(GraphNode).all()}

        edges = [
            GraphEdge(source_id=node_map["Python"], target_id=node_map["PyTorch"], weight=1.0),
            GraphEdge(source_id=node_map["Python"], target_id=node_map["DeepLabCut"], weight=1.0),
            GraphEdge(source_id=node_map["Python"], target_id=node_map["SLEAP"], weight=0.9),
            GraphEdge(source_id=node_map["Python"], target_id=node_map["YOLO"], weight=0.9),
            GraphEdge(source_id=node_map["Python"], target_id=node_map["NumPy / SciPy"], weight=1.0),
            GraphEdge(source_id=node_map["PyTorch"], target_id=node_map["DeepLabCut"], weight=0.8),
            GraphEdge(source_id=node_map["PyTorch"], target_id=node_map["SLEAP"], weight=0.8),
            GraphEdge(source_id=node_map["PyTorch"], target_id=node_map["YOLO"], weight=0.8),
            GraphEdge(source_id=node_map["R"], target_id=node_map["NumPy / SciPy"], weight=0.6),
            GraphEdge(source_id=node_map["R"], target_id=node_map["TIBCO Spotfire"], weight=0.7),
            GraphEdge(source_id=node_map["SQL"], target_id=node_map["Python"], weight=0.7),
            GraphEdge(source_id=node_map["SQL"], target_id=node_map["R"], weight=0.7),
            GraphEdge(source_id=node_map["SQL"], target_id=node_map["TIBCO Spotfire"], weight=0.8),
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
