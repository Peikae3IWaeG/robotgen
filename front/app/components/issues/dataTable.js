"use client";

import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

const IssueTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5127/issue")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleDelete = (id) => {
    fetch("http://localhost:5127/issue/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Row deleted successfully.");
        window.location.reload();
      })
      .catch((error) => console.error("Error deleting row:", error));
  };

  const renderAssertions = (assertions) => {
    return assertions.map((assertion, index) => (
      <TableRow key={index}>
        <TableCell>{assertion.target}</TableCell>
        <TableCell>{assertion.condition}</TableCell>
        <TableCell>{assertion.value}</TableCell>
      </TableRow>
    ));
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Id</TableCell>
              <TableCell align="right">Command</TableCell>
              <TableCell align="right">Severity</TableCell>
              <TableCell align="right">Regex</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Assertions</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.response}</TableCell>
                <TableCell>{item.severity}</TableCell>
                <TableCell>{item.regex}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <TableHead>
                    <TableRow>
                      <TableCell>Target</TableCell>
                      <TableCell>Condition</TableCell>
                      <TableCell>Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableBody>{renderAssertions(item.assertions)}</TableBody>
                  </TableBody>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(item.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default IssueTable;
