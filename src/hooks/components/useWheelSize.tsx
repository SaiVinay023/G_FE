import { useCallback, useMemo, useState } from 'react';
import {
  useGetMakesQuery,
  useGetModelsQuery,
  useGetGenerationsQuery,
  useGetModificationsQuery,
  useGetWheelOptionsQuery,
  useLazyGetModelsQuery,
  useLazyGetGenerationsQuery,
  useLazyGetModificationsQuery,
  useLazyGetWheelOptionsQuery,
} from 'src/api/wheelSizeApi';
import { GenerationData, MakesData, ModelsData, ModificationData, WheelOptionsData } from 'src/models';

interface UseWheelSizeOptions {
  make?: string;
  model?: string;
  generation?: string;
  modification?: string;
  // Control when to auto-fetch data
  autoFetch?: {
    models?: boolean;
    generations?: boolean;
    modifications?: boolean;
    wheelOptions?: boolean;
  };
  // Skip initial makes query (useful if you want to load them manually)
  skipMakes?: boolean;
}

interface UseWheelSizeReturn {
  // Data
  makes: MakesData['data'];
  models: ModelsData['data'];
  generations: GenerationData['data'];
  modifications: ModificationData['data'];
  wheelOptions: WheelOptionsData['data'];

  // Loading states
  loading: {
    makes: boolean;
    models: boolean;
    generations: boolean;
    modifications: boolean;
    wheelOptions: boolean;
  };

  // Error states
  errors: {
    makes: any;
    models: any;
    generations: any;
    modifications: any;
    wheelOptions: any;
  };

  // Manual fetch functions (lazy queries)
  fetchModels: (make: string) => Promise<any>;
  fetchGenerations: (make: string, model: string) => Promise<any>;
  fetchModifications: (make: string, model: string, generation: string) => Promise<any>;
  fetchWheelOptions: (make: string, model: string, generation: string, modification: string) => Promise<any>;

  // Utility functions
  resetFrom: (level: 'models' | 'generations' | 'modifications' | 'wheelOptions') => void;
  isDataAvailable: {
    makes: boolean;
    models: boolean;
    generations: boolean;
    modifications: boolean;
    wheelOptions: boolean;
  };

  // Validation helpers
  canFetchModels: boolean;
  canFetchGenerations: boolean;
  canFetchModifications: boolean;
  canFetchWheelOptions: boolean;
}

