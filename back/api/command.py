from generator.model.sections import TaskSectionGenerator
from generator.model.keywords import RwCliRunCli, Catenate

from os import getenv
import re
from flask_restx import Resource, fields, api, Namespace, OrderedModel, reqparse, abort
from typing import List
from robot.variables.assigner import VariableAssigner
from api.variable import VariableDataResource as VResource

import requests

api = Namespace("command", description="Command related operations")

command = api.model(
    "Command",
    {
        "name": fields.String(required=True),
        "command": fields.String(required=False),
        "regex": fields.String(required=False, default=""),
        "target_service": fields.String(required=False, default="")
    },
)


class CommandResource(object):
    def __init__(self) -> None:
        self.commands: List(OrderedModel) = []

    def drop(self) -> None:
        self.commands = []

    def delete_by_name(self, name) -> None:
        self.commands = [x for x in self.commands if x["name"] != name]

    def get_command_by_name(self, name) -> OrderedModel:
        return [x for x in self.commands if x["name"] == name][0]

    def add(self, data) -> None:
        self._name_validator(data["name"])
        self._command_validator(data["command"])
        self._regex_validator(data["regex"])
        data['target_service'] = self._target_service_mutator(data['command'])
        self.commands.append(data)

    def dump_regex(self, name, regex):
        if regex != "":
            body = Catenate(
                assign_to_variable=True, variable="{}-regex".format(name), args=[regex]
            )
            return body
        return None

    def _target_service_mutator(self, value):
        if value != "":
            if "kube" in value.lower():
                return "${kubectl}"
            if "gcloud" in value.lower():
                return "${gcloud}"
            if "curl" in value.lower():
                return "${curl}"
            if "aws" in value.lower():
                return "${aws}"
        return "${kubectl}" #fallback
    
    def _configure_kubernetes(self, data):
        pass 
    
    def _configure_gcloud(self, data):
        pass

    def _name_validator(self, value):
        _valid_extended_attr = VariableAssigner._valid_extended_attr
        if _valid_extended_attr.match(value) is None:
            abort(
                400,
                msg="Name invalid. Please use a snake_case naming convention. For further info refer to https://docs.robotframework.org/docs/variables",
            )

    def _command_validator(self, value):
        if value == "":
            abort(400, msg="Command can not be an empty string")

    def _regex_validator(self, value):
        if value != "":
            try:
                re.compile(value)
            except re.error:
                abort(
                    400, msg="Can not compile provided regex. Please verify the regex."
                )

    def dump(self) -> TaskSectionGenerator:
        if len(self.commands) > 0:
            body = []
            for x in self.commands:
                body.append(
                    RwCliRunCli(
                        assign_to_variable=True,
                        variable=x["name"],
                        cmd=x["command"],
                        target_service=x["target_service"]
                    )
                )
                regex = self.dump_regex(x["name"], x["regex"])
                # print(regex)
                if regex != None:
                    body.append(regex)
            return body
        return []


DataResource = CommandResource()


@api.route("/")
class VarList(Resource):
    @api.doc("list_command")
    @api.marshal_list_with(command)
    def get(self):
        """List commands"""
        print(VResource.variables)
        return DataResource.commands

    @api.doc("add_commands")
    @api.expect(command, validate=True)
    @api.marshal_list_with(command)
    def post(self):
        """Add command"""
        DataResource.add(api.payload), 201

    @api.doc("delete_commands")
    @api.expect(command, validate=True)
    def delete(self):
        """Delete command"""
        DataResource.delete_by_name(api.payload["name"]), 201


@api.route("/simulate")
class VarList(Resource):
    @api.expect(command)
    @api.doc("simulate_cmd_output")
    def post(self):
        """Simulate output with ChatGPT"""
        url = getenv("SIMULATE_ENDPOINT")

        querystring = {
            "prompt": "Simulate output of the following comand. The output should have as much lines as possible. {}".format(
                api.payload["command"]
            )
        }

        regex = api.payload["regex"]
        response = requests.request("GET", url, params=querystring)
        gpt_explanation = response.json()["explanation"]
        regex_numbered_explanation: List() = []
        regex_named_explanation: List() = []
        if regex != "":
            try:
                for line in gpt_explanation.split("\n"):
                    regexp_results = re.search(regex, line)
                    if regexp_results:
                        regex_numbered_explanation.append(
                            {line: regexp_results.groups()}
                        )
                        regex_named_explanation.append(regexp_results.groupdict())
            except Exception as e:
                print(e)

        result = {
            "gpt_explanation": gpt_explanation,
            "regex_numbered_explanation": regex_numbered_explanation,
            "regex_named_explanation": regex_named_explanation,
        }
