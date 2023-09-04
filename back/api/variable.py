from generator.model.keywords import (
    RWCoreImportUserVariable,
    RWCoreImportService,
    RWCoreImportUserSecret,
)

from generator.model.statements import (
    SetSuiteVariableGenerator,
    SetEnvVarSuiteVariableGenerator,
)


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
        "secret": fields.Boolean(default=False),
    },
)


env_variable = api.model(
    "EnvironmentVariable",
    {"name": fields.String, "value": fields.String},
)

service = api.model(
    "Service",
    {
        "name": fields.String,
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

    def add(self, data) -> None:
        variable = data
        self.variables.append(variable)

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
    @api.expect(variable)
    @api.marshal_list_with(variable)
    def post(self):
        """Add variable"""
        VariableDataResource.add(api.payload), 201

    @api.doc("del_var")
    @api.expect(variable)
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
    @api.expect(variable)
    @api.marshal_list_with(variable)
    def post(self):
        """Add secret"""
        VariableDataResource.add(api.payload), 201

    @api.doc("del_secret")
    @api.expect(variable)
    @api.marshal_with(variable)
    def delete(self):
        """Delete secret"""
        VariableDataResource.delete_by_name(api.payload["name"]), 201


@api.route("/env")
class EnvVarList(Resource):
    @api.doc("list_env_vars")
    @api.marshal_list_with(env_variable)
    def get(self):
        """List all vars"""
        return EnvironmentVariableDataResource.variables

    @api.doc("add_env_var")
    @api.expect(env_variable)
    @api.marshal_list_with(env_variable)
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
    @api.expect(service)
    @api.marshal_list_with(service)
    def post(self):
        """Add variable"""
        ServiceImportDataResource.add(api.payload), 201
