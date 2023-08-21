import React, { useState } from 'react';
import { ListSubheader, MenuItem, Stack, TextField } from '@mui/material';

import FilterTextField, { startsWith } from './FilterTextField';

const SequenceChooser: React.FC<{
  sequences: string[];
  sequence: string | undefined;
  onSequenceChange: (s: string) => void;
}> = ({ sequences, sequence, onSequenceChange }) => {
  const [filteredItems, setFilteredItems] = useState<string[]>(sequences || []);

  const filterSequence = (seq: string, filter: string): boolean => {
    if (seq === undefined) {
      return false;
    }

    return startsWith(seq, filter);
  };

  return (
    <Stack direction='column' spacing={2}>
      <TextField
        select={true}
        label='Sequence'
        value={sequence}
        onChange={event => onSequenceChange(event.target.value)}
        helperText=''
      >
        <ListSubheader>
          <FilterTextField
            filterItem={filterSequence}
            items={sequences}
            setFilteredItems={setFilteredItems}
            placeholderText='Search by sequence id'
          ></FilterTextField>
        </ListSubheader>
        <MenuItem value=''>None selected</MenuItem>
        {filteredItems &&
          filteredItems.sort().map(s => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
      </TextField>
    </Stack>
  );
};

export default SequenceChooser;
