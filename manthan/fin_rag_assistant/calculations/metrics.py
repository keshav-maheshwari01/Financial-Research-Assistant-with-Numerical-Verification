from __future__ import annotations

from typing import Any

import pandas as pd


def _safe_divide(numerator: float | int | None, denominator: float | int | None) -> float | None:
    if numerator is None or denominator is None:
        return None
    if denominator == 0:
        return None
    return float(numerator) / float(denominator)


def _get_company_row(df: pd.DataFrame | None, company: str, year: int) -> pd.Series | None:
    if df is None:
        return None
    rows = df[(df["company"].astype(str).str.strip().str.lower() == company.lower()) & (df["year"] == year)]
    if rows.empty:
        return None
    return rows.iloc[0]


def _make_result(metric: str, value: float | None, unit: str | None, formula: str, inputs: dict[str, Any], source: str = "financials.csv", note: str | None = None) -> dict:
    return {
        "metric": metric,
        "value": value,
        "unit": unit,
        "formula": formula,
        "inputs": inputs,
        "source": source,
        "note": note,
    }


def calculate_metric(metric: str, company: str, year: int, df: pd.DataFrame | None = None, previous_year: int | None = None, metric_name: str | None = None, source: str = "financials.csv") -> dict:
    if df is None:
        df = pd.read_csv("fin_rag_assistant/data/raw/financials/company_a.csv")
        other = pd.read_csv("fin_rag_assistant/data/raw/financials/company_b.csv")
        df = pd.concat([df, other], ignore_index=True)

    row = _get_company_row(df, company, year)
    prev_row = _get_company_row(df, company, previous_year) if previous_year is not None else None

    if row is None:
        return _make_result(metric, None, None, "", {}, source, "missing data")

    if metric == "revenue_growth":
        if prev_row is None or pd.isna(prev_row["revenue"]) or prev_row["revenue"] == 0:
            return _make_result(metric, None, "%", "(revenue_current - revenue_previous) / revenue_previous * 100", {"revenue_current": row.get("revenue"), "revenue_previous": prev_row.get("revenue") if prev_row is not None else None}, source, "division by zero avoided")
        value = ((row["revenue"] - prev_row["revenue"]) / prev_row["revenue"]) * 100
        return _make_result(metric, round(float(value), 2), "%", "(revenue_current - revenue_previous) / revenue_previous * 100", {"revenue_current": float(row["revenue"]), "revenue_previous": float(prev_row["revenue"])}, source)

    if metric == "gross_margin":
        denominator = row.get("revenue")
        val = _safe_divide(row.get("gross_profit"), denominator)
        if val is None:
            return _make_result(metric, None, "%", "gross_profit / revenue * 100", {"gross_profit": row.get("gross_profit"), "revenue": row.get("revenue")}, source, "division by zero avoided")
        return _make_result(metric, round(float(val * 100), 2), "%", "gross_profit / revenue * 100", {"gross_profit": float(row["gross_profit"]), "revenue": float(row["revenue"])}, source)

    if metric == "operating_margin":
        val = _safe_divide(row.get("operating_income"), row.get("revenue"))
        if val is None:
            return _make_result(metric, None, "%", "operating_income / revenue * 100", {"operating_income": row.get("operating_income"), "revenue": row.get("revenue")}, source, "division by zero avoided")
        return _make_result(metric, round(float(val * 100), 2), "%", "operating_income / revenue * 100", {"operating_income": float(row["operating_income"]), "revenue": float(row["revenue"])}, source)

    if metric == "net_margin":
        val = _safe_divide(row.get("net_income"), row.get("revenue"))
        if val is None:
            return _make_result(metric, None, "%", "net_income / revenue * 100", {"net_income": row.get("net_income"), "revenue": row.get("revenue")}, source, "division by zero avoided")
        return _make_result(metric, round(float(val * 100), 2), "%", "net_income / revenue * 100", {"net_income": float(row["net_income"]), "revenue": float(row["revenue"])}, source)

    if metric == "working_capital":
        return _make_result(metric, float(row["current_assets"] - row["current_liabilities"]), "$", "current_assets - current_liabilities", {"current_assets": float(row["current_assets"]), "current_liabilities": float(row["current_liabilities"])}, source)

    if metric == "current_ratio":
        val = _safe_divide(row.get("current_assets"), row.get("current_liabilities"))
        if val is None:
            return _make_result(metric, None, "x", "current_assets / current_liabilities", {"current_assets": row.get("current_assets"), "current_liabilities": row.get("current_liabilities")}, source, "division by zero avoided")
        return _make_result(metric, round(float(val), 2), "x", "current_assets / current_liabilities", {"current_assets": float(row["current_assets"]), "current_liabilities": float(row["current_liabilities"])}, source)

    if metric == "quick_ratio":
        val = _safe_divide(row.get("current_assets") - row.get("inventory"), row.get("current_liabilities"))
        if val is None:
            return _make_result(metric, None, "x", "(current_assets - inventory) / current_liabilities", {"current_assets": row.get("current_assets"), "inventory": row.get("inventory"), "current_liabilities": row.get("current_liabilities")}, source, "division by zero avoided")
        return _make_result(metric, round(float(val), 2), "x", "(current_assets - inventory) / current_liabilities", {"current_assets": float(row["current_assets"]), "inventory": float(row["inventory"]), "current_liabilities": float(row["current_liabilities"])}, source)

    if metric == "roe":
        val = _safe_divide(row.get("net_income"), row.get("shareholders_equity"))
        if val is None:
            return _make_result(metric, None, "%", "net_income / shareholders_equity * 100", {"net_income": row.get("net_income"), "shareholders_equity": row.get("shareholders_equity")}, source, "division by zero avoided")
        return _make_result(metric, round(float(val * 100), 2), "%", "net_income / shareholders_equity * 100", {"net_income": float(row["net_income"]), "shareholders_equity": float(row["shareholders_equity"])}, source)

    if metric == "debt_to_equity":
        val = _safe_divide(row.get("total_debt"), row.get("shareholders_equity"))
        if val is None:
            return _make_result(metric, None, "x", "total_debt / shareholders_equity", {"total_debt": row.get("total_debt"), "shareholders_equity": row.get("shareholders_equity")}, source, "division by zero avoided")
        return _make_result(metric, round(float(val), 2), "x", "total_debt / shareholders_equity", {"total_debt": float(row["total_debt"]), "shareholders_equity": float(row["shareholders_equity"])}, source)

    if metric == "inventory_change":
        if prev_row is None:
            return _make_result(metric, None, "units", "inventory_current - inventory_previous", {"inventory_current": row.get("inventory"), "inventory_previous": None}, source, "missing previous year data")
        value = row["inventory"] - prev_row["inventory"]
        return _make_result(metric, float(value), "units", "inventory_current - inventory_previous", {"inventory_current": float(row["inventory"]), "inventory_previous": float(prev_row["inventory"])}, source)

    if metric == "margin_change":
        current_metric = metric_name or "gross_margin"
        current = calculate_metric(current_metric, company, year, df)
        prior = calculate_metric(current_metric, company, previous_year, df) if previous_year is not None else None
        if current.get("value") is None or prior is None or prior.get("value") is None:
            return _make_result(metric, None, "%", "margin_current - margin_previous", {"margin_current": current.get("value"), "margin_previous": prior.get("value") if prior else None}, source, "missing previous year data")
        value = current["value"] - prior["value"]
        return _make_result(metric, round(float(value), 2), "%", "margin_current - margin_previous", {"margin_current": float(current["value"]), "margin_previous": float(prior["value"])}, source)

    raise ValueError(f"Unsupported metric: {metric}")


def compute_metric_bundle(metric_name: str, company: str, year: int, df: pd.DataFrame | None = None, previous_year: int | None = None, source: str = "financials.csv") -> list[dict]:
    results = []
    if metric_name in {"revenue_growth", "gross_margin", "operating_margin", "net_margin", "working_capital", "current_ratio", "quick_ratio", "roe", "debt_to_equity", "inventory_change"}:
        results.append(calculate_metric(metric_name, company, year, df=df, previous_year=previous_year, source=source))
    if previous_year is not None and metric_name in {"gross_margin", "operating_margin", "net_margin"}:
        results.append(calculate_metric("margin_change", company, year, df=df, previous_year=previous_year, metric_name=metric_name, source=source))
    return results
