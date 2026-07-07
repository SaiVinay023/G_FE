import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { Box, Button, Card, CardContent, IconButton } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form-mui';

import { FormTextField } from 'src/components/fields';

import { ServicesForm } from '../ServicesForm';

interface ServiceGroupProps {
  index: number;
  isLast: boolean;
  hideDescription: boolean;
  onAddNewGroup: () => void;
  onRemove: (index: number) => void;
  action?: 'edit' | 'create' | 'copy';
  isCannedjob?: boolean;
}

export const ServiceGroup = ({
  index,
  isLast,
  hideDescription,
  onAddNewGroup,
  onRemove,
  action = 'create',
  isCannedjob = false,
}: ServiceGroupProps) => {
  const t = useTranslations();
  const {
    watch,
    formState: { errors },
  } = useFormContext();

  // Safe type assertion for accessing nested error fields
  const serviceGroupErrors = errors.serviceGroups as Record<string, any> | undefined;
  const groupDescriptionError = serviceGroupErrors?.[index]?.description;

  return (
    <Card
      variant="outlined"
      sx={{
        'mb': 3,
        'borderRadius': 2,
        '&:hover': {
          borderColor: 'primary.main',
          transition: 'border-color 0.2s ease-in-out',
        },
      }}
    >
      <CardContent>
        {/* Header with Description Input and Remove Button */}
        {!hideDescription && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 3 }}>
            <FormTextField
              fullWidth
              name={`serviceGroups.${index}.description`}
              label={`${t('CreateTicketForm.service_group_description')}`}
              variant="standard"
              size="small"
              rules={{ required: t('EmployeeCreateForm.validation.required') }}
              error={!!groupDescriptionError}
              helperText={groupDescriptionError?.message}
              placeholder={t('CreateTicketForm.service_group_description_placeholder')}
            />

            <IconButton
              size="small"
              color="error"
              onClick={() => onRemove(index)}
              sx={{ mt: 0.5 }}
              aria-label={t('CreateTicketForm.remove_group')}
            >
              <RemoveIcon />
            </IconButton>
          </Box>
        )}

        {/* Services Form */}
        <Box sx={{ mb: 3 }}>
          <ServicesForm fieldIndex={index} isEditable action={action} isCannedjob={isCannedjob} />
        </Box>

        {/* Action Buttons - Only show on last group */}
        {isLast && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              pt: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="medium"
              startIcon={<AddIcon />}
              onClick={onAddNewGroup}
              sx={{ minWidth: 140 }}
            >
              {t('CreateTicketForm.new_group')}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
