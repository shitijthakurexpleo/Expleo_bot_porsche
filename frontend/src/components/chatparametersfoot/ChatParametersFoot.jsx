import * as React from "react";
import "./ChatParametersFoot.css";
import TextField from "@mui/material/TextField";
import stringValues from "../../Assets/Constants";
import { Button, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import RefreshIcon from "@mui/icons-material/Refresh";
import FolderDeleteIcon from "@mui/icons-material/FolderDelete";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import InputIcon from "@mui/icons-material/Input";
import ModelSelector from "./SelectModel";
import SelectFolder from "./SelectFolder";
import PipelineToggle from "./PipelineToggle";
import OpenAICheckbox from "./InfoToggle";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import { Stack } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import {
  callClearChat,
  callClearFiles,
  callGenerateResponse,
  callIngest,
} from "../../Services/ApiServices";
import { NameContext } from "../LandingPage/LandingPage";
function ChatParametersFoot() {
  const inputTextContext = React.useContext(NameContext).inputText;
  const [inputText, setInputText] = inputTextContext;
  const messagesContext = React.useContext(NameContext).messages;
  const [messages, setMessages] = messagesContext;
  const loadingContext = React.useContext(NameContext).loading;
  const [loading, setLoading] = loadingContext;
  const selectedFolderContext = React.useContext(NameContext).selectedFolder;
  const [selectedFolder, setSelectedFolder] = selectedFolderContext;
  const selectedModelContext = React.useContext(NameContext).selectedModel;
  const [selectedModel, setSelectedModel] = selectedModelContext;
  const infoBotContext = React.useContext(NameContext).infoBot;
  const [infoBot, setInfoBot] = infoBotContext;
  const [snackState, setSnackState] = React.useState({
    message: "",
    state: false,
    severity: false,
  });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackState({ message: "", state: false });
  };
  const handleTextFieldChange = (event) => {
    setInputText(event.target.value);
  };
  return (
    <Stack direction="column" sx={{ marginTop: "5px" }}>
      <Stack direction="row">
        <Stack
          direction="row"
          sx={{ display: "flex", alignItems: "center", width: "100%" }}
        >
          <TextField
            sx={{
              borderTop: "1px solid white",
              outline: "none",
              backgroundColor: "#282828",
              "& .MuiFilledInput-input": {
                color: "white",
              },
            }}
            id="outlined-basic"
            placeholder="Ask anything"
            helperText={stringValues.questionPromtText}
            variant="filled"
            value={inputText}
            fullWidth
            hiddenLabel
            onChange={handleTextFieldChange}
          />
          <div className="chat-buttons">
            <Tooltip title="Send">
              <IconButton
                variant="outlined"
                onClick={() => {
                  if (inputText === "") {
                    setSnackState({
                      severity: false,
                      message: "Input cannot be Empty!",
                      state: true,
                    });
                    return;
                  }
                  callGenerateResponse(
                    {
                      input: inputText,
                      folder: selectedFolder,
                      model_name: selectedModel,
                      type: "SQL",
                      info_bot: infoBot,
                    },
                    setMessages,
                    setLoading,
                    setSnackState
                  );
                  setInputText("");
                }}
              >
                <SendIcon sx={{ color: "white" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear Chat">
              <IconButton
                variant="outlined"
                onClick={() => {
                  callClearChat(setSnackState, setMessages);
                }}
              >
                <ClearAllIcon sx={{ color: "white" }} />
              </IconButton>
            </Tooltip>
          </div>
        </Stack>
      </Stack>
      <div className="row parameters-container mx-0">
        <div className="actions">
          <div>
            <Tooltip title="Ingest Files">
              <IconButton
                variant="outlined"
                onClick={() => {
                  callIngest(setSnackState);
                }}
              >
                <InputIcon sx={{ color: "white" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear Files">
              <IconButton
                variant="outlined"
                onClick={() => {
                  callClearFiles(setSnackState);
                }}
              >
                <FolderDeleteIcon sx={{ color: "white" }} />
              </IconButton>
            </Tooltip>
          </div>
          <Divider
            orientation="vertical"
            sx={{
              "&.MuiDivider-root": {
                borderColor: "white",
                border: "2px solid",
                borderRadius: "5px",
              },
            }}
          />
          <SelectFolder />
          <Divider
            orientation="vertical"
            sx={{
              "&.MuiDivider-root": {
                borderColor: "white",
                border: "2px solid",
                borderRadius: "5px",
              },
            }}
          />
          <ModelSelector />
          <Divider
            orientation="vertical"
            sx={{
              "&.MuiDivider-root": {
                borderColor: "white",
                border: "2px solid",
                borderRadius: "5px",
              },
            }}
          />
          {/* <PipelineToggle /> */}
          <OpenAICheckbox />
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackState.state}
        autoHideDuration={3000}
        onClose={handleClose}
        message={snackState.message}
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: snackState.severity ? "red" : "#805CE5",
            border: "1px solid #FFFFFF",
          },
        }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            onClick={handleClose}
            sx={{ color: "#FFFFFF" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Stack>
  );
}

export default ChatParametersFoot;
