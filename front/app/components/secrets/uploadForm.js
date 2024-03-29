"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import HelpIcon from "../helpIcon";

const SecretsForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pattern: "",
    example: "",
    default: "",
    secret: true,
  });

  const handleInputChange = (event) => {
    const { name, value, checked, type } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost:5127/variables/robot/secret", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.status >= 400 && response.status <= 599) {
          return response.json().then((errorData) => {
            const errorMessage = errorData.msg || "Unknown error occurred.";
            alert(errorMessage);
            throw new Error(errorMessage);
          });
        } else {
          return response.json();
        }
      })
      .then((data) => {
        console.log("Entry added successfully:", data);
        window.location.reload();
      })
      .catch((error) => console.error("Error adding entry:", error));
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
          <HelpIcon info="Name of the user-defined secret"></HelpIcon>

          <TextField
            sx={{ width: "90%" }}
            id="standard-basic"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            label="Description"
            variant="standard"
          />
          <HelpIcon info="Secret description. The more comprehensive, the better GPT-related features results would be."></HelpIcon>

          <TextField
            sx={{ width: "90%" }}
            id="standard-basic"
            type="text"
            name="pattern"
            value={formData.pattern}
            onChange={handleInputChange}
            label="Pattern"
            variant="standard"
          />
          <HelpIcon info="Pattern in form of regex. Default: \w"></HelpIcon>
          <TextField
            sx={{ width: "90%" }}
            id="standard-basic"
            type="text"
            name="example"
            value={formData.example}
            onChange={handleInputChange}
            label="Example"
            variant="standard"
          />
          <HelpIcon info="Example value of the secret. Using example values improves GPT-related functions accuracy."></HelpIcon>

          <TextField
            sx={{ width: "90%" }}
            id="standard-basic"
            type="text"
            name="default"
            value={formData.default}
            onChange={handleInputChange}
            label="Default"
            variant="standard"
          />
          <Box justify="flex-end" textAlign="center">
            <br />
            <Button variant="contained" type="submit">
              Add Secret
            </Button>
          </Box>
        </form>
      </FormControl>
    </div>
  );
};

export default SecretsForm;
