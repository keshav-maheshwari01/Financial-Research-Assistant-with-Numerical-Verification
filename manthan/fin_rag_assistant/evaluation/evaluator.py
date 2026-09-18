from __future__ import annotations

from fin_rag_assistant.evaluation.golden_qa import GOLDEN_QUESTIONS
from fin_rag_assistant.qa.pipeline import answer


def run_golden_eval() -> dict:
    results = []
    for item in GOLDEN_QUESTIONS:
        response = answer(item["question"], company=item.get("company"), year=item.get("year"))
        passed = response.get("status") in {"success", "insufficient_evidence"}
        results.append({"question": item["question"], "passed": passed, "status": response.get("status")})
    score = sum(1 for item in results if item["passed"]) / len(results)
    return {"total": len(results), "passed": sum(1 for item in results if item["passed"]), "score": score, "results": results}
