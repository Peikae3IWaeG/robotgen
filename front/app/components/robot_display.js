"use client";

import React, { useEffect, useState } from "react";

const RobotDataDisplay = () => {
  const [apiData, setApiData] = useState("");

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
      <pre>{apiData}</pre>
    </div>
  );
};

export default RobotDataDisplay;
