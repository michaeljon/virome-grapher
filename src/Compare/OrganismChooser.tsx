import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, Skeleton, Stack } from '@mui/material';
import { OrganismType } from '../Shared/Region';

const OrganismChooser: React.FC<{
  organism: OrganismType | '';
  organisms: string[];
  onOrganismChange: (o: OrganismType | '') => void;
}> = ({ organism, organisms, onOrganismChange }) => {
  if (organisms === undefined || organisms.length === 0) {
    return (
      <Stack direction='column' spacing={2}>
        <Skeleton animation='wave' variant='rounded' height={60} />
      </Stack>
    );
  }

  return (
    <FormControl fullWidth>
      <InputLabel id='compare-organism-label'>Organism</InputLabel>
      <Select
        displayEmpty
        labelId='compare-organism-label'
        id='compare-organism-chooser'
        value={organism}
        label='Organism'
        onChange={event => onOrganismChange(event.target.value as OrganismType | '')}
      >
        {organisms &&
          organisms.map(o => (
            <MenuItem key={o} value={o}>
              {o}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default OrganismChooser;
