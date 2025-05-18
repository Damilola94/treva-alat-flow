import { useGetStatesQuery } from '@/services';
import { useAppSelector } from '@/store';

interface IParams {
  country: string;
}

const useStates = ({ country }: IParams) => {
  const { loggedIn } = useAppSelector((state) => state?.auth);

  const {
    data: stateData,
    isFetching: fetchingState,
    isLoading: loadingState,
    error: stateError,
  } = useGetStatesQuery(
    { country },
    {
      refetchOnMountOrArgChange: true,
      skip: !loggedIn || !country,
    },
  );

  return {
    stateData,
    loading: loadingState || fetchingState,
    stateError,
  };
};

export default useStates;
