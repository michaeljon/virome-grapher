import { createTheme } from '@mui/material';
import { amber, indigo } from '@mui/material/colors';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2d00ff',
    },
    secondary: {
      main: '#d0ff00',
    },
  },
  components: {},
});
