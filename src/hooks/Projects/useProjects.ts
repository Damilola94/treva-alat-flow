import { useGetAllProjectsQuery, useGetDeliverablesQuery } from '@/services';
import { useAppSelector } from '@/store';

interface ProjectQueryParams {
  type?: string;
  status?: string;
  priority?: string;
  currency?: string;
  pageNumber?: number;
  pageSize?: number;
  searchKey?: string;
}

export const useProjects = (params: ProjectQueryParams) => {
  const { loggedIn } = useAppSelector((state) => state?.auth);

  // Remove undefined, 0 or null parameters
  const cleanedFilters = Object.fromEntries(
    Object.entries(params).filter(([, value]) =>
      Boolean(Array.isArray(value) ? value.length > 0 : value),
    ),
  );

  const {
    data: allProjectsData,
    isFetching: fetchingAllProjects,
    isLoading: loadingAllProjects,
    refetch: refetchAllProjects,
    error: allProjectError,
  } = useGetAllProjectsQuery(cleanedFilters, {
    refetchOnMountOrArgChange: true,
    skip: !loggedIn,
  });

  return {
    allProjectsData,
    loading: fetchingAllProjects || loadingAllProjects,
    refetchAllProjects,
    allProjectError,
  };
};

// export default useProjects;

export const useDeliverable = (projectId?: string) => {
  const { loggedIn } = useAppSelector((state) => state?.auth);
  

  const {
    data: allDeliverablesData,
    isFetching: fetchingAllDeliverables,
    isLoading: loadingAllDeliverables,
    refetch: refetchAllProjects,
    error: allProjectError,
  } = useGetDeliverablesQuery({ projectId: projectId ?? '' }, // <-- pass as object
    {
      refetchOnMountOrArgChange: true,
      skip: !loggedIn || !projectId,
    });

  return {
    allDeliverablesData,
    loading: fetchingAllDeliverables || loadingAllDeliverables,
    refetchAllProjects,
    allProjectError,
  };
};

// export default useDeliverableId;