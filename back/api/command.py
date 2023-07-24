from generator.model.sections import TaskSectionGenerator
from generator.model.keywords import RwCliRunCli

from os import getenv

from flask_restx import Resource, fields, api, Namespace, OrderedModel
from typing import List

from api.variable import DataResource as VResource

import requests

api = Namespace("command", description="Command related operations")

command = api.model(
    "Command",
    {
        "name": fields.String,
        "command": fields.String,
    },
)


class CommandResource(object):
    def __init__(self) -> None:
        self.commands: List(OrderedModel) = []

    def add(self, data) -> None:
        variable = data
        self.commands.append(variable)

    def dump(self) -> TaskSectionGenerator:
        if len(self.commands) > 0:
            body = [
                RwCliRunCli(
                    assign_to_variable=True,
                    variable=x["name"],
                    cmd=x["command"],
                )
                for x in self.commands
            ]

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
    @api.expect(command)
    @api.marshal_list_with(command)
    def post(self):
        """Add command"""
        DataResource.add(api.payload), 201


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
        response = requests.request("GET", url, params=querystring)
        result = response.json()["explanation"]
        print(result)
        return result
