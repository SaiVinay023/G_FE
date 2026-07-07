import { TableCell as MuiTableCell, TableCellProps as MuiTableCellProps, useTheme } from '@mui/material';
import { FC, ReactNode } from 'react';

type TableCellProps = MuiTableCellProps & {
  centered?: boolean;
  children: ReactNode | ReactNode[];
  item?: {
    minWidth?: number;
    growCoefficient?: number;
  };
};

export const TableCell: FC<TableCellProps> = ({ children, item, centered, sx = {} }) => {
  const theme = useTheme();

  return (
    <MuiTableCell
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: centered ? 'center' : 'flex-start',
        width: item?.minWidth ?? 120,
        flexGrow: item?.growCoefficient ?? 0,
        flexBasis: item?.minWidth ?? 120,
        flexShrink: 0,
        fontSize: 16,

        [theme.breakpoints.down('sm')]: {
          fontSize: 14,
        },
        ...sx,
      }}
    >
      {children}
    </MuiTableCell>
  );
};
