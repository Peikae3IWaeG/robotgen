from flask import Flask, render_template, url_for, redirect
from flask import request

from flask_wtf import FlaskForm
from wtforms import StringField

from robot.parsing.lexer.tokens import Token
from robot.parsing.model.statements import (
    Documentation,
    VariablesImport,
    KeywordCall,
)

# from forms.forms import Settings, TaskForm, TaskKeywordFormNew

from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, BooleanField, FieldList, SelectField
from wtforms.validators import InputRequired, Length
from wtforms.validators import DataRequired

SEVERITIES = (1, 2, 3, 4)

ACTIONS = [
    ("none", "-"),
    ("raise_issue_if_eq", "Equal to"),
    ("raise_issue_if_neq", "Not equal to"),
    ("raise_issue_if_lt", "Less than"),
    ("raise_issue_if_gt", "Greater than"),
    ("raise_issue_if_contains", "Contains"),
    ("raise_issue_if_ncontains", "Not contains"),
]

VAR_TYPES = [("string"), ("othertype-1"), ("othertype-2")]


class RobotFormNew(FlaskForm):
    command = StringField("Command")
    name = StringField("Display Name")
    tags = StringField("Tags comma separated")
    docs = StringField("Docs")
    id = StringField("id")
    regex = StringField(
        "Filter stdout lines by regex. Ommit this field to evaluate all lines"
    )


class CustomVariableForm(FlaskForm):
    name = StringField("Variable Name")
    type = SelectField(label="Type", choices=VAR_TYPES)
    default = StringField("Set the default value")
    example = StringField("Example")
    description = StringField("Extra description")
    enum = StringField("Enumerated values to choose from")
    secret = BooleanField("Secret")


class IssueForm(FlaskForm):
    details = StringField("Description")
    regex = StringField(
        "Filter stdout lines by regex. Ommit this field to evaluate all lines"
    )
    severity = SelectField(label="Severity", choices=SEVERITIES)
    raise_issue_if = FieldList(
        SelectField(label="Raise issue if: ", choices=ACTIONS),
        min_entries=5,
        max_entries=5,
    )
    target = FieldList(
        StringField(label="'_line' or one of regex capture group names"),
        min_entries=5,
        max_entries=5,
    )
    assertion = FieldList(
        StringField(label="Assertion: "), min_entries=5, max_entries=5
    )


def generate_assign_variable_keyword_section(assign_variable, keyword, parameters):
    return generate_assign_header(assign_variable, keyword) + generate_keyword(
        parameters
    )


def generate_simple_keyword_section(keyword, parameters):
    return generate_simple_header(keyword) + generate_keyword(parameters)


def generate_keyword(paramaters):
    a = []
    for key in paramaters:
        argument = (
            "{}={}".format(key, paramaters[key])
            if key != ""
            else "{}".format(paramaters[key])
        )

        a.append(
            [
                Token(
                    Token.SEPARATOR,
                    "    ",
                ),
                Token(Token.CONTINUATION, "..."),
                Token(Token.SEPARATOR, "    "),
                Token(Token.ARGUMENT, argument),
                Token(Token.EOL, "\n"),
            ]
        )
    a = flatten(a)
    # print(a[:-1])
    return a


def generate_assign_header(var_name, keyword):
    assigner = "${{{}}}=".format(var_name)
    entity = [
        Token(Token.SEPARATOR, "    "),
        Token(Token.ASSIGN, assigner),
        Token(Token.SEPARATOR, "    "),
        Token(Token.KEYWORD, keyword),
        Token(Token.EOL, "\n"),
    ]
    return entity


def generate_simple_header(keyword):
    entity = [
        Token(Token.SEPARATOR, "    "),
        Token(Token.KEYWORD, keyword),
        Token(Token.EOL, "\n"),
    ]
    return entity


def keyword_header(keyword, params):
    return [
        Token(Token.SEPARATOR, "    "),
        Token(Token.KEYWORD, keyword),
        Token(Token.SEPARATOR, "    "),
        Token(Token.KEYWORD, params),
        Token(Token.EOL, "\n"),
    ]


def set_suite_variable(param1, param2):
    return VariablesImport.from_tokens(
        tokens=[
            Token(Token.KEYWORD, "Set Suite Variable"),
            Token(Token.SEPARATOR, "    "),
            Token(Token.KEYWORD, "${{{}}}".format(param1)),
            Token(Token.SEPARATOR, "    "),
            Token(Token.KEYWORD, "${{{}}}".format(param2)),
            Token(Token.EOL, "\n"),
        ]
    )


def generate_documentation_section(content):
    return Documentation.from_tokens(
        tokens=[
            Token(Token.SEPARATOR, "    "),
            Token(Token.DOCUMENTATION, "[Documentation]"),
            Token(Token.SEPARATOR, "    "),
            Token(Token.ARGUMENT, content),
            Token(Token.EOL, "\n"),
        ]
    )


def generate_tags_section(tags_list):
    tags_token_list = []
    for tag in tags_list:
        tags_token_list.append(Token(Token.SEPARATOR, "    "))
        tags_token_list.append(Token(Token.ARGUMENT, tag))
    return Documentation.from_tokens(
        tokens=[Token(Token.SEPARATOR, "    "), Token(Token.TAGS, "[Tags]")]
        + tags_token_list
        + [Token(Token.EOL, "\n")]
    )


def flatten(l):
    return [item for sublist in l for item in sublist]


def generate_keyword_usage_section(keyword, parameters):
    return keyword_header(keyword, parameters)
