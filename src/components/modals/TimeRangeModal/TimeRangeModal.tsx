import { Close as CloseIcon } from '@mui/icons-material';
import {
  Dialog,
  Button,
  DialogContent,
  DialogTitle,
  DialogActions,
  Stack,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { FC, useMemo, useEffect } from 'react';
import { useForm, FormContainer } from 'react-hook-form-mui';
import toast from 'react-hot-toast';

import { FormWorkSchedule, WorkSchedule, WorkScheduleRequest } from 'src/models/work/schedule';
import { useWorkSchedule } from 'src/hooks/pages/useWorkSchedule'; // Ensure correct import path
import { convertTo12HourFormat, convertTo24HourFormat } from 'src/utils/convertTo24HourFormat';

import { Form } from './Form';

type TimeRangeModalProps = {
  payload: {
    shopId: string;
  };
  DialogProps: {
    open: boolean;
    [key: string]: unknown;
  };
  handleModalReject?: () => void;
  handleModalResolve: (val?: unknown) => void;
};

export const TimeRangeModal: FC<TimeRangeModalProps> = ({
  DialogProps: { onExited, onEntered, ...restDialogProps },
  handleModalReject,
  handleModalResolve,
  payload: { shopId },
}) => {
  const t = useTranslations();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    workSchedules,
    loading,
    fetchWorkSchedulesByShopId,
    createWorkSchedule,
    updateWorkSchedule,
    updateWorkScheduleBulk,
  } = useWorkSchedule();

  useEffect(() => {
    if (shopId) {
      fetchWorkSchedulesByShopId(shopId).catch((error) => {
        toast.error(`Failed to load work schedules: ${error instanceof Error ? error.message : 'Unknown error'}`);
      });
    }
  }, [shopId, fetchWorkSchedulesByShopId]);

  const formWorkSchedules = useMemo<FormWorkSchedule[]>(() => {
    const defaultSchedules: FormWorkSchedule[] = Array(7)
      .fill(null)
      .map(() => ({
        day_off: 0,
        start: '8:30 AM',
        finish: '6:00 PM',
        breaks: [],
      }));

    if (!workSchedules || workSchedules.length === 0) {
      return defaultSchedules;
    }

    const extractTimeFrom = (isoString: string | null): string | null => {
      if (!isoString) return null;

      try {
        const date = new Date(isoString);
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        return convertTo12HourFormat(timeString);
      } catch (error) {
        return null;
      }
    };

    const result = [...defaultSchedules];
    workSchedules.forEach((schedule) => {
      if (schedule.day >= 0 && schedule.day < 7) {
        result[schedule.day] = {
          day_off: schedule.dayOff ? 1 : 0,
          start: extractTimeFrom(schedule.start),
          finish: extractTimeFrom(schedule.finish),
          breaks: [],
        };

        if (schedule.breakFrom && schedule.breakTo) {
          result[schedule.day].breaks.push({
            from: extractTimeFrom(schedule.breakFrom),
            to: extractTimeFrom(schedule.breakTo),
          });
        }
      }
    });

    return result;
  }, [workSchedules]);

  const formContext = useForm<{ workSchedules: FormWorkSchedule[] }>({
    defaultValues: { workSchedules: formWorkSchedules },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!formContext.formState.isDirty) {
      formContext.reset({ workSchedules: formWorkSchedules });
    }
  }, [formWorkSchedules, formContext]);

  const hasErrors = Object.keys(formContext?.formState?.errors).length > 0;

  const onSubmit = async (data: { workSchedules: FormWorkSchedule[] }) => {
    try {
      const editedSchedules: Array<WorkScheduleRequest & { id: string }> = [];
      const newSchedules: Array<WorkScheduleRequest> = [];

      data.workSchedules.forEach((scheduleItem, index) => {
        const scheduleData: WorkScheduleRequest = {
          shopId: shopId,
          day: index,
          dayOff: scheduleItem.day_off === 1,
          start:
            scheduleItem.day_off === 1
              ? '00:00:00'
              : scheduleItem.start
                ? convertTo24HourFormat(scheduleItem.start)
                : '00:00:00',
          finish:
            scheduleItem.day_off === 1
              ? '00:00:00'
              : scheduleItem.finish
                ? convertTo24HourFormat(scheduleItem.finish)
                : '00:00:00',
          breakFrom:
            scheduleItem.day_off === 1
              ? '00:00:00'
              : scheduleItem.breaks?.[0]?.from
                ? convertTo24HourFormat(scheduleItem.breaks[0].from)
                : '00:00:00',
          breakTo:
            scheduleItem.day_off === 1
              ? '00:00:00'
              : scheduleItem.breaks?.[0]?.to
                ? convertTo24HourFormat(scheduleItem.breaks[0].to)
                : '00:00:00',
        };

        const existingSchedule = workSchedules?.find((ws) => ws.day === index);

        if (existingSchedule) {
          const normalizeTime = (time: string | null | undefined): string => {
            if (!time) return '00:00';

            if (time.includes('T')) {
              const date = new Date(time);
              if (!isNaN(date.getTime())) {
                const hours = date.getUTCHours().toString().padStart(2, '0');
                const minutes = date.getUTCMinutes().toString().padStart(2, '0');
                return `${hours}:${minutes}`;
              }
            }

            const timeParts = time.split(':');
            if (timeParts.length >= 2) {
              return `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}`;
            }

            return '00:00';
          };

          const existingStart = normalizeTime(existingSchedule.start);
          const existingFinish = normalizeTime(existingSchedule.finish);
          const existingBreakFrom = normalizeTime(existingSchedule.breakFrom);
          const existingBreakTo = normalizeTime(existingSchedule.breakTo);

          const newStart = normalizeTime(scheduleData.start);
          const newFinish = normalizeTime(scheduleData.finish);
          const newBreakFrom = normalizeTime(scheduleData.breakFrom);
          const newBreakTo = normalizeTime(scheduleData.breakTo);

          const dayOffChanged = existingSchedule.dayOff !== scheduleData.dayOff;
          const timesChanged =
            existingStart !== newStart ||
            existingFinish !== newFinish ||
            existingBreakFrom !== newBreakFrom ||
            existingBreakTo !== newBreakTo;

          if (dayOffChanged || timesChanged) {
            const updatedSchedule = {
              id: existingSchedule.id,
              shopId: scheduleData.shopId,
              day: scheduleData.day,
              dayOff: scheduleData.dayOff,
              start: scheduleData.start,
              finish: scheduleData.finish,
              breakFrom: scheduleData.breakFrom,
              breakTo: scheduleData.breakTo,
            };

            editedSchedules.push(updatedSchedule);
          }
        } else {
          newSchedules.push(scheduleData);
        }
      });

      const updateOperations: Promise<any>[] = [];

      if (editedSchedules.length > 0) {
        const requestPayload = {
          weeklySchedule: editedSchedules,
        };

        updateOperations.push(updateWorkScheduleBulk(requestPayload));
      }

      if (newSchedules.length > 0) {
        const createPromises = newSchedules.map((scheduleData) => createWorkSchedule(scheduleData));
        updateOperations.push(...createPromises);
      }

      if (updateOperations.length === 0) {
        handleModalResolve(true);
        return;
      }

      await Promise.all(updateOperations);

      handleModalResolve(true);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      toast.error(`Failed to save work schedules: ${errorMessage}`);
    }
  };

  return (
    <FormContainer formContext={formContext}>
      <Dialog
        scroll="paper"
        maxWidth="sm"
        fullWidth
        {...restDialogProps}
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            width: '100%',
            borderRadius: '4px',
          },
        }}
      >
        <DialogTitle
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: ['center', 'flex-end'],
            padding: 0,
            px: [1, 2],
            py: [2, 1],
          }}
        >
          <Typography noWrap component="div" variant="h3" width="95%" textAlign="center">
            {t('shopFormTimeRangeModal.modalTitle')}
          </Typography>

          <IconButton
            onClick={handleModalReject}
            size="small"
            sx={(theme) => ({
              [theme.breakpoints.up('sm')]: {
                mr: theme.spacing(-1),
              },

              [theme.breakpoints.down('sm')]: {
                position: 'absolute',
                top: 0,
                right: 0,
              },
            })}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ position: 'relative', p: 0, px: [1, 2], height: '100%' }}>
          {loading ? (
            <Stack alignItems="center" justifyContent="center" height="100%" spacing={2}>
              <CircularProgress />
              <Typography>Loading work schedules...</Typography>
            </Stack>
          ) : (
            <Stack gap={5} height="100%">
              <Form formContext={formContext} />
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" color="primary" onClick={handleModalReject}>
            {t('shopFormTimeRangeModal.cancelButtonTitle')}
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={formContext.handleSubmit((formData) => {
              onSubmit(formData);
            })}
            disabled={!formContext.formState?.isDirty || hasErrors || formContext.formState.isSubmitting || loading}
          >
            {t('shopFormTimeRangeModal.saveButtonTitle')}
          </Button>
        </DialogActions>
      </Dialog>
    </FormContainer>
  );
};
