'use client';
import { createTheme } from '@mui/material/styles';
import { lighten } from '@mui/system/colorManipulator';
import { Bebas_Neue, Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const bebas = Bebas_Neue({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
});

const baseTheme = createTheme({
  typography: {
    fontFamily: poppins.style.fontFamily,
  },
  palette: {
    text: {
      primary: '#14142B',
      secondary: '#6E7191',
    },
    primary: {
      light: '#4E9AFF',
      main: '#005BD4',
      dark: '#003881',
    },
    secondary: {
      light: '#EDF2F7',
      main: '#A0AEC0',
      dark: '#2D3748',
    },
    success: {
      light: '#C6F6D5',
      main: '#48BB78',
      dark: '#276749',
    },
    error: {
      light: '#F3B0B3',
      main: '#DE2B34',
      dark: '#AC1B22',
    },
    grey: {
      50: '#F7F7FC',
      100: '#F7F7F7',
      200: '#EFF0F6',
      300: '#D9DBE9',
      400: '#A0A3BD',
      500: '#6E7191',
      600: '#4E4B66',
      700: '#262338',
      800: '#14142A',
      900: '#160808',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 991,
      lg: 1200,
      xl: 1536,
    },
  },
});

export const theme = createTheme(baseTheme, {
  typography: {
    fontFamily: poppins.style.fontFamily,
    fontSize: baseTheme.typography.pxToRem(16),

    h1: {
      fontWeight: 600,
      fontSize: baseTheme.typography.pxToRem(46),
      lineHeight: '120%',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: baseTheme.typography.pxToRem(30),
      },
    },
    h2: {
      fontWeight: 600,
      fontSize: baseTheme.typography.pxToRem(30),
      lineHeight: '120%',
      [baseTheme.breakpoints.down('sm')]: {
        fontSize: baseTheme.typography.pxToRem(24),
      },
    },
    h3: {
      fontWeight: 600,
      fontSize: baseTheme.typography.pxToRem(22),
      lineHeight: '130%',
    },
    h4: {
      fontWeight: 600,
      fontSize: baseTheme.typography.pxToRem(20),
      lineHeight: '130%',
    },
    h5: {
      fontWeight: 600,
      fontSize: baseTheme.typography.pxToRem(18),
      lineHeight: '130%',
    },
    h6: {
      fontWeight: 600,
      fontSize: baseTheme.typography.pxToRem(16),
      lineHeight: '130%',
    },
    body: {
      fontWeight: 400,
      fontSize: baseTheme.typography.pxToRem(16),
      lineHeight: '24px',
    },
    body2: {
      fontWeight: 400,
      fontSize: baseTheme.typography.pxToRem(14),
      lineHeight: '130%',
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: baseTheme.typography.pxToRem(12),
      lineHeight: '130%',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: baseTheme.typography.pxToRem(12),
      lineHeight: '130%',
    },
    button: {
      fontSize: 16,
      textTransform: 'unset',
      fontWeight: 700,
    },
    license: {
      fontFamily: bebas.style.fontFamily,
      fontSize: baseTheme.typography.pxToRem(18),
      fontWeight: 400,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html': {
          height: '100%',
        },
        'body': {
          height: '100%',
        },
        // scroll-bar
        '*::-webkit-scrollbar': {
          width: 4,
          height: 4,
        },

        '*::-webkit-scrollbar-track': {
          backgroundColor: lighten(baseTheme.palette?.text?.primary, 0.95),
          boxShadow: 'inset 0px 1px 4px rgba(0, 0, 0, 0.1)',
          borderRadius: 5,
          WebkitBoxShadow: 'inset 0px 1px 4px rgba(0, 0, 0, 0.1)',
        },

        '*::-webkit-scrollbar-thumb': {
          backgroundColor: lighten(baseTheme.palette?.text?.secondary, 0.7),
          border: `1px solid ${lighten(baseTheme.palette?.text?.secondary, 0.6)}`,
          boxSizing: 'border-box',
          borderRadius: 26,
        },

        '.fc-event-dragging, .fc-event-resizing': {
          opacity: 0.6,
        },

        '.fc-event-dragging': {
          cursor: 'grabbing',
        },

        '.fc': {
          '& .fc-event': {
            'backgroundColor': baseTheme.palette.primary.main + ' !important',

            '.carsu-fullcalendar': {
              backgroundColor: baseTheme.palette.primary.main + ' !important',
            },

            '&.carsu-fullcalendar:hover': {
              backgroundColor: baseTheme.palette.primary.main + ' !important',
              opacity: 0.7,
            },

            '&.carsu-fullcalendar.event-break': {
              backgroundColor: baseTheme.palette.secondary.main + ' !important',
              borderColor: baseTheme.palette.secondary.main + ' !important',
              cursor: 'default !important',
            },

            '&.carsu-fullcalendar.event-break:hover': {
              backgroundColor: baseTheme.palette.secondary.main + ' !important',
              borderColor: baseTheme.palette.secondary.main + ' !important',
              opacity: 1,
            },
          },
        },

        '.fc.fc-media-screen.fc-direction-ltr.fc-theme-standard': {
          'height': '100%',

          '& .fc-header-toolbar.fc-toolbar.fc-toolbar-ltr': {
            flexWrap: 'wrap',
            gap: 8,
          },

          '& .fc-button-group .fc-button, & .fc-button': {
            backgroundColor: baseTheme.palette.primary.main + ' !important',
            borderColor: baseTheme.palette.primary.main + ' !important',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: baseTheme.palette.background.default,
          boxShadow: '0px 8px 30px 0px rgba(82, 78, 183, 0.08)',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        disableRipple: true,
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});
