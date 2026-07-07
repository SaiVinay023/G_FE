import React, { useEffect } from 'react';
import Image from 'next/image';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useStorageUrl } from 'src/hooks/components/useStorageUrl';

interface ShopLogoProps {
  logoPath?: string | null;
  alt?: string;
  width?: number | string;
  height?: number | string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

/**
 * Component for displaying shop logo images from protected Supabase buckets
 * Automatically handles authentication and signed URLs
 */
export const ShopLogo: React.FC<ShopLogoProps> = ({
  logoPath,
  alt = 'Shop Logo',
  width = '100%',
  height = '100%',
  objectFit = 'contain',
}) => {
  const { url, isLoading, error, refreshUrl } = useStorageUrl(logoPath);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width,
          height,
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error || !url) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width,
          height,
          color: 'text.secondary',
          bgcolor: 'grey.50',
          border: (theme) => `1px dashed ${theme.palette.grey[300]}`,
          borderRadius: 1,
          p: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">{error ? 'Error loading logo' : 'No logo available'}</Typography>
        {error && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: 1, fontSize: '0.7rem', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {error.message}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden',
      }}
    >
      <Image
        src={url}
        alt={alt}
        layout="fill"
        objectFit={objectFit}
        priority
        onError={() => {
          console.error('ShopLogo: Image loading error, attempting refresh');
          refreshUrl();
        }}
      />
    </Box>
  );
};
