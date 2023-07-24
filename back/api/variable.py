from generator.model.sections import KeywordsSectionGenerator
from generator.model.keywords import RWCoreImportUserVariable

from generator.model.statements import SetSuiteVariableGenerator


from flask_restx import Resource, fields, api, Namespace, OrderedModel
from typing import List

api = Namespace("variables", description="Variables related operations")

variable = api.model(
    "Variable",
    {
        "name": fields.String,
        "description": fields.String,
        "pattern": fields.String,
        "example": fields.String,
        "default": fields.String,
    },
)


class VariableResource(object):
    def __init__(self) -> None:
        self.variables: List(OrderedModel) = []

    def add(self, data) -> None:
        variable = data
        self.variables.append(variable)

    def dump(self) -> KeywordsSectionGenerator:
        section = KeywordsSectionGenerator()

        if len(self.variables) > 0:
            [
                section.add(
                    RWCoreImportUserVariable(
                        assign_to_variable=True,
                        variable=x["name"],
                        example=x["example"],
                        description=x["description"],
                        default=x["default"],
                    )
                )
                for x in self.variables
            ]

            [section.add(SetSuiteVariableGenerator(x["name"])) for x in self.variables]
        return section


DataResource = VariableResource()


@api.route("/")
class VarList(Resource):
    @api.doc("list_vars")
    @api.marshal_list_with(variable)
    def get(self):
        """List all vars"""
        return DataResource.variables

    @api.doc("add_var")
    @api.expect(variable)
    @api.marshal_list_with(variable)
    def post(self):
        """Add variable"""
        DataResource.add(api.payload), 201
