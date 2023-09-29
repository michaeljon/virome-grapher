import React, { useState } from 'react';
import { ListSubheader, MenuItem, Skeleton, Stack, TextField } from '@mui/material';

import FilterTextField, { containsText } from '../Shared/FilterTextField';
import { Sequence, SequenceSet } from '../Shared/SequenceSet';

const SequenceChooser: React.FC<{
  sequenceList: SequenceSet | undefined;
  sequenceid: string | '';
  onSequenceChange: (s: string) => void;
}> = ({ sequenceList, sequenceid, onSequenceChange }) => {
  const [filteredItems, setFilteredItems] = useState<SequenceSet>(sequenceList || []);

  const filterSequence = (s: Sequence, filter: string): boolean => {
    if (s === undefined) {
      return false;
    }

    return containsText(s.sample, filter) || containsText(s.sequenceid, filter);
  };

  if (sequenceList === undefined || sequenceList.length === 0) {
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
        label='Sequence'
        value={sequenceid || ''}
        onChange={event => {
          onSequenceChange(event.target.value);
        }}
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
        <MenuItem key={''} value={''}>
          None selected
        </MenuItem>
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
