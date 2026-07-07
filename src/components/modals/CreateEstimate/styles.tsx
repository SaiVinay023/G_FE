import { ListItem, Paper, styled } from '@mui/material';

export const ResultsContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.spacing(1.5),
  maxHeight: '240px',
  overflow: 'auto',
  marginBottom: theme.spacing(3),
}));

export const VehicleItem = styled(ListItem)<{ selected?: boolean }>(({ theme, selected }) => ({
  'width': '100%',
  'marginBottom': theme.spacing(1),
  'padding': theme.spacing(1, 2),
  'backgroundColor': selected ? theme.palette.primary.main : theme.palette.background.paper,
  'color': selected ? theme.palette.primary.contrastText : theme.palette.text.primary,
  'borderRadius': theme.spacing(0.5),
  'cursor': 'pointer',
  'boxShadow': theme.shadows[1],
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.main : theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
}));
