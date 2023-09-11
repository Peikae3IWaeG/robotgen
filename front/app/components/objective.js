"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import HelpIcon from "./helpIcon";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

const ObjectiveForm = () => {
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
    fetch("http://localhost:5000/robot/name", {
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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <HelpIcon info="This value will be used as the task name"></HelpIcon>

        <TextField
          id="standard-basic"
          required
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          label="What is the objective of this codebundle? "
          variant="standard"
          style={{ width: 400 }}
        />

        <Button variant="contained" onClick={handleSubmit} type="submit">
          Apply
        </Button>
      </form>
    </div>
  );
};

export default ObjectiveForm;
