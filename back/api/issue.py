from generator.model.sections import TaskSectionGenerator
from generator.model.keywords import RwCliParseCliOutputByLine

from flask_restx import Resource, fields, api, Namespace, OrderedModel
from typing import List, Dict
from os import getenv
import requests

from api.variable import VariableDataResource as SResource
from api.command import DataResource as CResource
import logging

api = Namespace("issue", description="issue related operations")

stdout_assertion = api.model(
    "stdout_assertion",
    {
        "target": fields.String(required=False, default="_line_"),
        "condition": fields.String,
        "value": fields.String,
    },
)

issue = api.model(
    "issue",
    {
        "id": fields.Integer,
        "severity": fields.Integer,
        "regex": fields.String,
        "response": fields.String,
        "assertions": fields.List(fields.Nested(stdout_assertion)),
        "issue_details": fields.String,
        "issue_title": fields.String,
        "issue_expected": fields.String,
        "issue_actual": fields.String,
    },
)


def generate_chatgpt_description(input):
    url = getenv("SIMULATE_ENDPOINT")
    querystring = {
        "prompt": "Create negation of the following sentence: {}".format(input)
    }
    response = requests.request("GET", url, params=querystring)
    gpt_explanation = response.json()["explanation"]
    return gpt_explanation.lstrip()


class stdoutAssertion(object):
    target: str
    condition: str
    value: str

    def __init__(self, target, condition, value) -> None:
        self.target = target
        self.condition = condition
        self.value = value


class IssueResource(object):
    def __init__(self) -> None:
        self.issues: List(OrderedModel) = []

    def add(self, data) -> None:
        variable = data
        variable["id"] = id(variable)
        self.issues.append(variable)

    def drop(self) -> None:
        self.issues = []

    def delete(self, id) -> None:
        self.issues = [x for x in self.issues if x["id"] != id]

    def __get_command_regex(self, name):
        regex = CResource.get_command_by_name(name)
        if regex["regex"] != "":
            return f"${{{regex['name']}-regex}}"
        return ""

    def dump(self) -> TaskSectionGenerator:
        if len(self.issues) > 0:
            body = []

            for issue in self.issues:
                kwargs = []
                dict_kwargs = {}
                for assertion in issue["assertions"]:
                    print(assertion)
                    kwargs.append(
                        {
                            "{}_{}".format(
                                assertion["target"], assertion["condition"]
                            ): assertion["value"]
                        }
                    )
                    dict_kwargs[
                        "{}_{}".format(assertion["target"], assertion["condition"])
                    ] = assertion["value"]

                body.append(
                    RwCliParseCliOutputByLine(
                        assign_to_variable=False,
                        regex=self.__get_command_regex(issue["response"]),
                        rsp="${{{}}}".format(issue["response"]),
                        set_issue_expected=issue["description"],
                        set_issue_details="More details available here \\n\\n $_stdout \\n\\n ",
                        set_issue_actual="issue_actual placeholder",
                        extra_kwargs=dict_kwargs,
                    )
                )

            return body
        return []


DataResource = IssueResource()


@api.route("/")
class VarList(Resource):
    @api.doc("get_all_issues")
    @api.marshal_list_with(issue)
    def get(self):
        """Get all issues"""
        print(SResource.variables)
        return DataResource.issues

    @api.doc("add_issue")
    @api.expect(issue)
    @api.marshal_list_with(issue)
    def post(self):
        """Add issue"""
        DataResource.add(api.payload), 201

    @api.doc("del_issue")
    @api.expect(issue)
    def delete(self):
        """Delete issue by id"""
        print(api.payload)
        DataResource.delete(api.payload["id"]), 201
