import React, { useState } from 'react';
import { ListSubheader, MenuItem, Skeleton, Stack, TextField } from '@mui/material';

import FilterTextField from './FilterTextField';
import { Sequence, SequenceSet } from './SequenceSet';

const SequenceChooser: React.FC<{
  sequenceList: SequenceSet | undefined;
  sequenceid: string | undefined;
  onSequenceChange: (s: string) => void;
}> = ({ sequenceList, sequenceid: sequence, onSequenceChange }) => {
  const [filteredItems, setFilteredItems] = useState<SequenceSet>(sequenceList || []);

  const startsWith = (text: string | undefined, searchText: string): boolean => {
    if (text === undefined) {
      return false;
    }
    return text.toLowerCase().startsWith(searchText.toLowerCase());
  };

  const filterSequence = (seq: Sequence, filter: string): boolean => {
    if (seq === undefined) {
      return false;
    }

    return startsWith(seq.sample, filter) || startsWith(seq.sequenceid, filter);
  };

  if (sequenceList === undefined || sequenceList.length === 0) {
    return (
      <Stack direction='column' spacing={2}>
        <Skeleton animation={false} variant='rounded' height={60} />
      </Stack>
    );
  }

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
            items={sequenceList}
            setFilteredItems={setFilteredItems}
            placeholderText='Search by sequence id'
          ></FilterTextField>
        </ListSubheader>
        <MenuItem value=''>None selected</MenuItem>
        {filteredItems &&
          filteredItems
            .filter(s => s.sortkey !== undefined)
            .sort((a, b) => a.sortkey.localeCompare(b.sortkey))
            .map(s => (
              <MenuItem key={s.sequenceid} value={s.sequenceid}>
                <strong>{s.sequenceid}</strong> - {s.sample}
              </MenuItem>
            ))}
      </TextField>
    </Stack>
  );
};

export default SequenceChooser;
