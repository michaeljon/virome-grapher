import React from 'react';

import { Theme, useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Button, Skeleton, Stack } from '@mui/material';

import { Sequence } from '../Shared/SequenceSet';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(sequenceid: Sequence, sequence: readonly Sequence[], theme: Theme) {
  return {
    fontWeight:
      sequence.indexOf(sequenceid) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

const SequenceList: React.FC<{ sequences: Sequence[] | undefined; onCompare: (sequences: Sequence[]) => void }> = ({
  sequences,
  onCompare,
}) => {
  const theme = useTheme();
  const [selectedSequenceItems, setSelectedSequenceItems] = React.useState<Sequence[]>(sequences || []);

  const handleChange = (event: SelectChangeEvent<typeof selectedSequenceItems>) => {
    const {
      target: { value },
    } = event;

    if (typeof value === 'string') {
      setSelectedSequenceItems(sequences?.filter(s => s.sequenceid === value[0]) || []);
    } else {
      const newItems: Sequence[] = [];

      // the last one is the one we're messing with
      const len = value.length;
      const item = value[len - 1] as any as string;

      if (len === 1) {
        // there's only one, we're adding it, and it's a string, and we know it's there
        newItems.push((sequences?.filter(s => s.sequenceid === item) || [])[0]);
      } else {
        // this is the one we're adding or removing
        if (selectedSequenceItems.filter(s => s.sequenceid === item).length > 0) {
          // removing it, just copy all the ones that aren't the target
          for (let v of selectedSequenceItems) {
            if (v.sequenceid !== item) {
              newItems.push(v);
            }
          }
        } else {
          // adding it, just copy everything, then add this one
          for (let v of selectedSequenceItems) {
            newItems.push(v);
          }
          newItems.push((sequences?.filter(s => s.sequenceid === item) || [])[0]);
        }
      }

      setSelectedSequenceItems(newItems);
    }
  };

  if (sequences?.length === 0) {
    return (
      <Stack direction='column' spacing={2}>
        <Skeleton animation='wave' variant='rounded' height={60} />
      </Stack>
    );
  }

  return (
    <Stack direction='column' spacing={2}>
      <Select
        multiple
        value={selectedSequenceItems}
        onChange={handleChange}
        input={<OutlinedInput id='select-multiple-chip' label='Chip' />}
        renderValue={selected => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map(value => (
              <Chip key={value.sequenceid} label={value.sample} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {sequences &&
          sequences
            .filter(s => s.sortkey !== undefined)
            .sort((a, b) => a.sortkey.localeCompare(b.sortkey))
            .map(s => (
              <MenuItem key={s.sequenceid} value={s.sequenceid} style={getStyles(s, selectedSequenceItems, theme)}>
                <span>{s.sample}</span>
                <span style={{ fontSize: 'smaller', paddingLeft: '1em' }}>{s.sequenceid}</span>
              </MenuItem>
            ))}
      </Select>
      <Button disabled={selectedSequenceItems?.length === 0} onClick={() => onCompare(selectedSequenceItems)}>
        Compare
      </Button>
    </Stack>
  );
};

export default SequenceList;
