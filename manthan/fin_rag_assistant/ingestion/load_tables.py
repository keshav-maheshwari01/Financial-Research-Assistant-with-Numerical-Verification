from __future__ import annotations

from pathlib import Path
from typing import Iterable

import pandas as pd

REQUIRED_COLUMNS = {
    "company",
    "year",
    "revenue",
    "cost_of_revenue",
    "gross_profit",
    "operating_income",
    "net_income",
    "current_assets",
    "current_liabilities",
    "inventory",
    "total_assets",
    "shareholders_equity",
    "total_debt",
}

NUMERIC_COLUMNS = sorted(REQUIRED_COLUMNS - {"company", "year"})


def load_financial_tables(files: Iterable[str | Path]) -> dict[str, pd.DataFrame]:
    """Load all CSV files and normalize them for downstream calculation use."""
    frames: dict[str, pd.DataFrame] = {}
    for file_path in files:
        path = Path(file_path)
        df = pd.read_csv(path)
        missing = REQUIRED_COLUMNS - set(df.columns)
        if missing:
            raise ValueError(f"Missing required columns in {path.name}: {sorted(missing)}")

        df = df.copy()
        df["year"] = pd.to_numeric(df["year"], errors="raise")
        for column in NUMERIC_COLUMNS:
            df[column] = pd.to_numeric(df[column], errors="raise")
        df["company"] = df["company"].astype(str).str.strip()
        df = df.sort_values(["company", "year"]).reset_index(drop=True)
        frames[path.stem] = df
    return frames


def load_company_table(file_path: str | Path) -> pd.DataFrame:
    return load_financial_tables([file_path])[Path(file_path).stem]
