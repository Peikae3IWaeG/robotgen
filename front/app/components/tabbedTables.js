"use client";
import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import BasicAccordion from "./issues/uploadFormAccordion";

import VariablesTable from "./variables/dataTable";
import SecretsTable from "./secrets/dataTable";
import IssueTable from "./issues/dataTable";
import CommandTable from "./commands/dataTable";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function DataTablesTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Commands" {...a11yProps(0)} />
          <Tab label="Variables" {...a11yProps(1)} />
          <Tab label="Secrets" {...a11yProps(2)} />
          <Tab label="Issues" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <CommandTable></CommandTable>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <VariablesTable></VariablesTable>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <SecretsTable></SecretsTable>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <IssueTable></IssueTable>
      </CustomTabPanel>
    </Box>
  );
}
