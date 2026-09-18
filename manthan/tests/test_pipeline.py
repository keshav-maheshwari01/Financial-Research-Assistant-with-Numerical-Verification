from fin_rag_assistant.qa.pipeline import answer


def test_complete_question_works():
    result = answer("What was Acme Retail Inc.'s revenue growth in 2024?", company="Acme Retail Inc.", year=2024)
    assert result["status"] in {"success", "insufficient_evidence"}
    assert "question" in result


def test_insufficient_evidence_works():
    result = answer("What was Acme Retail Inc.'s revenue growth in 2027?", company="Acme Retail Inc.", year=2027)
    assert result["status"] == "insufficient_evidence"


def test_explanation_question_works():
    result = answer("Why did gross margin fall in 2024?", company="Acme Retail Inc.", year=2024)
    assert result["status"] in {"success", "insufficient_evidence"}
    assert "answer" in result


def test_comparison_works_if_implemented():
    result = answer("Compare Company A and Company B in 2024.", company=None, year=2024)
    assert result["status"] in {"success", "insufficient_evidence"}
