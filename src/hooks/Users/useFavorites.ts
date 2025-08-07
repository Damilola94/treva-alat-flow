import { useGetAllFavoritesQuery } from '@/services';
import { useAppSelector } from '@/store';

interface IParams {
  rating: number | string;
  pageNumber: number;
  pageSize: number;
  searchKey: string;
  professionId: string | null;
}

const useFavorites = (params: IParams) => {
  const { loggedIn } = useAppSelector((state) => state?.auth);

  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== null),
  );

  const {
    data: favoriteData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllFavoritesQuery(filteredParams, {
    refetchOnMountOrArgChange: true,
    skip: !loggedIn,
  });

  return {
    favoriteData,
    loading: isFetching || isLoading,
    error,
    refetch,
    isError,
  };
};

export default useFavorites;
