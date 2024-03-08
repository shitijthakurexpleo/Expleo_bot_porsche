import * as React from "react";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Box, DialogContent, Stack } from "@mui/material";
import Divider from "@mui/material/Divider";
import ReorderIcon from "@mui/icons-material/Reorder";
import CloseIcon from "@mui/icons-material/Close";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { callPromptsProvider } from "../../Services/ApiServices";
import Typography from "@mui/material/Typography";
import { PromptContext } from "../LandingPage/LandingPage";

function PromptDialog(props) {
  const { onClose, selectedValue, open } = props;
  const [promptsList, setPromptsList] = React.useContext(PromptContext).prompt;
  const handleClose = () => {
    onClose(selectedValue);
  };

  React.useEffect(() => {
    callPromptsProvider(setPromptsList);
  }, []);
  const [expanded, setExpanded] = React.useState();

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle
        sx={{
          pt: 0,
          backgroundColor: "#181818",
          color: "white",
          border: "2px solid white",
          textAlign: "center",
          padding: "0.5rem",
        }}
      >
        <Stack
          direction={"row"}
          spacing={3}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <div></div>
          <Typography variant="h5">Browse Prompts</Typography>
          <IconButton
            sx={{
              pt: 0,
              color: "white",
              textAlign: "center",
              padding: "0.5rem",
            }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: "#181818",
          border: "2px solid white",
          borderTop: "0px",
          padding: "0.5rem",
        }}
      >
        <Box
          sx={{
            padding: "0.25rem",
            marginTop: "10px",
            backgroundColor: "#181818",
            width: "100%",
          }}
          alignItems={"center"}
          justifyContent={"center"}
        >
          {promptsList.map((prompt, index) => (
            <Accordion
              disableGutters
              expanded={expanded === index}
              onChange={handleChange(index)}
              sx={{ border: "1px solid #696969", alignItems: "center" }}
              key={index}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={index}
                id={index}
              >
                <Typography sx={{ color: "black" }}>{prompt.title}</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  color: "black",
                  borderTop: "1px solid #696969",
                  backgroundColor: "#DCDCDC",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  padding: "0.5rem",
                }}
              >
                <Typography sx={{ width: "100%", textAlign: "center" }}>
                  {prompt.prompt}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

PromptDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function PromptDialogButton() {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <>
      <IconButton variant="outlined" onClick={handleClickOpen}>
        <ReorderIcon sx={{ color: "white" }} />
      </IconButton>
      <PromptDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </>
  );
}
