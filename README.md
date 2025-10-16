# DevOps Challenge: Flask API + React + Postgres

A deliberately simple, working app (todos) that runs locally with Docker Compose — but **not** production-ready.
Your students' job is to **productionize** it using DevOps best practices.

## Stack
- Backend: Python **Flask**, SQLAlchemy
- Frontend: **React** (Vite)
- DB: **Postgres**
- Local Orchestration: **docker-compose**

## Quick start (local, with Docker)
```bash
docker compose up --build
```
- Frontend: http://localhost:5173
- API: http://localhost:5000
- Health: http://localhost:5000/api/health

## Service Overview
- **backend**: Simple Flask API exposing `/api/todos` CRUD.
- **frontend**: React UI to add/list/delete todos.
- **db**: Postgres with a single `todos` table created at startup.

## Environment (dev defaults – intentionally insecure)
- DB user/password/db: `app_user` / `devpassword` / `app_db`
- Flask secret: `devsecret`
- API URL passed to frontend via `VITE_API_URL` (see `docker-compose.yml`).

---

## Student Assignment: Make It Production-Ready
This repo is intentionally missing or weak on the following. Your job is to fix or add them:

### 1) Infrastructure as Code
- Provision cloud infra (networking, cluster, DB/storage) using Terraform.
- Separate **dev/stage/prod**. Remote state. Modules.

### 2) CI/CD & GitOps
- CI: tests, lint, type checks, security scans (Trivy/Snyk) on PRs.
- CD: build & deploy via Helm/Kustomize; blue‑green or canary. Argo CD optional.
- Signed images & SBOMs.

### 3) Security & Secrets
- Remove plaintext defaults; use Vault/External Secrets/Sealed Secrets.
- Enforce non‑root containers, no `:latest`, resource limits, OPA/Kyverno policies.

### 4) Observability
- Prometheus metrics (API latency, errors) + dashboards in Grafana.
- Centralized logs (Loki/ELK) + basic traces (OpenTelemetry). Actionable alerts.

### 5) Reliability & Scaling
- Readiness/liveness/startup probes, HPAs, PodDisruptionBudgets.
- Backups for Postgres; migrations workflow (Alembic).

### 6) Quality, Performance & Docs
- Unit/integration tests + smoke tests; load tests (k6) with SLOs.
- Cost awareness & right‑sizing notes.
- Clear README diagrams and runbooks; postmortem template.

> Tip: Treat me like your CTO. I only care that this app can be shipped, scaled, and supported safely.

---

## Local dev without Docker
- Backend:
  ```bash
  cd backend
  python -m venv .venv && source .venv/bin/activate
  pip install -r requirements.txt
  cp .env  # edit if needed
  python app.py
  ```
- Frontend:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

## API
- `GET /api/health` → `{"status":"ok"}`
- `GET /api/todos` → list todos
- `POST /api/todos` → create (`{"title":"string"}`)
- `PUT /api/todos/<id>` → update (`{"title":"...", "completed": true/false}`)
- `DELETE /api/todos/<id>` → delete