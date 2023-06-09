from flask import Flask, render_template, url_for, redirect
from flask import request

from flask_wtf import FlaskForm
from wtforms import StringField
from robot.parsing.model.blocks import (
    File,
    TestCase,
    TestCaseSection,
    KeywordSection,
    SettingSection,
)

from robot.parsing.lexer.tokens import Token
from robot.parsing.model.statements import (
    Documentation,
    KeywordCall,
)

from helpers import RobotFormNew, IssueForm
from robots import kubectlRobot, cliParser, suiteInit, kubernetesSuiteInit

app = Flask(__name__)
app.config["SECRET_KEY"] = "aaa"


@app.route("/", methods=("GET", "POST"))
def generate_kubernetes():
    form = RobotFormNew()

    issues_list = [IssueForm(prefix=str(x)) for x in range(0, 5)]

    if request.method == "POST":
        robot = kubectlRobot()
        issues_stanzas = []

        for index, issue in enumerate(issues_list):
            raise_issues_from_form = [x.data for x in issue.raise_issue_if]
            targets_from_form = [x.data for x in issue.target]
            assertions_from_form = [x.data for x in issue.assertion]

            if raise_issues_from_form[0] != "none":
                cli_parser = cliParser()
                cli_parser.from_params(
                    name=str(index) + form.name.data,
                    cmd=form.command.data,
                    regex=issue.regex.data,
                    severity=issue.severity.data,
                    raise_issues=raise_issues_from_form,
                    targets=targets_from_form,
                    assertions=assertions_from_form,
                    details="aa",
                )
                issues_stanzas.append(
                    TestCaseSection(
                        header="test",
                        body=[
                            cli_parser.generate_regex(),
                            cli_parser.generate_keyword(),
                        ],
                    )
                )

        robot.from_params(
            name=form.name.data,
            docs=form.docs.data,
            tags=form.tags.data,
            cmd=form.binary.data + " " + form.command.data,
        )

        suite = kubernetesSuiteInit()

        test_cases = TestCaseSection(
            header="Test",
            body=[
                robot.generate_static_stanzas(),
                robot.generate_cmd(),
            ],
        )

        sections = [test_cases] + issues_stanzas + [suite.generate_cmd()]
        model = File(sections, "testsuite.robot")
        model.save()
        f = open("testsuite.robot")
        # print(f.read())
        robotfile = f.read()
        print(robotfile)
        return render_template("show_robot.html", robot_file=robotfile)

    return render_template(
        "create_robot.html", cli_form=form, issue_forms=issues_list, robots=[]
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
