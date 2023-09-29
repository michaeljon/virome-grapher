import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';

export type gene_type = { [key: string]: { start: number; stop: number } } | undefined;

const FeatureList: React.FC<{ feature: string | undefined; features: gene_type; setFeature: (f: string) => void }> = ({
  feature,
  features,
  setFeature,
}) => {
  // if (feature === undefined) {
  //   setFeature('organism');
  // }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > *': {
          m: 1,
        },
      }}
    >
      <ToggleButtonGroup value={feature || 'organism'} exclusive onChange={(_, f) => setFeature(f)}>
        <ToggleButton key='organism' value='organism'>
          Full genome
        </ToggleButton>

        {features &&
          Object.keys(features).map(g => (
            <ToggleButton key={g} value={g}>
              {g}
            </ToggleButton>
          ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default FeatureList;
