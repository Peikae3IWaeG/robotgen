from flask import Flask, render_template, url_for, redirect
from flask import request

from flask_wtf import FlaskForm
from wtforms import StringField

from robot.parsing.lexer.tokens import Token
from robot.parsing.model.statements import Documentation, KeywordCall, Metadata


from robot.parsing.lexer.tokens import Token
from robot.parsing.model.blocks import (
    File,
    TestCase,
    TestCaseSection,
    KeywordSection,
    SettingSection,
)
from robot.parsing.model.statements import (
    SectionHeader,
    KeywordName,
    TestCaseName,
    Documentation,
    KeywordCall,
    Variable,
    KeywordName,
)
from helpers import (
    generate_assign_variable_keyword_section,
    generate_documentation_section,
)
from parsers import Parser, cliParser
from robots import kubectlRobot


a = kubectlRobot()
a.from_params(
    name="Fetch Mismatched FluxCD HelmRelease Version",
    docs=" List helmreleases and use jq to display any releases where the last attempted software revision doesn't match the current running revision. Requires jq.  ",
    tags="FluxCD,Helmrelease,Version,Mismatched,Unhealthy",
    cmd="aaa",
)
cli_parser = cliParser()


test_cases = TestCaseSection(
    header="test",
    body=[
        a.generate_static_stanzas(),
        a.generate_cmd(),
        cli_parser.set_regex(),
        cli_parser.generate_keyword(),
    ],
)


cli = a.generate_cmd()
cli_parser = cliParser().generate_keyword()
sections = [test_cases]
print(sections)

model = File(sections, "testsuite.robot")
model.save()
