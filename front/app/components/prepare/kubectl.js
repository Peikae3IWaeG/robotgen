"use client";
import React, { useState } from "react";
import Button from "@mui/material/Button";

const KubectlPreparer = () => {
  const [apiResponses, setApiResponses] = useState([]);
  const apiEndpoint = "http://localhost:5000/variables/";

  const handleApiRequests = () => {
    const requestDataList = [
      {
        endpoint: "http://localhost:5000/variables/robot/secret",
        payload: {
          name: "kubeconfig",
          description:
            "The kubernetes kubeconfig yaml containing connection configuration used to connect to cluster(s).",
          pattern: "\\w",
          example:
            "For examples, start here https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/",
          default: "",
          secret: true,
        },
      },
      {
        endpoint: "http://localhost:5000/variables/robot/plain",
        payload: {
          name: "CONTEXT",
          description:
            "Which Kubernetes context to operate within.",
          pattern: "\\w",
          example:
            "my-main-cluster",
          default: "default",
          secret: false,
        },
      },
      {
        endpoint: "http://localhost:5000/variables/robot/plain",
        payload: {
          name: "NAMESPACE",
          description:
            "The name of the Kubernetes namespace to scope actions and searching to. Accepts a single namespace in the format `-n namespace-name` or `--all-namespaces`.",
          pattern: "\\w",
          example:
            "default",
          default: "default",
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
        Add in Kubectl preset
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
