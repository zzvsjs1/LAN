import { createTheme, Theme } from "@mui/material";

/**
 * Two themes we need to use in this website.
 */
export const lanLight: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6e38f4',
    },
    secondary: {
      main: '#f50057',
    }
  }
});

export const lanDark: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6e38f4',
    },
    secondary: {
      main: '#f50057',
    },
  }
});
