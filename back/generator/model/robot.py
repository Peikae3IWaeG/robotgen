from __future__ import annotations
from abc import ABC, abstractmethod
from typing import List

from typing import List

from robot.parsing.model.blocks import File

from robot.parsing.model.statements import (
    SectionHeader,
    Statement,
)


from robot.parsing.model.blocks import (
    File,
)


class Component(ABC):
    header: SectionHeader
    body: List(Statement)

    def add(self, component: Component) -> None:
        pass

    def remove(self, component: Component) -> None:
        pass

    def can_have_children(self) -> bool:
        return False

    def is_base_section(self) -> bool:
        return True

    def generate_section() -> None:
        pass

    def dump() -> None:
        pass


class RobotGenerator(Component):
    composite: bool = True

    def __init__(self) -> None:
        self._children: List(Component) = []

    def add(self, component: Component) -> None:
        self._children.append(component)
        component.parent = self

    def dump(self) -> str:
        robot_model = File([x.dump() for x in self._children], "testsuite.robot")
        robot_model.save()
        f = open("testsuite.robot")
        return f.read()