export const useWheelSize = (options: UseWheelSizeOptions = {}): UseWheelSizeReturn => {
  const {
    make,
    model,
    generation,
    modification,
    autoFetch = {
      models: true,
      generations: true,
      modifications: true,
      wheelOptions: true,
    },
    skipMakes = false,
  } = options;

  // Always fetch makes first (unless explicitly skipped)
  const {
    data: makesData,
    isLoading: makesLoading,
    error: makesError,
  } = useGetMakesQuery(undefined, {
    skip: skipMakes,
  });

  // Conditional queries based on dependencies and autoFetch settings
  const shouldFetchModels = Boolean(make && autoFetch.models);
  const shouldFetchGenerations = Boolean(make && model && autoFetch.generations);
  const shouldFetchModifications = Boolean(make && model && generation && autoFetch.modifications);
  const shouldFetchWheelOptions = Boolean(make && model && generation && modification && autoFetch.wheelOptions);

  // Auto-fetch queries
  const {
    data: modelsData,
    isLoading: modelsLoading,
    error: modelsError,
  } = useGetModelsQuery(
    { make: make! },
    {
      skip: !shouldFetchModels,
    },
  );

  const {
    data: generationsData,
    isLoading: generationsLoading,
    error: generationsError,
  } = useGetGenerationsQuery(
    { make: make!, model: model! },
    {
      skip: !shouldFetchGenerations,
    },
  );

  const {
    data: modificationsData,
    isLoading: modificationsLoading,
    error: modificationsError,
  } = useGetModificationsQuery(
    { make: make!, model: model!, generation: generation! },
    {
      skip: !shouldFetchModifications,
    },
  );

  const {
    data: wheelOptionsData,
    isLoading: wheelOptionsLoading,
    error: wheelOptionsError,
  } = useGetWheelOptionsQuery(
    { make: make!, model: model!, generation: generation!, modification: modification! },
    {
      skip: !shouldFetchWheelOptions,
    },
  );

  // Lazy query hooks for manual fetching
  const [triggerModels] = useLazyGetModelsQuery();
  const [triggerGenerations] = useLazyGetGenerationsQuery();
  const [triggerModifications] = useLazyGetModificationsQuery();
  const [triggerWheelOptions] = useLazyGetWheelOptionsQuery();

  // Manual fetch functions
  const fetchModels = useCallback(
    async (makeParam: string) => {
      if (!makeParam) {
        throw new Error('Make is required to fetch models');
      }
      return triggerModels({ make: makeParam }).unwrap();
    },
    [triggerModels],
  );

  const fetchGenerations = useCallback(
    async (makeParam: string, modelParam: string) => {
      if (!makeParam || !modelParam) {
        throw new Error('Make and model are required to fetch generations');
      }
      return triggerGenerations({ make: makeParam, model: modelParam }).unwrap();
    },
    [triggerGenerations],
  );

  const fetchModifications = useCallback(
    async (makeParam: string, modelParam: string, generationParam: string) => {
      if (!makeParam || !modelParam || !generationParam) {
        throw new Error('Make, model, and generation are required to fetch modifications');
      }
      return triggerModifications({
        make: makeParam,
        model: modelParam,
        generation: generationParam,
      }).unwrap();
    },
    [triggerModifications],
  );

  const fetchWheelOptions = useCallback(
    async (makeParam: string, modelParam: string, generationParam: string, modificationParam: string) => {
      if (!makeParam || !modelParam || !generationParam || !modificationParam) {
        throw new Error('Make, model, generation, and modification are required to fetch wheel options');
      }
      return triggerWheelOptions({
        make: makeParam,
        model: modelParam,
        generation: generationParam,
        modification: modificationParam,
      }).unwrap();
    },
    [triggerWheelOptions],
  );

  // Reset utility function (for clearing dependent data when parent changes)
  const resetFrom = useCallback((level: 'models' | 'generations' | 'modifications' | 'wheelOptions') => {
    // This would typically be handled by the parent component
    // by clearing the state values, but we provide this as a helper
    console.log(`Reset cascade from: ${level}`);
  }, []);

  // Validation helpers
  const canFetchModels = Boolean(make);
  const canFetchGenerations = Boolean(make && model);
  const canFetchModifications = Boolean(make && model && generation);
  const canFetchWheelOptions = Boolean(make && model && generation && modification);

  // Data availability checks
  const isDataAvailable = useMemo(
    () => ({
      makes: Boolean(makesData?.data && makesData.data.length > 0),
      models: Boolean(modelsData?.data && modelsData.data.length > 0),
      generations: Boolean(generationsData?.data && generationsData.data.length > 0),
      modifications: Boolean(modificationsData?.data && modificationsData.data.length > 0),
      wheelOptions: Boolean(wheelOptionsData?.data && wheelOptionsData.data.length > 0),
    }),
    [makesData, modelsData, generationsData, modificationsData, wheelOptionsData],
  );

  return {
    // Data (with fallbacks)
    makes: makesData?.data || [],
    models: modelsData?.data || [],
    generations: generationsData?.data || [],
    modifications: modificationsData?.data || [],
    wheelOptions: wheelOptionsData?.data || [],

    // Loading states
    loading: {
      makes: makesLoading,
      models: modelsLoading,
      generations: generationsLoading,
      modifications: modificationsLoading,
      wheelOptions: wheelOptionsLoading,
    },

    // Error states
    errors: {
      makes: makesError,
      models: modelsError,
      generations: generationsError,
      modifications: modificationsError,
      wheelOptions: wheelOptionsError,
    },

    // Manual fetch functions
    fetchModels,
    fetchGenerations,
    fetchModifications,
    fetchWheelOptions,

    // Utility functions
    resetFrom,
    isDataAvailable,

    // Validation helpers
    canFetchModels,
    canFetchGenerations,
    canFetchModifications,
    canFetchWheelOptions,
  };
};

// Specialized hook for form scenarios with controlled state
export const useWheelSizeForm = () => {
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedGeneration, setSelectedGeneration] = useState<string>('');
  const [selectedModification, setSelectedModification] = useState<string>('');

  const wheelSize = useWheelSize({
    make: selectedMake,
    model: selectedModel,
    generation: selectedGeneration,
    modification: selectedModification,
    autoFetch: {
      models: !!selectedMake,
      generations: !!selectedModel,
      modifications: !!selectedGeneration,
      wheelOptions: !!selectedModification,
    },
  });

  // Reset dependent selections when parent changes
  const handleMakeChange = useCallback((make: string) => {
    setSelectedMake(make);
    setSelectedModel('');
    setSelectedGeneration('');
    setSelectedModification('');
  }, []);

  const handleModelChange = useCallback((model: string) => {
    setSelectedModel(model);
    setSelectedGeneration('');
    setSelectedModification('');
  }, []);

  const handleGenerationChange = useCallback((generation: string) => {
    setSelectedGeneration(generation);
    setSelectedModification('');
  }, []);

  const handleModificationChange = useCallback((modification: string) => {
    setSelectedModification(modification);
  }, []);

  return {
    ...wheelSize,
    // Selected values
    selectedMake,
    selectedModel,
    selectedGeneration,
    selectedModification,
    // Handlers
    handleMakeChange,
    handleModelChange,
    handleGenerationChange,
    handleModificationChange,
    // Reset functions
    resetFromMake: () => handleMakeChange(''),
    resetFromModel: () => handleModelChange(''),
    resetFromGeneration: () => handleGenerationChange(''),
  };
};

export default useWheelSize;
