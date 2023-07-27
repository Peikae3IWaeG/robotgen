from generator.model.sections import TaskSectionGenerator
from generator.model.keywords import RwCliRunCli, Catenate

from os import getenv
import re 
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
        "regex": fields.String
    },
)


class CommandResource(object):
    
    def __init__(self) -> None:
        self.commands: List(OrderedModel) = []

    def drop(self) -> None:
        self.commands = []

    def get_command_by_name(self, name) -> OrderedModel:
        return [x for x in self.commands if x['name']==name][0]

    def add(self, data) -> None:
        variable = data
        self.commands.append(variable)
        
    def dump_regex(self, name, regex):
        if regex != "":
            body = Catenate(assign_to_variable=True, variable="{}-regex".format(name), args=[regex])
            return body 
        return None

    def dump(self) -> TaskSectionGenerator:
        if len(self.commands) > 0:
            body = []
            for x in self.commands:
                body.append(
                    RwCliRunCli(
                        assign_to_variable=True,
                        variable=x["name"],
                        cmd=x["command"],
                    )
                )
                regex = self.dump_regex(x['name'], x['regex'])
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
        
        regex = api.payload["regex"]    
        response = requests.request("GET", url, params=querystring)
        gpt_explanation = response.json()["explanation"]
        regex_numbered_explanation: List() = []
        regex_named_explanation: List() = []
        if regex != "":
            try:        
                for line in gpt_explanation.split('\n'):
                    regexp_results = re.search(regex, line)
                    if regexp_results:
                        regex_numbered_explanation.append({line:regexp_results.groups()})
                        regex_named_explanation.append(regexp_results.groupdict())
            except Exception as e:
                print(e)
                
        result = {
            "gpt_explanation": gpt_explanation,
            "regex_numbered_explanation": regex_numbered_explanation,
            "regex_named_explanation": regex_named_explanation
        }
        
        # print(regexp_results.groups())
        
        
        # print(result)
        return result
