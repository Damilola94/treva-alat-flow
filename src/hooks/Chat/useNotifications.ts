import {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
} from '@/services';
import { useAppSelector } from '@/store';

interface IParams {
  isRead?: boolean;
  pageNumber?: number;
  pageSize?: number;
  searchKey?: string;
}

const useNotifications = (params?: IParams) => {
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

  const {
    data: notificationCount,
    isError: notificationCountHasError,
  } = useGetUnreadNotificationCountQuery(undefined, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    skip: !loggedIn,
  });

  return {
    notificationCount,
    allNotifications,
    loading: loggedIn ? isLoading || isFetching : false,
    refetch,
    error,
    notificationCountHasError,
    isError,
  };
};

export default useNotifications;