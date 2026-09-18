from __future__ import annotations

import json
from pathlib import Path


def chunk_report_text(text: str, section: str = "MD&A", chunk_size: int = 250) -> list[str]:
    """Split a report into simple sentence-based chunks while preserving meaning."""
    sentences = [piece.strip() for piece in text.split(". ") if piece.strip()]
    chunks: list[str] = []
    current: list[str] = []
    current_len = 0
    for sentence in sentences:
        sentence = sentence.rstrip('.')
        if current_len + len(sentence) > chunk_size and current:
            chunks.append(". ".join(current) + ".")
            current = [sentence]
            current_len = len(sentence)
        else:
            current.append(sentence)
            current_len += len(sentence)
    if current:
        chunks.append(". ".join(current) + ".")
    return chunks if chunks else [text.strip()]


def build_processed_chunks(report_documents: list[dict], output_path: str | Path | None = None) -> list[dict]:
    chunks: list[dict] = []
    for doc in report_documents:
        company = doc.get("company") or "Unknown Company"
        year = doc.get("year")
        text = doc.get("text", "")
        file_name = Path(doc.get("file", "")).stem
        section = "MD&A"
        for idx, piece in enumerate(chunk_report_text(text, section=section), start=1):
            chunks.append({
                "chunk_id": f"{company.lower().replace(' ', '_')}_{year}_{section.lower().replace('&', 'and')}_{idx:02d}",
                "company": company,
                "year": year,
                "section": section,
                "text": piece,
                "source": file_name,
            })
    if output_path is not None:
        path = Path(output_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(chunks, indent=2, ensure_ascii=False), encoding="utf-8")
    return chunks
