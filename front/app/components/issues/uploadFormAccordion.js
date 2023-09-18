"use client";

import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import IssueForm from "./uploadForm";
import ApiRequestComponent from "./chatGPT";
export default function BasicAccordion() {
  return (
    <div>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>ChatGPT</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ApiRequestComponent></ApiRequestComponent>
        </AccordionDetails>
      </Accordion>
      <Accordion >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Manual</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <IssueForm></IssueForm>
        </AccordionDetails>
      </Accordion>

    </div>
  );
}
