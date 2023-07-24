from generator.model.sections import SettingsSectionGenerator
from generator.model.statements import DocumentationStatementGenerator
from flask_restx import Resource, fields, api, Namespace, OrderedModel


api = Namespace("settings", description="Command related operations")

settings = api.model(
    "Settings",
    {
        "author": fields.String,
        "display_name": fields.String,
        "libraries": fields.List(fields.String),
        "docs": fields.String,
    },
)


class SettingsResource(object):
    content: OrderedModel

    def __init__(self) -> None:
        pass

    def set(self, data) -> None:
        self.content = data

    def dump(self) -> str:
        section = SettingsSectionGenerator()
        section.add(DocumentationStatementGenerator(self.docs))


DataResource = SettingsResource()


@api.route("/")
class VarList(Resource):
    @api.doc("set_metadata")
    @api.expect(settings)
    @api.marshal_with(settings)
    def post(self):
        """Set Settings section"""
        DataResource.set(api.payload), 201
        return "ok"

    @api.doc("show_metadata")
    @api.marshal_with(settings)
    def get(self):
        """Show settings section"""
        return DataResource.content
