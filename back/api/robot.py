from generator.model.robot import RobotGenerator

from generator.model.sections import TaskSectionGenerator

from flask_restx import Resource, fields, api, Namespace

from api.command import DataResource as CommandDataResource
from api.variable import DataResource as VariableDataResource
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
        [new_task_section.add(x) for x in CommandDataResource.dump()]
        [new_task_section.add(x) for x in IssueDataResource.dump()]

        keywords_section = VariableDataResource.dump()

        robot_generator.add(new_task_section)
        robot_generator.add(keywords_section)
        return robot_generator.dump()