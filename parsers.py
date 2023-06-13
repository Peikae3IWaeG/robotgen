from flask import Flask, render_template, url_for, redirect
from flask import request

from flask_wtf import FlaskForm
from wtforms import StringField

from robot.parsing.lexer.tokens import Token
from robot.parsing.model.statements import Documentation, KeywordCall, Metadata

# from forms.forms import Settings, TaskForm, TaskKeywordFormNew

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


from helpers import generate_assign_variable_keyword_section


class Parser:
    name = "placeholder"
    parameters = {}
    render_in_commandlist = True

    def from_params(self, name, cmd):
        self.name = name
        self.parameters = {"cmd": cmd}

    def generate_keyword(self):
        kw_call = KeywordCall.from_tokens(
            tokens=generate_assign_variable_keyword_section(
                keyword=self.keyword,
                parameters=self.parameters,
                assign_variable=self.var_name,
            )
        )
        return kw_call


class cliParser(Parser):
    name = "example"
    keyword = "RW.CLI.Parse Cli Output By Line"
    details = ""
    regex = ""
    severity = 0
    raise_issues = ["", "", "", "", ""]
    targets = ["", "", "", "", ""]
    assertions = ["", "", "", "", ""]

    cmd = "None"
    parameters = {
        "rsp": "${output}",
    }

    def __gen_regex_param(self):
        if self.regex == "":
            return {}
        return {"lines_like_regexp": "${{{}}}-regexp".format(self.name)}

    def generate_keyword(self):
        new_params = {
            "set_severity_level": self.severity,
        }

        params_dict = {}
        for i in range(0, 5):
            if self.targets[i] != "":
                params_dict[
                    "{}_{}".format(self.targets[i], self.raise_issues[i])
                ] = self.assertions[i]
        # print(params_dict)

        additional_parameters = {
            "set_issue_title": "Running command |{}| failed ".format(self.cmd),
            "set_issue_expected": "Command output should pass following tests: {}".format(
                params_dict
            ),
            "set_issue_actual": "Command output validation failed against one of following: {}".format(
                params_dict
            ),
            "set_issue_details": self.details,
        }

        combined_params = (
            self.parameters
            | new_params
            | self.__gen_regex_param()
            | additional_parameters
            | params_dict
        )

        kw_call = KeywordCall.from_tokens(
            tokens=generate_assign_variable_keyword_section(
                keyword=self.keyword,
                parameters=combined_params,
                assign_variable="{}-parser-output".format(self.name),
            )
        )
        return kw_call

    def from_params(
        self, name, regex, severity, raise_issues, targets, assertions, cmd, details
    ):
        self.name = name
        self.regex = regex
        self.severity = severity
        self.raise_issues = raise_issues
        self.targets = targets
        self.assertions = assertions
        self.cmd = (cmd,)
        self.details = details

    RECOGNIZED_STDOUT_PARSE_QUERIES = [
        "raise_issue_if_eq",
        "raise_issue_if_neq",
        "raise_issue_if_lt",
        "raise_issue_if_gt",
        "raise_issue_if_contains",
        "raise_issue_if_ncontains",
    ]

    def append_extra_parameters(self, extra_params):
        self.parameters = self.parameters + extra_params

    def set_regex(self, regex):
        self.regex = regex

    def generate_regex(self):
        if self.regex != "":
            kw_call = KeywordCall.from_tokens(
                tokens=generate_assign_variable_keyword_section(
                    keyword="Evaluate",
                    parameters={"": 'r "' + str(self.regex) + '"'},
                    assign_variable="{}-regexp".format(self.name),
                )
            )
            return kw_call

    def line_parser(self):
        pass

    def regex_parser(self):
        pass
