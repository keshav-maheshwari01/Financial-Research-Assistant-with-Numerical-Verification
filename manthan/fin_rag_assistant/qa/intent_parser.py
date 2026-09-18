from __future__ import annotations

import re
from typing import Any


def parse_question(question: str, company: str | None = None, year: int | None = None) -> dict[str, Any]:
    text = question.lower().strip()
    question_type = "fact"
    if "why" in text or "because" in text or "explain" in text:
        question_type = "explanation"
    if "compare" in text or "vs" in text or "versus" in text or "between" in text:
        question_type = "comparison"

    metric = "general"
    metric_keywords = {
        "revenue growth": ["revenue growth", "growth in revenue", "revenue grew"],
        "gross_margin": ["gross margin", "gross profitability"],
        "operating_margin": ["operating margin"],
        "net_margin": ["net margin", "profit margin", "profitability"],
        "current_ratio": ["current ratio", "liquidity ratio"],
        "quick_ratio": ["quick ratio", "acid test"],
        "roe": ["roe", "return on equity"],
        "debt_to_equity": ["debt to equity", "leverage"],
        "working_capital": ["working capital"],
        "inventory_change": ["inventory change", "inventory increase", "inventory decrease"],
    }
    for key, phrases in metric_keywords.items():
        if any(phrase in text for phrase in phrases):
            metric = key
            break

    years = [int(match) for match in re.findall(r"\b(?:19|20)\d{2}\b", question)]
    current_year = year
    previous_year = None
    if years:
        current_year = years[0]
        if len(years) > 1:
            previous_year = years[1]

    inferred_company = company
    for candidate in ["acme retail inc.", "company a", "northwind goods", "company b"]:
        if candidate in text:
            inferred_company = candidate.title() if candidate != "acme retail inc." else "Acme Retail Inc."
            break

    return {
        "company": inferred_company,
        "metric": metric,
        "question_type": question_type,
        "year": current_year,
        "previous_year": previous_year,
        "comparison": question_type == "comparison",
        "explanation": question_type == "explanation",
        "raw_question": question,
    }
