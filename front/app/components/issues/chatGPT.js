import React, { useState, useEffect } from "react";
import { Button, TextField, Typography } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
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
const handleAssertionChange = (index, field, value) => {};

const ApiRequestComponent = () => {
  const [inputText, setInputText] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [formData, setFormData] = useState(null);
  const [issueData, setIssueData] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch data from the API
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:5127/command"); // Replace with your API endpoint
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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Sending API request:", issueData);
    fetch("http://localhost:5127/issue/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiResponse),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Entry added successfully:", data);
        window.location.reload();
      })
      .catch((error) => console.error("Error adding entry:", error));
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleGeneratedInputChange = (event) => {
    const { name, value } = event.target;
    setApiResponse((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleAssertionChange = (index, field, value) => {
    setApiResponse((prevData) => {
      const assertions = [...prevData.assertions];
      assertions[index][field] = value;
      return { ...prevData, assertions };
    });
  };

  const handleAddAssertion = () => {
    setApiResponse((prevData) => ({
      ...prevData,
      assertions: [
        ...prevData.assertions,
        { target: "", condition: "_raise_issue_if_eq", value: "" },
      ],
    }));
  };

  const handleApiRequest = () => {
    const apiUrl = "http://127.0.0.1:5127/gpt/issue"; // Replace with your API endpoint

    const requestBody = JSON.stringify({
      text: inputText,
      temperature: 0.1,
      additional_info: "",
    });

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    })
      .then((response) => response.json())
      .then((data) =>
        setApiResponse(JSON.parse(data["choices"][0]["message"]["content"])),
      )
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <FormControl fullWidth>
        <TextField
          label="Input"
          variant="outlined"
          value={inputText}
          onChange={handleInputChange}
        />
        <Button variant="contained" onClick={handleApiRequest}>
          Send API Request
        </Button>
        {/* <pre>{JSON.stringify(apiResponse)}</pre> */}

        {formData && (
          <Button variant="contained" onClick={() => setFormData(null)}>
            Clear Form
          </Button>
        )}
        {apiResponse && (
          <div>
            <pre>{JSON.stringify(apiResponse)}</pre>
            Severity
            <FormGroup>
              <Select
                id="standard-basic"
                required
                name="severity"
                value={apiResponse.severity}
                onChange={handleGeneratedInputChange}
              >
                <MenuItem value={0}>0</MenuItem>
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
                onChange={handleGeneratedInputChange}
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
                value={apiResponse.description}
                onChange={handleGeneratedInputChange}
                label="Describe healthy state"
                variant="standard"
              />
            </FormGroup>
            {apiResponse["assertions"].map((assertion, index) => (
              <div key={index}>
                <Item>
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    type="text"
                    name="name"
                    value={assertion.target}
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
                    <MenuItem value={"_raise_issue_if_eq"}>Equal to</MenuItem>
                    <MenuItem value={"_raise_issue_if_neq"}>
                      Not equal to
                    </MenuItem>
                    <MenuItem value={"_raise_issue_if_lt"}>Less than</MenuItem>
                    <MenuItem value={"_raise_issue_if_gt"}>
                      Greater than
                    </MenuItem>
                    <MenuItem value={"_raise_issue_if_contains"}>
                      Contains
                    </MenuItem>
                    <MenuItem value={"_raise_issue_if_ncontains"}>
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
                      setApiResponse((prevData) => {
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
            </Box>
          </div>
        )}
        <Box justify="flex-end" textAlign="center">
          <Button variant="contained" onClick={handleSubmit} type="submit">
            Submit
          </Button>
        </Box>
      </FormControl>
    </div>
  );
};

export default ApiRequestComponent;
