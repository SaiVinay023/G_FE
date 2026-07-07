import type { EventChangeArg, EventClickArg, EventDropArg, DatesSetArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Alert, Snackbar } from '@mui/material';
import { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { CalendarEventCard } from 'src/components/Calendar/CalendarEventCard';
import { defaultSlotMaxTime, defaultSlotMinTime } from 'src/hooks/components/useCalendar';
import { useAppSelector } from 'src/hooks/store';
import { CalendarEvent } from 'src/models';
import { isOpenSidebarSelect } from 'src/store/selectors/themeSelectors';
interface CalendarComponentProps {
  events: CalendarEvent[];
  initialDate: Date;
  slotMinTime?: string;
  slotMaxTime?: string;
  onDateSelect?: (selectInfo: DateClickArg) => void;
  onDateReset?: () => void;
  onChange?: () => void;
  onEventClick?: (clickInfo: EventClickArg) => void;
  onEventDrop: (draggedEvent: EventDropArg) => void;
  onEventChange: (updatedEvent: EventChangeArg) => void;
  onDatesSet?: (dateInfo: any) => void;
  onEventAdd: (newEvent: CalendarEvent) => void;
  onEventRemove?: (eventId: string) => void;
  onShareClick?: () => void;
  onNewAppointmentClick?: () => void;
}

const Calendar: FC<CalendarComponentProps> = ({
  events,
  initialDate,
  slotMinTime = defaultSlotMinTime,
  slotMaxTime = defaultSlotMaxTime,
  onChange,
  onEventChange,
  onEventClick,
  onDateSelect,
  onDatesSet,
  onEventAdd,
  onShareClick,
  onNewAppointmentClick,
}) => {
  const [errorState, setErrorState] = useState<string | null>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const isOpenSidebar = useAppSelector(isOpenSidebarSelect);

  const showError = useCallback((message: string) => {
    setErrorState(message);
  }, []);

  const closeError = useCallback(() => {
    setErrorState(null);
  }, []);

  const handleExternalEventDrop = useCallback(
    (info: { draggedEl: HTMLElement; date: Date }) => {
      const draggedEvent = JSON.parse(info?.draggedEl?.dataset?.event ?? '');

      if (events.some((event) => event.cardData?.id === draggedEvent.cardData?.id)) {
        return;
      }

      const oldStart = new Date(draggedEvent.start);
      const oldEnd = new Date(draggedEvent.end);
      const durationMs = oldEnd.getTime() - oldStart.getTime();

      const newStart = info.date;
      const newEnd = new Date(newStart.getTime() + durationMs);

      const newEvent: CalendarEvent = {
        ...draggedEvent,
        start: newStart.toISOString(),
        end: newEnd.toISOString(),
      };

      onEventAdd(newEvent);
    },
    [onEventAdd, events],
  );

  const handleDateClick = useCallback(
    (info: any) => {
      if (onDateSelect) onDateSelect(info);
    },
    [onDateSelect],
  );

  const handleEventClick = useCallback(
    (info: EventClickArg) => {
      if (onEventClick) onEventClick(info);
    },
    [onEventClick],
  );

  const handleDatesSet = useCallback(
    (info: DatesSetArg) => {
      if (onDatesSet) onDatesSet(info);
    },
    [onDatesSet],
  );

  const handleEventChange = useCallback(
    (info: EventChangeArg) => {
      onEventChange(info);
    },
    [onEventChange],
  );

  const eventClassNames = useMemo(
    () => (eventInfo: any) => {
      const classes = ['project-fullcalendar'];
      if (eventInfo.event.extendedProps.break) {
        classes.push('event-break');
      }
      return classes;
    },
    [],
  );



  const headerToolbar = useMemo(() => ({
    left: 'prev,next today, newAppointmentButton',
    center: 'title',
    right: 'shareButton dayGridMonth,timeGridWeek,timeGridDay',
  }), []);


    const customButtons = useMemo(() => ({
    shareButton: {
      text: 'Quick Share',
      click: () => {
        if (onShareClick) onShareClick();
      },
    },
    newAppointmentButton: { // Add this new button
      text: 'New Appointment',
      click: () => {
        if (onNewAppointmentClick) onNewAppointmentClick();
      },
    },
  }), [onShareClick, onNewAppointmentClick]); 

    const renderEventContent = (eventInfo: any) => {
    const { event } = eventInfo;

    return (
      <CalendarEventCard
        timeText={eventInfo.timeText}
        showMonthContent={eventInfo.view.type === 'dayGridMonth'}
        isBreak={!!event?.extendedProps?.break}
        card={{
          title: event.title,
          ...(event?.extendedProps?.cardData || {}),
        }}
        onChange={() => onChange?.()}
      />
    );
  };

  useEffect(() => {
    const triggerResize = () => {
      window.dispatchEvent(new Event('resize'));
    };

    triggerResize();
  }, [isOpenSidebar]);

  return (
    <>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={headerToolbar}
        customButtons={customButtons}
        initialDate={initialDate}
        locale="en-GB"
        firstDay={1}
        editable
        eventDurationEditable
        // selectable
        eventOverlap
        selectMirror
        // unselectAuto
        dayMaxEvents={2}
        slotDuration="00:15:00"
        slotLabelInterval="00:30:00"
        slotLabelFormat={{
          hour: 'numeric',
          minute: '2-digit',
          omitZeroMinute: false,
        }}
        slotEventOverlap={false}
        allDaySlot={false}
        events={events}
        eventAllow={(dropInfo, draggedEvent) => {
          if (draggedEvent?.extendedProps?.break) {
            showError('You can change break time in the settings.');
          }

          return !draggedEvent?.extendedProps?.break;
        }}
        eventClassNames={eventClassNames}
        slotMinTime={slotMinTime}
        slotMaxTime={slotMaxTime}
        eventContent={renderEventContent}
        eventChange={handleEventChange}
        drop={handleExternalEventDrop}
        // dateClick={handleDateClick}
        eventClick={handleEventClick}
        datesSet={handleDatesSet}
      />

      <Snackbar
        open={!!errorState}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={closeError}
      >
        <Alert variant="filled" severity="error" onClose={closeError}>
          {errorState}
        </Alert>
      </Snackbar>
    </>
  );
};

export default memo(Calendar);
