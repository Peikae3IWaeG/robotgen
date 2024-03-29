from .robot import Component

from robot.parsing.model.statements import KeywordCall
from robot.parsing.lexer.tokens import Token
from typing import List

import logging


def flatten(l):
    return [item for sublist in l for item in sublist]


class KeywordCallGenerator(Component):
    composite: bool = False
    name: str = "noName"
    assign_to_variable: bool = False
    variable: str = ""
    eol: str = "\n"
    args = []
    kwargs = {}

    statement: KeywordCall

    def __init__(self, assign_to_variable=False, variable="", eol="\n") -> None:
        super().__init__()
        self.assign_to_variable = assign_to_variable
        self.variable = variable
        self.eol = eol

    def _args_generator(self) -> None:
        generated_list = []
        for x in self.args:
            generated_list.append(
                [
                    Token(Token.SEPARATOR, "    "),
                    Token(Token.CONTINUATION, "..."),
                    Token(Token.SEPARATOR, "    "),
                    Token(Token.ARGUMENT, x),
                    Token(Token.EOL, "\n"),
                ]
            )
        return flatten(generated_list)

    def _kwargs_generator(self) -> list:
        generated_list = []
        for key, value in self.kwargs.items():
            if value != "":
                generated_list.append(
                    [
                        Token(Token.SEPARATOR, "    "),
                        Token(Token.CONTINUATION, "..."),
                        Token(Token.SEPARATOR, "    "),
                        Token(Token.ARGUMENT, "{}={}".format(key, value)),
                        Token(Token.EOL, self.eol),
                    ]
                )
        return flatten(generated_list)

    def dump(self) -> KeywordCall:
        tokens = []

        if self.assign_to_variable:
            header = [
                Token(Token.SEPARATOR, "    "),
                Token(Token.ASSIGN, "${{{}}}=".format(self.variable)),
                Token(Token.SEPARATOR, "    "),
                Token(Token.KEYWORD, self.name),
                Token(Token.EOL, self.eol),
            ]
        else:
            header = [
                Token(Token.SEPARATOR, "    "),
                Token(Token.KEYWORD, self.name),
                Token(Token.EOL, self.eol),
            ]
        tokens = tokens + header
        dupa = tokens + self._args_generator() + self._kwargs_generator()
        return KeywordCall.from_tokens(tokens=dupa)


class RWCoreImportUserVariable(KeywordCallGenerator):
    name: str = "RW.Core.Import User Variable"

    def __init__(
        self,
        assign_to_variable=False,
        variable="",
        type: str = "string",
        pattern: str = "\w",
        example: str = "example",
        description: str = "description",
        default: str = "",
    ) -> None:
        super().__init__(assign_to_variable, variable)
        self.kwargs = {
            "varname": variable,
            "type": type,
            "description": description,
            "pattern": pattern,
            "example": example,
            "default": default,
        }


class RWCoreImportUserSecret(RWCoreImportUserVariable):
    name: str = "RW.Core.Import Secret"

    def __init__(
        self,
        assign_to_variable=False,
        variable="",
        type: str = "string",
        pattern: str = "\w",
        example: str = "example",
        description: str = "description",
        default: str = "",
    ) -> None:
        super().__init__(assign_to_variable, variable)
        self.kwargs = {
            "varname": variable,
            "type": type,
            "description": description,
            "pattern": pattern,
            "example": example,
            "default": default,
        }


class RWCoreImportService(KeywordCallGenerator):
    name: str = "RW.Core.Import Service"

    def __init__(
        self,
        assign_to_variable=True,
        name="",
        example: str = "",
        description: str = "description",
        default: str = "",
    ) -> None:
        super().__init__(assign_to_variable, name)
        self.kwargs = {
            "varname": name,
            "description": description,
            "example": example,
            "default": default,
        }


class RWCoreImportUserSecret(RWCoreImportUserVariable):
    name: str = "RW.Core.Import Secret"


class RwCliRunCli(KeywordCallGenerator):
    name: str = "RW.CLI.Run Cli"

    def __init__(
        self,
        assign_to_variable=False,
        variable="",
        cmd: str = "string",
        render_in_commandlist: bool = True,
        target_service: str = "${kubectl}",
        secrets: any = [],
        secert_files: any = [],
        envs: any = [],
        # secret_file__kubeconfig: any = "${kubeconfig}",
    ) -> None:
        super().__init__(assign_to_variable, variable)

        kwargs = {
            "cmd": cmd,
            "render_in_commandlist": render_in_commandlist,
            "target_service": target_service,
        }

        if "kubectl" in cmd.lower():
            kwargs.update({"secret_file__kubeconfig": "${kubeconfig}"})
        else:
            secrets_kwargs = dict(
                [(f"secret__{secret}", f"${{{secret}}}") for secret in secrets]
            )
            kwargs.update(secrets_kwargs)

        if len([env for env in envs]) > 0:
            kwargs.update({"env": "${env}"})
        self.kwargs = kwargs


class RwCliParseCliOutputByLine(KeywordCallGenerator):
    name: str = "RW.CLI.Parse Cli Output By Line"

    rsp: str
    set_severity_level: int
    set_issue_details: str

    def __init__(
        self,
        assign_to_variable=False,
        variable="",
        rsp: str = "",
        regex: str = "",
        set_severity_level: int = 1,
        set_issue_expected: str = "",
        set_issue_actual: str = "",
        set_issue_title: str = "",
        set_issue_details: str = "",
        extra_kwargs={},
    ) -> None:
        super().__init__()

        self.kwargs = {
            "rsp": rsp,
            "lines_like_regexp": regex,
            "set_severity_level": set_severity_level,
            "set_issue_details": set_issue_details,
            "set_issue_expected": set_issue_expected,
            "set_issue_actual": set_issue_actual,
            "set_issue_title": set_issue_title,
        }

        self.kwargs.update(extra_kwargs)


class Catenate(KeywordCallGenerator):
    name: str = "Catenate"

    def __init__(
        self, assign_to_variable=False, variable="", kwargs={}, args: List = []
    ) -> None:
        super().__init__(assign_to_variable, variable)
        self.args = args


# class IssueAssertions(KeywordCallGenerator):
#     name: str = "\n"

#     def __init__(
#         self, assign_to_variable=False, variable="", kwargs={"dupa":"seks"}, args=[]
#     ) -> None:
#         super().__init__(assign_to_variable, variable, eol="")
#         self.kwargs = kwargs
