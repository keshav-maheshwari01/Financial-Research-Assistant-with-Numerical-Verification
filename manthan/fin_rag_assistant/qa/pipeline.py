from __future__ import annotations

import json
from pathlib import Path

import pandas as pd

from fin_rag_assistant.calculations.metrics import calculate_metric
from fin_rag_assistant.config import PROCESSED_DIR
from fin_rag_assistant.ingestion.chunk_text import build_processed_chunks
from fin_rag_assistant.ingestion.load_reports import load_report_documents
from fin_rag_assistant.ingestion.load_tables import load_financial_tables
from fin_rag_assistant.qa.intent_parser import parse_question
from fin_rag_assistant.qa.query_planner import build_plan
from fin_rag_assistant.qa.synthesizer import synthesize_answer
from fin_rag_assistant.qa.verifier import verify_results
from fin_rag_assistant.retrieval.citation import format_citations
from fin_rag_assistant.retrieval.retriever import retrieve_chunks


def _get_company_data() -> pd.DataFrame:
    files = [
        Path("fin_rag_assistant/data/raw/financials/company_a.csv"),
        Path("fin_rag_assistant/data/raw/financials/company_b.csv"),
    ]
    tables = load_financial_tables(files)
    return pd.concat(tables.values(), ignore_index=True)


def _ensure_chunks() -> None:
    file_path = PROCESSED_DIR / "narrative_chunks.json"
    if file_path.exists():
        return
    reports = load_report_documents(Path("fin_rag_assistant/data/raw/reports"))
    build_processed_chunks(reports, file_path)


def _metric_for_intent(intent: dict, df: pd.DataFrame, company: str | None = None, year: int | None = None) -> list[dict]:
    metric = intent.get("metric", "general")
    target_company = company or intent.get("company")
    target_year = year if year is not None else intent.get("year")
    if target_company is None:
        return []
    if metric == "revenue_growth":
        prev_year = target_year - 1
        return [calculate_metric("revenue_growth", target_company, target_year, df=df, previous_year=prev_year)]
    if metric == "gross_margin":
        return [calculate_metric("gross_margin", target_company, target_year, df=df)]
    if metric == "operating_margin":
        return [calculate_metric("operating_margin", target_company, target_year, df=df)]
    if metric == "net_margin":
        return [calculate_metric("net_margin", target_company, target_year, df=df)]
    if metric == "working_capital":
        return [calculate_metric("working_capital", target_company, target_year, df=df)]
    if metric == "current_ratio":
        return [calculate_metric("current_ratio", target_company, target_year, df=df)]
    if metric == "quick_ratio":
        return [calculate_metric("quick_ratio", target_company, target_year, df=df)]
    if metric == "roe":
        return [calculate_metric("roe", target_company, target_year, df=df)]
    if metric == "debt_to_equity":
        return [calculate_metric("debt_to_equity", target_company, target_year, df=df)]
    if metric == "inventory_change":
        prev_year = target_year - 1
        return [calculate_metric("inventory_change", target_company, target_year, df=df, previous_year=prev_year)]
    if metric == "general":
        return []
    return []


def answer(question: str, company: str | None = None, year: int | None = None) -> dict:
    intent = parse_question(question, company=company, year=year)
    docs = _get_company_data()
    plan = build_plan(intent)
    target_company = company or intent.get("company")
    target_year = year if year is not None else intent.get("year")

    if target_company is None and "company a" in question.lower():
        target_company = "Acme Retail Inc."

    if target_company is None and "company b" in question.lower():
        target_company = "Northwind Goods"

    _ensure_chunks()
    calculations = _metric_for_intent(intent, docs, company=target_company, year=target_year)
    if target_year is not None and target_company is not None:
        company_rows = docs[(docs["company"].str.strip().str.lower() == target_company.lower()) & (docs["year"] == target_year)]
        if company_rows.empty:
            return {
                "question": question,
                "answer": "Not enough evidence to answer this question.",
                "calculations": [],
                "citations": [],
                "warnings": [f"Required financial data is unavailable for {target_year}."],
                "status": "insufficient_evidence",
            }

    if target_company is not None and target_year is not None and intent.get("metric") in {"gross_margin", "revenue_growth", "net_margin"}:
        previous_year = target_year - 1
        if intent.get("metric") == "gross_margin":
            calculations.append(calculate_metric("margin_change", target_company, target_year, df=docs, previous_year=previous_year, metric_name="gross_margin"))
        elif intent.get("metric") == "revenue_growth":
            calculations.append(calculate_metric("revenue_growth", target_company, target_year, df=docs, previous_year=previous_year))

    evidence = retrieve_chunks(question, company=target_company, year=target_year, top_k=5)
    verifier = verify_results(calculations, evidence)
    warnings = list(verifier.get("warnings", [])) if isinstance(verifier, dict) else []

    if not calculations or (not all(calc.get("value") is not None for calc in calculations) if calculations else False):
        return {
            "question": question,
            "answer": "Not enough evidence to answer this question.",
            "calculations": [],
            "citations": [],
            "warnings": ["Required financial data is unavailable for the requested metric."],
            "status": "insufficient_evidence",
        }

    citations = format_citations(evidence)
    answer_text = synthesize_answer(question, calculations, citations, warnings=warnings, status="success")
    response = {
        "question": question,
        "answer": answer_text,
        "calculations": calculations,
        "citations": citations,
        "warnings": warnings,
        "confidence": "high" if len(citations) > 0 else "low",
        "status": "success",
        "plan": plan,
    }
    if verifier.get("contradiction"):
        response["warnings"].append("Narrative statement conflicts with calculated values.")
    return response
