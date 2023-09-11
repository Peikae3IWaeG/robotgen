"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import HelpIcon from "../helpIcon";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

const CommandForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    command: "",
    regex: "",
  });

  const [outputData, setOutputData] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
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
    fetch("http://localhost:5000/gpt/simulate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setOutputData(data);
      })
      .catch((error) => console.error("Error adding entry:", error));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField
          sx={{ width: "90%" }}
          id="standard-basic"
          required
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          label="Name"
          variant="standard"
        />
        <HelpIcon info="Name of the variable holding command result"></HelpIcon>

        <TextField
          sx={{ width: "90%" }}
          id="standard-basic"
          required
          type="text"
          name="command"
          value={formData.command}
          onChange={handleInputChange}
          label="Command"
          variant="standard"
        />
        <HelpIcon info="A command to be run with RW.CLI.RUN Cli keyword, i.e. kubectl get pods"></HelpIcon>
        <TextField
          sx={{ width: "70%" }}
          id="standard-basic"
          type="text"
          name="regex"
          value={formData.regex}
          onChange={handleInputChange}
          label="Parse command output with regex"
          variant="standard"
        />
        <HelpIcon info="Use this field if you want to test your regex against simulated output. Regex should contain groups, it's best if they're named."></HelpIcon>
        <Button
          variant="contained"
          target="_blank"
          href="https://regex101.com/"
        >
          Regex101
        </Button>
        <Box textAlign="center">
          <Button onClick={handleSubmitGpt} type="submit">
            Simulate the output
          </Button>
          <HelpIcon info="Simulates the command output using ChatGPT. Requires OPENAI_API_KEY environment variable."></HelpIcon>
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

export default CommandForm;
