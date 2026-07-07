import { configureStore, combineReducers, Action, Middleware } from '@reduxjs/toolkit';

import { baseApi } from 'src/api/baseApi';

import { cannedJobsMiddleware } from './middleware/cannedJobsMiddleware';
import { chatActionsMiddleware } from './middleware/chatMiddleware';
import { customersMiddleware } from './middleware/customerMiddleware';
import { employeesMiddleware } from './middleware/employeesMiddleware';
import { estimatesActionsMiddleware } from './middleware/estimatesMiddleware';
import { eventsActionsMiddleware } from './middleware/eventsMiddleware';
import { kanbanActionsMiddleware } from './middleware/kanbanMiddleware';
import { shopMiddleware } from './middleware/shopMiddleware';
import { userMiddleware } from './middleware/userMiddleware';
import { whatsappMiddleware } from './middleware/whatsappMiddleware';
import { workScheduleMiddleware } from './middleware/workScheduleMiddleware';
import { CannedJobsReducer } from './slices/cannedJobsSlice';
import { CustomersReducer } from './slices/customersSlice';
import { EmployeesReducer } from './slices/employeesSlice';
import { EstimatesReducer } from './slices/estimatesSlice';
import { EventsReducer } from './slices/eventSlice';
import { KanbanReducer } from './slices/kanbanSlice';
import { MessagesReducer } from './slices/messagesSlice';
import { ShopReducers } from './slices/shopSlice';
import { ThemeReducers } from './slices/themeSlice';
import { UsersReducer } from './slices/usersSlice';
import { UserReducer } from './slices/userSlice';
import { WhatsAppReducer } from './slices/whatsappSlice';
import { WorkScheduleReducer } from './slices/workScheduleSlice';
import authReducer from './slices/authSlice';
import { VehicleReducer } from './slices/vehicleSlice';
import { vehicleMiddleware } from './middleware/vehicleMiddleware';
import appointmentReducer from './slices/appointmentSlice';
import { appointmentMiddleware } from './middleware/appointmentMiddleware';

const appReducer = combineReducers({
  auth: authReducer,
  estimates: EstimatesReducer,
  users: UsersReducer,
  user: UserReducer,
  messages: MessagesReducer,
  customers: CustomersReducer,
  shop: ShopReducers,
  employees: EmployeesReducer,
  events: EventsReducer,
  kanban: KanbanReducer,
  cannedJobs: CannedJobsReducer,

  workSchedule: WorkScheduleReducer,
  vehicles: VehicleReducer,
  appointment: appointmentReducer,
  whatsapp: WhatsAppReducer,

  theme: ThemeReducers,

  [baseApi.reducerPath]: baseApi.reducer,
});

type AppReducer = typeof appReducer;
type AppState = Parameters<AppReducer>[0];

const rootReducer: typeof appReducer = (state: AppState, action: Action) => {
  // TODO: add here logout settings
  // if (action.type === identityActions.logout.type) {
  //   return appReducer(undefined, action);
  // }

  return appReducer(state, action);
};

const middleware = [
  estimatesActionsMiddleware,
  chatActionsMiddleware,
  customersMiddleware,
  shopMiddleware,
  employeesMiddleware,
  eventsActionsMiddleware,
  kanbanActionsMiddleware,
  cannedJobsMiddleware,
  userMiddleware,
  workScheduleMiddleware,
  vehicleMiddleware,
  whatsappMiddleware,

  baseApi.middleware,
] as Middleware[];

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getMiddleware) =>
    getMiddleware({
      serializableCheck: {
        ignoredActionPaths: [
          'payload.onSuccess',
          'payload.onError',
          'meta.arg',
          'meta.baseQueryMeta.request',
          'meta.baseQueryMeta.response',
        ],
        ignoredPaths: ['meta.baseQueryMeta'],
        ignoredActions: ['api/executeQuery/pending', 'api/executeQuery/fulfilled', 'api/executeQuery/rejected'],
      },
    }).concat(middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
