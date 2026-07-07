import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { BuiltInWorkCardStatus, Cards, WorkCard } from 'src/models';

export interface KanbanState {
  board: Cards;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  filters: KanbanFilters;
}

export interface UpdateCardPayload {
  card: WorkCard;
}

export interface KanbanFilters {
  date?: string;
}

export interface MoveCardPayload {
  fromStatus: BuiltInWorkCardStatus;
  toStatus: BuiltInWorkCardStatus;
  newIndex: number;
  oldIndex: number;
  cardId: string;
}

const initialState: KanbanState = {
  board: {},
  loading: false,
  initialized: false,
  error: null,
  filters: {},
};

export const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    initializeBoard(state) {
      state.loading = true;
      state.error = null;
    },
    setBoard(state, action: PayloadAction<Cards>) {
      state.board = action.payload;
      state.loading = false;
      state.initialized = true;
      state.error = null;
    },
    setBoardFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addCard(state, action: PayloadAction<{ status: BuiltInWorkCardStatus; card: WorkCard }>) {
      const { status, card } = action.payload;
      state.board[status] = [...(state.board[status] || []), card];
    },
    updateCard(state, action: PayloadAction<UpdateCardPayload>) {
      const { card } = action.payload;
      for (const status in state.board) {
        const index = state.board[status as unknown as BuiltInWorkCardStatus]?.findIndex((c) => c.id === card.id);
        if (index !== undefined && index !== -1) {
          state.board[status as unknown as BuiltInWorkCardStatus][index] = card;
          break;
        }
      }
    },
    moveCard(state, action: PayloadAction<MoveCardPayload>) {
      const { cardId, fromStatus, toStatus, newIndex, oldIndex } = action.payload;
      if (fromStatus === toStatus && oldIndex === newIndex) return;

      const actualCardId = cardId.split('=')[0];

      const sourceCards = [...(state.board[fromStatus] || [])];
      const destinationCards = fromStatus === toStatus ? sourceCards : [...(state.board[toStatus] || [])];

      const cardIndex = sourceCards.findIndex((card) => card.id === actualCardId);
      if (cardIndex === -1) return;

      const [movedCard] = sourceCards.splice(cardIndex, 1);
      movedCard.status = toStatus;
      destinationCards.splice(newIndex, 0, movedCard);

      state.board[fromStatus] = fromStatus === toStatus ? destinationCards : sourceCards;
      state.board[toStatus] = destinationCards;
    },
    removeCard(state, action: PayloadAction<string>) {
      for (const status in state.board) {
        state.board[status as unknown as BuiltInWorkCardStatus] =
          state.board[status as unknown as BuiltInWorkCardStatus]?.filter((c) => c.id !== action.payload) || [];
      }
    },
    updateFilters(state, action: PayloadAction<KanbanFilters>) {
      state.filters = { date: action.payload?.date };
      state.loading = true;
    },
    updateCardStatus(state, action: PayloadAction<{ cardId: string; newStatus: BuiltInWorkCardStatus }>) {
      const { cardId, newStatus } = action.payload;

      for (const status in state.board) {
        const cardIndex = state.board[status]?.findIndex((c) => c.id === cardId);
        if (cardIndex !== undefined && cardIndex !== -1) {
          const [movedCard] = state.board[status]?.splice(cardIndex, 1) || [];
          if (!movedCard) return;

          movedCard.status = newStatus;

          state.board[newStatus] = [...(state.board[newStatus] || []), movedCard];

          break;
        }
      }
    },
    resetFilters(state) {
      state.filters = { date: undefined };
      state.loading = true;
    },
  },
});

export const KanbanActions = kanbanSlice.actions;
export const KanbanReducer = kanbanSlice.reducer;
