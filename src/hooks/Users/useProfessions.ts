import { useMemo } from 'react';
import { useGetProfessionsQuery } from '@/services';

const useProfessions = () => {
  const {
    data: professionsData,
    isLoading: loadingProfessions,
    error,
  } = useGetProfessionsQuery(undefined, { refetchOnMountOrArgChange: true });

  const professions = useMemo(
    () => professionsData?.data || [],
    [professionsData],
  );

  return {
    professions,
    loading: loadingProfessions,
    professionsError: error,
  };
};

export default useProfessions;
