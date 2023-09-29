import React, { useEffect, useState } from 'react';

import { Stack, Typography } from '@mui/material';

const Statistics: React.FC = () => {
  const [batchCount, setBatchCount] = useState<number>();
  const [sequenceCount, setSequenceCount] = useState<number>();

  useEffect(() => {
    fetch('/server/all-samples.json')
      .then(response => response.json())
      .then(json => {
        setSequenceCount(json.length);
      });

    fetch('/server/batchlist.json')
      .then(response => response.json())
      .then(json => {
        setBatchCount(json.length);
      });
  }, []);

  return (
    <Stack spacing={1} direction='column'>
      <Typography variant='h5'>Statistics</Typography>

      <Stack spacing={2} direction='row'>
        <Typography style={{ fontWeight: 'bolder' }}>Batches available</Typography>
        {batchCount && <Typography>{batchCount}</Typography>}
      </Stack>
      <Stack spacing={2} direction='row'>
        <Typography style={{ fontWeight: 'bolder' }}>Total sequences</Typography>
        {sequenceCount && <Typography>{sequenceCount}</Typography>}
      </Stack>
    </Stack>
  );
};

export default Statistics;
