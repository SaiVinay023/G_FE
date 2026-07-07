import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Badge,
  Divider,
  CircularProgress,
} from '@mui/material';
import React, { memo } from 'react';

import { WorkCard, ReadableStatus, BuiltInWorkCardStatus } from 'src/models';

import { EstimateCard } from '../../Estimates/EstimateCard/index';

export interface ColumnProps {
  cards: WorkCard[];
  status: number;
  loading: boolean;
  expanded: boolean;
  onExpand: () => void;
  onChangeStatus?: (value: BuiltInWorkCardStatus, cardID: string) => void;
}

export const AccordionColumn: React.FC<ColumnProps> = memo(
  ({ loading, expanded, cards, status, onExpand, onChangeStatus }) => {
    const title = ReadableStatus[status];

    return (
      <Accordion
        expanded={expanded}
        onChange={onExpand}
        sx={{
          'py': 1,
          'mb': 0,
          '&.Mui-expanded': {
            margin: '0 !important',
          },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'white' }}>
          <Typography variant="h6" color={title === 'On hold' ? 'orange' : 'black'}>
            {title}
          </Typography>

          <Badge badgeContent={cards.length} color={title === 'On hold' ? 'error' : 'primary'} sx={{ ml: 2 }} />
        </AccordionSummary>

        <AccordionDetails>
          <Divider sx={{ mb: 2 }} />

          <Box
            display="flex"
            flexDirection="column"
            position="relative"
            gap={2}
            sx={
              loading
                ? {
                    alignItems: 'center',
                    justifyContent: 'center',
                    pt: 1,
                  }
                : {}
            }
          >
            {loading && <CircularProgress />}
            {!loading &&
              (cards.length ? (
                expanded ? (
                  cards.map((card, index) => (
                    <Box key={card.id}>
                      <EstimateCard showWorkCard card={card} onChangeStatus={onChangeStatus} />
                    </Box>
                  ))
                ) : (
                  <></>
                )
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No tasks
                </Typography>
              ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  },
);
