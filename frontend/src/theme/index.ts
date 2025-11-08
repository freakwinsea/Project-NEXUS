import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  styles: {
    global: {
      'html, body': {
        bg: 'slate.900',
      },
    },
  },
  colors: {
    brand: {
      50: '#e0f2ff',
      100: '#b3dcff',
      200: '#80c6ff',
      300: '#4db0ff',
      400: '#1a9aff',
      500: '#007fe6',
      600: '#005fb4',
      700: '#004182',
      800: '#002351',
      900: '#000521',
    },
    slate: {
      900: '#0f172a',
      800: '#1e293b',
      700: '#334155',
      600: '#475569',
      500: '#64748b',
      400: '#94a3b8',
      300: '#cbd5f5',
      200: '#e2e8f0',
      100: '#f1f5f9',
      50: '#f8fafc',
    },
  },
  components: {
    Button: {
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: { bg: 'brand.400' },
          _active: { bg: 'brand.600' },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          bg: 'slate.800',
        },
      },
    },
  },
});

export default theme;
export { config };
