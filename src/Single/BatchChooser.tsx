import React, { useEffect, useState } from 'react';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

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
    <FormControl fullWidth>
      <InputLabel id='single-batch-chooser-label'>Batch</InputLabel>
      <Select
        displayEmpty
        labelId='single-batch-chooser-label'
        id='single-batch-chooser'
        value={batch}
        label='Batch'
        onChange={event => changeBatch(event.target.value)}
      >
        {batchList &&
          batchList
            .filter(b => b !== undefined)
            .sort((a, b) => a.localeCompare(b))
            .map(b => (
              <MenuItem key={b} value={b}>
                {b}
              </MenuItem>
            ))}
      </Select>
    </FormControl>
  );
};

export default BatchChooser;
