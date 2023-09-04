"use client";
import IconButton from "@mui/material/IconButton";
import React, { useEffect, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Item from "./paperitem";
import Toolbar from "@mui/material/Toolbar";

const RobotDataDisplay = () => {
  const [apiData, setApiData] = useState("");

  const handleDrop = () => {
    fetch("http://localhost:5000/robot/drop", {
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/robot/");
        const data = await response.json();
        setApiData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
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

      <pre>{apiData}</pre>
    </div>
  );
};

export default RobotDataDisplay;
