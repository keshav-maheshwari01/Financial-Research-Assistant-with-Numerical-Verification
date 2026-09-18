from __future__ import annotations

from typing import Any


def _contains_financial_numbers(text: str) -> bool:
    # Keep this simple and deterministic for the hackathon.
    return any(ch.isdigit() for ch in text)


def verify_results(calculations: list[dict], evidence: list[dict]) -> dict[str, Any]:
    if not calculations:
        return {
            "status": "insufficient_evidence",
            "contradiction": False,
            "message": "No financial calculations were produced.",
        }

    contradictions = []
    for item in evidence:
        text = item.get("text", "")
        if not text:
            continue
        lowered = text.lower()
        if "improved" in lowered and any(calc.get("metric") == "margin_change" and calc.get("value", 0) < 0 for calc in calculations):
            contradictions.append("Narrative statement conflicts with calculated gross margin change.")
        if "fall" in lowered or "decline" in lowered or "decreased" in lowered:
            if any(calc.get("metric") in {"margin_change", "gross_margin"} and calc.get("value") is not None and calc.get("value") >= 0 for calc in calculations):
                contradictions.append("Narrative statement conflicts with calculated margin change.")

    if evidence and not any(_contains_financial_numbers(item.get("text", "")) for item in evidence):
        return {
            "status": "ok",
            "contradiction": bool(contradictions),
            "warnings": contradictions,
            "message": "Evidence retrieved without numeric contradiction.",
        }

    return {
        "status": "ok",
        "contradiction": bool(contradictions),
        "warnings": contradictions,
        "message": "Calculation output verified against retrieved evidence." if not contradictions else "Narrative conflicts with calculated values.",
    }
