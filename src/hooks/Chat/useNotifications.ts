import { useGetNotificationsQuery } from '@/services';
import { useAppSelector } from '@/store';

interface IParams {
  isRead?: boolean;
  pageNumber?: number;
  pageSize?: number;
  searchKey?: string;
}

const useNotifications = (params: IParams) => {
  const { loggedIn } = useAppSelector((state) => state.auth);

  const {
    data: allNotifications,
    isLoading,
    isFetching,
    error,
    isError,
    refetch,   
  } = useGetNotificationsQuery(params, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    skip: !loggedIn,
  });

  return {
    allNotifications,
    loading: isLoading || isFetching,
    refetch,
    error,
    isError,
  };
};

export default useNotifications;
