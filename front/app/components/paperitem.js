"use client";
import { styled, withStyles } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { Accordion } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body1,
  ...(theme.elevation = 12),
  padding: theme.spacing(3),
  textAlign: "left",
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[12],
}));

export default Item;
