/* eslint-disable no-restricted-globals */
import React, { useMemo } from 'react';

import { Container, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';

import { lightTheme } from './themes/light.theme';
import { darkTheme } from './themes/dark.theme';

import Home from './Home/Home';
import { Route, Routes } from 'react-router-dom';
import Single from './Single/Single';
import Compare from './Compare/Compare';

const App = () => {
  const isDarkModeEnabled = useMediaQuery('(prefers-color-scheme: dark)');
  const responsiveTheme = useMemo(() => (isDarkModeEnabled ? darkTheme : lightTheme), [isDarkModeEnabled]);

  return (
    <ThemeProvider theme={responsiveTheme}>
      <CssBaseline />
      <Container maxWidth={false}>
        <Routes location={location}>
          <Route path='/' element={<Home />} />
          <Route path='/single' element={<Single />} />
          <Route path='/compare' element={<Compare />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
};

export default App;
