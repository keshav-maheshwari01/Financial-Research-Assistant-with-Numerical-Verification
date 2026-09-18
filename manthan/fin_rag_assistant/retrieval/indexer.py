from __future__ import annotations

import json
from pathlib import Path

from sklearn.feature_extraction.text import TfidfVectorizer

from fin_rag_assistant.config import PROCESSED_DIR


def load_processed_chunks(path: str | Path | None = None) -> list[dict]:
    data_path = Path(path) if path is not None else PROCESSED_DIR / "narrative_chunks.json"
    if not data_path.exists():
        return []
    with open(data_path, "r", encoding="utf-8") as fh:
        return json.load(fh)


def build_tfidf_index(chunks: list[dict]) -> tuple[TfidfVectorizer, list[str], list[dict]]:
    texts = [chunk.get("text", "") for chunk in chunks]
    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
    matrix = vectorizer.fit_transform(texts)
    return vectorizer, [str(index) for index in range(matrix.shape[0])], chunks


def rebuild_index(chunks: list[dict]) -> tuple[TfidfVectorizer, list[str]]:
    vectorizer, _, _ = build_tfidf_index(chunks)
    return vectorizer, [str(index) for index in range(len(chunks))]
