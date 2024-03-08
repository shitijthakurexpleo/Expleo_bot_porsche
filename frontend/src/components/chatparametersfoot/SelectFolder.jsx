import * as React from "react";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import getFolders from "../../Services/HelperFunctions";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { callFolderNamesProvider } from "../../Services/ApiServices";
import { NameContext } from "../LandingPage/LandingPage";

const SelectFolder = (props) => {
  const folderListContext = React.useContext(NameContext).folderList;
  const [folderList, setFolderList] = folderListContext;
  const selectedFolderContext = React.useContext(NameContext).selectedFolder;
  const [selectedFolder, setSelectedFolder] = selectedFolderContext;
  const handleChange = (event) => {
    setSelectedFolder(event.target.value);
  };
  React.useEffect(() => {
    callFolderNamesProvider(setFolderList, setSelectedFolder);
  }, []);
  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h6">Select Folder: </Typography>

      <FormControl sx={{ minWidth: "100px" }}>
        <Select
          labelId="selected-folder-label"
          id="selected-folder"
          value={selectedFolder}
          onChange={handleChange}
          inputProps={{
            "aria-label": "Without label",
            MenuProps: {
              MenuListProps: {
                sx: {
                  backgroundColor: "black",
                  color: "white",
                },
              },
            },
          }}
          autoWidth
          size="small"
          sx={{
            ".MuiSelect-nativeInput": {
              color: "red",
            },
            "& .MuiSelect-icon": {
              color: "white",
            },
            "& .MuiSelect-select": {
              color: "white",
              border: "1px dashed white",
              fontWeight: "2rem",
            },
            "& .MuiSelect-select:hover": {
              color: "white",
              border: "2px solid white",
            },

            "& .MuiSelect-select:selected": {
              color: "black",
              border: "2px solid white",
              background: "white",
            },
          }}
        >
          {folderList.map((folder) => (
            <MenuItem
              sx={{
                "& .Mui-selected": {
                  color: "white",
                  backgroundColor: "black",
                },
              }}
              key={folder}
              value={folder}
            >
              {folder}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default SelectFolder;
