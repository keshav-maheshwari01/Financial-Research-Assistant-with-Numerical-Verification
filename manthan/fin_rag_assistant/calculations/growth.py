from __future__ import annotations


def revenue_growth(current_revenue: float, previous_revenue: float) -> float:
    if previous_revenue == 0:
        raise ZeroDivisionError("previous revenue is zero")
    return ((current_revenue - previous_revenue) / previous_revenue) * 100
