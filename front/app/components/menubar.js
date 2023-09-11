"use client";
import Item from "./paperitem";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ObjectiveForm from "./objective";
const MenuBar = () => {
  return (
    <div>
      <Item>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography variant="h3" color="primary">
              Codebundle Generator
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h5" color="primary">
              See examples here -{" "}
              <a href="https://github.com/runwhen-contrib/rw-cli-codecollection">
                https://github.com/runwhen-contrib/rw-cli-codecollection
              </a>
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h3" color="primary">
              <ObjectiveForm></ObjectiveForm>
            </Typography>
          </Grid>
          {/* <Grid item xs={8}>
            <Item>xs=8</Item>
        </Grid> */}
        </Grid>
      </Item>
    </div>
  );
};

export default MenuBar;
