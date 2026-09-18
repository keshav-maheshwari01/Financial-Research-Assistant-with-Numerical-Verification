from __future__ import annotations


def gross_margin(gross_profit: float, revenue: float) -> float:
    if revenue == 0:
        raise ZeroDivisionError("revenue is zero")
    return (gross_profit / revenue) * 100


def operating_margin(operating_income: float, revenue: float) -> float:
    if revenue == 0:
        raise ZeroDivisionError("revenue is zero")
    return (operating_income / revenue) * 100


def net_margin(net_income: float, revenue: float) -> float:
    if revenue == 0:
        raise ZeroDivisionError("revenue is zero")
    return (net_income / revenue) * 100
