from __future__ import annotations

from pathlib import Path


def load_report_documents(report_dir: str | Path) -> list[dict]:
    """Load raw report text files and attach company/year metadata."""
    records: list[dict] = []
    for path in sorted(Path(report_dir).glob("*.txt")):
        text = path.read_text(encoding="utf-8")
        file_name = path.stem
        parts = file_name.split("_")
        if len(parts) < 3:
            company = file_name
            year = None
        else:
            company = "_".join(parts[:-1]).replace("_", " ").strip()
            try:
                year = int(parts[-1])
            except ValueError:
                company = file_name
                year = None
        records.append({
            "file": str(path),
            "company": company,
            "year": year,
            "text": text,
            "source": path.name,
        })
    return records
