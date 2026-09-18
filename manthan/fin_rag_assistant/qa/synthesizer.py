from __future__ import annotations

from typing import Any


def synthesize_answer(question: str, calculations: list[dict], citations: list[dict], warnings: list[str] | None = None, status: str = "success") -> str:
    if status == "insufficient_evidence":
        return "Not enough evidence to answer this question."

    if not calculations:
        return "Not enough evidence to answer this question."

    lines = []
    for calc in calculations:
        metric = calc.get("metric", "value")
        value = calc.get("value")
        formula = calc.get("formula")
        inputs = calc.get("inputs", {})
        unit = calc.get("unit")
        if value is None:
            continue
        label = metric.replace("_", " ").title()
        if metric == "revenue_growth":
            lines.append(f"{label}: {value}{unit} based on {formula} using inputs {inputs}.")
        else:
            lines.append(f"{label}: {value}{unit} from {formula} with inputs {inputs}.")

    body = " ".join(lines) if lines else "The available calculation data is limited."
    if warnings:
        body += " " + " ".join(warnings)
    if citations:
        body += " Supporting evidence: " + "; ".join(citation.get("text", "") for citation in citations[:2])
    return body
