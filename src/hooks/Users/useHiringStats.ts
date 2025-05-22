import { useGetHiringStatsQuery } from '@/services';
import { useAppSelector } from '@/store';

const useHiringStats = () => {
  const { loggedIn } = useAppSelector((state) => state?.auth);

  const {
    data: hiringStatsData,
    isLoading,
    isFetching,
    error,
    refetch,
    isError,
  } = useGetHiringStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    skip: !loggedIn,
  });
  return {
    hiringStatsData,
    loading: isLoading || isFetching,
    error,
    refetch,
    isError,
  };
};

export default useHiringStats;
