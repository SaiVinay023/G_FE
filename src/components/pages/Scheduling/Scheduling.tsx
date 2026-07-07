'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { toHHMMSS, toISOZ } from 'src/utils/dateUtils';
import { normalizePhone, isE164ish } from 'src/utils/phoneUtils';

import { Calendar } from 'src/components/Calendar';
import { MobileEventList } from 'src/components/Calendar/MobileEventList';
import { CalendarColumn } from 'src/components/CalendarColumn/CalendarColumn';
import { AppointmentFormModal } from 'src/components/modals/AppointmentFormModal';
import { QuickShareModal } from 'src/components/modals/QuickShareModal';

import { useCreateAppointmentMutation } from 'src/api/appointmentApi';
import { useEmployees } from 'src/hooks/pages/useEmployees';
import { useUser } from 'src/hooks/pages/useUser';
import { useCalendar } from 'src/hooks/components/useCalendar';
import { useQuickShare } from 'src/hooks/components/useQuickShare';

import {
  addEvent,
  removeEvent,
  updateEvent,
  setUnassignedEvents,
  openAppointmentModal,
  closeAppointmentModal,
} from 'src/store/slices/appointmentSlice';
import { RootState } from '@/store/store';

import { Grid, useMediaQuery, useTheme } from '@mui/material';

export const Scheduling = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  // Redux state
  const events = useSelector((state: RootState) => state.appointment.events);
  const unassignedEvents = useSelector((state: RootState) => state.appointment.unassignedEvents);
  const loading = useSelector((state: RootState) => state.appointment.loading);
  const isAppointmentModalOpen = useSelector((state: RootState) => state.appointment.appointmentModalOpen);

  useEmployees();
  const { shopId } = useUser();

  const [createAppointment, { isLoading: isCreating }] = useCreateAppointmentMutation();

  // Calendar hook (legacy helpers for external events)
  const { onEventAdd, onEventRemove, onEventDrop, onEventChange } = useCalendar();

  // QuickShare hook
  const { isShareModalOpen, setIsShareModalOpen, isQuickSharing, handleShareClick, handleSendConfirmation } =
    useQuickShare();

  // Clear unassigned ONCE on mount
  const didInitRef = useRef(false);
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    dispatch(setUnassignedEvents([]));
  }, [dispatch]);

  const handleNewAppointmentClick = useCallback(() => {
    dispatch(openAppointmentModal());
  }, [dispatch]);

  // Local event handlers (Redux sync)
  const handleEventAdd = useCallback(
    (newEvent: { title: string; start: Date; end: Date; extendedProps?: { customer: any; comments?: string }; id?: string }) => {
      dispatch(
        addEvent({
          id: newEvent.id ?? String(Date.now()),
          title: newEvent.title,
          start: newEvent.start.toISOString(),
          end: newEvent.end.toISOString(),
          extendedProps: newEvent.extendedProps,
        }),
      );
    },
    [dispatch],
  );

  const handleEventRemove = useCallback((eventId: string) => dispatch(removeEvent(eventId)), [dispatch]);
  const handleEventChange = useCallback(
    (updatedEvent: { id: string; title: string; start: Date; end: Date; extendedProps?: { customer: any; comments?: string } }) => {
      dispatch(
        updateEvent({
          id: updatedEvent.id,
          title: updatedEvent.title,
          start: updatedEvent.start.toISOString(),
          end: updatedEvent.end.toISOString(),
          extendedProps: updatedEvent.extendedProps,
        }),
      );
    },
    [dispatch],
  );
  const handleEventDrop = handleEventChange;

  // Appointment submit
  const handleAppointmentSubmit = async (data: {
    title: string;
    customer: { name: string; phone: string; email: string; licensePlate?: string };
    startTime: Date;
    endTime: Date;
    comments?: string;
    assignedTo?: string;
    shopId: string;
  }) => {
    if (!shopId) {
      toast.error('Shop is missing');
      return;
    }

    const phone = normalizePhone(data.customer.phone);
    if (!isE164ish(phone)) {
      toast.error('Phone must be in +{country}{number} format, e.g. +15551234567');
      return;
    }

    try {
      const payload: any = {
        shopId,
        title: data.title || data.customer.name,
        name: data.customer.name,
        email: data.customer.email,
        phone,
        comment: data.comments || '',
        date: data.startTime.toISOString(),
        time: toHHMMSS(new Date(data.startTime)),
        assignedTo: data.assignedTo === 'Unassigned' ? undefined : data.assignedTo,
      };

      const response = await createAppointment(payload).unwrap();

      if (response?.success !== false) {
        dispatch(
          addEvent({
            id: String(Date.now()),
            title: payload.title,
            start: data.startTime.toISOString(),
            end: data.endTime.toISOString(),
            extendedProps: { customer: { ...data.customer, phone }, comments: data.comments },
          }),
        );
        toast.success('Appointment created successfully');
        dispatch(closeAppointmentModal());
      } else {
        toast.error(response?.message || 'Failed to create appointment');
      }
    } catch (error) {
      toast.error('Failed to create appointment');
      console.error('Create appointment error', error);
    }
  };

  // Map Redux string dates -> Date objects
  const calendarEvents = useMemo(
    () => (events || []).map((e: any) => ({ ...e, start: new Date(e.start), end: new Date(e.end) })),
    [events],
  );

  const calendarUnassigned = useMemo(
    () => (unassignedEvents || []).map((e: any) => ({ ...e, start: new Date(e.start), end: new Date(e.end) })),
    [unassignedEvents],
  );

  if (loading) return <div>Loading appointments...</div>;

  return isMobile ? (
    <MobileEventList events={calendarEvents} />
  ) : (
    <Grid container spacing={2} sx={{ p: 2, overflowY: 'auto', height: '100%', flexWrap: 'nowrap' }}>
      <Grid xs={0} lg={3} sx={{ display: { xs: 'none', lg: 'block' }, height: '100%', minWidth: '277px' }}>
        <CalendarColumn loading={loading} events={calendarUnassigned} />
      </Grid>

      <Grid xs={12} lg={9} sx={{ height: '100%' }}>
        <Calendar
          initialDate={new Date()}
          events={calendarEvents}
          onEventDrop={handleEventDrop}
          onEventAdd={handleEventAdd}
          onEventChange={handleEventChange}
          onEventRemove={handleEventRemove}
          onNewAppointmentClick={handleNewAppointmentClick}
          onShareClick={handleShareClick}
        />
      </Grid>

      {/* Appointment Modal */}
      <AppointmentFormModal
        open={isAppointmentModalOpen}
        onClose={() => dispatch(closeAppointmentModal())}
        onSubmit={handleAppointmentSubmit}
        isSubmitting={isCreating}
      />

      {/* Quick Share Modal */}
      <QuickShareModal
        open={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onSubmit={handleSendConfirmation}
        isSubmitting={isQuickSharing}
      />
    </Grid>
  );
};
