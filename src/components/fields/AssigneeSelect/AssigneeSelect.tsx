import { Select, MenuItem } from '@mui/material';
import React from 'react';

import { useAppSelector } from 'src/hooks/store';
import { selectEmployees } from 'src/store/selectors/employeesSelectors';

interface AssigneeSelectProps {
  cardId: string;
  currentAssigneeId?: string;
  onChangeAssignee: (cardId: string, assigneeId: string) => void;
}

export const AssigneeSelect: React.FC<AssigneeSelectProps> = ({ cardId, currentAssigneeId, onChangeAssignee }) => {
  const employees = useAppSelector(selectEmployees);

  return (
    <Select
      fullWidth
      value={currentAssigneeId || 'Unassigned'}
      onChange={(e, ...rest) => {
        e.stopPropagation();
        onChangeAssignee(cardId, e.target.value);
      }}
      displayEmpty
      variant="outlined"
      size="small"
      onClick={(e) => e.stopPropagation()}
    >
      <MenuItem value="Unassigned">Unassigned</MenuItem>

      {employees.map((employee) => (
        <MenuItem key={employee.id} value={employee.id}>
          {employee.name}
        </MenuItem>
      ))}
    </Select>
  );
};
