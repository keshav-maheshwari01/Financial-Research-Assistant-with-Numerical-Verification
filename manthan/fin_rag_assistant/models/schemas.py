from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class AskRequest(BaseModel):
    question: str
    company: Optional[str] = None
    year: Optional[int] = None


class CalculationResult(BaseModel):
    metric: str
    value: Optional[float]
    unit: Optional[str] = None
    formula: Optional[str] = None
    inputs: Dict[str, Any] = Field(default_factory=dict)
    source: Optional[str] = None
    note: Optional[str] = None


class Citation(BaseModel):
    chunk_id: str
    company: str
    year: int
    section: str
    text: str
    score: float


class APIResponse(BaseModel):
    answer: str
    calculations: List[Dict[str, Any]] = Field(default_factory=list)
    citations: List[Dict[str, Any]] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    status: str = "success"
    chart: Optional[Dict[str, Any]] = None
