import { REQUEST_METHODS, endpoints } from '@/constants';
import { userServiceApiSlice } from '@/store/slices';
import { ITrevaUserService } from '@/types';

export const userFavoritesService = userServiceApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllFavorites: builder.query({
      query: (params) => ({
        url: endpoints.userFavorites.getAllFavorites,
        method: REQUEST_METHODS.GET,
        params: params,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['UserFavoriteModelBaseResponse'],
      ) => response,
    }),

    addFavorite: builder.mutation({
      query: (values) => ({
        url: endpoints.userFavorites.addFavorite,
        method: REQUEST_METHODS.POST,
        body: values,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['BooleanBaseResponse'],
      ) => response,
    }),

    deleteFavorite: builder.mutation({
      query: (creativeUserId) => ({
        url: endpoints.userFavorites.deleteFavorite(creativeUserId),
        method: REQUEST_METHODS.DELETE,
      }),
      transformResponse: (
        response: ITrevaUserService['schemas']['BooleanBaseResponse'],
      ) => response,
    }),
  }),
});

export const {
  useAddFavoriteMutation,
  useDeleteFavoriteMutation,
  useGetAllFavoritesQuery,
} = userFavoritesService;
