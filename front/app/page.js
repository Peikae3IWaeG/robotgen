import Image from "next/image";
import ApiDataTable from "./components/variables/dataTable";
import AddEntryForm from "./components/variables/uploadForm";
import UploadIssue from "./components/issues/uploadForm";
import CommandDataTable from "./components/commands/dataTable";
import AddTask from "./components/commands/uploadForm";
import RobotDataDisplay from "./components/robot_display";
import MyGrid from "./components/grid";

import IssueDataTable from "./components/issues/dataTable";
import KubectlPreparer from "./components/prepare/kubectl";
import ResetRobot from "./components/robot/reset";

export default function Home() {
  const commandDataTable = <CommandDataTable></CommandDataTable>;

  const topLeftContent = <ApiDataTable></ApiDataTable>;

  const topRightContent = <RobotDataDisplay></RobotDataDisplay>;

  const bottomLeftContent = <AddTask></AddTask>;

  const bottomRightContent = <AddEntryForm></AddEntryForm>;

  const uploadIssue = <UploadIssue></UploadIssue>;

  const issueDataTable = <IssueDataTable></IssueDataTable>;

  const prepareKubectl = <KubectlPreparer></KubectlPreparer>;

  const resetRobot = <ResetRobot></ResetRobot>;

  return (
    <main>
      <MyGrid
        topLeft={topLeftContent}
        topRight={topRightContent}
        bottomLeft={bottomLeftContent}
        bottomRight={bottomRightContent}
        commandDataTable={commandDataTable}
        uploadIssue={uploadIssue}
        issueDataTable={issueDataTable}
        prepareKubectl={prepareKubectl}
        resetRobot={resetRobot}
      ></MyGrid>
    </main>
  );
}
