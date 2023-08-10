from flask_restx import Api

from .variable import api as variable_api
from .command import api as command_api
from .settings import api as settings_api
from .robot import api as robot_api
from .issue import api as issue_api
from .gpt import api as gpt_api


api = Api(
    title="Robotgen API",
    version="1.0",
    description="Ass",
)

api.add_namespace(variable_api)
api.add_namespace(command_api)
api.add_namespace(settings_api)
api.add_namespace(robot_api)
api.add_namespace(issue_api)
api.add_namespace(gpt_api)
