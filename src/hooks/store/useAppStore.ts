import { useStore } from 'react-redux';

import { AppStore } from 'src/store';

export const useAppStore: () => AppStore = useStore;

// add usage store.getState()
