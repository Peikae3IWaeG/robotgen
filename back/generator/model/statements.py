"""" 
This module contains models for generating statements,
that are not sections and keywords invocations
"""
from robot.parsing.lexer.tokens import Token
from robot.parsing.model.statements import (
    Statement,
    Metadata,
    Documentation,
)

from .robot import Component


class StatementGenerator(Component):
    """
    Component used as a parent for other specific statement components

    Args: todo
    Methods: todo
    """

    composite: bool = False
    statement: Statement
    value: str

    def dump(self) -> Statement:
        return self.statement


class TaskStatementGenerator(StatementGenerator):
    """
    A class to generate Test Case statement
    https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#test-case-name-and-documentation

    Args: todo
    Methods: todo
    """

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
    """
    A class to generate a Test Case documentation statement

    Args: todo
    Methods: todo
    """

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


class TaskTagGenerator(StatementGenerator):
    """
    A class to generate a Test Case tags statement

    Args: todo
    Methods: todo
    """

    def __init__(self, value) -> None:
        super().__init__()
        self.value = value
        self.statement = Documentation.from_tokens(
            tokens=[
                Token(Token.SEPARATOR, "    "),
                Token(Token.DOCUMENTATION, "[Tags]"),
                Token(Token.SEPARATOR, "       "),
                Token(Token.ARGUMENT, self.value),
                Token(Token.EOL, "\n"),
            ]
        )


class DocumentationStatementGenerator(StatementGenerator):
    """
    A class to generate a Documentation statement

    Args: todo
    Methods: todo
    """

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


class AuthorStatementGenerator(StatementGenerator):
    """
    A class to generate a Documentation statement

    Args: todo
    Methods: todo
    """

    def __init__(self, value) -> None:
        super().__init__()
        self.value = value

        self.statement = Documentation.from_tokens(
            tokens=[
                Token(Token.DOCUMENTATION, "Author"),
                Token(Token.SEPARATOR, "       "),
                Token(Token.ARGUMENT, self.value),
                Token(Token.EOL, "\n"),
            ]
        )


class MetadataStatementGenerator(StatementGenerator):
    """
    A class to generate a Metadata key-value statement

    Args: todo
    Methods: todo
    """

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
    """
    A class to generate a single Library statement

    Args: todo
    Methods: todo
    """

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
    """
    A class to generate a Suite Setup statement

    Args: todo
    Methods: todo
    """

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


class KeywordSuiteInitialization(StatementGenerator):
    """
    A class to generate a Suite Setup statement

    Args: todo
    Methods: todo
    """

    value: str = "Suite Initialization"

    def __init__(self) -> None:
        super().__init__()

        self.statement = Metadata.from_tokens(
            tokens=[
                Token(Token.ARGUMENT, "Suite Initialization"),
                Token(Token.EOL, "\n"),
            ]
        )


class SuiteInitializationGenerator(StatementGenerator):
    """
    A class to generate a Suite Initialization statement

    Args: todo
    Methods: todo
    """

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
    """
    A class to generate a Set Suite Variable Statement

    Args: todo
    Methods: todo
    """

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


class SetEnvVarSuiteVariableGenerator(StatementGenerator):
    """
    A class to generate a Set Suite Variable Statement

    Args: todo
    Methods: todo
    """

    def __init__(self, name, value) -> None:
        super().__init__()
        self.name = name
        self.value = value

        self.statement = Metadata.from_tokens(
            tokens=[
                Token(Token.SEPARATOR, "    "),
                Token(Token.METADATA, "Set Suite Variable"),
                Token(Token.SEPARATOR, "             "),
                Token(Token.ARGUMENT, "${env}"),
                Token(Token.SEPARATOR, "    "),
                Token(Token.ARGUMENT, str({name: value})),
                Token(Token.EOL, "\n"),
            ]
        )
