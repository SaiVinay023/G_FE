import { Droppable } from '@hello-pangea/dnd';
import { Box, Paper, useMediaQuery, useTheme } from '@mui/material';
import React, { memo } from 'react';

import { ColumnLayout } from 'src/components/KanbanBoard/ColumnLayout';
import { BuiltInWorkCardStatus, ReadableStatus, WorkCard } from 'src/models';

import { Card } from './Card';

export interface ColumnProps {
  cards: WorkCard[];
  status: number;
  loading: boolean;
  disableDnD?: boolean;
  onChangeStatus?: (value: BuiltInWorkCardStatus, cardID: string) => void;
}

export const Column: React.FC<ColumnProps> = memo(({ disableDnD = false, cards, loading, onChangeStatus, status }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const title = ReadableStatus[status];

  return (
    <Paper variant="outlined" sx={{ p: 0, minWidth: '277px', mr: 2, borderRadius: 2, pb: 3 }}>
      <ColumnLayout
        defaultHeight={isMobile ? '195px' : '140px'}
        loading={loading}
        badgeContent={cards?.length}
        title={title}
      >
        <Droppable droppableId={`${status}`}>
          {(provided) => (
            <Box width={277} p={2} {...provided.droppableProps} ref={provided.innerRef}>
              {cards.map((card, index) => (
                <Box key={card.id} mb={2}>
                  <Card
                    disableDnD={disableDnD}
                    card={card}
                    index={index}
                    withPlateNumber
                    onChangeStatus={onChangeStatus}
                  />
                </Box>
              ))}

              <Box height={100} width={200} />
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </ColumnLayout>
    </Paper>
  );
});
