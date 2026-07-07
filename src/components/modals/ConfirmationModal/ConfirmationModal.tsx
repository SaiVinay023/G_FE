import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Breakpoint,
} from '@mui/material';
import { FC, ReactNode } from 'react';

type ConfirmationModalProps = {
  payload: {
    content?: string | ReactNode;
    title?: string;
    maxWidth?: false | Breakpoint;
    disableSubmit?: boolean;
  };
  DialogProps: {
    open: boolean;
    [key: string]: unknown;
  };
  handleModalReject?: () => void;
  handleModalResolve: (val?: unknown) => void;
};

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
  payload: { title = 'Are you sure?', content, maxWidth = 'xs', disableSubmit = false },
  DialogProps,
  handleModalResolve,
  handleModalReject,
}) => {
  return (
    <Dialog maxWidth={maxWidth} {...DialogProps}>
      {!!title && <DialogTitle>{title}</DialogTitle>}

      {!!content && (
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
      )}

      <DialogActions sx={{ p: 2 }}>
        <Button variant="outlined" onClick={handleModalReject}>
          Cancel
        </Button>

        {!disableSubmit && (
          <Button variant="contained" color="primary" onClick={handleModalResolve}>
            Agree
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
