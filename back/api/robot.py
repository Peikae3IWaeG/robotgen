from generator.model.robot import RobotGenerator

from generator.model.sections import TaskSectionGenerator, KeywordsSectionGenerator
from generator.model.statements import (
    TaskStatementGenerator,
    TaskDocumentationGenerator,
    TaskTagGenerator,
)

from flask_restx import Resource, fields, api, Namespace

from api.command import DataResource as CommandDataResource
from api.variable import VariableDataResource
from api.variable import ServiceImportDataResource
from api.variable import EnvironmentVariableDataResource

from api.issue import DataResource as IssueDataResource

api = Namespace("robot", description="Robot related operations")

robot = api.model(
    "Robot",
    {
        "placeholder": fields.String,
    },
)


@api.route("/")
class RobotDump(Resource):
    @api.doc("dump_robot")
    def get(self):
        """Dump generated robot section"""
        robot_generator = RobotGenerator()

        new_task_section = TaskSectionGenerator()
        new_task_section.add(
            TaskStatementGenerator("Test task for running all commands")
        )
        new_task_section.add(TaskDocumentationGenerator("Documentation placeholder"))
        new_task_section.add(TaskTagGenerator("some example tags"))
        [new_task_section.add(x) for x in CommandDataResource.dump()]
        [new_task_section.add(x) for x in IssueDataResource.dump()]

        new_keyword_section = KeywordsSectionGenerator()
        [new_keyword_section.add(x) for x in ServiceImportDataResource.dump()]
        [new_keyword_section.add(x) for x in VariableDataResource.dump()]
        [new_keyword_section.add(x) for x in EnvironmentVariableDataResource.dump()]

        robot_generator.add(new_task_section)
        robot_generator.add(new_keyword_section)
        return robot_generator.dump()


@api.route("/drop")
class RobotDrop(Resource):
    @api.doc("drop_all")
    def get(self):
        """Drop everything"""
        CommandDataResource.drop()
        IssueDataResource.drop()
        VariableDataResource.drop()
        EnvironmentVariableDataResource.drop()
        ServiceImportDataResource.drop()
        return "ok", 201
