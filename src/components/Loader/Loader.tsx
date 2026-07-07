import { Backdrop, CircularProgress } from '@mui/material';
import { SxProps } from '@mui/system';
import { FC, ReactNode } from 'react';

type LoaderProps = {
  loading?: boolean;
  color?: string;
  sx?: SxProps;
  render: () => ReactNode;
};

export const Loader: FC<LoaderProps> = ({ loading = false, render, color = '#fff', sx = {} }) => {
  return loading ? (
    <Backdrop
      sx={{
        color,
        backgroundColor: 'transparent',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        ...sx,
      }}
      open={loading}
    >
      <CircularProgress color="primary" />
    </Backdrop>
  ) : (
    <>{render()}</>
  );
};
