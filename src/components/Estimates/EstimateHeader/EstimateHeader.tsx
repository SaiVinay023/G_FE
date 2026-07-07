import { Grid, Typography } from '@mui/material';
import moment from 'moment';
import { useTranslations } from 'next-intl';

import { FormTextField } from 'src/components/fields';

export const EstimateHeader = () => {
  const t = useTranslations();

  return (
    <>
      <Typography gutterBottom variant="h4">
        {t('Estimates.newEstimate')}
      </Typography>

      <Typography variant="h4" fontWeight={400} mb={3}>
        {moment().format('DD MMMM YYYY')}
      </Typography>

      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 12, md: 9 }}>
          <FormTextField
            fullWidth
            name="serviceTitle"
            label={t('CreateTicketForm.service_title')}
            variant="outlined"
            size="small"
            rules={{ required: t('EmployeeCreateForm.validation.required') }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <FormTextField
            fullWidth
            name="kms"
            label={t('CreateTicketForm.kms')}
            variant="outlined"
            size="small"
            rules={{ required: t('EmployeeCreateForm.validation.required') }}
          />
        </Grid>
      </Grid>

      <FormTextField
        fullWidth
        multiline
        rows={4}
        name="customerComments"
        label={t('CreateTicketForm.customer_comments')}
        variant="outlined"
        size="small"
        sx={{ mb: 3 }}
        rules={{
          required: t('EmployeeCreateForm.validation.required'),
          minLength: {
            value: 5,
            message: 'Minimum length not met.',
          },
        }}
      />
    </>
  );
};
