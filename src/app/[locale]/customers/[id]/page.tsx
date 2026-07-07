import { Box } from '@mui/material';
import { CustomerDetailsPage } from 'src/components/pages/Customers/CustomerDetailsPage';

type CustomerPageParams = {
  id: string;
  locale: string;
};


type CustomerPageProps = {
  params: Promise<CustomerPageParams>;
};

export default async function CustomerPage({ params }: CustomerPageProps) {
  const { id } = await params;

  return (
    <Box height="100%" sx={{ overflowY: 'auto' }}>
      <CustomerDetailsPage id={id} />
    </Box>
  );
}
