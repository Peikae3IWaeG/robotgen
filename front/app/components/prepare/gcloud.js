"use client";
import React, { useState } from "react";
import Button from "@mui/material/Button";

const KubectlPreparer = () => {
  const [apiResponses, setApiResponses] = useState([]);
  const apiEndpoint = "http://localhost:5127/variables/";

  const handleApiRequests = () => {
    const requestDataList = [
      {
        endpoint: "http://localhost:5127/variables/robot/secret",
        payload: {
          name: "gcp_credentials_json",
          description:
            "GCP service account json used to authenticate with GCP APIs.",
          pattern: "\\w",
          default: "",
          example:
            '{"type": "service_account","project_id":"myproject-ID", ... super secret stuff ...}',
          secret: true,
        },
      },
      {
        endpoint: "http://localhost:5127/variables/robot/plain",
        payload: {
          name: "GCP_PROJECT_ID",
          description: "The GCP Project ID to scope the API to",
          pattern: "\\w",
          default: "",
          example: "myproject-ID",
          secret: false,
        },
      },
      {
        endpoint: "http://localhost:5127/variables/service",
        payload: {
          name: "gcloud",
          description:
            "The selected RunWhen Service to use for accessing services within a network.",
          example: "gcloud-service.shared",
          default: "gcloud-service.shared",
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
        Add In GCloud Presets
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
