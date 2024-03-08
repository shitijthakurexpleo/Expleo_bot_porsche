import * as React from "react";
import axios from "axios";
import JSON from "JSON";
//import apis from "../../Assets/Constants";
import apis from "../Assets/Constants";
function callIngest(setSnackState) {
  const url = apis.apis.baseUrl + apis.apis.ingest;
  axios.post(url, {}).then((response) => {
    console.log("Ingested response", response);
    setSnackState({ message: response.data, state: true, severity: false });
  });
}

async function callGenerateResponse(
  input,
  setMessages,
  setLoading,
  setSnackState
) {
  try {
    const url = apis.apis.baseUrl + apis.apis.generateResponse;
    setLoading(true);
    console.log(input);
    const response = await axios.post(url, input);
    const conversation = JSON.parse(response.data);
    console.log("Generate Response Conversation", conversation);
    setMessages(conversation);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching Response:", error.response.data);
    setSnackState({
      message: error.response.data,
      state: true,
      severity: true,
    });
    setLoading(false);
    // You might want to handle errors or propagate them if needed
  }
}

async function callFolderNamesProvider(setFolderList, setSelectedFolder) {
  try {
    const url = apis.apis.baseUrl + apis.apis.folderProvider;
    const response = await axios.get(url);
    const folders = JSON.parse(response.data).folder_name;
    console.log("Get Folder Names Response", folders);
    setFolderList(folders);
    setSelectedFolder(folders[0]);
  } catch (error) {
    console.error("Error fetching folder names:", error);
    // You might want to handle errors or propagate them if needed
    throw error;
  }
}
async function callPromptsProvider(setPromptsList) {
  try {
    const url = apis.apis.baseUrl + apis.apis.promptsProvider;
    const response = await axios.get(url);
    const prompts = JSON.parse(response.data);
    console.log("Get Prompts Response", prompts);
    setPromptsList(prompts);
  } catch (error) {
    console.error("Error fetching prompts lists:", error);
    // You might want to handle errors or propagate them if needed
    throw error;
  }
}

async function callModelsProvider(setModelList, setSelectedModel) {
  try {
    const url = apis.apis.baseUrl + apis.apis.modelProvider;
    const response = await axios.get(url);
    const models = JSON.parse(response.data).models;
    console.log("Get Models Response", models);
    setModelList(models);
    setSelectedModel(models[0]);
  } catch (error) {
    console.error("Error fetching model names:", error);
    // You might want to handle errors or propagate them if needed
    throw error;
  }
}

function callClearChat(setSnackState, setMessages) {
  // console.log(`${apis.apis.baseUrl}``${apis.apis.clearChat}`);
  const url = apis.apis.baseUrl + apis.apis.clearChat;
  axios.post(url, {}).then((response) => {
    console.log("Clear Chat Response", response);
    setSnackState({ message: response.data, state: true, severity: false });
    setMessages([
      { role: "bot", content: "Welcome to Expleo Bot. Ask me anything!" },
    ]);
  });
}
function callClearFiles(setSnackState) {
  // `${apis.apis.baseUrl}``${apis.apis.clearFiles}`
  const url = apis.apis.baseUrl + apis.apis.clearFiles;
  axios.post(url, {}).then((response) => {
    console.log("Clear All Files Response", response);
    setSnackState({ message: response.data, state: true, severity: false });
  });
}

export {
  callIngest,
  callGenerateResponse,
  callFolderNamesProvider,
  callModelsProvider,
  callClearChat,
  callClearFiles,
  callPromptsProvider,
};
