import React from 'react';
import { Link } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import { Button, Container, Divider, Grid, Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import backgroundLogo from '../images/gs-logo192.png';
import foregroundLogo from '../images/logo192.png';

import Statistics from './Statistics';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const WelcomeBanner: React.FC<{ children?: React.ReactNode }> = props => {
  const style = {
    backgroundImage: `url(${backgroundLogo})`,
    backgroundPosition: '0% 25%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundColor: 'rgb(240, 240, 240, 0.75)',
    color: 'black',
  };

  return (
    <div className='jumbotron' style={style}>
      <Stack direction='row' spacing={2}>
        <img src={foregroundLogo} alt='Ovation logo' />
        <div>
          <Typography variant='h2'>Ovation Virome Viewer</Typography>
          <Divider />
          <div>{props.children}</div>
        </div>
      </Stack>
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <Container>
      <WelcomeBanner>
        <Typography variant='body1'>&nbsp;</Typography>
        <Typography variant='body1'>Hello Ovation Peeps,</Typography>
        <Typography variant='body2'>
          This is the Ovation Virome Viewer / Grapher. It's here for you to use for viewing, verifying, and generally
          staring at the results of running our virus pipelines against various FASTQ sequences. There are two
          "applications" currently available. The first allows you to drill into a single sequence and view it on its
          own. The second allows you to compare multiple sequences in the same graph. See below for the links...
        </Typography>
      </WelcomeBanner>

      <Box sx={{ width: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}></Grid>
          <Grid item xs={6}>
            <Item>
              <Link to='/single'>
                <Button>View single sequences</Button>
              </Link>
            </Item>
          </Grid>

          <Grid item xs={6}>
            <Item>
              <Link to='/compare'>
                <Button>Compare sequences</Button>
              </Link>
            </Item>
          </Grid>

          <Grid item xs={12}>
            <Statistics />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
