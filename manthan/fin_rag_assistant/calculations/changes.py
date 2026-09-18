from __future__ import annotations


def margin_change(current_margin: float, previous_margin: float) -> float:
    return current_margin - previous_margin


def inventory_change(current_inventory: float, previous_inventory: float) -> float:
    return current_inventory - previous_inventory
