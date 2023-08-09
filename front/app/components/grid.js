"use client";

import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { palette } from "@mui/system";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { ExpandMore } from "@mui/icons-material";

import DropdownForm from "./robot/dropdown";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body1,
  padding: theme.spacing(3),
  textAlign: "left",
  color: theme.palette.text.primary,
}));

export default function MyGrid(props) {
  const {
    topLeft,
    topRight,
    issueDataTable,
    uploadIssue,
    commandDataTable,
    bottomLeft,
    bottomRight,
    prepareKubectl,
    resetRobot,
  } = props;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item m={1} xs={12}>
          <Item elevation={12} sx={{}}>
            <h1>Robot generator</h1>
          </Item>
        </Grid>

        <Grid item m={1} xs={5}>
          <Stack spacing={2}>
            <Item elevation={12} sx={{}}>
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

            <Item elevation={12} sx={{}}>
              <h2>Add variable</h2>
              <Item>{bottomRight}</Item>
            </Item>

            <Item elevation={12} sx={{}}>
              <h2>Add command</h2>
              <Item>{bottomLeft}</Item>
            </Item>

            <Item elevation={12} sx={{}}>
              <h2>Add Issue</h2>
              <Item>{uploadIssue}</Item>
            </Item>

            <Accordion sx={{}}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                Variables
              </AccordionSummary>
              <AccordionDetails>{topLeft}</AccordionDetails>
            </Accordion>

            <Accordion sx={{}}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Commands</Typography>
              </AccordionSummary>
              <AccordionDetails>{commandDataTable}</AccordionDetails>
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
                <Item>{issueDataTable}</Item>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Grid>

        <Grid item m={1} xs={6.8}>
          <Item sx={{ overflow: "auto" }}>{topRight}</Item>
        </Grid>
      </Grid>
    </Box>
  );
}
