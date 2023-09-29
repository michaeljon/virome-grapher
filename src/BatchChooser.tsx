import React, { useEffect, useState } from 'react';

import { MenuItem, Stack, TextField } from '@mui/material';

const BatchChooser: React.FC<{ onBatchChange: (batch: string) => void }> = ({ onBatchChange }) => {
  const [batch, setBatch] = useState<string>('');
  const [batchList, setBatchList] = useState<string[]>([]);

  useEffect(() => {
    fetch('/server/batchlist.json')
      .then(response => response.json())
      .then(json => setBatchList(json));
  }, []);

  const changeBatch = (b: string) => {
    setBatch(b);
    onBatchChange(b);
  };

  return (
    <Stack direction='column' spacing={2}>
      <TextField
        select={true}
        label='Batch'
        value={batch}
        onChange={event => changeBatch(event.target.value)}
        helperText=''
      >
        <MenuItem value={undefined}>None selected</MenuItem>
        {batchList &&
          batchList
            .filter(b => b !== undefined)
            .sort((a, b) => a.localeCompare(b))
            .map(b => (
              <MenuItem key={b} value={b}>
                {b}
              </MenuItem>
            ))}
      </TextField>
    </Stack>
  );
};

export default BatchChooser;
