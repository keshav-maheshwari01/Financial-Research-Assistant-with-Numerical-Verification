from __future__ import annotations

from typing import Any


def build_plan(intent: dict[str, Any]) -> list[str]:
    metric = intent.get("metric", "general")
    year = intent.get("year")
    previous_year = intent.get("previous_year")
    company = intent.get("company")
    steps = [
        "identify company and year",
        "load relevant financial records",
    ]
    if metric != "general":
        steps.append(f"calculate {metric} for {company or 'target company'} in {year}")
    if previous_year is not None:
        steps.append(f"compare values between {previous_year} and {year}")
    steps.extend([
        "retrieve relevant report evidence",
        "verify calculations against evidence",
        "synthesize final answer",
    ])
    return steps
