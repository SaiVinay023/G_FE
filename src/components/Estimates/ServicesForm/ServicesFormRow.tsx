import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { Grid, IconButton, MenuItem } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useCallback, memo } from 'react';

import { FormTextField } from 'src/components/fields';
import { parseGermanNumber, formatGermanNumber } from 'src/utils/numberFormat';

interface ServicesFormRowProps {
  fieldIndex: number;
  index: number;
  manHours: string;
  price: string;
  totalValue: string;
  errors: any;
  isEditable: boolean;
  isFirstRow: boolean;
  onAddService: () => void;
  onRemoveService: () => void;
  onManualTotalChange: (index: number, value: string) => void;
  onManualTotalBlur: (index: number, value: string) => void;
  onClearManualTotal: (index: number) => void;
  onValueChange: (index: number, field: 'manHours' | 'price', value: string) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const ServicesFormRowComponent = ({
  fieldIndex,
  index,
  manHours,
  price,
  totalValue,
  errors,
  isEditable,
  isFirstRow,
  onAddService,
  onRemoveService,
  onManualTotalChange,
  onManualTotalBlur,
  onClearManualTotal,
  onValueChange,
  handleKeyDown,
}: ServicesFormRowProps) => {
  const t = useTranslations();

  const serviceErrors = errors?.services?.[index];
  const categoryOptions = ['Parts', 'Services'];

  const handleManHoursChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      onClearManualTotal(index);
      onValueChange(index, 'manHours', value);
    },
    [index, onClearManualTotal, onValueChange],
  );

  const handlePriceChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      onClearManualTotal(index);
      onValueChange(index, 'price', value);
    },
    [index, onClearManualTotal, onValueChange],
  );

  const handleTotalChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      onManualTotalChange(index, value);
    },
    [onManualTotalChange, index],
  );

  const handleTotalBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const { value } = event.target;
      onManualTotalBlur(index, value);
    },
    [index, onManualTotalBlur],
  );

  return (
    <Grid
      container
      spacing={1}
      sx={{
        mb: 2,
        alignItems: 'flex-start',
        flexWrap: 'nowrap',
      }}
    >
      <Grid size={2}>
        <FormTextField
          size="small"
          variant="outlined"
          label={t('createCanned.category')}
          fullWidth
          name={`serviceGroups.${fieldIndex}.services.${index}.category`}
          select
          required
          rules={{ required: t('EmployeeCreateForm.validation.required') }}
        >
          {categoryOptions.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </FormTextField>
      </Grid>

      <Grid size={2}>
        <FormTextField
          size="small"
          variant="outlined"
          label={t('createCanned.internalId')}
          fullWidth
          name={`serviceGroups.${fieldIndex}.services.${index}.internalId`}
          required
          rules={{ required: t('EmployeeCreateForm.validation.required') }}
        />
      </Grid>

      <Grid size={4}>
        <FormTextField
          fullWidth
          size="small"
          variant="outlined"
          label={t('createCanned.description')}
          name={`serviceGroups.${fieldIndex}.services.${index}.description`}
          rules={{ required: t('EmployeeCreateForm.validation.required') }}
        />
      </Grid>

      <Grid size={1.5}>
        <FormTextField
          size="small"
          variant="outlined"
          label={t('createCanned.QTY')}
          fullWidth
          name={`serviceGroups.${fieldIndex}.services.${index}.manHours`}
          value={manHours}
          onChange={handleManHoursChange}
          onKeyDown={handleKeyDown}
          rules={{ required: t('EmployeeCreateForm.validation.required') }}
          inputProps={{
            inputMode: 'decimal',
          }}
        />
      </Grid>

      <Grid size={1.5}>
        <FormTextField
          size="small"
          variant="outlined"
          label={t('createCanned.price')}
          fullWidth
          name={`serviceGroups.${fieldIndex}.services.${index}.price`}
          value={price}
          onChange={handlePriceChange}
          onKeyDown={handleKeyDown}
          rules={{ required: t('EmployeeCreateForm.validation.required') }}
          inputProps={{
            inputMode: 'decimal',
          }}
        />
      </Grid>

      <Grid size={1.5}>
        <FormTextField
          size="small"
          variant="outlined"
          label={t('createCanned.total')}
          fullWidth
          name={`serviceGroups.${fieldIndex}.services.${index}.total`}
          disabled={!isEditable}
          value={totalValue}
          onChange={handleTotalChange}
          onBlur={handleTotalBlur}
          rules={{ required: t('EmployeeCreateForm.validation.required') }}
          inputProps={{
            inputMode: 'decimal',
          }}
        />
      </Grid>

      <Grid size={1} container spacing={1}>
        <Grid>
          <IconButton size="small" color="primary" onClick={onAddService}>
            <AddIcon fontSize="small" />
          </IconButton>
        </Grid>
        {!isFirstRow && (
          <Grid>
            <IconButton size="small" color="error" onClick={onRemoveService}>
              <RemoveIcon fontSize="small" />
            </IconButton>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export const ServicesFormRow = memo(ServicesFormRowComponent);
