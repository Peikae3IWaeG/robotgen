"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import Input from "@mui/material/Input";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material";

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

const AddTask = () => {
  const [formData, setFormData] = useState({
    name: "",
    command: "",
    regex: "",
  });

  const [outputData, setOutputData] = useState(null); // New state variable to hold the output data

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmitRegex = (event) => {
    fetch("http://localhost:5000/command/regex", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Entry added successfully:", data);
      })
      .catch((error) => console.error("Error adding entry:", error));

    setFormData({
      name: "",
      command: "",
      regex: "",
    });
  };

  const handleSubmit = (addevent) => {
    addevent.preventDefault();
    fetch("http://localhost:5000/command/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Entry added successfully:", data);
        window.location.reload();
      })
      .catch((error) => console.error("Error adding entry:", error));
  };

  const handleSubmitGpt = (simevent) => {
    simevent.preventDefault();
    fetch("http://localhost:5000/command/simulate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setOutputData(data); // Update the state with the response data
      })
      .catch((error) => console.error("Error adding entry:", error));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          id="standard-basic"
          required
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          label="Name"
          variant="standard"
        />
        <TextField
          fullWidth
          id="standard-basic"
          required
          type="text"
          name="command"
          value={formData.command}
          onChange={handleInputChange}
          label="Command"
          variant="standard"
        />
        <TextField
          fullWidth
          id="standard-basic"
          type="text"
          name="regex"
          value={formData.regex}
          onChange={handleInputChange}
          label="Parse command output with regex"
          variant="standard"
        />
        <Box textAlign="center">
          <br></br>

          <Button onClick={handleSubmitGpt} type="submit">
            Simulate the output
          </Button>
        </Box>
        <Box textAlign="center">
          <br></br>

          <Button variant="contained" onClick={handleSubmit} type="submit">
            Add Command
          </Button>
        </Box>
      </form>

      {outputData && (
        <Item>
          <h3>Simulated Output</h3>
          <pre>{outputData.gpt_explanation}</pre>
          <h3>Regex numbered groups catches</h3>
          <pre>
            {JSON.stringify(outputData.regex_numbered_explanation, null, 2)}
          </pre>

          <h3>Regex named groups catches</h3>
          <pre>
            {JSON.stringify(outputData.regex_named_explanation, null, 2)}
          </pre>
        </Item>
      )}
    </div>
  );
};

export default AddTask;
