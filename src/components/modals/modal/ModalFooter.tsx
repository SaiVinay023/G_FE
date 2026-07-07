import { Stack, Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import { FC, ReactNode } from 'react';

interface ModalFooterInterface {
  children: ReactNode | ReactNode[];
  sx?: SxProps<Theme>;
}

export const ModalFooter: FC<ModalFooterInterface> = ({ children, sx = {} }) => (
  <Stack position="sticky" sx={{ bottom: 0, backgroundColor: 'white', zIndex: 1, ...sx }}>
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      gap={[1, 2]}
      py={2}
      sx={(theme) => ({
        px: [2, 3, 3],
        borderTop: `1px solid ${theme.palette.divider}`,
      })}
    >
      {children}
    </Stack>
  </Stack>
);
