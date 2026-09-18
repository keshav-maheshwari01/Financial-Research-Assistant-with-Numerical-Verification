from __future__ import annotations

import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn

from fin_rag_assistant.qa.pipeline import answer

app = FastAPI()

class AskRequest(BaseModel):
    question: str
    company: str | None = None
    year: int | None = None

@app.post("/api/ask")
async def api_ask(req: AskRequest):
    # Defaulting company and year if they are empty strings
    company = req.company if req.company else None
    
    # parse year string like "FY2024" to integer 2024 if necessary
    year_int = None
    if req.year:
        try:
            year_int = int(str(req.year).replace("FY", ""))
        except ValueError:
            pass

    res = answer(req.question, company=company, year=year_int)
    
    trace = []
    for calc in res.get("calculations", []):
        val = calc.get("value")
        unit = calc.get("unit", "")
        if val is not None:
            val_str = f"{val} {unit}".strip()
        else:
            val_str = "N/A"
        trace.append({
            "label": calc.get("metric", "Calculation"),
            "formula": calc.get("formula", ""),
            "value": val_str,
            "source": calc.get("source", "")
        })
        
    conf_str = res.get("confidence", "low")
    confidence = 90 if conf_str == "high" else 50
    
    chart = {"labels": [], "values": [], "format": "money"}
    
    citations = []
    for c in res.get("citations", []):
        if isinstance(c, dict):
            citations.append({
                "kind": c.get("kind", "Document"),
                "title": c.get("title", c.get("id", "Unknown")),
                "text": c.get("text", ""),
                "score": c.get("score", 1.0)
            })
        elif isinstance(c, str):
            citations.append({
                "kind": "Document",
                "title": "Citation",
                "text": c,
                "score": 1.0
            })
    
    warnings = res.get("warnings", [])
    guardrail = " | ".join(warnings) if warnings else ""
    
    return {
        "answer": res.get("answer", "No answer found."),
        "company": company or "Unknown",
        "year": str(req.year) if req.year else "Unknown",
        "confidence": confidence,
        "guardrail": guardrail,
        "trace": trace,
        "citations": citations,
        "chart": chart
    }

@app.get("/api/metadata")
async def api_metadata():
    return {
        "questions": [
            "What was Acme Retail Inc.'s revenue growth in FY2024?",
            "Why did gross margin fall in FY2024?",
            "What was the current ratio in FY2024?"
        ]
    }

frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8021)
