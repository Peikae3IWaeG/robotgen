"use client";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import React, { useState } from "react";
import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import HelpIcon from "../helpIcon";
import Item from "../paperitem";
import DialogComponent from "./regexDialog";
import Typography from "@mui/material/Typography";
const CommandForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    command: "",
    regex: "",
    additional_info: "",
  });
  const [regexResult, setRegexResult] = useState(null);
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
    fetch("http://localhost:5127/command/", {
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
    fetch("http://localhost:5127/gpt/simulate", {
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

  const handleRegexRequest = () => {
    if (outputData && outputData.gpt_explanation) {
      fetch("http://localhost:5127/gpt/regex_by_text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: outputData.gpt_explanation }),
      })
        .then((response) => response.json())
        .then((regexData) => {
          setRegexResult(regexData.gpt_explanation);
          console.log(JSON.parse(JSON.stringify(regexData.gpt_explanation)));
          setRegexResult(JSON.parse(JSON.stringify(regexData.gpt_explanation)));
        })
        .catch((error) => console.error("Error fetching regex result:", error));
    }
  };

  return (
    <div>
      <FormControl style={{ minWidth: 300 }}>
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
            name="additional_info"
            value={formData.additional_info}
            onChange={handleInputChange}
            label="Optionally describe the simulated output in details"
            variant="standard"
          />
          <HelpIcon info="I.e. if you used `kubectl get pods command`, you can tell ChatGPT to make sure that output contains crashing pods by simply writing down `one of the pods should be in CrashLoopBackOff state` "></HelpIcon>

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
          <p></p>
          <Typography variant="p" color="primary">
            You can compose regex with ChatGPT-powered form, try to write it
            manually, or simulate the command output and then generate a regex
            based on the simulated output by clicking the button on the bottom.
          </Typography>

          <DialogComponent></DialogComponent>

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
      </FormControl>

      {outputData && (
        <Box>
          <Box>
            <h3>
              Simulated Output
              <HelpIcon info="This is only a ChatGPT-generated simulation of the command and can be inaccurate."></HelpIcon>
            </h3>
          </Box>
          <Item sx={{ overflow: "auto" }}>
            <pre>{outputData.gpt_explanation}</pre>
          </Item>
          {outputData && outputData.gpt_explanation && (
            <Box textAlign="center">
              <p></p>
              <Button variant="contained" onClick={handleRegexRequest}>
                Guess regex
              </Button>
            </Box>
          )}

          {regexResult && (
            <Box>
              <h3>
                Regex result
                <HelpIcon info="Copy generated regex and run simulation again. You can also use regex101 to manually adjust the regex. "></HelpIcon>
              </h3>
              <Item sx={{ overflow: "auto" }}>
                <IconButton
                  onClick={() => navigator.clipboard.writeText(regexResult)}
                  aria-label="delete"
                >
                  {" "}
                  <ContentCopyIcon /> Copy{" "}
                </IconButton>
                <pre>{regexResult}</pre>
              </Item>
              <p></p>
              <Box textAlign="center"></Box>
            </Box>
          )}

          <h3>Regex groups catches</h3>
          <Item sx={{ overflow: "auto" }}>
            <pre>
              {JSON.stringify(outputData.regex_numbered_explanation, null, 2)}
            </pre>
          </Item>
        </Box>
      )}
    </div>
  );
};

export default CommandForm;
