import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Stack, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import { NameContext } from "../LandingPage/LandingPage";

function ChatBubbles() {
  const messagesContext = React.useContext(NameContext).messages;
  const [messages, setMessages] = messagesContext;
  const loadingContext = React.useContext(NameContext).loading;
  const [loading, setLoading] = loadingContext;
  return (
    <List
      sx={{
        overflowY: "auto",
        "::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
        // minHeight: "78%",
      }}
    >
      {messages.map((message, index) => (
        <ListItem key={index}>
          <ListItemText align={message.role == "user" ? "right" : "left"}>
            {/* <Avatar>
              {message.role == "user" ? <PersonIcon /> : <PersonIcon />}
            </Avatar> */}
            <Typography
              sx={{
                border: "1px solid #696969",
                borderRadius: "10px",
                width: "fit-content",
                padding: "0.5rem",
                backgroundColor: message.role == "user" ? "#181818" : "#DCDCDC",
                color: message.role == "user" ? "white" : "black",
              }}
            >
              {message.content}
            </Typography>
          </ListItemText>
        </ListItem>
      ))}
      {loading && (
        <ListItem key={messages.length + 1}>
          <ListItemText align="left">
            {/* <Avatar>
              <PersonIcon />
            </Avatar> */}
            <CircularProgress sx={{ color: "#805CE5" }} />
          </ListItemText>
        </ListItem>
      )}
    </List>
  );
}
export default ChatBubbles;
