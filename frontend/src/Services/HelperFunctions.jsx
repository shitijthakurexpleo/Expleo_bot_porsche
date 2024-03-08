import { callFolderNamesProvider } from "./ApiServices";
 
async function getFolders(){
  return await callFolderNamesProvider();
};



export default {getFolders};