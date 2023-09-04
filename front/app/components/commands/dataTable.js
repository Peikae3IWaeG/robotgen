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

const CommandTable = () => {
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    fetchApiData();
  }, []);

  const fetchApiData = () => {
    fetch("http://localhost:5000/command")
      .then((response) => response.json())
      .then((data) => setApiData(data))
      .catch((error) => console.error("Error fetching API data:", error));
  };

  const handleDelete = (name) => {
    // Send DELETE request to remove the row
    fetch("http://localhost:5000/command/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name }),
    })
      .then((response) => response.json()) // if the response is JSON
      .then((data) => {
        console.log("Row deleted successfully.");
        // fetchApiData();
        window.location.reload();
      })
      .catch((error) => console.error("Error deleting row:", error));
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Command</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {apiData.map((item, index) => (
              <TableRow
                key={item.name}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell align="right">{item.command}</TableCell>
                <TableCell align="right">
                  <Button onClick={() => handleDelete(item.name)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CommandTable;
