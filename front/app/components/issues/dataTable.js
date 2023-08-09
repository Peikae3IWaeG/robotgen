"use client";

import React, { useState, useEffect } from "react";

const IssueDataTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Replace 'API_ENDPOINT' with the actual endpoint URL for your GET request
    fetch("http://localhost:5000/issue")
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

  // Helper function to render the nested assertions
  const renderAssertions = (assertions) => {
    return assertions.map((assertion, index) => (
      <tr key={index}>
        <td>{assertion.target}</td>
        <td>{assertion.condition}</td>
        <td>{assertion.value}</td>
      </tr>
    ));
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Command</th>
            <th>Severity</th>
            <th>Regex</th>
            <th>Description</th>
            <th>Assertions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.command}</td>
              <td>{item.severity}</td>
              <td>{item.regex}</td>
              <td>{item.description}</td>
              <td>
                <table>
                  <thead>
                    <tr>
                      <th>Target</th>
                      <th>Condition</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>{renderAssertions(item.assertions)}</tbody>
                </table>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IssueDataTable;
