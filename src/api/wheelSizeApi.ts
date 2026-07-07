import {
  GenerationData,
  GenerationsQueryParams,
  MakesData,
  ModelsData,
  ModelsQueryParams,
  ModificationData,
  ModificationsQueryParams,
  WheelOptionsData,
  WheelOptionsQueryParams,
} from 'src/models';
import { baseApi } from './baseApi';

// Helper function to build query string
const buildQueryString = (params: Record<string, string>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
};

export const wheelSizeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get all available makes
    getMakes: build.query<MakesData, void>({
      query: () => '/api/wheel-size/makes',
      providesTags: ['WheelSize'],
    }),

    // Get models for a specific make
    getModels: build.query<ModelsData, ModelsQueryParams>({
      query: ({ make }) => {
        const queryString = buildQueryString({ make });
        return `/api/wheel-size/models?${queryString}`;
      },
      providesTags: (result, error, { make }) => [{ type: 'WheelSize', id: `models-${make}` }],
    }),

    // Get generations for a specific make and model
    getGenerations: build.query<GenerationData, GenerationsQueryParams>({
      query: ({ make, model }) => {
        const queryString = buildQueryString({ make, model });
        return `/api/wheel-size/generations?${queryString}`;
      },
      providesTags: (result, error, { make, model }) => [{ type: 'WheelSize', id: `generations-${make}-${model}` }],
    }),

    // Get modifications for a specific make, model, and generation
    getModifications: build.query<ModificationData, ModificationsQueryParams>({
      query: ({ make, model, generation }) => {
        const queryString = buildQueryString({ make, model, generation });
        return `/api/wheel-size/modifications?${queryString}`;
      },
      providesTags: (result, error, { make, model, generation }) => [
        { type: 'WheelSize', id: `modifications-${make}-${model}-${generation}` },
      ],
    }),

    // Get wheel options for a specific make, model, generation, and modification
    getWheelOptions: build.query<WheelOptionsData, WheelOptionsQueryParams>({
      query: ({ make, model, generation, modification }) => {
        const queryString = buildQueryString({ make, model, generation, modification });
        return `/api/wheel-size/wheel-options?${queryString}`;
      },
      providesTags: (result, error, { make, model, generation, modification }) => [
        { type: 'WheelSize', id: `wheel-options-${make}-${model}-${generation}-${modification}` },
      ],
    }),

    // Optional: Get wheel option by ID for detailed view
    getWheelOptionById: build.query<WheelOptionsData, string>({
      query: (id) => `/api/wheel-size/wheel-option/${id}`,
      providesTags: (result, error, id) => [{ type: 'WheelSize', id }],
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetMakesQuery,
  useGetModelsQuery,
  useGetGenerationsQuery,
  useGetModificationsQuery,
  useGetWheelOptionsQuery,
  useGetWheelOptionByIdQuery,
  // Lazy query hooks for conditional fetching
  useLazyGetModelsQuery,
  useLazyGetGenerationsQuery,
  useLazyGetModificationsQuery,
  useLazyGetWheelOptionsQuery,
} = wheelSizeApi;
