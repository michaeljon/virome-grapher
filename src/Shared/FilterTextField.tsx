/* eslint-disable  @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';

import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';

import useFocusableInput from '../useFocusableInput';

/**
 * Input properties for a filter text field. A text field that filters applies the provided
 * filterItem function to each element in the items array and uses the setFilteredItems state dispatch function
 * to return the filtered elements to the parent.
 */
export interface FilterTextProps<T> {
  /**
   * Function which applies to each item, taking the item itself and the search text that's been typed.
   * Return true if this item matches the filter, false otherwise.
   *
   * @param item The item being filtered
   *
   * @param filterText the text being searched on
   *
   * @return true if the item matches the filter, false otherwise
   */
  filterItem: (item: T, filterText: string) => boolean;
  /**
   * Array of items that will be filterable by this component.
   */
  items: T[];
  /**
   * React dispatch state action which will be used to set the filtered results.
   */
  setFilteredItems: React.Dispatch<React.SetStateAction<T[]>>;

  /**
   * Optional. Set the filter text for the search box. If not specified, this value will be ignored.
   */
  filterText?: string | undefined;

  /**
   * Optional placeholder text to display in the empty widget.
   *
   * @default "Type to search..."
   */
  placeholderText?: string;
  /**
   * If the element should be autoFocused on first draw
   *
   * @default true
   */
  autoFocus?: boolean;
}

export const containsText = (text: string | undefined, searchText: string): boolean => {
  if (text === undefined) {
    return false;
  }
  return text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
};

export const startsWith = (text: string | undefined, searchText: string): boolean => {
  if (text === undefined) {
    return false;
  }
  return text.toLowerCase().startsWith(searchText.toLowerCase());
};

const FilterTextField: React.FC<FilterTextProps<any>> = ({
  filterItem,
  items,
  setFilteredItems,
  autoFocus = true,
  placeholderText = 'Type to search...',
  filterText,
}: FilterTextProps<any>) => {
  const [searchText, setSearchText] = useState('');

  // Hook which can be used to set focus on this component, in the event it will be hidden when the component renders
  const { setInputRef, disableKeyPropagation } = useFocusableInput(autoFocus);

  useEffect(() => setSearchText(''), [items]);

  useEffect(() => {
    if (filterText !== undefined) {
      setSearchText(filterText);
    }
  }, [filterText]);

  useEffect(() => {
    const filteredItems = items.filter((item: any) => filterItem(item, searchText));
    setFilteredItems(filteredItems);
  }, [searchText, items]);

  return (
    <TextField
      size='small'
      value={searchText}
      autoFocus={autoFocus}
      inputRef={setInputRef}
      placeholder={placeholderText}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      onChange={e => setSearchText(e.target.value)}
      onKeyDown={disableKeyPropagation}
    />
  );
};

export default FilterTextField;
