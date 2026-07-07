// src/api/appointmentApi.ts
import { baseApi } from './baseApi';

interface Customer {
  name: string;
  phone: string;
  email: string;
  licensePlate?: string;
}

export interface Event {
  id: string;
  title: string;
  start: string; // ISO string
  end: string;   // ISO string
  extendedProps?: {
    customer: Customer;
    comments?: string;
  };
}

interface AppointmentPayload {
  shopId: string;
  title: string;
  name: string;
  email: string;
  phone: string;
  comment?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  assignedTo?: string;
  licensePlate?: string;
}

interface AppointmentResponse {
  success: boolean;
  message?: string;
  id?: string;
}

interface UpdateAppointmentPayload extends Partial<AppointmentPayload> {
  id: string;
}

interface CreateSlotsPayload {
  appointmentId: string;
  slots: { date: string; time: string }[];
}

export const appointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAppointment: builder.mutation<AppointmentResponse, AppointmentPayload>({
      query: (data) => ({
        url: '/api/appointment/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Appointment', 'Calendar'],
    }),

    createAppointmentSlots: builder.mutation<AppointmentResponse, CreateSlotsPayload>({
      query: (data) => ({
        url: '/api/appointment/create/slots',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Appointment'],
    }),

    getAppointmentById: builder.query<AppointmentPayload & { id: string }, string>({
      query: (id) => `/api/appointment/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'Appointment' as const, id }],
    }),

    updateAppointment: builder.mutation<AppointmentResponse, UpdateAppointmentPayload>({
      query: ({ id, ...data }) => ({
        url: `/api/appointment/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'Appointment' as const, id }, 'Calendar'],
    }),

    deleteAppointment: builder.mutation<AppointmentResponse, string>({
      query: (id) => ({
        url: `/api/appointment/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, id) => [{ type: 'Appointment' as const, id }, 'Calendar'],
    }),

    // Calendar events, rely on x-shop-id header only
    fetchEvents: builder.query<Event[], void>({
      query: () => ({ url: '/api/calendar/shop' }),
      transformResponse: (res: any) => {
        if (Array.isArray(res?.data)) return res.data as Event[];
        if (Array.isArray(res)) return res as Event[];
        return [];
      },
      providesTags: ['Calendar'],
    }),
  }),
});

export const {
  useCreateAppointmentMutation,
  useCreateAppointmentSlotsMutation,
  useGetAppointmentByIdQuery,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  useFetchEventsQuery,
} = appointmentApi;
