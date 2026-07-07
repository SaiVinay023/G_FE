import { Box, Skeleton, Typography, Avatar } from '@mui/material';
import React from 'react';

export const CardLoading = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 3,
        backgroundColor: 'white',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'grey.300',
        marginBottom: 2,
        width: '100%',
      }}
    >
      <Box sx={{ padding: 2 }}>
        <Skeleton width="60%">
          <Typography variant="body1">Loading...</Typography>
        </Skeleton>
        {/*<Skeleton>*/}
        {/*  /!*<LicensePlate licensePlateNumber={'HH KNV 979'} licensePlateNumberCountryCode={'Germany'} />*!/*/}
        {/*</Skeleton>*/}
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: 2,
          borderTop: '1px solid',
          borderColor: 'grey.300',
        }}
      >
        <Skeleton variant="circular">
          <Avatar />
        </Skeleton>
        <Skeleton width="100%" sx={{ marginLeft: 1 }}>
          <Typography>Loading</Typography>
        </Skeleton>
      </Box>
    </Box>
  );
};
