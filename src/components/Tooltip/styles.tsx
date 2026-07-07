import { Tooltip, TooltipProps, tooltipClasses } from '@mui/material';
import { styled } from '@mui/material/styles';

interface TooltipInterface extends TooltipProps {
  maxWidth?: number | string;
}
export const MuiTooltip = styled(({ className, ...props }: TooltipInterface) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme, maxWidth, placement }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: '#2E3841',

    [theme.breakpoints.down('md')]:
      placement === 'bottom'
        ? {
            marginLeft: theme.spacing(-1.25) + ' !important',
          }
        : {},
  },
  [`& .${tooltipClasses.tooltip}`]: {
    'padding': theme.spacing(1.5, 2),
    'backgroundColor': '#2E3841',
    'borderRadius': '15px',
    ...({ maxWidth } || {}),

    [theme.breakpoints.down('md')]:
      placement === 'bottom' || placement === 'top'
        ? {
            marginLeft: theme.spacing(5.5) + ' !important',
          }
        : {},

    [theme.breakpoints.down('sm')]:
      placement === 'bottom' || placement === 'top'
        ? {
            marginLeft: theme.spacing(3) + ' !important',
          }
        : {},

    '@media (max-width: 320px)': {
      maxWidth: 270,
    },
  },
}));
