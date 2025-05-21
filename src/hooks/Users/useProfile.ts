import { useGetUserProfileQuery } from '@/services';
import { useAppSelector } from '@/store';

const useProfile = () => {
  const { loggedIn } = useAppSelector((state) => state?.auth);

  const { data, isLoading, error, isFetching, isError } =
    useGetUserProfileQuery(undefined, {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      skip: !loggedIn,
    });

  return {
    data,
    loading: isFetching || isLoading,
    error,
    isError,
  };
};

export default useProfile;
