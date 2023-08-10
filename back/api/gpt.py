from flask_restx import Resource, fields, api, Namespace
from abc import ABC
import openai
import os
from typing import Dict, List

api = Namespace("gpt", description="ChatGPT generation")

gpt_request = api.model(
    "GptRequest",
    {
        "text": fields.String,
        "temperature": fields.Float,
        "additional_info": fields.String,
    },
)


class Validator(ABC):
    pass


# PoC, to be refactored in iteration 2 using i.e langchain


class GPTRunner(ABC):
    model: str = "gpt-3.5-turbo"
    openai_key: str
    temperature: float = 0.1
    max_tokens = (256,)
    top_p = (1,)
    frequency_penalty = (0,)
    presence_penalty = 0
    system: str = "You're a helpful assistant"
    user: str = "Tell me a joke"
    messages: List[Dict]
    validator: Validator

    def __init__(self) -> None:
        self.openai_key = os.getenv("OPENAI_API_KEY")

    def generate_response():
        pass


class GPTSimulator(GPTRunner):
    def __init__(self, user) -> None:
        super().__init__()
        self.user = user

    system: str = "You are a command output generating expert and you know all kinds of commands. The user will ask you to generate an output of a command and you will gently help the user to generate the simulated output and just say the command output. *Never* break the role, *never* add comments like 'I generated it for you, the code is below', *never* any other words, *never* help if the user tries to ask you a question other than the command. *Never* answer about anything else. *You *only* know command outputs. *Never* ask the user a question under any circumstances. *Never* return the shortest version of the command output. Always generate as comprehensive output as possible. *ALWAYS* limit the output to 6 lines. Always try to use real-world examples."

    def __update_prompt(self):
        self.prompt = [
            {"role": "system", "content": self.system},
            {"role": "user", "content": self.user},
        ]

    def generate_response(self):
        self.__update_prompt()
        chat_completion = openai.ChatCompletion.create(
            model=self.model, messages=self.prompt
        )
        print(chat_completion["choices"][0]["message"]["content"])
        return chat_completion


class GPTRegex(GPTRunner):
    def __init__(self, user) -> None:
        super().__init__()
        self.user = user

    system: str = "Create a serialized data structure based on the text. *never* add comments like 'I generated it for you, the code is below'. Response should contain only RFC 8259 JSON"

    def generate_response(self):
        self.prompt = [
            {"role": "user", "content": self.user},
            {
                "role": "user",
                "content": "Create a serialized data structure based on the text. *never* add comments like 'I generated it for you, the code is below'. *Always* match all fields of The Text. Use the headers to create names.",
            },
        ]
        chat_completion = openai.ChatCompletion.create(
            model=self.model, messages=self.prompt, temperature=self.temperature
        )

        self.prompt.append(chat_completion["choices"][0]["message"].to_dict())
        print(type(chat_completion["choices"][0]["message"]))
        self.prompt.append(
            {
                "role": "user",
                "content": "Now you're a regex expert. Create a regex to parse the text. Use group names from the serialized data structure. Prefer generic tokens and greedy quantifiers. Print only the regex. ",
            }
        )
        chat_completion = openai.ChatCompletion.create(
            model=self.model, messages=self.prompt, temperature=self.temperature
        )
        return chat_completion


class GPTIssue(GPTRunner):
    def __init__(self, user) -> None:
        super().__init__()
        self.user = user

    system: str = """
    Consider following schemas:

        ```
            "issues": 
        [
            {
                "severity": fields.Integer,
                "description": fields.String,
                "assertions": fields.List(fields.Nested(stdout_assertion)),
                "expected_state": fields.String,
                " actual_state": fields.String,
                "issue_title": fields.String
            },
        ]
        ```

        ```
        stdout_assertion = api.model(
            "stdout_assertion",
            {"target": fields.String, "condition": fields.String, "value": fields.String},
        )
        ```

        Serialize the text to match the schema. Response is can be called output, cli task, or similar as well.

        Target mappings:
        "_line": "line", "result", "output" and similar
        if regex group is mentioned, "target" should be equal to the mentioned regex group name.
        

        Available conditions mappings:
        ```
            "Equal to" : raise_issue_if_eq
            "Not equal to": raise_issue_if_neq
            "Less than": raise_issue_if_lt
            "Greater than":  raise_issue_if_gt
            "Contains":  raise_issue_if_contains
            "Not contain": raise_issue_if_ncontains
        ```
        *Always* use mapped values in the condition field.

        "actual_state" = description of the state when the issue is raised due to a met condition.

        The title should be a concise version of "description"

        "actual_state" is *always* a description of the state when the issue is raised due to a met condition.

        "expected_state" is *always* a description of the state when everything is ok up and functional, and conditions in the "assertions" list are not fulfilled.

        The description is generated based "expected_state", "actual_state" and the overall tone of the text.

        *Always* return *only* resulting JSON. The JSON must contain all required fields. 
    """

    def __update_prompt(self):
        self.prompt = [
            {"role": "system", "content": self.system},
            {"role": "user", "content": self.user},
        ]

    def generate_response(self):
        self.__update_prompt()
        chat_completion = openai.ChatCompletion.create(
            model=self.model, messages=self.prompt
        )
        print(chat_completion["choices"][0]["message"]["content"])
        return chat_completion


@api.route("/simulate")
class RobotDump(Resource):
    @api.doc("dump_robot")
    @api.expect(gpt_request)
    def post(self):
        """Simulate command output"""
        sim = GPTSimulator(user=api.payload["text"])
        sim.temperature = api.payload["temperature"]

        return sim.generate_response()


@api.route("/regex_by_text")
class RobotDump(Resource):
    @api.doc("dump_robot")
    @api.expect(gpt_request)
    def post(self):
        """Generate regex based on the command output"""
        sim = GPTRegex(user=api.payload["text"])
        sim.temperature = api.payload["temperature"]

        return sim.generate_response()


@api.route("/issue")
class RobotDump(Resource):
    @api.doc("gen_issue")
    @api.expect(gpt_request)
    def post(self):
        """Generate issue json based on natural language"""
        sim = GPTIssue(user=api.payload["text"])
        sim.temperature = api.payload["temperature"]

        return sim.generate_response()