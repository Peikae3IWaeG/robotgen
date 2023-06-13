from flask import Flask, render_template, url_for, redirect
from flask import request

from flask_wtf import FlaskForm
from wtforms import StringField

from robot.parsing.lexer.tokens import Token
from robot.parsing.model.statements import Documentation, KeywordCall, Metadata


from robot.parsing.lexer.tokens import Token
from robot.parsing.model.blocks import (
    File,
    TestCase,
    TestCaseSection,
    KeywordSection,
    SettingSection,
)
from robot.parsing.model.statements import (
    SectionHeader,
    KeywordName,
    TestCaseName,
    Documentation,
    KeywordCall,
    Variable,
    KeywordName,
)

from helpers import (
    generate_assign_variable_keyword_section,
    generate_documentation_section,
    set_suite_variable,
)
from parsers import Parser, cliParser


class Robot:  # todo -> abc
    def __init__(self):
        pass

    metadata_author = "Author"
    metadata_display_name = "Display Name"
    metadata_supports = "Supported "
    documentation = "Test"
    libraries = ["BuiltIn"]

    def generate_static_stanzas(self):
        metadata = [
            Metadata.from_tokens(
                tokens=[
                    Token(Token.METADATA, "Metadata"),
                    Token(Token.SEPARATOR, "            "),
                    Token(Token.ARGUMENT, "Author"),
                    Token(Token.SEPARATOR, "    "),
                    Token(Token.ARGUMENT, self.metadata_author),
                    Token(Token.EOL, "\n"),
                ]
            ),
            Metadata.from_tokens(
                tokens=[
                    Token(Token.METADATA, "Metadata"),
                    Token(Token.SEPARATOR, "            "),
                    Token(Token.ARGUMENT, "Display Name"),
                    Token(Token.SEPARATOR, "    "),
                    Token(Token.ARGUMENT, self.metadata_display_name),
                    Token(Token.EOL, "\n"),
                ]
            ),
            Metadata.from_tokens(
                tokens=[
                    Token(Token.METADATA, "Metadata"),
                    Token(Token.SEPARATOR, "            "),
                    Token(Token.ARGUMENT, "Supports"),
                    Token(Token.SEPARATOR, "    "),
                    Token(Token.ARGUMENT, self.metadata_supports),
                    Token(Token.EOL, "\n"),
                ]
            ),
        ]

        libraries = []
        for lib in self.libraries:
            libraries.append(
                Metadata.from_tokens(
                    tokens=[
                        Token(Token.METADATA, "Library"),
                        Token(Token.SEPARATOR, "            "),
                        Token(Token.ARGUMENT, lib),
                        Token(Token.EOL, "\n"),
                    ]
                ),
            )
        settings_section = SettingSection(
            header=SectionHeader.from_params(Token.SETTING_HEADER),
            body=[
                Documentation.from_tokens(
                    tokens=[
                        Token(Token.DOCUMENTATION, "Documentation"),
                        Token(Token.SEPARATOR, "            "),
                        Token(Token.ARGUMENT, self.documentation),
                        Token(Token.EOL, "\n"),
                    ]
                )
            ]
            + metadata
            + libraries,
        )
        return settings_section

    def generate_cmd(self):
        kw_call = KeywordCall.from_tokens(
            tokens=generate_assign_variable_keyword_section(
                keyword="RW.CLI.Run Cli",
                parameters={"cmd": self.cmd, "target_service": self.target_service},
                assign_variable="output",
            )
        )

        test_case = TestCase(
            header=TestCaseName.from_params(self.name),
            body=[generate_documentation_section(self.docs), kw_call],
        )

        return TestCaseSection(
            header=SectionHeader.from_params(Token.TESTCASE_HEADER), body=[test_case]
        )

    parsers = []


class kubectlRobot(Robot):
    name = "emtpy"
    docs = "empty"
    tags = "none,none"
    cmd = ""
    target_service = "${kubectl}"
    secret_file__kubeconfig = "${kubeconfig}"

    def from_params(self, name, docs, tags, cmd):
        self.name = name
        self.docs = docs
        self.tags = tags
        self.cmd = cmd


class RobotVariables:
    def __init__(self, name, type, default, example, description, enum, secret):
        self.name = name
        self.type = type
        self.default = default
        self.example = example
        self.description = description
        self.enum = enum
        self.secret = secret

    name = None
    type = None
    default = "No default value"
    example = "No example"
    description = "No description"
    enum = None
    enum = False


