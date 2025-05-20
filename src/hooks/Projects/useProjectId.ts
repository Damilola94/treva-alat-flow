import { useGetProjectByIdQuery } from '@/services';
import { useAppSelector } from '@/store';

// interface ProjectQueryParams {
//   projectId?: string;
//   type?: string;
//   status?: string;
//   priority?: string;
//   currency?: string;
//   pageNumber?: number;
//   pageSize?: number;
//   searchKey?: string;
// }

const useProjectById = (projectId?: string ) => {
  const { loggedIn } = useAppSelector((state) => state?.auth);
  
  const {
    data: allProjectsByIdData,
    isFetching: fetchingAllProjects,
    isLoading: loadingAllProjects,
    refetch: refetchAllProjects,
    error: allProjectError,
  } = useGetProjectByIdQuery(projectId ?? '', {
    skip: !loggedIn || !projectId,
    refetchOnMountOrArgChange: true,
  });

  return {
    allProjectsByIdData,
    loading: fetchingAllProjects || loadingAllProjects,
    refetchAllProjects,
    allProjectError,
  };
};

export default useProjectById;