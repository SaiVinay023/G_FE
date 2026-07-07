import { InfoOutlined } from '@mui/icons-material';
import { Card, CardContent, CardHeader, Divider, Box, IconButton } from '@mui/material';
import { FC } from 'react';

import { LicensePlate } from 'src/components/LicensePlate';
import { useRouter } from 'src/i18n/routing';
import { Customer } from 'src/models';

interface CustomerCardProps {
  card: Customer;
}

export const CustomerCard: FC<CustomerCardProps> = ({ card }) => {
  const router = useRouter();

  const openCustomerPage = () => {
    router.push(`/customers/${card.id}`);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        'borderRadius': '12px',
        'boxShadow': 0,
        'width': '100%',
        'minWidth': 250,

        '&:hover': {
          boxShadow: 1,
          cursor: 'pointer',
        },
      }}
      onClick={openCustomerPage}
    >
      <CardHeader
        title={card.name}
        action={
          <IconButton aria-label="info" onClick={openCustomerPage}>
            <InfoOutlined fontSize="small" color="action" />
          </IconButton>
        }
        titleTypographyProps={{
          noWrap: true,
          variant: 'subtitle1',
          fontWeight: 500,
        }}
        subheader={card?.phoneNumber}
        sx={{
          '.MuiCardHeader-content': {
            maxWidth: '91%',
          },
        }}
      />

      <Divider />

      <CardContent>
        <Box mb={2} display="flex" justifyContent="space-between" gap={2} />

        <Box display="flex" justifyContent="center" mb={2}>
          {card?.vehicles[0] && (
            <LicensePlate
              licensePlateNumber={card?.vehicles[0]?.licensePlateNumber}
              licensePlateNumberCountryCode={card?.vehicles[0]?.licensePlateNumberCountryCode || 'D'}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
