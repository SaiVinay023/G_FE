import { RootState } from 'src/store';

export const selectKanbanState = (state: RootState) => state.kanban;
export const selectBoard = (state: RootState) => selectKanbanState(state).board;
export const selectKanbanLoading = (state: RootState) => selectKanbanState(state).loading;
export const selectKanbanInitialized = (state: RootState) => selectKanbanState(state).initialized;
export const selectKanbanFilters = (state: RootState) => selectKanbanState(state).filters;
export const selectKanbanError = (state: RootState) => selectKanbanState(state).error;
