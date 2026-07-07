// eslint-disable-next-line max-len

import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { ModalBase } from './ModalBase';

interface ModalsContextProps {
  globalValues: any;
  modals: any[];
  setGlobalValues: (val: any) => void;
  updateGlobalValues: (val: any) => void;
  deleteModal: (val: any[]) => void;
  addModal: (val: { [p: string]: any; ModalComponent: any }) => void;
  openModal: (val: { [p: string]: any; ModalComponent: any }) => void;
}

export const ModalsContext = createContext<ModalsContextProps>({
  globalValues: null,
  modals: [],
  setGlobalValues: (_: any) => {},
  updateGlobalValues: (_: any) => {},
  deleteModal: (_: any[]) => {},
  addModal: (_: { [p: string]: any; ModalComponent: any }) => {},
  openModal: (_: { [p: string]: any; ModalComponent: any }) => {},
});

type ModalsProviderProps = {
  children: ReactNode;
  pathname?: string;
};

export const ModalsProvider = ({ pathname, children }: ModalsProviderProps) => {
  const modalsCount = useRef(0);
  const [globalValues, setGlobalValues] = useState<any>({});
  const [modals, setModals] = useState<{ modalID: number; [p: string]: any }[]>([]);

  const updateGlobalValues = (val: any) => {
    setGlobalValues(val);
  };

  const deleteModal = useCallback((modalID: number) => {
    setModals((modals) => modals.filter((modal) => modal?.modalID !== modalID));
    modalsCount.current--;
  }, []);

  const addModal = (modal: any) => {
    setModals((modals) =>
      modals.concat({
        ...modal,

        modalID: modalsCount.current++,
        onModalExited: deleteModal,
      }),
    );
  };

  const openModal = (modal: any) => {
    setModals([
      {
        ...modal,

        modalID: modalsCount.current++,
        onModalExited: deleteModal,
      },
    ]);
  };

  useEffect(() => {
    setModals([]);
  }, [pathname]);

  const providerValue = {
    modals,
    deleteModal,
    globalValues,
    setGlobalValues,
    updateGlobalValues,
    addModal,
    openModal,
  };

  return (
    // @ts-expect-error
    <ModalsContext.Provider value={providerValue}>
      {children}

      {modals?.map((modal) => (
        // @ts-expect-error
        <ModalBase open key={modal?.modalID} {...modal} />
      ))}
    </ModalsContext.Provider>
  );
};

export const useModalProvider = () => useContext(ModalsContext);
