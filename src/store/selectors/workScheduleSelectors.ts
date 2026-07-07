import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../index';

export const selectWorkScheduleState = (state: RootState) => state.workSchedule;
export const selectWorkSchedules = (state: RootState) => selectWorkScheduleState(state).workSchedules;
export const selectWorkScheduleFilters = (state: RootState) => selectWorkScheduleState(state).filters;
export const selectWorkScheduleLoading = (state: RootState) => selectWorkScheduleState(state).loading;
export const selectWorkScheduleError = (state: RootState) => selectWorkScheduleState(state).error;
export const selectCurrentWorkSchedule = (state: RootState) => state.workSchedule.currentWorkSchedule;
export const selectCurrentWorkScheduleLoading = (state: RootState) => state.workSchedule.currentWorkScheduleLoading;

export const selectWorkScheduleById = (id: string) =>
  createSelector(selectWorkSchedules, (workSchedules) => workSchedules.find((schedule) => schedule.id === id));

export const selectWorkSchedulesByEmployeeId = (employeeId: string) =>
  createSelector(selectWorkSchedules, (workSchedules) =>
    workSchedules.filter((schedule) => schedule.employeeId === employeeId),
  );

export const selectWorkSchedulesByDateRange = (startDate: string, endDate: string) =>
  createSelector(selectWorkSchedules, (workSchedules) =>
    workSchedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.date);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date(8640000000000000);

      return scheduleDate >= start && scheduleDate <= end;
    }),
  );

export const selectWorkSchedulesByStatus = (status: string) =>
  createSelector(selectWorkSchedules, (workSchedules) =>
    status ? workSchedules.filter((schedule) => schedule.status === status) : workSchedules,
  );
