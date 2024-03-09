const stringValues = {
  introText01:
    "Expleo's AI chat bot helps you in everyday life and explore infinite capabilities within organization.",
  welcomeText: "Welcome to Expleo Bot",
  getStartedText: "Not sure where to start? Click Here",
  introText02: "Seamless conversations: Your intelligent AI chat companion.",
  questionPromtText: "Type your question here",
};
const errorValues = {
  error_failed_to_ingest: "Failed to ingest folder",
  error_ingesting: "Error ingesting folder:",
};
const promptTexts = {
  promptSelectionText: "Browse Prompts",
  prompt1: { title: "All Rows", prompt: "Search for all rows" },
  prompt2: { title: "All Rows", prompt: "Search for all rows" },
  prompt3: { title: "All Rows", prompt: "Search for all rows" },
  prompt4: { title: "All Rows", prompt: "Search for all rows" },
};

const apis = {
  baseUrl: "http://20.13.33.106/api/",
  ingest: "ingest",
  clearFiles: "clear_files",
  clearChat: "clear_chat",
  generateResponse: "generate_response",
  folderProvider: "folder_names",
  modelProvider: "models",
  promptsProvider: "prompts",
};
const exports = {
  stringValues,
  errorValues,
  promptTexts,
  apis,
};
export default exports;
