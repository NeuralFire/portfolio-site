#!/bin/sh

set -e

# Wait for PostgreSQL to be ready
echo "Waiting for database to be ready..."
python -c "
import time
import sys
from sqlalchemy import create_engine
from app.config import settings

engine = create_engine(settings.database_url)
for i in range(30):
    try:
        with engine.connect() as conn:
            print('✓ Database connection successful!')
            sys.exit(0)
    except Exception as e:
        print(f'Database not ready yet. Retrying in 2 seconds... ({i+1}/30)')
        time.sleep(2)
print('✗ Database connection failed after 30 attempts.')
sys.exit(1)
"

# Run alembic database migrations
echo "Running database migrations..."
alembic upgrade head

# Conditionally seed database
if [ "$SEED_DB" = "true" ]; then
    echo "Seeding database..."
    python seed.py
else
    echo "Skipping database seeding."
fi

# Execute CMD
echo "Starting application..."
exec "$@"
