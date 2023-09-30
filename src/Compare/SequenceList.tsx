import React, { useEffect, useState } from 'react';

import { Theme, styled, useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Button, FormControl, InputLabel, Paper, Skeleton, Stack } from '@mui/material';

import { Sequence } from '../Shared/SequenceSet';
import { OrganismType } from '../Shared/Region';

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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function getStyles(sequenceid: Sequence, sequence: readonly Sequence[], theme: Theme) {
  return {
    fontWeight:
      sequence.indexOf(sequenceid) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

const SequenceList: React.FC<{
  unfilteredSequences: Sequence[] | undefined;
  organism: OrganismType | '';
  onCompare: (sequences: Sequence[]) => void;
}> = ({ unfilteredSequences, organism, onCompare }) => {
  const theme = useTheme();

  const [filteredSequences, setFilteredSequences] = useState<Sequence[]>([]);
  const [selectedSequenceItems, setSelectedSequenceItems] = useState<Sequence[]>([]);

  useEffect(() => {
    setSelectedSequenceItems([]);
    if (organism === '') {
      setFilteredSequences([]);
    } else {
      setFilteredSequences(unfilteredSequences?.filter(s => s.organisms?.includes(organism)) || []);
    }
  }, [unfilteredSequences, organism]);

  const handleChange = (event: SelectChangeEvent<typeof selectedSequenceItems>) => {
    const {
      target: { value },
    } = event;

    if (typeof value === 'string') {
      setSelectedSequenceItems(filteredSequences?.filter(s => s.sequenceid === value[0]) || []);
    } else {
      const newItems: Sequence[] = [];

      // the last one is the one we're messing with
      const len = value.length;
      const item = value[len - 1] as any as string;

      if (len === 1) {
        // there's only one, we're adding it, and it's a string, and we know it's there
        newItems.push((filteredSequences?.filter(s => s.sequenceid === item) || [])[0]);
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
          newItems.push((filteredSequences?.filter(s => s.sequenceid === item) || [])[0]);
        }
      }

      setSelectedSequenceItems(newItems);
    }
  };

  if (unfilteredSequences?.length === 0) {
    return (
      <Stack direction='column' spacing={2}>
        <Skeleton animation='wave' variant='rounded' height={60} />
      </Stack>
    );
  }

  return (
    <FormControl fullWidth>
      <InputLabel id='compare-sequence-label'>Sequence</InputLabel>
      <Select
        multiple
        displayEmpty
        labelId='compare-sequence-label'
        id='compare-sequence-chooser'
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
        {filteredSequences &&
          filteredSequences
            .filter(s => s.sortkey !== undefined)
            .sort((a, b) => a.sortkey.localeCompare(b.sortkey))
            .map(s => (
              <MenuItem key={s.sequenceid} value={s.sequenceid} style={getStyles(s, selectedSequenceItems, theme)}>
                <span>{s.sample}</span>
                <span style={{ fontSize: 'smaller', paddingLeft: '1em' }}>{s.sequenceid}</span>
              </MenuItem>
            ))}
      </Select>
      <Item>
        <Button disabled={selectedSequenceItems?.length === 0} onClick={() => onCompare(selectedSequenceItems)}>
          Compare
        </Button>
      </Item>
    </FormControl>
  );
};

export default SequenceList;
