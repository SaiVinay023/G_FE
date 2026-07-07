import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';

export type ModalContainerProps = {
  component?: any;
  children: ReactNode;
  className?: string;
};

export const ModalContainer: FC<ModalContainerProps> = ({
  className = '',
  component: Component = Box,
  children,
  ...props
}) => {
  return (
    <Component
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
      {...props}
    >
      {children}
    </Component>
  );
};
