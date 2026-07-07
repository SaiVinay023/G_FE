'use client';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';

import { MobileFooter } from 'src/components/Layout/MobileFooter';
import { useAppDispatch, useAppSelector } from 'src/hooks/store';
import { isOpenSidebarSelect } from 'src/store/selectors/themeSelectors';
import { ThemeActions } from 'src/store/slices/themeSlice';

import Header from './Header';
import { usePathname } from '../../i18n/routing';
import Sidebar from '../Sidebar';

const Layout: React.FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
  const theme = useTheme();
  const pathname = usePathname();
  const isOpenSidebar = useAppSelector(isOpenSidebarSelect);
  const dispatch = useAppDispatch();
  const [navbarKey, setNavbarKey] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const disableSideBar = useMemo(
    () =>
      pathname.includes('registration/confirm') ||
      pathname.includes('confirm/appointment') ||
      pathname.includes('estimates/public'),
    [pathname],
  );

  const toggleSidebar = () => {
    dispatch(ThemeActions.toggleSidebar());
  };

  useEffect(() => {
    setNavbarKey((prevKey) => prevKey + 1);

    if (isMobile) {
      dispatch(ThemeActions.closeSidebar());
    } else {
      dispatch(ThemeActions.openSidebar());
    }
  }, [dispatch, isMobile]);

  return (
    <Box display="flex" position="relative" overflow="auto" height="100%">
      <Header disableNavigation={disableSideBar} isOpen={isOpenSidebar} toggleSidebar={toggleSidebar} />

      {!disableSideBar && <Sidebar key={`${navbarKey}`} isOpen={isOpenSidebar} toggleSidebar={toggleSidebar} />}

      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        component="main"
        bgcolor="grey.100"
        pt={8}
        pb={disableSideBar ? 0 : ['60px', '60px', 0, 0]}
        sx={{ flexGrow: 1, overflow: 'hidden' }}
      >
        {children}
      </Box>

      {!disableSideBar && <MobileFooter />}
    </Box>
  );
};

export default Layout;
