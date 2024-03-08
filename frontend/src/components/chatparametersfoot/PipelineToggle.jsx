import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function PipelineToggle() {
  const [pipeline, setPipeline] = React.useState('left');

  const handleSelectedPipeline = (event, newAlignment) => {
    setPipeline(newAlignment);
  };

  return (
    <ToggleButtonGroup
      value={pipeline}
      exclusive
      onChange={handleSelectedPipeline}
      aria-label="text pipeline"
    >
      <ToggleButton value="left" aria-label="left aligned">
        SQL
      </ToggleButton>
      <ToggleButton value="right" aria-label="right aligned">
        RAG
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
