import { Close as CloseIcon } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, List, ListItem, Typography, IconButton } from '@mui/material';
import { FC } from 'react';

import { BuiltInWorkCardStatusValues } from 'src/models';

import { StatusLabel } from '../../StatusLabel';

type StatusModalProps = {
  DialogProps: {
    open: boolean;
    PaperProps: {
      sx?: Record<string, string | number>;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  handleModalReject?: () => void;
  handleModalResolve: (val?: unknown) => void;
};

export const StatusModal: FC<StatusModalProps> = ({
  DialogProps: { onExited, onEntered, ...restDialogProps },
  handleModalReject,
  handleModalResolve,
}) => {
  return (
    <Dialog
      {...restDialogProps}
      maxWidth="xs"
      PaperProps={{
        ...restDialogProps.PaperProps,
        sx: {
          ...restDialogProps.PaperProps?.sx,
          maxWidth: '250px !important',
        },
      }}
      sx={{}}
    >
      <DialogTitle
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: ['center', 'flex-end'],
          padding: 0,
          px: [1, 2],
          pt: [2, 1],
        }}
      >
        <Typography noWrap component="div" width="95%" fontWeight={500} textAlign="center">
          Update Status
        </Typography>

        <IconButton
          onClick={handleModalReject}
          size="small"
          sx={(theme) => ({
            [theme.breakpoints.up('sm')]: {
              mr: theme.spacing(-1),
            },

            [theme.breakpoints.down('sm')]: {
              position: 'absolute',
              top: 0,
              right: 0,
            },
          })}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <List>
          {BuiltInWorkCardStatusValues.map((status) => (
            <ListItem key={status} sx={{ justifyContent: 'center' }}>
              <StatusLabel showWorkLabel status={status} onClick={handleModalResolve} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};
