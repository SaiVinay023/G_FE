'use client';

import { useCallback } from 'react';

type MenuHandlers = {
  onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onMenuClose: () => void;
};

export const useRowMenu = (id: string, menuHandlers?: MenuHandlers) => {
  const handleEdit = useCallback(() => {
    console.log('Edit action triggered for ID:', id);
  }, [id]);

  const handleDelete = useCallback(() => {
    console.log('Delete action triggered for ID:', id);
  }, [id]);

  const handleCopy = useCallback(() => {
    console.log('Copy action triggered for ID:', id);
  }, [id]);

  const handleMenuOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      event.preventDefault();
      menuHandlers?.onMenuOpen(event);
    },
    [menuHandlers],
  );

  const handleMenuClose = useCallback(() => {
    menuHandlers?.onMenuClose();
  }, [menuHandlers]);

  const handleAction = useCallback(
    (action: () => void) => {
      menuHandlers?.onMenuClose();
      setTimeout(action, 0);
    },
    [menuHandlers],
  );

  return {
    handleEdit,
    handleDelete,
    handleCopy,
    handleMenuOpen,
    handleMenuClose,
    handleAction,
  };
};
