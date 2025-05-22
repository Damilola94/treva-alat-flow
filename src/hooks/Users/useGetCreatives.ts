import { useGetCreativesQuery } from '@/services';
import { useAppSelector } from '@/store';

interface IParams {
  pageNumber: number;
  pageSize: number;
  searchKey: string;
}

const useGetCreatives = (params: IParams) => {
  const { loggedIn } = useAppSelector((state) => state?.auth);

  const {
    data: creativesData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetCreativesQuery(params, {
    refetchOnMountOrArgChange: true,
    skip: !loggedIn,
  });

  return {
    creativesData,
    loading: isFetching || isLoading,
    error,
    refetch,
    isError,
  };
};

export default useGetCreatives;
