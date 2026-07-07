'use client';

import { SignIn } from '@clerk/nextjs';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useEffect } from 'react';

import { LanguageSwitcher } from 'src/components/fields';

export default function SigninForm() {
  const currentLocale = useLocale();
  const router = useRouter();

  useEffect(() => {
    const storedLocale = localStorage.getItem('NEXT_LOCALE');
    if (storedLocale && storedLocale !== currentLocale) {
      router.replace(`/${storedLocale}/sign-in`);
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

        <SignIn
          routing="path"
          path={`/${currentLocale}/sign-in`}
          signUpUrl={`/${currentLocale}/sign-up`}
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
