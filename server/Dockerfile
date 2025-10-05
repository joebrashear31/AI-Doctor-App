FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates && rm -rf /var/lib/apt/lists/*

# Python deps
COPY server/requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

# App code
COPY server/ ./server/

# Run as non-root
RUN useradd -m appuser
USER appuser

# Expose & default command
EXPOSE 8000
CMD ["gunicorn", "-c", "server/gunicorn.conf.py", "server.main:app"]
