import { useGetCitiesQuery } from '@/services';
import { useAppSelector } from '@/store';

const useCities = ({ state }: { state: string }) => {
  const { loggedIn } = useAppSelector((state) => state?.auth);

  const {
    data: citiesData,
    isFetching: fetchingCities,
    isLoading: loadingCities,
    error: citiesError,
  } = useGetCitiesQuery(
    { state },
    {
      refetchOnMountOrArgChange: true,
      skip: !loggedIn || !state,
    },
  );

  return {
    citiesData,
    loading: fetchingCities || loadingCities,
    citiesError,
  };
};

export default useCities;
