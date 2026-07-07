'use client';

import { SignUp } from '@clerk/nextjs';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useEffect } from 'react';

import { LanguageSwitcher } from '../../../../components/fields/index';

export default function SignUpForm() {
  const currentLocale = useLocale();
  const router = useRouter();

  useEffect(() => {
    const storedLocale = localStorage.getItem('NEXT_LOCALE');
    if (storedLocale && storedLocale !== currentLocale) {
      router.replace(`/${storedLocale}/sign-up`);
    }
  }, [currentLocale, router]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <LanguageSwitcher />

        <SignUp
          routing="path"
          path={`/${currentLocale}/sign-up`}
          signInUrl={`/${currentLocale}/sign-in`}
          forceRedirectUrl={`/${currentLocale}/today`}
          appearance={{
            elements: {
              footerActionText: {
                fontSize: '16px',
              },
              footerActionLink: {
                fontSize: '16px',
                fontWeight: '500',
                color: 'primary.main',
              },
              formButtonPrimary: {
                'backgroundColor': 'primary.main',
                'boxShadow': 'none !important',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}
