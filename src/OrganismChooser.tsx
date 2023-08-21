import React from 'react';
import { MenuItem, Stack, TextField } from '@mui/material';
import { OrganismType } from './Region';

const OrganismChooser: React.FC<{
  organism: OrganismType | undefined;
  organisms: string[];
  onOrganismChange: (o: OrganismType) => void;
}> = ({ organism, organisms, onOrganismChange }) => {
  return (
    <Stack direction='column' spacing={2}>
      <TextField
        select={true}
        label='Organism'
        value={organism}
        onChange={event => onOrganismChange(event.target.value as OrganismType)}
        helperText=''
      >
        <MenuItem value={undefined}>None selected</MenuItem>
        {organisms &&
          organisms.map(o => (
            <MenuItem key={o} value={o}>
              {o}
            </MenuItem>
          ))}
      </TextField>
    </Stack>
  );
};

export default OrganismChooser;
