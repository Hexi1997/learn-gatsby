import { createTheme, lightThemePrimitives } from 'baseui';

export const theme = createTheme(
  {
    ...lightThemePrimitives,
    primaryFontFamily: 'IBM Plex Mono'
  },
  {
    colors: {
      primary: '#182DEF',
      inputBorder: '#CBD0F4',
      inputFill: '#E6E8FF',
      borderFocus: '#182DEF',
      contentPrimary: '#182DEF',
      inputPlaceholder: '#182DEF'
    }
  }
);
