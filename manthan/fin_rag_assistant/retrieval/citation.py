from __future__ import annotations

from typing import Iterable


def format_citations(chunks: Iterable[dict], scores: Iterable[float] | None = None) -> list[dict]:
    citations: list[dict] = []
    for index, chunk in enumerate(chunks):
        entry = {
            "chunk_id": chunk.get("chunk_id", f"chunk_{index}"),
            "company": chunk.get("company", "Unknown Company"),
            "year": chunk.get("year"),
            "section": chunk.get("section", "MD&A"),
            "text": chunk.get("text", ""),
            "score": float(scores[index]) if scores is not None else 0.0,
        }
        citations.append(entry)
    return citations
