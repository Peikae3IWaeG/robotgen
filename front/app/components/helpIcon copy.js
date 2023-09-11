import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { HelpOutline } from "@mui/icons-material";

const HelpIcon = ({ info }) => (
  <Tooltip title={info} placement="top">
    <IconButton aria-label="help">
      <HelpOutline />
    </IconButton>
  </Tooltip>
);

export default HelpIcon;
