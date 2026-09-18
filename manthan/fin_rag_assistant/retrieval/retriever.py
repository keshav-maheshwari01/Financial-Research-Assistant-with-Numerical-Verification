from __future__ import annotations

import json
from pathlib import Path

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from fin_rag_assistant.config import PROCESSED_DIR


def _load_chunks() -> list[dict]:
    path = PROCESSED_DIR / "narrative_chunks.json"
    if not path.exists():
        return []
    with open(path, "r", encoding="utf-8") as fh:
        return json.load(fh)


def retrieve_chunks(question: str, company: str | None = None, year: int | None = None, top_k: int = 5) -> list[dict]:
    chunks = _load_chunks()
    if not chunks:
        return []

    filtered = []
    for chunk in chunks:
        chunk_company = chunk.get("company")
        chunk_year = chunk.get("year")
        if company and chunk_company and chunk_company.lower() != company.lower():
            continue
        if year is not None and chunk_year is not None and chunk_year != year:
            continue
        filtered.append(chunk)

    if not filtered:
        return []

    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
    corpus = [chunk.get("text", "") for chunk in filtered]
    query = [question]
    tfidf = vectorizer.fit_transform(corpus + query)
    matrix = cosine_similarity(tfidf[:-1], tfidf[-1])
    ranked = sorted(
        enumerate(filtered),
        key=lambda item: matrix[item[0]].item(),
        reverse=True,
    )
    results = []
    for idx, chunk in ranked[:top_k]:
        results.append({
            "chunk_id": chunk.get("chunk_id"),
            "company": chunk.get("company"),
            "year": chunk.get("year"),
            "section": chunk.get("section", "MD&A"),
            "text": chunk.get("text"),
            "score": round(float(matrix[idx].item()), 4),
        })
    return results
