from itertools import count
from typing import Dict, List

from ..models import PlanCreate, PlanOut

_plans_by_date: Dict[str, List[PlanOut]] = {}
_id_counter = count(1)


def add_plan(date: str, plan: PlanCreate) -> PlanOut:
    new_plan = PlanOut(id=next(_id_counter), **plan.dict())
    _plans_by_date.setdefault(date, []).append(new_plan)
    return new_plan


def get_plans(date: str) -> List[PlanOut]:
    return list(_plans_by_date.get(date, []))
