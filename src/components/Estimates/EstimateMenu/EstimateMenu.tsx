import ArchiveIcon from '@mui/icons-material/Archive';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SendIcon from '@mui/icons-material/Send';
import { Button, MenuItem, Divider, Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { BuiltInEstimateStatus, EstimateRes } from 'src/models';

import { StyledMenu } from './styles';

interface EstimateMenuProps {
  estimate: EstimateRes;
}

export const EstimateMenu: React.FC<EstimateMenuProps> = ({ estimate }) => {
  const t = useTranslations();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button
        id="estimate-menu-button"
        aria-controls={open ? 'estimate-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="outlined"
        disableElevation
        onClick={handleMenuOpen}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {t('Users.action')}
      </Button>

      <StyledMenu
        id="estimate-menu"
        MenuListProps={{
          'aria-labelledby': 'estimate-menu-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose} disableRipple>
          <SendIcon sx={(theme) => ({ color: theme.palette.primary.main + ' !important' })} />
          {t('Added.send')}
        </MenuItem>

        <MenuItem onClick={handleMenuClose} disableRipple>
          <CalendarMonthIcon sx={(theme) => ({ color: theme.palette.primary.main + ' !important' })} />
          {t('Added.schedule')}
        </MenuItem>

        <MenuItem onClick={handleMenuClose} disableRipple>
          <FileCopyIcon sx={(theme) => ({ color: theme.palette.primary.main + ' !important' })} />
          {t('Added.duplicate')}
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={handleMenuClose}
          disableRipple
          disabled={
            estimate.status === BuiltInEstimateStatus.APPROVED || estimate.status === BuiltInEstimateStatus.SCHEDULED
          }
        >
          <CheckCircleIcon sx={(theme) => ({ color: theme.palette.success.main + ' !important' })} />
          {t('Added.approve')}
        </MenuItem>

        <MenuItem onClick={handleMenuClose} disableRipple>
          <ArchiveIcon sx={(theme) => ({ color: theme.palette.grey[600] + ' !important' })} />
          {t('Added.archive')}
        </MenuItem>

        <MenuItem onClick={handleMenuClose} disableRipple disabled={estimate.status === BuiltInEstimateStatus.CANCELED}>
          <CancelIcon sx={(theme) => ({ color: theme.palette.error.main + ' !important' })} />
          {t('Added.cancel')}
        </MenuItem>
      </StyledMenu>
    </Box>
  );
};
