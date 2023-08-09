"use client";

import React, { useState } from "react";
import Button from "@mui/material/Button";

const ResetRobot = () => {
  const [data, setData] = useState(null);

  const fetchData = (event) => {
    event.preventDefault();
    fetch("http://localhost:5000/robot/drop")
      .then((response) => response.json())
      .then((data) => setData(data))
      .then(window.location.reload())
      .catch((error) => console.error("Error fetching data:", error));
  };

  return (
    <div>
      <Button variant="contained" onClick={fetchData}>
        Reset workspace
      </Button>

      {data && (
        <div>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ResetRobot;
