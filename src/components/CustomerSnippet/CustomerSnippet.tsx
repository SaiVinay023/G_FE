import { Avatar, Box, Typography } from '@mui/material';
import React, { FC, useMemo } from 'react';

import { useRouter } from 'src/i18n/routing';
import type { Customer } from 'src/models';
import { formatPhoneNumber } from 'src/utils/formatPhoneNumber';
import { stringAvatar } from 'src/utils/getAvatarInitials';

interface CustomerSnippetProps {
  customer: Customer;
}

export const CustomerSnippet: FC<CustomerSnippetProps> = ({ customer }) => {
  const router = useRouter();
  const phone = useMemo(() => formatPhoneNumber(customer.user.contact?.phone ?? ''), [customer.user.contact?.phone]);
  const avatarProps = useMemo(
    () => ({
      ...stringAvatar(customer?.user.firstName + ' ' + customer?.user.lastName),
      sx: { ...stringAvatar(customer?.user.firstName + ' ' + customer?.user.lastName).sx, width: 64, height: 64 },
    }),
    [customer?.user.firstName, customer?.user.lastName],
  );

  return (
    <Box display="flex" flexDirection="column" width="100%" padding={2}>
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar {...avatarProps} onClick={() => router.push(`/customers/${customer.id}`)} />

        <Box display="flex" flexDirection="column" flexGrow={1}>
          <Typography gutterBottom variant="h3">
            {customer?.user.firstName} {customer?.user.lastName}
          </Typography>

          <Box display="flex" flexDirection="column" gap={0.25}>
            <Typography variant="body2">{customer?.user.address?.addressLine1 || 'No address available'}</Typography>
            <Typography variant="body2">{customer?.user.address?.city || 'No city available'}</Typography>
            <Typography variant="body2">{phone}</Typography>
            <Typography variant="body2">{customer?.user.contact?.email || 'No email available'}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
