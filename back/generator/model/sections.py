from .robot import Component
from .statements import KeywordSuiteInitialization

from typing import List

from robot.parsing.lexer.tokens import Token


from robot.parsing.model.statements import SectionHeader, Statement

from robot.parsing.model.blocks import (
    Section,
)


class SectionGenerator(Component):
    composite: bool = True
    section_header: SectionHeader

    def __init__(self) -> None:
        self._children: List(Component) = []

    def add(self, component: Statement) -> None:
        self._children.append(component)
        component.parent = self

    def dump(self) -> Section:
        return Section(
            header=self.section_header, body=[x.dump() for x in self._children]
        )


class SettingsSectionGenerator(SectionGenerator):
    section_header: SectionHeader = SectionHeader.from_params(Token.SETTING_HEADER)

    def __init__(self) -> None:
        super().__init__()


class KeywordsSectionGenerator(SectionGenerator):
    section_header: SectionHeader = SectionHeader.from_params(Token.KEYWORD_HEADER)

    def __init__(self) -> None:
        super().__init__()
        self.add(KeywordSuiteInitialization())


class TaskSectionGenerator(SectionGenerator):
    section_header: SectionHeader = SectionHeader.from_params(Token.TASK_HEADER)

    def __init__(self) -> None:
        super().__init__()
