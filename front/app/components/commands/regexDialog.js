import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import HelpIcon from "../helpIcon";
import CircularProgress from "@mui/material/CircularProgress";

import { Grid, Box } from "@mui/material";

const DialogComponent = () => {
  const [regexFormData, setRegexFormData] = useState({
    text: "",
  });

  const [isRegexComposeInProgress, setRegexComposeInProgress] = useState(false);
  const [result, setResultData] = useState(null);

  const handleRegexSubmit = (regexevent) => {
    setRegexComposeInProgress(true);
    regexevent.preventDefault();
    fetch("http://localhost:5127/gpt/regex_compose", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(regexFormData),
    })
      .then((response) => response.json())
      .then((data) => {
        setRegexComposeInProgress(false);
        console.log("Request sucessful:", data);
        setResultData(data);
      })
      .catch((error) => console.error("Request error:", error));
  };

  const handleRegexInputChange = (event) => {
    const { name, value } = event.target;
    setRegexFormData({
      ...regexFormData,
      [name]: value,
    });
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <p></p>
      <Grid container>
        <Grid item xs={6}>
          <Box textAlign="center">
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Compose regex with ChatGPT
            </Button>
            <HelpIcon info="Describe the regex in natural language"></HelpIcon>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box textAlign="center">
            <Button target="_blank" href="https://regex101.com/">
              {" "}
              Go to Regex101
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
              sx={{
                "& .MuiDialog-container": {
                  "& .MuiPaper-root": {
                    width: "100%",
                    maxWidth: "800px",
                    textAlign: "center",
                  },
                },
              }}
            >
              <DialogTitle>Compose regex with ChatGPT</DialogTitle>
              <DialogContent>
                <FormControl sx={{ width: "90%" }}>
                  <form onSubmit={handleRegexSubmit}>
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-multiline"
                      required
                      type="text"
                      name="text"
                      multiline
                      rows={2}
                      value={regexFormData.text}
                      onChange={handleRegexInputChange}
                      label="Input"
                      variant="standard"
                    />
                    <p></p>
                    {isRegexComposeInProgress ? (
                      <CircularProgress></CircularProgress>
                    ) : (
                      <Box justify="flex-end" textAlign="center">
                        <Button variant="contained" onClick={handleRegexSubmit}>
                          Generate
                        </Button>
                        <HelpIcon info="I.e. 'Generate the regex that catches data in format %Y-%m-%d. Year month and day should be placed in separate named groups.' This in only an example, consider parsing date the proper way."></HelpIcon>
                      </Box>
                    )}
                  </form>
                </FormControl>

                {result && (
                  <Box>
                    <p></p>
                    <Box>
                      <Typography color="primary" variant="p">
                        Result
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h4">
                        {result.gpt_explanation}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={() =>
                        navigator.clipboard.writeText(result.gpt_explanation)
                      }
                      aria-label="delete"
                    >
                      {" "}
                      <ContentCopyIcon /> Copy{" "}
                    </IconButton>
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary"></Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Grid>
      </Grid>
      <p></p>
    </div>
  );
};

export default DialogComponent;
