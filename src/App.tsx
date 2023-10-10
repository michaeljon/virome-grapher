/* eslint-disable no-restricted-globals */
import React, { useEffect, useMemo, useState } from 'react';

import { Route, Routes } from 'react-router-dom';
import { Container, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';

import Highcharts, { Options } from 'highcharts';

// import { lightTheme } from './themes/light.theme';
// import { darkTheme } from './themes/dark.theme';

import { darkTheme } from './themes/custom.theme';
import { lightTheme } from './themes/custom.theme';

import Home from './Home/Home';
import Single from './Single/Single';
import Compare from './Compare/Compare';
import { SequenceSet } from './Shared/SequenceSet';

Highcharts.setOptions({
  chart: {
    style: {
      fontFamily:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
    },
  },
});

const App = () => {
  const isDarkModeEnabled = useMediaQuery('(prefers-color-scheme: dark)');
  const overallTheme = useMemo(() => (isDarkModeEnabled ? darkTheme : lightTheme), [isDarkModeEnabled]);

  const [sequenceList, setSequenceList] = useState<SequenceSet>([]);

  // get the sequence list
  useEffect(() => {
    fetch('/server/all-samples.json')
      .then(response => response.json())
      .then(json => {
        setSequenceList(json);
      });
  }, []);

  return (
    <ThemeProvider theme={overallTheme}>
      <CssBaseline />
      <Container maxWidth={false}>
        <Routes location={location}>
          <Route path='/' element={<Home />} />
          <Route path='/single' element={<Single sequenceList={sequenceList} />} />
          <Route path='/compare' element={<Compare sequenceList={sequenceList} />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
};

export default App;
