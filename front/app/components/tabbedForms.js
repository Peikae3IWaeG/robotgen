"use client";
import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import VariablesForm from "./variables/uploadForm";
import SecretsForm from "./secrets/uploadForm";
import IssueForm from "./issues/uploadForm";
import CommandForm from "./commands/uploadForm";
import BasicAccordion from "./issues/uploadFormAccordion";
import HelpIcon from "./helpIcon";
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

export default function BasicTabs() {
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
        <Typography variant="h7" color="primary">
          Runs $command and assigns its output to $name variable.
        </Typography>
        <CommandForm></CommandForm>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Typography variant="h7" color="primary">
          Adds user-defined variable named $name.
        </Typography>
        <VariablesForm></VariablesForm>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Typography variant="h7" color="primary">
          Adds user-defined secret named $name.
        </Typography>
        <SecretsForm></SecretsForm>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Typography variant="h7" color="primary">
          <p>
            Creates an issue when conditions specified in assertions section are
            fulfilled. At least one assertion must be specified. Once ChatGPT
            mode is added, it will be a default method of generating issues.
          </p>
        </Typography>
        <BasicAccordion></BasicAccordion>
      </CustomTabPanel>
    </Box>
  );
}
