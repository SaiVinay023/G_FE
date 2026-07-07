import CloseIcon from '@mui/icons-material/Close';
import { Box, Typography, IconButton, Tooltip, Theme, BoxProps } from '@mui/material';
import { SxProps } from '@mui/system';
import { FC, ReactNode } from 'react';

interface ModalHeaderInterface {
  sx?: SxProps<Theme>;
  disableTypography?: boolean;
  iconFontSize?: number;
  icon?: string | ReactNode;
  children?: string | ReactNode;
  onClose: ((val?: unknown) => void) | undefined;
}

export const ModalHeader: FC<ModalHeaderInterface> = ({
  disableTypography = false,
  icon,
  sx = {},
  children,
  onClose,
  iconFontSize = 30,
}) => {
  const boxProps: Partial<BoxProps> = !disableTypography
    ? {
        component: Typography,
        fontSize: 23,
        fontWeight: 500,
      }
    : {};

  return (
    <Box display="flex" alignItems="center" pl={[2, 3, 3]} pr={2} sx={sx} {...boxProps}>
      {!!children && (
        <Box display="flex" flexGrow={1} color="inherit" mr={1}>
          {icon && (
            <Box display="flex" alignItems="center" mr={1}>
              {icon}
            </Box>
          )}

          {children}
        </Box>
      )}

      {!!onClose && (
        <Tooltip title="Close modal">
          <IconButton color="inherit" edge="end" onClick={onClose}>
            <CloseIcon color="inherit" sx={{ fontSize: iconFontSize }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};
