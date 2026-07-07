import { Card as MuiCard, CardContent, Typography } from '@mui/material';
import React from 'react';

import { CalendarEvent } from 'src/models';

interface CardProps {
  card: CalendarEvent;
}

const Card: React.FC<CardProps> = ({ card }) => {
  return (
    <MuiCard sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {card.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {card?.description}
        </Typography>
      </CardContent>
    </MuiCard>
  );
};

export default Card;
