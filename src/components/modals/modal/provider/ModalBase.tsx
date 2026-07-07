import { useMediaQuery, useTheme } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import { Transition } from './Transition';
import { ErrorBoundary } from '../../../ErrorBoundary';

type ModalBaseProps = {
  modalID: number;
  open?: boolean;
  payload?: Record<string, any>;
  DialogProps?: Record<string, any>;
  ModalComponent: any;
  onModalResolved: (val: any) => void;
  onModalRejected: (val: any) => void;
  onModalExited: (val: any) => void;
  [key: string]: any;
};

export const ModalBase: FC<ModalBaseProps> = ({
  modalID,
  open,
  payload = {},
  ModalComponent,
  DialogProps,
  onModalResolved = () => {},
  onModalRejected = () => {},
  onModalExited = () => {},
  fullHeight = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isModalOpen, setIsModalOpen] = useState(open);
  const [isModalEntered, setIsModalEntered] = useState(false);

  const handleModalEntered = () => {
    setIsModalEntered(true);
  };

  const handleModalExited = () => {
    onModalExited(modalID);
    setIsModalEntered(false);
  };

  const handleModalResolve = (payload: any) => {
    setIsModalOpen(false);
    setIsModalEntered(false);
    onModalResolved(payload);
    onModalExited(modalID);
  };

  const handleModalReject = (reason: any) => {
    setIsModalOpen(false);
    setIsModalEntered(false);
    onModalRejected(reason);
    onModalExited(modalID);
  };

  useEffect(() => {
    setIsModalOpen(open);
  }, [open]);

  return (
    <ErrorBoundary>
      <ModalComponent
        isModalEntered={isModalEntered}
        payload={payload}
        DialogProps={{
          disableEscapeKeyDown: true,
          TransitionComponent: isMobile ? Transition : undefined,
          sx: {
            [theme.breakpoints.up('sm')]: {
              'display': 'flex',
              'alignItems': 'center',
              'justifyContent': 'center',
              'flexDirection': 'column',

              '& > .MuiDialog-container': {
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
            },

            [theme.breakpoints.down('sm')]: {
              '& > .MuiDialog-container > .MuiPaper-root': {
                'position': 'absolute',
                'left': 0,
                'right': 0,
                'bottom': 0,
                'm': 0,

                [theme.breakpoints.down('sm')]: {
                  height: '100%',
                  maxHeight: fullHeight ? 'auto' : 400,
                },

                '@media (max-width: 320px)': {
                  minHeight: 436,
                },
              },
            },
          },
          PaperProps: {
            elevation: 0,
            sx: {
              overflow: 'hidden',

              [theme.breakpoints.up('sm')]: {
                borderRadius: '20px',
                width: 483,
                maxWidth: 483,
              },
            },
          },

          ...DialogProps,

          open: isModalOpen,
          onClose: handleModalReject,
          onExited: handleModalExited,
          onEntered: handleModalEntered,
        }}
        handleModalResolve={handleModalResolve}
        handleModalReject={handleModalReject}
      />
    </ErrorBoundary>
  );
};
