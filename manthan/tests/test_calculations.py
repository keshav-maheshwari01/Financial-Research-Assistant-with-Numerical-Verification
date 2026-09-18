import math

from fin_rag_assistant.calculations.metrics import calculate_metric, compute_metric_bundle


import pandas as pd


def test_revenue_growth_formula():
    result = calculate_metric("revenue_growth", company="Acme Retail Inc.", year=2024, df=None, previous_year=2023)
    assert result["metric"] == "revenue_growth"
    assert math.isclose(result["value"], 12.08, rel_tol=1e-6)
    assert result["formula"] == "(revenue_current - revenue_previous) / revenue_previous * 100"


def test_gross_margin_formula():
    result = calculate_metric("gross_margin", company="Acme Retail Inc.", year=2024, df=None)
    assert result["metric"] == "gross_margin"
    assert math.isclose(result["value"], 34.06, rel_tol=1e-6)


def test_net_margin_formula():
    result = calculate_metric("net_margin", company="Acme Retail Inc.", year=2024, df=None)
    assert result["metric"] == "net_margin"
    assert math.isclose(result["value"], 8.12, rel_tol=1e-6)


def test_margin_change_formula():
    result = calculate_metric("margin_change", company="Acme Retail Inc.", year=2024, df=None, previous_year=2023, metric_name="gross_margin")
    assert result["metric"] == "margin_change"
    assert math.isclose(result["value"], 0.26, rel_tol=1e-6)


def test_working_capital_formula():
    result = calculate_metric("working_capital", company="Acme Retail Inc.", year=2024, df=None)
    assert result["metric"] == "working_capital"
    assert result["value"] == 140


def test_division_by_zero_handled():
    df = pd.DataFrame([
        {
            "company": "Acme Retail Inc.",
            "year": 2024,
            "revenue": 640,
            "cost_of_revenue": 422,
            "gross_profit": 218,
            "operating_income": 85,
            "net_income": 52,
            "current_assets": 450,
            "current_liabilities": 0,
            "inventory": 125,
            "total_assets": 1065,
            "shareholders_equity": 330,
            "total_debt": 220,
        }
    ])
    result = calculate_metric("current_ratio", company="Acme Retail Inc.", year=2024, df=df)
    assert result["value"] is None
    assert result["note"] == "division by zero avoided"
