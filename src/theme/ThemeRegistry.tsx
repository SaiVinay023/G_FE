'use client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import * as React from 'react';
import { ReactNode, Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ErrorBoundary } from 'src/components/ErrorBoundary';
import LayoutWithDelay from 'src/components/Layout/LayoutWithDelay';
import { ModalsProvider } from 'src/components/modals';
import { AppDispatch } from 'src/store';
import { ShopActions } from 'src/store/slices/shopSlice';

import { theme } from './theme';
import MainLoader from '../components/MainLoader';
import { EmployeesActions } from '../store/slices/employeesSlice';

// export const Layout = dynamic(() => import('../components/Layout'), {
//   ssr: false,
// });
// This implementation is from emotion-js
// https://github.com/emotion-js/emotion/issues/2928#issuecomment-1319747902
export function ThemeRegistry(props: { children: ReactNode }) {
  const { children } = props;
  // const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   dispatch(ShopActions.fetchShopStart(''));
  //   dispatch(EmployeesActions.fetchEmployeesStart());
  // }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <CssBaseline />
        <Suspense fallback={<MainLoader />}>
          <ErrorBoundary>
            <ModalsProvider>
              <LayoutWithDelay>{children}</LayoutWithDelay>
            </ModalsProvider>
          </ErrorBoundary>
        </Suspense>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
