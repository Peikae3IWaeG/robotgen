"use client";
import IconButton from "@mui/material/IconButton";
import React, { useEffect, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Box from "@mui/material/Box";
import Item from "./paperitem";
import Toolbar from "@mui/material/Toolbar";

const RobotDataDisplay = () => {
  const [apiData, setApiData] = useState("");
  const [
    outputData = { status: "unknown", log_html_url: "", report_html_url: "" },
    setOutputData,
  ] = useState(null);

  const handleDrop = () => {
    fetch("http://localhost:5127/robot/drop", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Workspace reset sucesful");
        window.location.reload();
      })
      .catch((error) =>
        console.error("Error resetting robot workspace", error),
      );
  };
  const handleRun = () => {
    fetch("http://localhost:5127/robot/run", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setOutputData(response);
      })
      .catch((error) =>
        console.error("Error resetting robot workspace", error),
      );
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5127/robot/");
        const data = await response.json();
        setApiData(data["data"]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <IconButton
        sx={{ marginRight: "auto" }}
        onClick={() => handleRun()}
        aria-label="Run"
      >
        {" "}
        <PlayArrowIcon /> Run{" "}
      </IconButton>
      <IconButton
        onClick={() => navigator.clipboard.writeText(apiData)}
        aria-label="delete"
      >
        {" "}
        <ContentCopyIcon /> Copy{" "}
      </IconButton>
      <IconButton
        sx={{ marginRight: "auto" }}
        onClick={() => handleDrop()}
        aria-label="delete"
      >
        {" "}
        <DeleteIcon /> Reset{" "}
      </IconButton>
      {outputData && (
        <Item>
          <h3>Status: {outputData["status"]}</h3>
          <h3>
            <a href={outputData["log_html_url"]}>Log</a>
          </h3>
          <h3>
            <a href={outputData["report_html_url"]}>Report</a>
          </h3>
        </Item>
      )}{" "}
      {/* {outputData.map(outputData => <div>{outputData.status}</div>)} */}
      <pre>{apiData}</pre>
      <IconButton
        sx={{ marginRight: "auto" }}
        onClick={() => handleRun()}
        aria-label="Run"
      >
        {" "}
        <PlayArrowIcon /> Run{" "}
      </IconButton>
      <IconButton
        onClick={() => navigator.clipboard.writeText(apiData)}
        aria-label="delete"
      >
        {" "}
        <ContentCopyIcon /> Copy{" "}
      </IconButton>
      <IconButton
        sx={{ marginRight: "auto" }}
        onClick={() => handleDrop()}
        aria-label="delete"
      >
        {" "}
        <DeleteIcon /> Reset{" "}
      </IconButton>
    </div>
  );
};

export default RobotDataDisplay;
