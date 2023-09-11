"use client";

import React, { useState, useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import HelpIcon from "../helpIcon";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#black" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(3),
  margin: 3,
  textAlign: "left",
  boxShadow: theme.shadows[5],

  color: theme.palette.text.secondary,
}));

const IssueForm = () => {
  const [issueData, setIssueData] = useState({
    severity: 1,
    response: "",
    description: "",
    assertions: [{ target: "", condition: "raise_issue_if_eq", value: "" }],
  });

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch data from the API
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/command"); // Replace with your API endpoint
        const data = await response.json();
        setItems(data); // Assuming the response is an array of items
        setLoading(false);
      } catch (error) {
        console.error("Error fetching items:", error);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleChange = (e) => {
    setSelectedItem(e.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setIssueData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddAssertion = () => {
    setIssueData((prevData) => ({
      ...prevData,
      assertions: [
        ...prevData.assertions,
        { target: "", condition: "raise_issue_if_eq", value: "" },
      ],
    }));
  };

  const handleAssertionChange = (index, field, value) => {
    setIssueData((prevData) => {
      const assertions = [...prevData.assertions];
      assertions[index][field] = value;
      return { ...prevData, assertions };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Sending API request:", issueData);
    fetch("http://localhost:5000/issue/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(issueData),
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
      <FormControl fullWidth>
        Severity
        <FormGroup>
          <Select
            id="standard-basic"
            required
            name="severity"
            defaultValue={issueData.severity}
            value={issueData.severity}
            onChange={handleInputChange}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </Select>
        </FormGroup>
        Command
        <FormGroup>
          <Select
            name="response"
            id="standard-basic"
            defaultValue={items[0]}
            onChange={handleInputChange}
          >
            {items.map((item) => (
              <MenuItem value={item.name}>{item.name}</MenuItem>
            ))}
          </Select>
        </FormGroup>
        <FormGroup>
          <TextField
            id="standard-basic"
            required
            type="text"
            name="description"
            value={issueData.description}
            onChange={handleInputChange}
            label="Describe healthy state"
            variant="standard"
          />
        </FormGroup>
        <Box>
          <p>
            <Typography variant="h7" color="primary">
              Specify conditions for raising an issue. Conditions are evaluated
              sequentially. For details refer to{" "}
              <a href="https://github.com/runwhen-contrib/rw-cli-codecollection/blob/main/libraries/RW/CLI/stdout_parser.py">
                https://github.com/runwhen-contrib/rw-cli-codecollection/blob/main/libraries/RW/CLI/stdout_parser.py
              </a>
            </Typography>
          </p>
        </Box>
        {issueData.assertions.map((assertion, index) => (
          <div key={index}>
            <Item>
              <TextField
                sx={{ width: "90%" }}
                id="standard-basic"
                type="text"
                name="name"
                value={assertion.target}
                onChange={(e) =>
                  handleAssertionChange(index, "target", e.target.value)
                }
                label="_line or use regex group"
                variant="standard"
              />
              <HelpIcon info="Keep empty to evaluate an entire line or specify named regex group."></HelpIcon>

              <Select
                sx={{ width: "90%" }}
                value={assertion.condition}
                label="Condition"
                displayEmpty
                onChange={(e) =>
                  handleAssertionChange(index, "condition", e.target.value)
                }
              >
                <MenuItem value={"raise_issue_if_eq"}>Equal to</MenuItem>
                <MenuItem value={"raise_issue_if_neq"}>Not equal to</MenuItem>
                <MenuItem value={"raise_issue_if_lt"}>Less than</MenuItem>
                <MenuItem value={"raise_issue_if_gt"}>Greater than</MenuItem>
                <MenuItem value={"raise_issue_if_contains"}>Contains</MenuItem>
                <MenuItem value={"raise_issue_if_ncontains"}>
                  Not contain
                </MenuItem>
              </Select>
              <HelpIcon info="Use one of predefined conditions. The conditions are mapped to stdout parser values."></HelpIcon>
              <TextField
                sx={{ width: "80%" }}
                id="standard-basic"
                required
                type="text"
                name="name"
                value={assertion.value}
                onChange={(e) =>
                  handleAssertionChange(index, "value", e.target.value)
                }
                label="Value"
                variant="standard"
              />
              <IconButton
                sx={{ marginRight: "auto" }}
                onClick={() =>
                  setIssueData((prevData) => {
                    const assertions = [...prevData.assertions];
                    assertions.splice(index, 1);
                    return { ...prevData, assertions };
                  })
                }
                aria-label="delete"
              >
                <DeleteIcon />
                Delete{" "}
              </IconButton>
            </Item>
          </div>
        ))}
        <Box justify="flex-end" textAlign="center">
          <IconButton
            sx={{ marginRight: "auto" }}
            onClick={handleAddAssertion}
            aria-label="add"
          >
            <DeleteIcon />
            Add assertion{" "}
          </IconButton>
          <HelpIcon info="Adds new assertion field to the form"></HelpIcon>
        </Box>
        <Box justify="flex-end" textAlign="center">
          <Button variant="contained" onClick={handleSubmit} type="submit">
            Submit
          </Button>
        </Box>
      </FormControl>
    </div>
  );
};

export default IssueForm;
