from typing import List
import logging
from generator.model.robot import RobotGenerator

from generator.model.sections import (
    TaskSectionGenerator,
    KeywordsSectionGenerator,
    SettingsSectionGenerator,
)
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
from api.settings import DataResource as SettingsDataResource

from api.issue import DataResource as IssueDataResource

from generator.model.robot import RobotGenerators

api = Namespace("robot", description="Robot related operations")

robot = api.model(
    "Robot",
    {
        "name": fields.String,
    },
)


class RobotsResource:
    def __init__(self) -> None:
        self.robots: List(RobotGenerators) = []


robot_generator = RobotGenerator()


@api.route("/")
class RobotDump(Resource):
    @api.doc("dump_robot")
    def get(self):
        """Dump generated robot section"""

        settings_section = SettingsSectionGenerator()
        [settings_section.add(x) for x in SettingsDataResource.dump()]
        new_task_section = TaskSectionGenerator()
        new_task_section.add(TaskStatementGenerator(robot_generator.name))
        new_task_section.add(TaskDocumentationGenerator("Documentation placeholder"))
        new_task_section.add(TaskTagGenerator("some example tags"))
        [new_task_section.add(x) for x in CommandDataResource.dump()]
        [new_task_section.add(x) for x in IssueDataResource.dump()]

        new_keyword_section = KeywordsSectionGenerator()
        [new_keyword_section.add(x) for x in ServiceImportDataResource.dump()]
        [new_keyword_section.add(x) for x in VariableDataResource.dump()]
        [new_keyword_section.add(x) for x in EnvironmentVariableDataResource.dump()]

        robot_generator.add(settings_section)
        robot_generator.add(new_task_section)
        robot_generator.add(new_keyword_section)
        dumped_robot = robot_generator.dump()
        robot_generator._children = []  # temp hack to avoid rewriting
        return dumped_robot


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
        robot_generator.robots = []
        return "ok", 201


@api.route("/name")
class RobotDrop(Resource):
    @api.expect(robot)
    @api.doc("name")
    def post(self):
        """Set name"""
        robot_generator.name = api.payload["name"]
        return "ok", 201
