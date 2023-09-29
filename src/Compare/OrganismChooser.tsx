import React from 'react';
import { MenuItem, Skeleton, Stack, TextField } from '@mui/material';
import { OrganismType } from '../Shared/Region';

const OrganismChooser: React.FC<{
  organism: OrganismType | undefined;
  organisms: string[];
  onOrganismChange: (o: OrganismType) => void;
}> = ({ organism, organisms, onOrganismChange }) => {
  if (organisms === undefined || organisms.length === 0) {
    return (
      <Stack direction='column' spacing={2}>
        <Skeleton animation='wave' variant='rounded' height={60} />
      </Stack>
    );
  }

  return (
    <Stack direction='column' spacing={2}>
      <TextField
        select={true}
        label='Organism'
        value={organism}
        onChange={event => {
          onOrganismChange(event.target.value as OrganismType);
        }}
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
