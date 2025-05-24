import { useGetProjectByIdQuery } from '@/services';
import { useAppSelector } from '@/store';

const useProjectById = (projectId?: string ) => {
  const { loggedIn } = useAppSelector((state) => state?.auth);
  
  const {
    data: allProjectsByIdData,
    isFetching: fetchingAllProjects,
    isLoading: loadingAllProjects,
    refetch: refetchAllProjectsById,
    error: allProjectError,
  } = useGetProjectByIdQuery(projectId ?? '', {
    skip: !loggedIn || !projectId,
    refetchOnMountOrArgChange: true,
  });

  return {
    allProjectsByIdData,
    loading: fetchingAllProjects || loadingAllProjects,
    refetchAllProjectsById,
    allProjectError,
  };
};

export default useProjectById;