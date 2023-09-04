"use client";
import React, { useState } from "react";
import Button from "@mui/material/Button";

const KubectlPreparer = () => {
  const [apiResponses, setApiResponses] = useState([]);
  const apiEndpoint = "http://localhost:5000/variables/";

  const handleApiRequests = () => {
    const requestDataList = [
      {
        endpoint: "http://localhost:5000/variables/service",
        payload: {
          name: "kubectl",
          description: "The location service used to interpret shell commands.",
          example: "curl-service.shared",
          default: "curl-service.shared",
        },
      },
    ];

    const responses = [];

    const promises = requestDataList.map((requestData) => {
      return fetch(requestData.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData.payload),
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error("Error sending API request:", error);
          return { error: "Error sending API request" };
        });
    });

    Promise.all(promises)
      .then((results) => {
        setApiResponses(results);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error processing API responses:", error);
      });
  };

  return (
    <div>
      <Button variant="contained" onClick={handleApiRequests}>
        Add In Curl Presets
      </Button>
      <div>
        {apiResponses.map((response, index) => (
          <div key={index}>
            {response.error ? (
              <p>Error in Request {index + 1}</p>
            ) : (
              <p>
                Response {index + 1}: {JSON.stringify(response)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KubectlPreparer;
