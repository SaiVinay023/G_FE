import { ComponentType } from 'react';

import { ModalsProps, useModalProvider } from 'src/components/modals';

export const useModal = () => {
  const context = useModalProvider();

  const openModal = (ModalComponent: ComponentType<ModalsProps>, props?: Record<string, any>) => {
    if (!context) return;

    return context?.addModal({ ModalComponent, ...props });
  };

  const openSingleModal = (ModalComponent: ComponentType<ModalsProps>, props?: Record<string, any>) => {
    if (!context) return;

    return context?.openModal({ ModalComponent, ...props });
  };

  return { openModal, openSingleModal, closeModal: context?.deleteModal };
};
