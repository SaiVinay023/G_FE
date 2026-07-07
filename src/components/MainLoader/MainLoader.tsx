'use client';

import { Box, keyframes } from '@mui/material';
import Image from 'next/image';

import LogoSrc from 'public/carsuFullLogoBlue.png';

const pulse = keyframes`
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
`;

export default function MainLoader() {
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
          backgroundColor: 'background.default',
          animation: `${pulse} 1.5s infinite`,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          component={Image}
          src={LogoSrc}
          alt="Carsu Technologies"
          width={[150, 300]}
          height={150}
          sx={{ objectFit: 'contain' }}
        />
      </Box>
    </Box>
  );
}