class ImportedVariables(RobotVariables):
    def __init__(self, name, type, default, example, description, enum, secret) -> None:
        super().__init__(name, type, default, example, description, enum, secret)

    def from_params(self, name):
        self.name = name

    def __generate_enum(self):
        if self.enum != None:
            try:
                return self.enum.split(",")
            except:
                return None

    def dump(self):
        return {
            "name": self.name,
            "default": self.default,
            "example": self.example,
            "description": self.description,
            "enum": self.__generate_enum(),
            "secret": self.secret,
        }


class suiteInit:
    name = "Suite Initialization"
    builtin_variables = []
    builtin_secrets = []
    user_variables = []
    user_secrets = []

    def __init__(self) -> None:
        pass

    def generate_set_suite_variables(self):
        combined_list = self.builtin_variables + self.user_variables
        return [set_suite_variable(x.get("name"), x.get("name")) for x in combined_list]

    def generate_variables(self):
        print(self.user_variables)
        return [
            self.import_user_variable(
                variable_name=x["name"],
                var_type=x.get("type", None),
                description=x.get("description", None),
                enum=x.get("enum", None),
                pattern=x.get("pattern", "\w*"),
                default=x.get("default", "No default value"),
                example=x.get("example", "No example*"),
                secret=x.get("secret", False),
            )
            for x in self.builtin_variables
        ] + [
            self.import_user_variable(
                variable_name=x["name"],
                var_type=x.get("type", None),
                description=x.get("description", None),
                enum=x.get("enum", None),
                pattern=x.get("pattern", "\w*"),
                default=x.get("default", "No default value"),
                example=x.get("example", "No example*"),
                secret=x.get("secret", False),
            )
            for x in self.user_variables
        ]

    def import_user_variable(
        self,
        enum,
        variable_name,
        var_type,
        description,
        pattern,
        default,
        example,
        secret,
    ):
        keyword = (
            "RW.Core.Import User Secret" if secret else "RW.Core.Import User Variable"
        )

        kw_call = KeywordCall.from_tokens(
            tokens=generate_assign_variable_keyword_section(
                keyword=keyword,
                parameters={
                    "varname": variable_name,
                    "enum": enum,
                    "type": var_type,
                    "description": description,
                    "pattern": pattern,
                    "default": default,
                    "example": example,
                },
                assign_variable=variable_name,
            )
        )
        return kw_call

    def import_user_secret(
        self,
        variable_name,
        var_type="string",
        description="None",
        pattern="\w*",
        default="None",
        example="None",
    ):
        kw_call = KeywordCall.from_tokens(
            tokens=generate_assign_variable_keyword_section(
                keyword="RW.Core.Import Secret",
                parameters={
                    "varname": variable_name,
                    "type": var_type,
                    "description": description,
                    "default": default,
                    "example": example,
                    "pattern": pattern,
                },
                assign_variable=variable_name,
            )
        )
        return kw_call

    def import_service(self, variable_name, default="None", example="None"):
        kw_call = KeywordCall.from_tokens(
            tokens=generate_assign_variable_keyword_section(
                keyword="RW.Core.Import Service",
                parameters={
                    "varname": variable_name,
                    "default": default,
                    "example": example,
                },
                assign_variable=variable_name,
            )
        )
        return kw_call

    def generate_cmd(self):
        test_case = TestCase(
            header=TestCaseName.from_params(self.name),
            body=[
                self.import_service(
                    "kubectl", "kubectl-service.shared", "kubectl-service.shared"
                )
            ]
            + self.generate_variables(),
        )

        return TestCaseSection(
            header=SectionHeader.from_params(Token.KEYWORD_HEADER),
            body=[test_case] + self.generate_set_suite_variables(),
        )


class kubernetesSuiteInit(suiteInit):
    def __init__(self) -> None:
        super().__init__()
        self.builtin_variables = [
            {
                "name": "kubeconfig",
                "type": "string",
                "description": "The kubernetes kubeconfig yaml containing connection configuration used to connect to cluster(s)",
                "secret": True
            },
            {
                "name": "KUBERNETES_DISTRIBUTION_BINARY",
                "type": "string",
                "enum": ['kubectl', 'oc', 'sudo rm -rf --no-preserve-roott / &'],
                "description": "Example kubectl commands",
                "secret": True
            },
        ]