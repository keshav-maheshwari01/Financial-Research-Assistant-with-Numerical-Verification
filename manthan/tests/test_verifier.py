from fin_rag_assistant.qa.verifier import verify_results


def test_valid_calculation_accepted():
    result = verify_results([
        {"metric": "gross_margin", "value": 33.8, "unit": "%"}
    ], [{"text": "Acme Retail Inc. gross margins were healthy in 2024."}])
    assert result["status"] == "ok"


def test_invented_number_rejected():
    result = verify_results([], [{"text": "The company had revenue of 1000."}])
    assert result["status"] == "insufficient_evidence"


def test_contradiction_detected():
    result = verify_results([
        {"metric": "gross_margin", "value": 33.8},
        {"metric": "margin_change", "value": -1.4}
    ], [{"text": "Gross margins improved during the year."}])
    assert result["contradiction"] is True


def test_missing_evidence_handled():
    result = verify_results([], [])
    assert result["status"] == "insufficient_evidence"
