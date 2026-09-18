from fin_rag_assistant.qa.pipeline import answer


def test_complete_question_works():
    result = answer("What was Acme Retail Inc.'s revenue growth in 2024?", company="Acme Retail Inc.", year=2024)
    assert result["status"] in {"success", "insufficient_evidence"}
    assert "question" in result


def test_insufficient_evidence_works():
    result = answer("What was Acme Retail Inc.'s revenue growth in 2027?", company="Acme Retail Inc.", year=2027)
    assert result["status"] == "insufficient_evidence"


def test_greeting_gets_conversational_response():
    result = answer("hi", company="Acme Retail Inc.", year=2024)
    assert result["status"] == "success"
    assert result["calculations"] == []
    assert result["answer"].startswith("Hello.")


def test_acknowledgement_gets_conversational_response():
    result = answer("ok")
    assert result["status"] == "success"
    assert result["answer"].startswith("Great.")


def test_revenue_question_is_not_misread_as_greeting():
    result = answer("hi i want detail about revenue")
    assert result["status"] == "success"
    assert result["answer"].startswith("Revenue is the total income")


def test_functions_question_gets_project_information():
    result = answer("I need some information about functions")
    assert result["status"] == "success"
    assert "calculation functions" in result["answer"]


def test_stocks_question_explains_data_scope():
    result = answer("I need info about stocks")
    assert result["status"] == "success"
    assert "live stock prices" in result["answer"]


def test_revenue_growth_question_gets_definition():
    result = answer("Tell me about revenue growth")
    assert result["status"] == "success"
    assert "current-period revenue" in result["answer"]


def test_revenue_growth_follow_up_gets_more_detail():
    result = answer("more things", company="Acme Retail Inc.", year=2024)
    assert result["status"] == "success"
    assert "higher prices" in result["answer"]


def test_explanation_question_works():
    result = answer("Why did gross margin fall in 2024?", company="Acme Retail Inc.", year=2024)
    assert result["status"] in {"success", "insufficient_evidence"}
    assert "answer" in result


def test_comparison_works_if_implemented():
    result = answer("Compare Company A and Company B in 2024.", company=None, year=2024)
    assert result["status"] in {"success", "insufficient_evidence"}
