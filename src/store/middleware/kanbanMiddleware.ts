import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import { cardApi } from 'src/api/cardApi';
import { BuiltInWorkCardStatus, WorkCard } from 'src/models';
import { RootState } from 'src/store';
import { KanbanActions, MoveCardPayload } from 'src/store/slices/kanbanSlice';

const kanbanListenerMiddleware = createListenerMiddleware();

const fetchKanbanEvents = async (listenerApi: any) => {
  const result = await listenerApi.dispatch(cardApi.endpoints.getAllCards.initiate());

  if ('data' in result) {
    const grouped = result.data.reduce(
      // @ts-ignore
      (acc, card) => {
        const status = card.status as BuiltInWorkCardStatus;
        if (!acc[status]) acc[status] = [];
        acc[status].push(card);
        return acc;
      },
      {} as Record<BuiltInWorkCardStatus, typeof result.data>,
    );

    return grouped;
  }

  throw result.error;
};

const updateCard = async (listenerApi: any, card: WorkCard) => {
  await listenerApi.dispatch(cardApi.endpoints.updateCard.initiate({ id: card.id, data: card }));
};

const moveCard = async (listenerApi: any, payload: MoveCardPayload) => {
  const updatedCard = {
    id: payload.cardId,
    status: payload.toStatus,
    position: payload.newIndex,
  };

  await listenerApi.dispatch(cardApi.endpoints.updateCard.initiate({ id: updatedCard.id, data: updatedCard }));
};

kanbanListenerMiddleware.startListening({
  matcher: isAnyOf(KanbanActions.initializeBoard, KanbanActions.updateFilters, KanbanActions.resetFilters),
  effect: async (_, listenerApi) => {
    try {
      const state = listenerApi.getState() as RootState;
      const filters = state.kanban.filters;
      const data = await fetchKanbanEvents(filters);

      listenerApi.dispatch(KanbanActions.setBoard(data));
    } catch (error) {
      listenerApi.dispatch(KanbanActions.setBoardFailure('Failed to fetch data'));
    }
  },
});

kanbanListenerMiddleware.startListening({
  actionCreator: KanbanActions.updateCard,
  effect: async (action, listenerApi) => {
    await updateCard(listenerApi, action.payload.card);
  },
});

kanbanListenerMiddleware.startListening({
  actionCreator: KanbanActions.updateCardStatus,
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const { cardId, newStatus } = action.payload;

    for (const status in state.kanban.board) {
      const card = state.kanban.board?.[status]?.find((c) => c.id === cardId);
      if (card) {
        await updateCard(listenerApi, { ...card, status: newStatus });
        break;
      }
    }
  },
});

kanbanListenerMiddleware.startListening({
  actionCreator: KanbanActions.moveCard,
  effect: async (action, listenerApi) => {
    await moveCard(listenerApi, action.payload);
  },
});

export const { middleware: kanbanActionsMiddleware } = kanbanListenerMiddleware;
