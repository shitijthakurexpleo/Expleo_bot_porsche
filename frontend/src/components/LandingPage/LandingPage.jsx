import "./LandingPage.css";
import * as React from "react";
import logo from "../../Assets/Frame.svg";
import image from "../../Assets/image.png";
import stringValues from "../../Assets/Constants";
import PromptDialogButton from "../chatparametersfoot/PrompDialog";
import ChatParametersFoot from "../chatparametersfoot/ChatParametersFoot";
import ChatBubbles from "../ChatBubbles/ChatBubbles";
import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";

export const NameContext = React.createContext();
export const PromptContext = React.createContext();

function LandingPage() {
  const [promptsList, setPromptsList] = React.useState([
    { title: "Dummy", prompt: "dummy" },
  ]);
  const [messages, setMessages] = React.useState([
    { role: "bot", content: "Welcome to Expleo Bot. Ask me anything!" },
  ]);
  const [loading, setloading] = React.useState(false);
  const [inputText, setInputText] = React.useState("");
  const [folderList, setFolderList] = React.useState([]);
  const [selectedFolder, setSelectedFolder] = React.useState("");
  const [modelList, setModelList] = React.useState([]);
  const [selectedModel, setSelectedModel] = React.useState("");
  const [infoBot, setInfoBot] = React.useState(true);
  return (
    <div className="main">
      <div className="container">
        <nav>
          <img src={logo} className="App-logo" alt="logo" />
          <img src={image} className="App-logo2" alt="logo1" />
        </nav>
        <div className="card main-card">
          <div className="card-body main-text">
            <Stack>
              <Typography variant="h4" sx={{ color: "#805CE5" }}>
                {stringValues.stringValues.welcomeText}
              </Typography>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                alignContent="center"
              >
                <Typography>
                  {stringValues.stringValues.getStartedText}
                </Typography>
                <PromptContext.Provider
                  value={{ prompt: [promptsList, setPromptsList] }}
                >
                  <PromptDialogButton />
                </PromptContext.Provider>
              </Stack>
              <Stack
                direction="column"
                sx={{
                  border: "1px solid white",
                  borderRadius: "10px",
                  width: "85vw",
                  height: "75vh",
                  justifyContent: "space-between",
                  backgroundColor: "#181818",
                }}
              >
                <NameContext.Provider
                  value={{
                    messages: [messages, setMessages],
                    loading: [loading, setloading],
                    inputText: [inputText, setInputText],
                    folderList: [folderList, setFolderList],
                    selectedFolder: [selectedFolder, setSelectedFolder],
                    modelList: [modelList, setModelList],
                    selectedModel: [selectedModel, setSelectedModel],
                    infoBot: [infoBot, setInfoBot],
                  }}
                >
                  <ChatBubbles />
                  <ChatParametersFoot />
                </NameContext.Provider>
              </Stack>
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
