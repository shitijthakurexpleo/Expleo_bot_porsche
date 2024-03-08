import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { Tooltip } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { callModelsProvider } from "../../Services/ApiServices";
import { NameContext } from "../LandingPage/LandingPage";

// function ModelSelector(props)

const ModelSelector = (props) => {
  const modelListContext = React.useContext(NameContext).modelList;
  const [modelList, setModelList] = modelListContext;
  const selectedModelContext = React.useContext(NameContext).selectedModel;
  const [selectedModel, setSelectedModel] = selectedModelContext;
  const handleChange = (event) => {
    setSelectedModel(event.target.value);
  };
  React.useEffect(() => {
    callModelsProvider(setModelList, setSelectedModel);
  }, []);

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h6">Select Model: </Typography>

      <FormControl className="model-select-dropdown" sx={{ minWidth: "100px" }}>
        <Select
          labelId="selected-model-label"
          id="selected-model"
          value={selectedModel}
          onChange={handleChange}
          autoWidth
          size="small"
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
          sx={{
            "& .MuiSelect-icon": {
              color: "white",
            },
            "& .MuiSelect-select": {
              color: "white",
              border: "1px dashed white",
            },
            "& .MuiSelect-select:hover": {
              color: "white",
              border: "2px solid white",
            },
          }}
        >
          {modelList.map((model) => (
            <MenuItem key={model} value={model}>
              {model}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};
export default ModelSelector;
