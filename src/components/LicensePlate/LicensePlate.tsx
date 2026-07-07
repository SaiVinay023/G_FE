import { Box, Typography, Divider, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import React, { FC } from 'react';

import euStars from 'public/euStars.svg';
import { Vehicle } from 'src/models';
import { formatLicensePlate } from 'src/utils/licensePlate';
import { LicensePlateInfo, licensePlateInfoByCountry } from 'src/utils/licensePlateInfoByCountry';

interface LicensePlateProps {
  licensePlateNumber: Vehicle['licensePlateNumber'];
  licensePlateNumberCountryCode: Vehicle['licensePlateNumberCountryCode'];
}

const LicensePlateWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  border: '2px solid black',
  borderRadius: '4px',
  backgroundColor: 'white',
  overflow: 'hidden',
}));

export const LicensePlate: FC<LicensePlateProps> = (props) => {
  const countryInfo = (licensePlateInfoByCountry.find((c) => c.abbreviation === props.licensePlateNumberCountryCode) ||
    {}) as LicensePlateInfo;
  const countryBg = countryInfo.bg || '#fff';
  const countryAbbreviation = countryInfo.abbreviation || 'D';

  return (
    <LicensePlateWrapper sx={{ width: [140, 140, 160, 180], height: [34, 36, 40] }}>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.primary.main,
          width: 26,
          minWidth: 26,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: theme.spacing(0.25),
        })}
      >
        <Box component={Image} src={euStars} alt="EU Stars" width={[12, 14, 15]} height={[12, 14, 15]} />

        <Typography color="white" fontWeight={500} fontSize={[12, 12, 12, 14]} mt={0.5} sx={{ lineHeight: 0.85 }}>
          {countryAbbreviation}
        </Typography>
      </Box>

      <Box
        sx={(theme) => ({
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: countryBg,
          fontSize: [18, 18, 22, 24],
          letterSpacing: '2px',
          whiteSpace: 'nowrap',
        })}
      >
        {formatLicensePlate(props.licensePlateNumber, props.licensePlateNumberCountryCode)}
      </Box>

      {props.licensePlateNumberCountryCode === 'I' && (
        <Box
          sx={{
            backgroundColor: '#0F3399',
            width: '26px',
            minWidth: '26px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              border: '1px solid #FDCE31',
            }}
          />
        </Box>
      )}

      {props.licensePlateNumberCountryCode === 'P' && (
        <Box
          sx={{
            backgroundColor: '#FCC20B',
            width: '26px',
            minWidth: '26px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '7px',
          }}
        >
          <Typography fontWeight={500} fontSize="12px">
            XX
          </Typography>
          <Divider
            sx={{
              width: '100%',
              borderColor: 'black',
              margin: '3px 0',
            }}
          />
          <Typography fontWeight={500} fontSize="12px">
            XX
          </Typography>
        </Box>
      )}

      {props.licensePlateNumberCountryCode === 'F' && (
        <Box
          sx={{
            backgroundColor: '#0F3399',
            width: '26px',
            minWidth: '26px',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '7px',
          }}
        >
          <Typography color="white" fontWeight={500} fontSize="12px" mt="16px">
            00
          </Typography>
        </Box>
      )}
    </LicensePlateWrapper>
  );
};
