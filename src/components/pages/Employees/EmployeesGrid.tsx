import { Box } from '@mui/material';
import React from 'react';

import { EmployeeCard } from 'src/components/Employee';
import { Employee } from 'src/models';

interface EmployeesGridProps {
  employees: Employee[];
}

export const EmployeesGrid: React.FC<EmployeesGridProps> = ({ employees }) => {
  return (
    <Box
      p={2}
      sx={{
        'display': 'grid',
        'gap': '16px',
        'gridTemplateColumns': `
          repeat(auto-fit, minmax(280px, 1fr))
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
      {employees.map((employee) => (
        <EmployeeCard key={employee.id} card={employee} />
      ))}
    </Box>
  );
};
