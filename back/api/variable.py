from generator.model.keywords import (
    RWCoreImportUserVariable,
    RWCoreImportService,
    RWCoreImportUserSecret,
)

from generator.model.statements import (
    SetSuiteVariableGenerator,
    SetEnvVarSuiteVariableGenerator,
)

import re
from flask_restx import Resource, fields, api, Namespace, OrderedModel, abort
from typing import List
from robot.variables.assigner import VariableAssigner

api = Namespace("variables", description="Variables related operations")

variable = api.model(
    "Variable",
    {
        "name": fields.String(required=True),
        "description": fields.String(),
        "pattern": fields.String,
        "example": fields.String,
        "default": fields.String,
        "secret": fields.Boolean(default=False),
    },
)


env_variable = api.model(
    "EnvironmentVariable",
    {"name": fields.String(required=True), "value": fields.String(required=True)},
)

service = api.model(
    "Service",
    {
        "name": fields.String(required=True),
        "description": fields.String,
        "default": fields.String,
        "example": fields.String,
    },
)


class VariableResource(object):
    def __init__(self) -> None:
        self.variables: List(OrderedModel) = []

    def drop(self) -> None:
        self.variables = []

    def delete_by_name(self, name) -> None:
        self.variables = [x for x in self.variables if x["name"] != name]

    def _name_validator(self, value):
        _valid_extended_attr = VariableAssigner._valid_extended_attr
        if _valid_extended_attr.match(value) is None:
            abort(
                400,
                msg="Name invalid. Please use a snake_case naming convention. For further info refer to https://docs.robotframework.org/docs/variables",
            )

    def _regex_validator(self, value):
        if value != "":
            try:
                re.compile(value)
            except re.error:
                abort(400, msg="Provided pattern does not compile into a regex")

    def add(self, data) -> None:
        self._name_validator(data["name"])
        self._regex_validator(data["pattern"])

        self.variables.append(data)

    def dump(self) -> List:
        body = []
        if len(self.variables) > 0:
            for x in self.variables:
                if x["secret"]:
                    body.append(
                        RWCoreImportUserSecret(
                            assign_to_variable=True,
                            variable=x["name"],
                            example=x["example"],
                            description=x["description"],
                            default=x["default"],
                        )
                    )
                else:
                    body.append(
                        RWCoreImportUserVariable(
                            assign_to_variable=True,
                            variable=x["name"],
                            example=x["example"],
                            description=x["description"],
                            default=x["default"],
                        )
                    )
                body.append(SetSuiteVariableGenerator(x["name"]))
        return body

    def dump_secret_variables(self) -> List:
        return [x for x in self.variables if x["secret"] == True]

    def dump_plain_variables(self) -> List:
        return [x for x in self.variables if x["secret"] == False]


class ServiceImportResource(object):
    def __init__(self) -> None:
        self.variables: List(OrderedModel) = []

    def drop(self) -> None:
        self.variables = []

    def add(self, data) -> None:
        variable = data
        self.variables.append(variable)

    def dump(self) -> List:
        body = []
        if len(self.variables) > 0:
            for x in self.variables:
                body.append(
                    RWCoreImportService(
                        name=x["name"],
                        description=x["description"],
                        example=x["example"],
                        default=x["default"],
                    )
                )
                body.append(SetSuiteVariableGenerator(x["name"]))
        return body


class EnvironmentVariableResource(object):
    def __init__(self) -> None:
        self.variables: List(OrderedModel) = []

    def drop(self) -> None:
        self.variables = []

    def add(self, data) -> None:
        variable = data
        self.variables.append(variable)

    def dump(self) -> List:
        body = []
        if len(self.variables) > 0:
            for x in self.variables:
                body.append(
                    SetEnvVarSuiteVariableGenerator(name=x["name"], value=x["value"])
                )
        return body

    def dump_variables(self) -> List:
        return [x for x in self.variables]


VariableDataResource = VariableResource()
EnvironmentVariableDataResource = EnvironmentVariableResource()
ServiceImportDataResource = ServiceImportResource()


@api.route("/robot/plain")
class VarList(Resource):
    @api.doc("list_vars")
    @api.marshal_list_with(variable)
    def get(self):
        """List all vars"""
        return VariableDataResource.dump_plain_variables()

    @api.doc("add_var")
    @api.expect(variable, validate=True)
    @api.marshal_with(variable)
    def post(self):
        """Add variable"""
        VariableDataResource.add(api.payload), 201

    @api.doc("del_var")
    @api.expect(variable, validate=True)
    @api.marshal_with(variable)
    def delete(self):
        """Delete variable"""
        VariableDataResource.delete_by_name(api.payload["name"]), 201


@api.route("/robot/secret")
class SecretList(Resource):
    @api.doc("list_secrets")
    @api.marshal_list_with(variable)
    def get(self):
        """List all secrets"""
        return VariableDataResource.dump_secret_variables()

    @api.doc("add_secret")
    @api.expect(variable, validate=True)
    @api.marshal_with(variable)
    def post(self):
        """Add secret"""
        VariableDataResource.add(api.payload), 201

    @api.doc("del_secret")
    @api.expect(variable, validate=True)
    @api.marshal_with(variable)
    def delete(self):
        """Delete secret"""
        VariableDataResource.delete_by_name(api.payload["name"]), 201


@api.route("/env")
class EnvVarList(Resource):
    @api.doc("list_env_vars")
    def get(self):
        """List all vars"""
        return EnvironmentVariableDataResource.variables

    @api.doc("add_env_var")
    @api.expect(env_variable, validate=True)
    @api.marshal_with(env_variable)
    def post(self):
        """Add variable"""
        EnvironmentVariableDataResource.add(api.payload), 201


@api.route("/service")
class ServiceList(Resource):
    @api.doc("list_services")
    @api.marshal_list_with(service)
    def get(self):
        """List all vars"""
        return ServiceImportDataResource.variables

    @api.doc("add_service")
    @api.expect(service, validate=True)
    @api.marshal_with(service)
    def post(self):
        """Add variable"""
        ServiceImportDataResource.add(api.payload), 201
