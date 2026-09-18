from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env")

DATA_DIR = PROJECT_ROOT / "fin_rag_assistant" / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
FINANCIALS_DIR = RAW_DATA_DIR / "financials"
REPORTS_DIR = RAW_DATA_DIR / "reports"
PROCESSED_DIR = DATA_DIR / "processed"
GOLDEN_DIR = DATA_DIR / "golden"
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
try:
	GROQ_TIMEOUT_SECONDS = float(os.getenv("GROQ_TIMEOUT_SECONDS", "20"))
except ValueError:
	GROQ_TIMEOUT_SECONDS = 20.0
DEBUG = os.getenv("DEBUG", "false").lower() == "true"
