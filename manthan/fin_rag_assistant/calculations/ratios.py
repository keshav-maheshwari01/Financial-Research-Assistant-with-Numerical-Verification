from __future__ import annotations


def working_capital(current_assets: float, current_liabilities: float) -> float:
    return current_assets - current_liabilities


def current_ratio(current_assets: float, current_liabilities: float) -> float:
    if current_liabilities == 0:
        raise ZeroDivisionError("current liabilities are zero")
    return current_assets / current_liabilities


def quick_ratio(current_assets: float, inventory: float, current_liabilities: float) -> float:
    if current_liabilities == 0:
        raise ZeroDivisionError("current liabilities are zero")
    return (current_assets - inventory) / current_liabilities


def roe(net_income: float, shareholders_equity: float) -> float:
    if shareholders_equity == 0:
        raise ZeroDivisionError("shareholders equity is zero")
    return (net_income / shareholders_equity) * 100


def debt_to_equity(total_debt: float, shareholders_equity: float) -> float:
    if shareholders_equity == 0:
        raise ZeroDivisionError("shareholders equity is zero")
    return total_debt / shareholders_equity
