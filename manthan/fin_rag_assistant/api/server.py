from __future__ import annotations

from pathlib import Path
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from fin_rag_assistant.config import GROQ_API_KEY, GROQ_MODEL
from fin_rag_assistant.models.schemas import APIResponse, AskRequest
from fin_rag_assistant.qa.pipeline import answer

app = FastAPI(title="Financial Research Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

FRONTEND_DIR = Path(__file__).resolve().parents[3]


@app.get("/health")
def health() -> dict[str, str | bool]:
    return {
        "status": "ok",
        "groq_configured": bool(GROQ_API_KEY.strip()),
        "groq_model": GROQ_MODEL,
    }


@app.get("/companies")
def companies() -> dict[str, list[str]]:
    return {"companies": ["Acme Retail Inc.", "Northwind Goods"]}


@app.post("/ask")
def ask(request: AskRequest) -> APIResponse:
    result = answer(request.question, company=request.company, year=request.year)
    return APIResponse(
        answer=result.get("answer", ""),
        calculations=result.get("calculations", []),
        citations=result.get("citations", []),
        warnings=result.get("warnings", []),
        status=result.get("status", "success"),
        chart=result.get("chart"),
    )


@app.post("/api/ask")
def dashboard_ask(request: AskRequest) -> dict[str, Any]:
    result = answer(request.question, company=request.company, year=request.year)
    trace = []
    for calculation in result.get("calculations", []):
        value = calculation.get("value")
        unit = calculation.get("unit", "")
        trace.append({
            "label": calculation.get("metric", "Calculation"),
            "formula": calculation.get("formula", ""),
            "value": f"{value} {unit}".strip() if value is not None else "N/A",
            "source": calculation.get("source", ""),
        })

    return {
        "answer": result.get("answer", "No answer found."),
        "company": request.company or "Unknown",
        "year": str(request.year) if request.year is not None else "Unknown",
        "confidence": 90 if result.get("confidence") == "high" else 50 if result.get("status") == "success" else 15,
        "guardrail": " | ".join(result.get("warnings", [])),
        "trace": trace,
        "citations": result.get("citations", []),
        "chart": result.get("chart") or {"labels": [], "values": [], "format": "money"},
        "status": result.get("status", "success"),
    }


@app.get("/api/metadata")
def metadata() -> dict[str, Any]:
    return {
        "questions": [
            "What was Acme Retail Inc.'s revenue growth in FY2024?",
            "Why did gross margin fall in FY2024?",
            "What was the current ratio in FY2024?",
        ],
        "groq_configured": bool(GROQ_API_KEY.strip()),
        "groq_model": GROQ_MODEL,
    }


app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
