import { Box, ClickAwayListener, SxProps, Theme } from '@mui/material';
import { TooltipProps } from '@mui/material/Tooltip/Tooltip';
import { FC, useEffect, useState, SyntheticEvent } from 'react';

import { MuiTooltip } from './styles';

interface TooltipInterface extends TooltipProps {
  maxWidth?: number | string;
  disableTooltip?: boolean;
  closeTooltip?: () => void;
  sx?: SxProps<Theme>;
  boxSx?: SxProps;
}

export const Tooltip: FC<TooltipInterface> = ({
  disableTooltip = false,
  placement = 'bottom-end',
  open: defaultOpen = false,
  maxWidth = 292,
  title,
  children,
  closeTooltip,
  sx = {},
  boxSx = {},
  ...props
}) => {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  const handleTooltipClose = () => {
    setOpen(false);
    closeTooltip?.();
  };

  const handleTooltipOpen = (event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setOpen(true);
  };

  useEffect(() => {
    if (!disableTooltip) {
      if (defaultOpen) {
        setOpen(true);

        setTimeout(() => {
          setOpen(false);
          closeTooltip?.();
        }, 3500);
      } else {
        setOpen(false);
      }
    }
  }, [defaultOpen, disableTooltip, closeTooltip]);

  if (disableTooltip) return children;

  return (
    <MuiTooltip
      open={open}
      title={title}
      leaveTouchDelay={4000}
      enterTouchDelay={50}
      placement={placement}
      onClose={handleTooltipClose}
      onOpen={handleTooltipOpen}
      maxWidth={maxWidth}
      sx={sx}
      {...props}
    >
      <Box
        component="span"
        maxWidth="fit-content"
        sx={[...(Array.isArray(boxSx) ? boxSx : [boxSx])]}
        onClick={handleTooltipOpen}
      >
        <ClickAwayListener disableReactTree onClickAway={handleTooltipClose}>
          {children}
        </ClickAwayListener>
      </Box>
    </MuiTooltip>
  );
};
