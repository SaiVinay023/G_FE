import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  TableContainer,
  Paper,
  Table as MuiTable,
  TableRow,
  Typography,
  TableHead,
  TableBody,
  useTheme,
  useMediaQuery,
  SxProps,
  Collapse,
  IconButton,
  Box,
} from '@mui/material';
import { ReactNode, JSX, useState, Fragment } from 'react';

import { TableCell } from './TableCell/index';

export type SmartTableColumn<T> = {
  name: string;
  title?: string | ReactNode;
  minWidth: number;
  sizingSuffix?: string;
  growCoefficient?: number;
  getValue: (item: T, index?: number) => string | ReactNode;
  sx?: SxProps;
};

export type Align = 'left' | 'center' | 'right' | 'inherit' | 'justify' | undefined;

export type TableProps<T> = {
  rowHeight?: number;
  headerBackground?: string;
  disableHeader?: boolean;
  getUniqueId?: (item: T, index?: number) => string | number;
  onClick?: (item: T) => void;
  align?: Align;
  minWidth?: number;
  columns: SmartTableColumn<T>[];
  data: T[];
  sx?: Record<string, string | number>;
  renderCollapsedRow?: (item: T, index: number) => ReactNode;
};

export function Table<T>({
  rowHeight = 60,
  getUniqueId,
  disableHeader = false,
  align = 'left',
  minWidth = 295,
  headerBackground = '#E9EEF0',
  columns = [],
  data = [],
  sx = {},
  onClick,
  renderCollapsedRow,
}: TableProps<T>): JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openRows, setOpenRows] = useState<Record<string | number, boolean>>({});

  const toggleRow = (id: string | number) => {
    setOpenRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const hasCollapse = typeof renderCollapsedRow === 'function';

  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{
        borderTop: 0,
        borderLeft: 0,
        borderRight: 0,
        borderTopLeftRadius: '15px',
        borderTopRightRadius: '15px',
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        ...sx,
      }}
    >
      <MuiTable sx={{ minWidth }}>
        {!disableHeader && (
          <TableHead sx={{ background: headerBackground }}>
            <TableRow sx={{ height: isMobile ? rowHeight + 10 : rowHeight, display: 'flex' }}>
              {hasCollapse && (
                <TableCell sx={{ width: '100%' }}>
                  <></>
                </TableCell>
              )}
              {columns.map((item, index) => (
                <TableCell align={align} key={item?.name + index} item={item}>
                  <Typography component="span" fontSize={[16, 18, 18]} fontWeight={500} aria-label={`${item?.title}`}>
                    {item?.title}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        )}

        <TableBody>
          {data.map((item, index) => {
            const rowId = getUniqueId ? getUniqueId(item, index) : index;
            const isOpen = !!openRows[rowId];

            return (
              <Fragment key={rowId}>
                <TableRow
                  hover={!!onClick}
                  sx={{
                    'height': rowHeight,
                    'minHeight': 40,
                    'display': 'flex',
                    '&:last-child td, &:last-child th': { border: 0 },
                    ...(!!onClick && {
                      '&:hover': {
                        cursor: 'pointer',
                      },
                    }),
                  }}
                  onClick={() => onClick?.(item)}
                >
                  {hasCollapse && (
                    <TableCell sx={{ width: 40 }}>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRow(rowId);
                        }}
                      >
                        {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                  )}
                  {columns.map(({ name, getValue, minWidth, growCoefficient, sx = {} }, i) => {
                    const value = getValue(item, index);

                    return (
                      <TableCell key={`${name || i}-${index}`} align={align} item={{ minWidth, growCoefficient }}>
                        <Typography
                          noWrap
                          component="span"
                          aria-label={`${value}`}
                          sx={{
                            color: !value ? theme.palette.text.disabled : theme.palette.text.primary,
                            ...sx,
                          }}
                        >
                          {value || '-'}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>

                {hasCollapse && (
                  <TableRow sx={{ display: 'flex' }}>
                    <TableCell colSpan={columns.length + 1} sx={{ p: 0, border: 0, flexBasis: '100%', width: '100%' }}>
                      <Collapse in={isOpen} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
                        <Box sx={{ margin: 1 }}>{renderCollapsedRow?.(item, index)}</Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}
