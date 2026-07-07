import { Box } from '@mui/material';
import { FC } from 'react';

import { CreateEstimate } from 'src/components/pages';

type EstimateCreatePageProps = {
  params: Promise<{
    id: string;
    contactId: string;
  }>;
};

const EstimateCreatePage: FC<EstimateCreatePageProps> = async ({ params }) => {
  const { id, contactId } = await params;

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
      <CreateEstimate contactId={contactId} vehicleId={id} />
    </Box>
  );
};

export default EstimateCreatePage;
