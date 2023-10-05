"use client";
import React, { useState } from "react";
import Button from "@mui/material/Button";

const AWSPreparer = () => {
  const [apiResponses, setApiResponses] = useState([]);
  const apiEndpoint = "http://localhost:5127/variables/";

  const handleApiRequests = () => {
    const requestDataList = [
      {
        endpoint: "http://localhost:5127/variables/robot/secret",
        payload: {
          name: "aws_access_key_id",
          description:
            "The AWS access key ID to use for connecting to AWS APIs.",
          pattern: "\\w*",
          example: "SUPERSECRETKEYID",
          default: "",
          secret: true,
        },
      },
      {
        endpoint: "http://localhost:5127/variables/robot/secret",
        payload: {
          name: "aws_secret_access_key",
          description: "The AWS access key to use for connecting to AWS APIs",
          pattern: "\\w*",
          example: "SUPERSECRETKEY",
          default: "",
          secret: true,
        },
      },
      {
        endpoint: "http://localhost:5127/variables/robot/secret",
        payload: {
          name: "aws_role_arn",
          description: "The AWS role ARN to use for connecting to AWS APIs",
          pattern: "\\w*",
          example: "arn:aws:iam::ACCOUNT_ID:role/ROLE_NAME",
          default: "",
          secret: true,
        },
      },
      {
        endpoint: "http://localhost:5127/variables/robot/plain",
        payload: {
          name: "AWS_DEFAULT_REGION",
          description: "The AWS region to scope API requests to.",
          pattern: "\\w*",
          example: "us-west-1",
          default: "us-west-1",
          secret: false,
        },
      },
      {
        endpoint: "http://localhost:5127/variables/service",
        payload: {
          name: "aws",
          description: "The location service used to interpret shell commands.",
          example: "aws-service.shared",
          default: "aws-service.shared",
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
        Add in AWS preset
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

export default AWSPreparer;
