import { Box } from '@mui/material';
import { FC } from 'react';

import { EstimatePreview } from 'src/components/Estimates';

type EstimatePageProps = {
  params: Promise<{
    id: string;
  }>;
};

const EstimatePage: FC<EstimatePageProps> = async ({ params }) => {
  const { id } = await params;

  return (
    <Box
      position="relative"
      p={2}
      flexGrow={1}
      display="flex"
      flexDirection="column"
      height="100%"
      sx={{ overflowY: 'auto' }}
    >
      <EstimatePreview id={id} />
    </Box>
  );
};

export default EstimatePage;
