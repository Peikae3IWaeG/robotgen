"use client";
import React, { useState } from "react";
import Button from "@mui/material/Button";

const KubectlPreparer = () => {
  const [apiResponses, setApiResponses] = useState([]);
  const apiEndpoint = "http://localhost:5000/variables/"; // Replace this with your API endpoint

  const handleApiRequests = () => {
    const requestDataList = [
      {
        endpoint: "http://localhost:5000/variables/robot",
        payload: {
          name: "kubeconfig",
          description:
            "The kubernetes kubeconfig yaml containing connection configuration used to connect to cluster(s).",
          pattern: "\\w",
          example:
            "For examples, start here https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/",
          default: "",
          secret: false,
        },
      },
      {
        endpoint: "http://localhost:5000/variables/service",
        payload: {
          name: "kubectl",
          description: "The location service used to interpret shell commands.",
          example: "kubectl-service.shared",
          default: "kubectl-service.shared",
        },
      },
      {
        endpoint: "http://localhost:5000/variables/env",
        payload: {
          name: "KUBECONFIG",
          value: "./${kubeconfig.key}",
        },
      },
    ];

    const responses = [];

    const promises = requestDataList.map((requestData) => {
      return fetch(requestData.endpoint, {
        method: "POST", // Change this to 'GET', 'PUT', 'DELETE', etc. if needed
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
        Load kubectl preset
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