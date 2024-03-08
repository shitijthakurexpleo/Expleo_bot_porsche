import * as React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { NameContext } from "../LandingPage/LandingPage";
export default function OpenAICheckbox() {
  const infoBotContext = React.useContext(NameContext).infoBot;
  const [infoBot, setInfoBot] = infoBotContext;
  const handleChange = (event) => {
    setInfoBot(event.target.checked);
  };
  return (
    <div>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              defaultChecked
              checked={infoBot}
              onChange={handleChange}
              sx={{
                "& .MuiSwitch-thumb": {
                  color: "white",
                },
                "& .MuiSwitch-track": {
                  backgroundColor: "#FFFFFF",
                },
                "& .Mui-checked+.MuiSwitch-track": {
                  backgroundColor: "#805CE5 !important",
                },
                "& .Mui-checked": {
                  "& .MuiSwitch-thumb": {
                    color: "#805CE5",
                  },
                },
              }}
            />
          }
          label="Expleo Assist"
        />
      </FormGroup>
    </div>
  );
}
