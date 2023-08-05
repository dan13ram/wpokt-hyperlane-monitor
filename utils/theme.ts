import { extendTheme, ResponsiveValue } from '@chakra-ui/react';
import { css } from '@emotion/react';

export const globalStyles = css`
  body {
    font-family:
      'Inter',
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
      sans-serif;
    font-size: 1rem;
    color: black;
  }
`;

export const PAGE_PADDING_X: ResponsiveValue<number> = {
  base: 4,
  sm: 6,
  md: 20,
  lg: 6,
  xl: 20,
};

export const PAGE_MAX_WIDTH = '110rem';

export const theme = extendTheme({
  config: { initialColorMode: 'light', useSystemColorMode: false },
});
