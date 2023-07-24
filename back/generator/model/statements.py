from .robot import Component

from typing import List

from robot.parsing.lexer.tokens import Token


from robot.parsing.model.statements import (
    SectionHeader,
    Statement,
    Metadata,
    Documentation,
    KeywordCall,
)


from robot.parsing.model.blocks import (
    Section,
)


class StatementGenerator(Component):
    def dump(self) -> Statement:
        pass

    composite: bool = False
    statement: Statement

    def dump(self) -> Statement:
        return self.statement


class TaskStatementGenerator(StatementGenerator):
    value: str

    def __init__(self, value) -> None:
        super().__init__()
        self.value = value

        self.statement = Documentation.from_tokens(
            tokens=[
                Token(Token.ARGUMENT, self.value),
                Token(Token.EOL, "\n"),
            ]
        )


class TaskDocumentationGenerator(StatementGenerator):
    value: str

    def __init__(self, value) -> None:
        super().__init__()
        self.value = value
        self.statement = Documentation.from_tokens(
            tokens=[
                Token(Token.SEPARATOR, "    "),
                Token(Token.DOCUMENTATION, "[Documentation]"),
                Token(Token.SEPARATOR, "       "),
                Token(Token.ARGUMENT, self.value),
                Token(Token.EOL, "\n"),
            ]
        )


class DocumentationStatementGenerator(StatementGenerator):
    value: str

    def __init__(self, value) -> None:
        super().__init__()
        self.value = value

        self.statement = Documentation.from_tokens(
            tokens=[
                Token(Token.DOCUMENTATION, "Documentation"),
                Token(Token.SEPARATOR, "       "),
                Token(Token.ARGUMENT, self.value),
                Token(Token.EOL, "\n"),
            ]
        )


class MetadataStatementGenerator(StatementGenerator):
    key: str
    value: str

    def __init__(self, key, value) -> None:
        super().__init__()
        self.key = key
        self.value = value

        self.statement = Metadata.from_tokens(
            tokens=[
                Token(Token.METADATA, "Metadata"),
                Token(Token.SEPARATOR, "            "),
                Token(Token.ARGUMENT, key),
                Token(Token.SEPARATOR, "    "),
                Token(Token.ARGUMENT, value),
                Token(Token.EOL, "\n"),
            ]
        )


class LibraryStatementGenerator(StatementGenerator):
    value: str

    def __init__(self, value) -> None:
        super().__init__()
        self.value = value

        self.statement = Metadata.from_tokens(
            tokens=[
                Token(Token.METADATA, "Library"),
                Token(Token.SEPARATOR, "             "),
                Token(Token.ARGUMENT, value),
                Token(Token.EOL, "\n"),
            ]
        )


class SuiteSetupGenerator(StatementGenerator):
    value: str = "Suite Initialization"

    def __init__(self) -> None:
        super().__init__()

        self.statement = Metadata.from_tokens(
            tokens=[
                Token(Token.METADATA, "Suite Setup"),
                Token(Token.SEPARATOR, "         "),
                Token(Token.ARGUMENT, self.value),
                Token(Token.EOL, "\n"),
            ]
        )


class SuiteInitializationGenerator(StatementGenerator):
    value: str = "Suite Initialization"

    composite: bool = False

    def __init__(self) -> None:
        super().__init__()

        self.statement = Metadata.from_tokens(
            tokens=[
                Token(Token.METADATA, "Suite Initialization"),
                Token(Token.EOL, "\n"),
            ]
        )


class SetSuiteVariableGenerator(StatementGenerator):
    value: str

    def __init__(self, value) -> None:
        super().__init__()
        self.value = value

        self.statement = Metadata.from_tokens(
            tokens=[
                Token(Token.SEPARATOR, "    "),
                Token(Token.METADATA, "Set Suite Variable"),
                Token(Token.SEPARATOR, "             "),
                Token(Token.ARGUMENT, "${{{}}}".format(value)),
                Token(Token.SEPARATOR, "    "),
                Token(Token.ARGUMENT, "${{{}}}".format(value)),
                Token(Token.EOL, "\n"),
            ]
        )
