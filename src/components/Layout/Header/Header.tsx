import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Toolbar, IconButton, Box, useMediaQuery, useTheme, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';

import { Breadcrumbs } from 'src/components/Breadcrumbs';
import { NavigationButtons } from 'src/components/Layout/Header/NavigationButtons';
import { collapsedWidth, drawerWidth } from 'src/components/Sidebar/Sidebar';
import { usePageMetadata } from 'src/hooks/usePageMetadata';

import logoSrc from '../../../../public/carsuFullLogoBlue.png';

interface HeaderProps {
  isOpen: boolean;
  disableNavigation?: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ disableNavigation, isOpen, toggleSidebar }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const { disableSearch, heading, breadcrumbs } = usePageMetadata(isMobile);

  return !disableNavigation ? (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        {isMobile
          ? !isOpen && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                height={64}
                minHeight={64}
                overflow="hidden"
              >
                {!isOpen && (
                  <IconButton color="primary" aria-label="open drawer" edge="start" onClick={toggleSidebar}>
                    <MenuIcon />
                  </IconButton>
                )}
              </Box>
            )
          : !isOpen && (
              <IconButton color="primary" aria-label="open drawer" edge="start" onClick={toggleSidebar} sx={{ ml: 6 }}>
                <MenuIcon />
              </IconButton>
            )}

        {!isMobile && (
          <Box
            display={(!isDesktop && !isOpen) || isDesktop ? 'flex' : 'none'}
            flexDirection="column"
            alignItems="flex-start"
            sx={{
              marginLeft: `${isOpen ? drawerWidth : collapsedWidth - 50}px`,
              transition: theme.transitions.create(['marginLeft'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            }}
          >
            <Typography noWrap variant="h2" fontWeight={600} color="textPrimary">
              {heading}
            </Typography>

            {breadcrumbs?.length > 1 && <Breadcrumbs breadcrumbs={breadcrumbs} />}
          </Box>
        )}

        <NavigationButtons disableSearch={disableSearch} />
      </Toolbar>
    </AppBar>
  ) : (
    <AppBar position="fixed" color="transparent">
      <Toolbar sx={{ minHeight: 64 }}>
        <Box
          component={Image}
          width={200}
          height={[48, 60, 60]}
          src={logoSrc}
          alt="Carsu Technologies"
          sx={{ objectFit: 'contain' }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
