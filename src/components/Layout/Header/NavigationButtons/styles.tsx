import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';

export const Search = styled('div')(({ theme }) => ({
  'position': 'relative',
  'borderRadius': theme.shape.borderRadius,
  'backgroundColor': alpha(theme.palette.primary.main, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.25),
  },
  'marginRight': theme.spacing(2),
  'marginLeft': theme.spacing(3),
  'width': 'auto',
  [theme.breakpoints.down('sm')]: {
    marginLeft: theme.spacing(1),
  },
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  'width': '100%',

  '& .MuiInputBase-input': {
    'padding': theme.spacing(1, 1, 1, 0),
    'paddingLeft': `calc(1em + ${theme.spacing(4)})`,
    'transition': theme.transitions.create('width'),
    'border': `1px solid ${theme.palette.primary.main}`,
    'borderRadius': theme.shape.borderRadius,
    'width': '8ch',
    '&:focus': {
      width: '20ch',
    },
    [theme.breakpoints.down('sm')]: {
      '&:focus': {
        width: '17ch',
      },
    },
  },
}));
