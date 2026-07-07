import { Avatar, Box, Card, CardContent, Typography, Chip, Stack } from '@mui/material';
import React from 'react';
import { useRouter } from 'src/i18n/routing';

import { LicensePlate } from 'src/components/LicensePlate';
import { Customer } from 'src/models';
import { formatPhoneNumber } from 'src/utils/formatPhoneNumber';
import { stringAvatar } from 'src/utils/getAvatarInitials';

interface CustomersGridProps {
  customers: Customer[];
}

export const CustomersGrid: React.FC<CustomersGridProps> = ({ customers }) => {
  const router = useRouter();

  const handleCustomerClick = (customerId: string) => {
    router.push(`/customers/${customerId}`);
  };

  return (
    <Box
      p={2}
      sx={{
        'display': 'grid',
        'gap': '16px',
        'gridTemplateColumns': `
          repeat(auto-fit, minmax(300px, 1fr))
        `,
        '@media (max-width: 600px)': {
          gridTemplateColumns: '1fr',
        },
        '@media (min-width: 600px) and (max-width: 960px)': {
          gridTemplateColumns: 'repeat(2, 1fr)',
        },
        '@media (min-width: 960px)': {
          gridTemplateColumns: 'repeat(3, 1fr)',
        },
      }}
    >
      {customers.map((customer) => {
        const fullName = `${customer?.user?.firstName || ''} ${customer?.user?.lastName || ''}`.trim();
        const phoneNumber = customer?.user?.contact?.phone || customer?.user?.contact?.phone || '';
        const firstVehicle = customer?.vehicles?.[0]?.vehicle;
        const vehicleCount = customer?.vehicles?.length || 0;

        return (
          <Card
            key={customer.id}
            sx={{
              'cursor': 'pointer',
              'transition': 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3,
              },
              'borderRadius': 2,
              'border': '1px solid',
              'borderColor': 'divider',
            }}
            onClick={() => handleCustomerClick(customer.id)}
          >
            <CardContent sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Avatar
                    {...stringAvatar(fullName)}
                    sx={{
                      ...stringAvatar(fullName).sx,
                      width: 40,
                      height: 40,
                      fontSize: 16,
                    }}
                  />
                  <Box flex={1}>
                    <Typography variant="h6" component="div" fontWeight={600} fontSize={16}>
                      {fullName || 'Unknown Customer'}
                    </Typography>
                    {phoneNumber ? (
                      <Typography variant="body2" color="text.secondary" fontSize={14}>
                        {formatPhoneNumber(phoneNumber)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary" fontSize={14}>
                        No phone number
                      </Typography>
                    )}
                  </Box>
                </Box>

                {firstVehicle && (
                  <Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <LicensePlate
                        licensePlateNumber={firstVehicle.licensePlateNumber}
                        licensePlateNumberCountryCode={firstVehicle.licensePlateNumberCountryCode}
                      />
                    </Box>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};
