import { Container } from '@mui/material';
import { FC } from 'react';

import { KanbanBoard } from 'src/components/KanbanBoard';

const Today: FC = () => {
  return (
    <Container maxWidth={false} sx={{ height: '100%', p: 0, backgroundColor: 'grey.200', position: 'relative' }}>
      <KanbanBoard />
    </Container>
  );
};

export default Today;
