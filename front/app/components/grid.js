"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { ExpandMore } from "@mui/icons-material";

import Item from "./paperitem";

export default function MyGrid(props) {
  const {
    secretsTable,
    secretsForm,
    variablesForm,
    variablesTable,
    issueForm,
    issueTable,
    commandForm,
    commandTable,
    robotDataDisplay,
    prepareKubectl,
    resetRobot,
  } = props;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item m={1} xs={12}>
          <Item sx={{}}>
            <h1>Robot generator</h1>
          </Item>
        </Grid>

        <Grid item m={1} xs={5}>
          <Stack spacing={2}>
            <Item>
              <h2>Misc</h2>

              <Grid container spacing={2}>
                <Grid item m={1} xs={2}>
                  {resetRobot}
                </Grid>
                <Grid item m={1} xs={2}>
                  {prepareKubectl}
                </Grid>
              </Grid>
            </Item>

            <Item>
              <h2>Add variable</h2>
              <Item>{variablesForm}</Item>
            </Item>

            <Item>
              <h2>Add Secret</h2>
              <Item>{secretsForm}</Item>
            </Item>

            <Item>
              <h2>Add command</h2>
              <Item>{commandForm}</Item>
            </Item>

            <Item>
              <h2>Add Issue</h2>
              <Item>{issueForm}</Item>
            </Item>

            <Accordion sx={{}}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                Variables
              </AccordionSummary>
              <AccordionDetails>{variablesTable}</AccordionDetails>
            </Accordion>

            <Accordion sx={{}}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                Secrets
              </AccordionSummary>
              <AccordionDetails>{secretsTable}</AccordionDetails>
            </Accordion>

            <Accordion sx={{}}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Commands</Typography>
              </AccordionSummary>
              <AccordionDetails>{commandTable}</AccordionDetails>
            </Accordion>

            <Accordion sx={{}}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Issues</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Item>{issueTable}</Item>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Grid>

        <Grid item m={1} xs={6.8}>
          <Item sx={{ overflow: "auto" }}>{robotDataDisplay}</Item>
        </Grid>
      </Grid>
    </Box>
  );
}
