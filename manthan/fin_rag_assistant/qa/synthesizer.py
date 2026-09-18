from __future__ import annotations

import logging

from fin_rag_assistant.config import GROQ_API_KEY, GROQ_MODEL, GROQ_TIMEOUT_SECONDS

logger = logging.getLogger(__name__)


def _fallback_answer(calculations: list[dict], citations: list[dict], warnings: list[str] | None = None) -> str:
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


def _groq_answer(question: str, calculations: list[dict], citations: list[dict], warnings: list[str] | None = None) -> str | None:
    api_key = GROQ_API_KEY.strip()
    model = GROQ_MODEL.strip()
    if not api_key or not model:
        return None

    try:
        from groq import Groq

        evidence = {
            "calculations": calculations,
            "citations": citations,
            "warnings": warnings or [],
        }
        client = Groq(api_key=api_key, timeout=GROQ_TIMEOUT_SECONDS, max_retries=1)
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            temperature=0,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Answer financial questions using only the supplied verified calculations and citations. "
                        "Do not invent or recalculate values. Be concise and mention uncertainty warnings."
                    ),
                },
                {"role": "user", "content": f"Question: {question}\nVerified data: {evidence}"},
            ],
        )
        content = response.choices[0].message.content
        return content.strip() if content else None
    except Exception as exc:
        logger.warning("Groq synthesis failed; using deterministic fallback (%s).", type(exc).__name__)
        return None


def synthesize_answer(question: str, calculations: list[dict], citations: list[dict], warnings: list[str] | None = None, status: str = "success") -> str:
    if status == "insufficient_evidence":
        return "Not enough evidence to answer this question."

    if not calculations:
        return "Not enough evidence to answer this question."

    return _groq_answer(question, calculations, citations, warnings) or _fallback_answer(calculations, citations, warnings)
