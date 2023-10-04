import { createTheme } from '@mui/material';
import { amber, indigo } from '@mui/material/colors';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2d00ff',
    },
    secondary: {
      main: '#d0ff00',
    },
  },
  components: {},
});
