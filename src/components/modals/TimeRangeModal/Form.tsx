import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  Grid,
  MenuItem,
  Select,
  Typography,
  Tooltip,
  IconButton,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import React, { FC, useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form-mui';

import { availableTimes, compareTimes } from './helpers';
import { FormWorkSchedule } from 'src/models';

type FormProps = {
  formContext: UseFormReturn<{ workSchedules: FormWorkSchedule[] }>;
};

const shortDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const daysLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const Form: FC<FormProps> = ({ formContext }) => {
  const t = useTranslations();
  const { watch, setValue, setError, clearErrors, register, formState } = formContext;
  const workSchedules = watch('workSchedules');

  const validateTimes = useCallback(
    (dayIndex: number, start: string | null, finish: string | null) => {
      if (!start || !finish) {
        clearErrors(`workSchedules.${dayIndex}.finish`);
        return;
      }

      if (compareTimes(start, finish)) {
        setError(`workSchedules.${dayIndex}.finish`, {
          type: 'manual',
          message: t('shopFormTimeRange.timeValidationError'),
        });
      } else {
        clearErrors(`workSchedules.${dayIndex}.finish`);
      }
    },
    [setError, clearErrors, t],
  );

  const validateBreaks = useCallback(
    (dayIndex: number, breakIndex: number, from: string | null, to: string | null) => {
      // Skip validation for empty values
      if (!from && !to) {
        clearErrors(`workSchedules.${dayIndex}.breaks.${breakIndex}`);
        return;
      }

      if (!from || !to) {
        setError(`workSchedules.${dayIndex}.breaks.${breakIndex}`, {
          type: 'manual',
          message: t('shopFormTimeRangeModal.breakStartErrorMessage'),
        });
      } else if (compareTimes(from, to)) {
        setError(`workSchedules.${dayIndex}.breaks.${breakIndex}.to`, {
          type: 'manual',
          message: t('shopFormTimeRangeModal.breakEndErrorMessage'),
        });
      } else {
        clearErrors(`workSchedules.${dayIndex}.breaks.${breakIndex}`);
      }
    },
    [setError, clearErrors, t],
  );

  useEffect(() => {
    if (!workSchedules || workSchedules.length === 0) return;

    const validationTimer = setTimeout(() => {
      workSchedules.forEach((day, dayIndex) => {
        if (day.day_off === 1) {
          clearErrors(`workSchedules.${dayIndex}`);
          return;
        }

        const start = watch(`workSchedules.${dayIndex}.start`);
        const finish = watch(`workSchedules.${dayIndex}.finish`);

        validateTimes(dayIndex, start, finish);

        if (day.breaks && day.breaks.length > 0) {
          day.breaks.forEach((breakTime, breakIndex) => {
            const from = watch(`workSchedules.${dayIndex}.breaks.${breakIndex}.from`);
            const to = watch(`workSchedules.${dayIndex}.breaks.${breakIndex}.to`);

            validateBreaks(dayIndex, breakIndex, from, to);
          });
        }
      });
    }, 100);

    return () => clearTimeout(validationTimer);
  }, [workSchedules, validateTimes, validateBreaks, watch, clearErrors]);

  const toggleDay = (dayIndex: number) => {
    const day = workSchedules[dayIndex];
    const isChangingToDayOff = !day.day_off;

    const updatedDay = {
      ...day,
      start: isChangingToDayOff ? null : '8:30 AM',
      finish: isChangingToDayOff ? null : '6:00 PM',
      day_off: isChangingToDayOff ? 1 : 0,
      breaks: isChangingToDayOff ? [] : day.breaks,
    };

    setValue(`workSchedules.${dayIndex}`, updatedDay, { shouldDirty: true });

    clearErrors(`workSchedules.${dayIndex}`);
  };

  const addBreak = (dayIndex: number) => {
    const day = { ...workSchedules[dayIndex] };
    if (!day.breaks) {
      day.breaks = [];
    }
    day.breaks.push({ from: '12:00 PM', to: '1:00 PM' });
    setValue(`workSchedules`, [...workSchedules.slice(0, dayIndex), day, ...workSchedules.slice(dayIndex + 1)], {
      shouldDirty: true,
    });
  };

  const removeBreak = (dayIndex: number, breakIndex: number) => {
    const day = { ...workSchedules[dayIndex] };
    if (day.breaks && day.breaks.length > 0) {
      day.breaks = day.breaks.filter((_, index) => index !== breakIndex);
      setValue(`workSchedules`, [...workSchedules.slice(0, dayIndex), day, ...workSchedules.slice(dayIndex + 1)], {
        shouldDirty: true,
      });
    }
  };

  return (
    <Box py={2} px={1}>
      <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
        {shortDays.map((label, index) => (
          <Grid key={index}>
            <Button
              variant="contained"
              color={workSchedules[index]?.day_off === 0 ? 'primary' : 'secondary'}
              onClick={() => toggleDay(index)}
            >
              {label}
            </Button>
          </Grid>
        ))}
      </Grid>

      {workSchedules.map((day, dayIndex) => (
        <Box key={dayIndex} my={4}>
          <Grid container spacing={[1, 2]} alignItems="center" wrap="nowrap">
            <Grid size={{ xs: 3.5, md: 3 }}>
              <Typography color="primary">{daysLabels[dayIndex]}</Typography>
            </Grid>

            <Grid size={{ xs: 4 }}>
              <FormControl fullWidth error={!!formState.errors?.workSchedules?.[dayIndex]?.start}>
                <Select
                  {...register(`workSchedules.${dayIndex}.start`)}
                  value={day.start || ''}
                  size="small"
                  disabled={day.day_off === 1}
                  onChange={(e) => {
                    setValue(`workSchedules.${dayIndex}.start`, e.target.value, { shouldDirty: true });
                    validateTimes(dayIndex, e.target.value, day.finish || '');
                  }}
                >
                  {availableTimes.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{formState.errors?.workSchedules?.[dayIndex]?.start?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 4 }}>
              <FormControl fullWidth error={!!formState.errors?.workSchedules?.[dayIndex]?.finish}>
                <Select
                  {...register(`workSchedules.${dayIndex}.finish`)}
                  value={day.finish || ''}
                  size="small"
                  disabled={day.day_off === 1}
                  onChange={(e) => {
                    setValue(`workSchedules.${dayIndex}.finish`, e.target.value, { shouldDirty: true });
                    validateTimes(dayIndex, day.start || '', e.target.value);
                  }}
                >
                  {availableTimes.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{formState.errors?.workSchedules?.[dayIndex]?.finish?.message}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid>
              <Tooltip title={t('shopFormTimeRangeModal.addBreak')}>
                <div>
                  <IconButton
                    size="small"
                    disabled={day.day_off === 1}
                    onClick={() => addBreak(dayIndex)}
                    color="primary"
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </div>
              </Tooltip>
            </Grid>
          </Grid>

          {day.breaks &&
            day.breaks.map((breakTime, breakIndex) => (
              <Grid container spacing={[1, 2]} alignItems="center" key={breakIndex} wrap="nowrap">
                <Grid size={{ xs: 3.5, md: 3 }}>
                  <Typography color="secondary">{t('Form.break')}</Typography>
                </Grid>

                <Grid size={{ xs: 4 }}>
                  <FormControl
                    fullWidth
                    error={!!formState.errors?.workSchedules?.[dayIndex]?.breaks?.[breakIndex]?.from}
                  >
                    <Select
                      {...register(`workSchedules.${dayIndex}.breaks.${breakIndex}.from`)}
                      value={breakTime.from || ''}
                      size="small"
                      onChange={(e) => {
                        setValue(`workSchedules.${dayIndex}.breaks.${breakIndex}.from`, e.target.value, {
                          shouldDirty: true,
                        });
                        validateBreaks(dayIndex, breakIndex, e.target.value, breakTime.to || '');
                      }}
                    >
                      {availableTimes.map((time) => (
                        <MenuItem key={time} value={time}>
                          {time}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {formState.errors?.workSchedules?.[dayIndex]?.breaks?.[breakIndex]?.from?.message}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 4 }}>
                  <FormControl
                    fullWidth
                    error={!!formState.errors?.workSchedules?.[dayIndex]?.breaks?.[breakIndex]?.to}
                  >
                    <Select
                      {...register(`workSchedules.${dayIndex}.breaks.${breakIndex}.to`)}
                      value={breakTime.to || ''}
                      size="small"
                      onChange={(e) => {
                        setValue(`workSchedules.${dayIndex}.breaks.${breakIndex}.to`, e.target.value, {
                          shouldDirty: true,
                        });
                        validateBreaks(dayIndex, breakIndex, breakTime.from || '', e.target.value);
                      }}
                    >
                      {availableTimes.map((time) => (
                        <MenuItem key={time} value={time}>
                          {time}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {formState.errors?.workSchedules?.[dayIndex]?.breaks?.[breakIndex]?.to?.message}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid>
                  <Tooltip title={t('shopFormTimeRangeModal.removeBreak')}>
                    <div>
                      <IconButton size="small" onClick={() => removeBreak(dayIndex, breakIndex)} color="error">
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </Tooltip>
                </Grid>
              </Grid>
            ))}

          <Divider sx={{ my: 2 }} />
        </Box>
      ))}
    </Box>
  );
};
