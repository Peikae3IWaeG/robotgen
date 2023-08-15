"use client";

import React, { useState, useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

const IssueForm = () => {
  const [issueData, setIssueData] = useState({
    severity: 1,
    response: "-",
    description: "",
    assertions: [],
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
      <Grid container spacing={2} columns={2}>
        <Grid item xs={1}>
          <Item>
            <h1> Manually</h1>

            <form>
              <FormControl style={{ minWidth: 120 }}>
                Severity
                <Select value={issueData.severity} onChange={handleInputChange}>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                </Select>
                <TextField
                  sx={{ width: 350 }}
                  id="standard-basic"
                  type="text"
                  name="response"
                  value={issueData.response}
                  onChange={handleInputChange}
                  label="Command name"
                  variant="standard"
                />
                <select
                  name="response"
                  id="response"
                  value={selectedItem}
                  onChange={handleInputChange}
                >
                  <option value="">-</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <TextField
                  sx={{ width: 350 }}
                  id="standard-basic"
                  required
                  type="text"
                  name="description"
                  value={issueData.description}
                  onChange={handleInputChange}
                  label="Describe healthy state"
                  variant="standard"
                />
                <br></br>
                <br></br>
                {issueData.assertions.map((assertion, index) => (
                  <div key={index}>
                    {index}
                    <br></br>
                    <TextField
                      sx={{ width: 350 }}
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

                    <Select
                      value={assertion.condition}
                      label="Condition"
                      displayEmpty
                      onChange={(e) =>
                        handleAssertionChange(
                          index,
                          "condition",
                          e.target.value,
                        )
                      }
                    >
                      <MenuItem value={"raise_issue_if_eq"}>Equal to</MenuItem>
                      <MenuItem value={"raise_issue_if_neq"}>
                        Not equal to
                      </MenuItem>
                      <MenuItem value={"raise_issue_if_lt"}>Less than</MenuItem>
                      <MenuItem value={"raise_issue_if_gt"}>
                        Greater than
                      </MenuItem>
                      <MenuItem value={"raise_issue_if_contains"}>
                        Contains
                      </MenuItem>
                      <MenuItem value={"raise_issue_if_ncontains"}>
                        Not contain
                      </MenuItem>
                    </Select>

                    <TextField
                      sx={{ width: 350 }}
                      id="standard-basic"
                      required
                      type="text"
                      name="name"
                      // valueDefault="_line"
                      value={assertion.value}
                      onChange={(e) =>
                        handleAssertionChange(index, "value", e.target.value)
                      }
                      label="Value"
                      variant="standard"
                    />

                    <br />
                    <button
                      type="button"
                      onClick={() =>
                        setIssueData((prevData) => {
                          const assertions = [...prevData.assertions];
                          assertions.splice(index, 1);
                          return { ...prevData, assertions };
                        })
                      }
                    >
                      Remove Assertion
                    </button>
                    <hr />
                    <br></br>

                    <br></br>
                  </div>
                ))}
                <Box justify="flex-end" textAlign="center">
                  <Button onClick={handleAddAssertion} type="button">
                    Add assertion
                  </Button>
                </Box>
                <Box justify="flex-end" textAlign="center">
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    type="submit"
                  >
                    Submit
                  </Button>
                </Box>
              </FormControl>
            </form>
          </Item>
        </Grid>
        <Grid item xs={1}>
          <Item>
            <h1> Generate with ChatGPT</h1>

            <TextField
              fullWidth
              placeholder="PLACEHOLDER"
              multiline
              rows={14}
            />

            <Box justify="flex-end" margin="10" textAlign="center">
              <Button variant="contained" onClick={handleSubmit} type="submit">
                Submit
              </Button>
            </Box>
          </Item>
        </Grid>
      </Grid>
    </div>
  );
};

export default IssueForm;
