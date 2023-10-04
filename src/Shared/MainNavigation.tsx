import React from 'react';

import AppBar from '@mui/material/AppBar/AppBar';
import Container from '@mui/material/Container/Container';
import Typography from '@mui/material/Typography/Typography';
import Toolbar from '@mui/material/Toolbar/Toolbar';

import logo from '../images/g-logo192.png';

const MainNavigation: React.FC = () => {
  return (
    <AppBar position='sticky' color='primary' elevation={6}>
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <img src={logo} style={{ display: 'flex', height: '48px' }} alt='The logo, yeah?' />
          <Typography
            variant='h5'
            noWrap
            component='a'
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              paddingLeft: '6px',
            }}
          >
            Ovation Virome Viewer
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default MainNavigation;
