'use client';

import { DragDropContext } from '@hello-pangea/dnd';
import { Box, Paper, useMediaQuery, useTheme } from '@mui/material';

import { useKanban } from 'src/hooks/pages';
import { WorkCard } from 'src/models';
import { BuiltInWorkCardStatusValues } from 'src/models/work';

import { AccordionColumn } from './AccordionColumn/index';
import { Column } from './Column';

const EMPTY: WorkCard[] = [];

export const KanbanBoard = () => {
  const theme = useTheme();
  const { loading, expanded, board, onDragEnd, toggleExpanded, onChangeStatus } = useKanban();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Box
      sx={{ height: '100%', width: '100%', p: [2, 0, 0], pt: '10px !important', ...(isTablet && { overflow: 'auto' }) }}
    >
      {isMobile ? (
        <Box
          component={Paper}
          variant="outlined"
          position="relative"
          sx={{
            borderRadius: '15px',
            overflow: 'hidden',
          }}
        >
          <Box overflow="auto">
            {BuiltInWorkCardStatusValues.map((status) => (
              <AccordionColumn
                key={status}
                expanded={expanded === status}
                onExpand={() => toggleExpanded(status)}
                loading={loading}
                cards={board?.[status] ?? EMPTY}
                status={status}
                onChangeStatus={onChangeStatus}
              />
            ))}
          </Box>
        </Box>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Box
            position="relative"
            display="flex"
            flexWrap="nowrap"
            width="100%"
            height="100%"
            sx={{ overflowX: 'auto' }}
          >
            {BuiltInWorkCardStatusValues.map((status) => (
              <Column
                disableDnD={isTablet}
                key={status}
                loading={loading}
                cards={board?.[status] ?? EMPTY}
                status={status}
                onChangeStatus={onChangeStatus}
              />
            ))}
          </Box>
        </DragDropContext>
      )}
    </Box>
  );
};
