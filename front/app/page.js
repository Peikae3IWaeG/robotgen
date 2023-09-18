"use client";
import VariablesTable from "./components/variables/dataTable";
import VariablesForm from "./components/variables/uploadForm";

import SecretsTable from "./components/secrets/dataTable";
import SecretsForm from "./components/secrets/uploadForm";

import CommandTable from "./components/commands/dataTable";
import CommandForm from "./components/commands/uploadForm";

import IssueForm from "./components/issues/uploadForm";
import IssueTable from "./components/issues/dataTable";

import RobotDataDisplay from "./components/robot_display";

import MyGrid from "./components/grid";

import KubectlPreparer from "./components/prepare/kubectl";
import GcloudPreparer from "./components/prepare/gcloud";
import CurlPreparer from "./components/prepare/curl";

export default function Home() {
  const secretsTable = <SecretsTable></SecretsTable>;
  const secretsUpload = <SecretsForm></SecretsForm>;

  const variablesForm = <VariablesForm></VariablesForm>;
  const variablesTable = <VariablesTable></VariablesTable>;

  const issueForm = <IssueForm></IssueForm>;
  const issueTable = <IssueTable></IssueTable>;

  const commandForm = <CommandForm></CommandForm>;
  const commandTable = <CommandTable></CommandTable>;

  const robotDataDisplay = <RobotDataDisplay></RobotDataDisplay>;

  const prepareKubectl = <KubectlPreparer></KubectlPreparer>;
  const prepareGcloud = <GcloudPreparer></GcloudPreparer>;
  const prepareCurl = <CurlPreparer></CurlPreparer>;

  return (
    <main>
      <MyGrid
        secretsTable={secretsTable}
        secretsForm={secretsUpload}
        variablesForm={variablesForm}
        variablesTable={variablesTable}
        issueForm={issueForm}
        issueTable={issueTable}
        commandForm={commandForm}
        commandTable={commandTable}
        robotDataDisplay={robotDataDisplay}
        prepareKubectl={prepareKubectl}
        prepareGcloud={prepareGcloud}
        prepareCurl={prepareCurl}
      ></MyGrid>
    </main>
  );
}
