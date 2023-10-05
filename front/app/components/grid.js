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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Item from "./paperitem";
import HelpIcon from "./helpIcon";

import ObjectiveForm from "../components/objective";
import BasicTabs from "./tabbedForms";
import DataTablesTabs from "./tabbedTables";
import MenuBar from "./menubar";

import AWSPreparer from "./prepare/aws";

export default function MyGrid(props) {
  const { robotDataDisplay, prepareKubectl, prepareCurl, prepareGcloud } =
    props;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item m={1} xs={12}>
          <MenuBar></MenuBar>
        </Grid>

        <Grid item m={1} xs={5}>
          <Stack spacing={2}>
            <Item>
              <Typography variant="h4" color="primary">
                Add resource
                <HelpIcon info="Add resources "></HelpIcon>
              </Typography>
              <BasicTabs></BasicTabs>
            </Item>

            <Item>
              <Typography variant="h4" color="primary">
                Get resources
              </Typography>

              <DataTablesTabs></DataTablesTabs>
              {/* <Item>{variablesForm}</Item> */}
            </Item>

            <Item>
              <Typography variant="h4" color="primary">
                Miscellaneous Actions
              </Typography>

              <Grid container spacing={2}>
                <Grid item m={1} xs={2}>
                  {prepareKubectl}
                </Grid>
                <Grid item m={1} xs={2}>
                  {prepareGcloud}
                </Grid>
                <Grid item m={1} xs={2}>
                  {prepareCurl}
                </Grid>
                <Grid item m={1} xs={2}>
                  <AWSPreparer></AWSPreparer>
                </Grid>
              </Grid>
            </Item>

            {/* 
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
            </Accordion> */}
          </Stack>
        </Grid>

        <Grid item m={1} xs={6.8}>
          <Item sx={{ overflow: "auto" }}>{robotDataDisplay}</Item>
        </Grid>
      </Grid>
    </Box>
  );
}
