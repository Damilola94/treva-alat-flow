import { useGetCreativeHiresQuery } from '@/services';
import { useAppSelector } from '@/store';

interface IUseCreativeHiresParams {
  pageNumber?: number;
  pageSize?: number;
  searchKey?: string;
}

const useCreativeHires = (params: IUseCreativeHiresParams) => {
  const { loggedIn } = useAppSelector((state) => state.auth);

  const {
    data: creativeHiresData,
    isLoading,
    isFetching,
    refetch,
  } = useGetCreativeHiresQuery(params, {
    refetchOnMountOrArgChange: true,
    skip: !loggedIn,
  });
  return {
    creativeHiresData,
    loading: isLoading || isFetching,
    refetch,
  };
};

export default useCreativeHires;
