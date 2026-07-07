export type ModalsProps = {
  payload?: Record<any, any> | undefined;
  DialogProps: {
    open: boolean;
    [key: string]: any;
  };
  handleModalReject?: (val?: any) => void;
  handleModalResolve: (val?: any) => void;
};
