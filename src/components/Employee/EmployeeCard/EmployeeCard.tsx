import { Card, CardHeader } from '@mui/material';
import { FC } from 'react';

import { Employee } from 'src/models';

interface EmployeeCardProps {
  card: Employee;
}

export const EmployeeCard: FC<EmployeeCardProps> = ({ card }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: '12px',
        boxShadow: 0,
        width: '100%',
        minWidth: 250,
      }}
    >
      <CardHeader
        title={card.name}
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
    </Card>
  );
};
