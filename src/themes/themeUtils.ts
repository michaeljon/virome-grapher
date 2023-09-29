import { darken, lighten } from '@mui/material';

export const getBackgroundColor = (color: string, mode: string): string =>
  mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

export const getHoverBackgroundColor = (color: string, mode: string): string =>
  mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);
