'use client';

import { DropResult } from '@hello-pangea/dnd';
import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from 'src/hooks/store';
import { BuiltInWorkCardStatus } from 'src/models';
import {
  selectBoard,
  selectKanbanError,
  selectKanbanFilters,
  selectKanbanLoading,
} from 'src/store/selectors/kanbanSelectors';
import { KanbanActions, KanbanFilters } from 'src/store/slices/kanbanSlice';

export const useKanban = () => {
  const dispatch = useAppDispatch();
  const board = useAppSelector(selectBoard);
  const loading = useAppSelector(selectKanbanLoading);
  const error = useAppSelector(selectKanbanError);
  const filters = useAppSelector(selectKanbanFilters);
  const [expanded, setExpanded] = useState<BuiltInWorkCardStatus | false>(BuiltInWorkCardStatus.EXPECTED);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;

      if (!destination) return;

      dispatch(
        KanbanActions.moveCard({
          cardId: draggableId,
          fromStatus: parseInt(source.droppableId),
          toStatus: parseInt(destination.droppableId),
          newIndex: destination.index,
          oldIndex: source.index,
        }),
      );
    },
    [dispatch],
  );

  const toggleExpanded = useCallback(
    (panel: BuiltInWorkCardStatus) => {
      setExpanded(panel !== expanded ? panel : false);
    },
    [setExpanded, expanded],
  );

  const updateFilters = useCallback(
    (newFilters: KanbanFilters) => {
      dispatch(KanbanActions.updateFilters(newFilters));
    },
    [dispatch],
  );

  const onChangeStatus = useCallback(
    (newStatus: BuiltInWorkCardStatus, cardId: string) => {
      dispatch(KanbanActions.updateCardStatus({ cardId, newStatus }));
    },
    [dispatch],
  );

  const resetFilters = useCallback(() => {
    dispatch(KanbanActions.resetFilters());
  }, [dispatch]);

  useEffect(() => {
    dispatch(KanbanActions.initializeBoard());
  }, [dispatch]);

  return {
    expanded,
    filters,
    board,
    loading,
    error,

    updateFilters,
    resetFilters,
    onDragEnd,
    toggleExpanded,
    onChangeStatus,
  };
};
