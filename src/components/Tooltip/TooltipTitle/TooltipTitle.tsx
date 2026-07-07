import { Box, Typography } from '@mui/material';
import { TypographyProps } from '@mui/material/Typography/Typography';
import { FC } from 'react';

export const TooltipTitle: FC<TypographyProps> = ({ sx = {}, children }) => (
  <Typography component={Box} variant="h6" sx={sx}>
    {children}
  </Typography>
);
