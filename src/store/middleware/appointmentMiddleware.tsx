import { Middleware } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import { addEvent, removeEvent, updateEvent } from './appointmentSlice';

export const appointmentMiddleware: Middleware = () => next => action => {
  if (addEvent.match(action)) {
    toast.success('Appointment added!');
  }
  if (removeEvent.match(action)) {
    toast('Appointment removed.', { icon: '🗑️' });
  }
  if (updateEvent.match(action)) {
    toast.success('Appointment updated.');
  }
  return next(action);
};
