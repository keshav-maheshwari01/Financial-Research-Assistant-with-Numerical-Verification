from __future__ import annotations

from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fin_rag_assistant.models.schemas import APIResponse, AskRequest
from fin_rag_assistant.qa.pipeline import answer

app = FastAPI(title="Financial Research Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


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
