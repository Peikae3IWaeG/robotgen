"use client";

import React, { useState } from "react";
import { Box, Checkbox } from "@mui/material";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";

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
    fetch("http://localhost:5000/variables/robot/secret", {
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
      <FormControl style={{ minWidth: 300 }}>
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
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            label="Description"
            variant="standard"
          />
          <TextField
            fullWidth
            id="standard-basic"
            type="text"
            name="pattern"
            value={formData.pattern}
            onChange={handleInputChange}
            label="Pattern"
            variant="standard"
          />
          <TextField
            fullWidth
            id="standard-basic"
            type="text"
            name="example"
            value={formData.example}
            onChange={handleInputChange}
            label="example"
            variant="standard"
          />
          <TextField
            fullWidth
            id="standard-basic"
            type="text"
            name="default"
            value={formData.default}
            onChange={handleInputChange}
            label="default"
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
