import { useDeleteDeliverableMutation, useDeleteDeliverableTaskMutation, useDeleteExtraCostMutation, useDeleteProjectMutation, useGetAllExtraCostsQuery, useGetAllPaymentScheduleQuery, useGetAllProjectsQuery, useGetDashboardSummaryCountQuery, useGetDeliverableByIdQuery, useGetDeliverablesQuery, useGetDeliverableTaskByIdQuery, useGetDeliverableTasksQuery, useGetExtraCostByIdQuery, useGetInvoicesQuery, useGetMyInvoicesQuery, useUpdateDeliverableMutation, useUpdateDeliverableTaskMutation, useUpdateExtraCostMutation, useUpdateProjectMutation } from '@/services';
import { useGetCommentsQuery } from '@/services/projectService/comment';
import { useAppSelector } from '@/store';

interface ProjectQueryParams {
  type?: string;
  status?: string;
  priority?: string;
  currency?: string;
  pageNumber?: number;
  pageSize?: number;
  searchKey?: string;
  totalActiveProjects?: number
  totalCompletedProjects?: number
  totalTasks?: number
}

interface InvoiceParams {
  status?: string;
  pageNumber?: number;
  pageSize?: number;
  searchKey?: string
}

export const useProjects = (params: ProjectQueryParams) => {
  const { loggedIn } = useAppSelector((state) => state?.auth);

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

export const useDeleteProject = () => {
const [deleteProject, { data, isLoading, error }] = useDeleteProjectMutation();
return {
  deleteProject,
  data,
  loading: isLoading,
  error,
};
 
};

export const useUpdateProject = () => {
  const [updateProject, { data, isLoading }] = useUpdateProjectMutation();

  return {
    updateProject,
    data,
    isLoading: isLoading,
  };
};

export const useProjectById = (projectId?: string) => {
  const { loggedIn } = useAppSelector((state) => state?.auth);
  const {
    data: allProjectsByIdData,
    isFetching: fetchingAllProjectsById,
    isLoading: loadingAllProjectsById,
    refetch: refetchAllProjectsById,
    error: allProjectError,
  } = useGetAllProjectsQuery({ projectId: projectId ?? '' },
    {
      refetchOnMountOrArgChange: true,
      skip: !loggedIn || !projectId,
    });
  return {
    allProjectsByIdData,
    loading: fetchingAllProjectsById || loadingAllProjectsById,
    refetchAllProjectsById,
    allProjectError,
  };
};

export const useDashboardSummaryCount = () => {
  const { loggedIn } = useAppSelector((state) => state?.auth);

  const {
    data: dashboardSummaryCountData,
    isFetching: fetchingDashboardSummaryCountData,
    isLoading: loadingDashboardSummaryCountData,
    refetch: refetchDashboardSummaryCountData,
    error: dashboardSummaryCountDataError,
  } = useGetDashboardSummaryCountQuery({
    refetchOnMountOrArgChange: true,
    skip: !loggedIn,
  });

  return {
    dashboardSummaryCountData,
    loading: fetchingDashboardSummaryCountData|| loadingDashboardSummaryCountData,
    refetchDashboardSummaryCountData,
    dashboardSummaryCountDataError,
  };
};

export const useDeliverable = (projectId?: string) => {
  const { loggedIn } = useAppSelector((state) => state?.auth);

  const {
    data: allDeliverablesData,
    isFetching: fetchingAllDeliverables,
    isLoading: loadingAllDeliverables,
    refetch: refetchAllDeliverables,
    error: allProjectError,
  } = useGetDeliverablesQuery({ projectId: projectId ?? '' },
    {
      refetchOnMountOrArgChange: true,
      skip: !loggedIn || !projectId,
    });

  return {
    allDeliverablesData,
    loading: fetchingAllDeliverables || loadingAllDeliverables,
    refetchAllDeliverables,
    allProjectError,
  };
};

export const useUpdateDeliverable = () => {
  const [updateDeliverable, { data, isLoading, error }] = useUpdateDeliverableMutation();

  return {
    updateDeliverable,
    data,
    loading: isLoading,
    error,
  };
};

export const useDeleteDeliverable = () => {
  const [deleteDeliverable, { data, isLoading, error }] = useDeleteDeliverableMutation();

  return {
    deleteDeliverable,
    data,
    loading: isLoading,
    error,
  };
}

export const useDeliverableById = (projectId?: string, deliverableId?: string) => {
  const { loggedIn } = useAppSelector((state) => state?.auth);
  const {
    data: allDeliverableIdData,
    isFetching: fetchingAllDeliverables,
    isLoading: loadingAllDeliverables,
    refetch: refetchAllDeliverables,
    error: allProjectError,
  } = useGetDeliverableByIdQuery({ projectId: projectId ?? '', deliverableId: deliverableId ?? '' },
    {
      refetchOnMountOrArgChange: true,
      skip: !loggedIn || !projectId || !deliverableId,
    });
  return {
    allDeliverableIdData,
    loading: fetchingAllDeliverables || loadingAllDeliverables,
    refetchAllDeliverables,
    allProjectError,
  };
}

export const useComment = (projectId?: string) => {
  const { loggedIn } = useAppSelector((state) => state?.auth);

  const {
    data: allCommentsData,
    isFetching: fetchingAllComments,
    isLoading: loadingAllComments,
    refetch: refetchAllComments,
    error: allCommentError,
  } = useGetCommentsQuery({ projectId: projectId ?? '' },
    {
      refetchOnMountOrArgChange: true,
      skip: !loggedIn || !projectId,
    });

  return {
    allCommentsData,
    loading: fetchingAllComments || loadingAllComments,
    refetchAllComments,
    allCommentError,
  };
}

export const useGetTask = (projectId?: string, deliverableId?: string) => {
  const { loggedIn } = useAppSelector((state) => state?.auth);

  const {
    data: allTasksData,
    isFetching: fetchingAllTasks,
    isLoading: loadingAllTasks,
    refetch: refetchAllTasks,
    error: allTaskError,
  } = useGetDeliverableTasksQuery({ projectId: projectId ?? '', deliverableId: deliverableId ?? '' },
    {
      refetchOnMountOrArgChange: true,
      skip: !loggedIn || !projectId || !deliverableId,
    });

  return {
    allTasksData,
    loading: fetchingAllTasks || loadingAllTasks,
    refetchAllTasks,
    allTaskError,
  };
}

export const useTasks = (projectId?: string, deliverableId?: string) => {
  const { loggedIn } = useAppSelector((state) => state?.auth);

  const {
    data: allTasksData,
    isFetching: fetchingAllTasks,
    isLoading: loadingAllTasks,
    refetch: refetchAllTasks,
    error: allTaskError,
  } = useGetDeliverableTasksQuery({ projectId: projectId ?? '', deliverableId: deliverableId ?? '' },
    {
      refetchOnMountOrArgChange: true,
      skip: !loggedIn || !projectId || !deliverableId,
    });

  return {
    allTasksData,
    loading: fetchingAllTasks || loadingAllTasks,
    refetchAllTasks,
    allTaskError,
  };
}

export const useGetTaskById = (projectId?: string, deliverableId?: string, taskId?: string) => {
  const { loggedIn } = useAppSelector((state) => state?.auth);

  const {
    data: allTaskByIdData,
    isFetching: fetchingAllTasks,
    isLoading: loadingAllTasks,
    refetch: refetchAllTasks,
    error: allTaskError,
  } = useGetDeliverableTaskByIdQuery({ projectId: projectId ?? '', deliverableId: deliverableId ?? '', taskId: taskId ?? '' },
    {
      refetchOnMountOrArgChange: true,
      skip: !loggedIn || !projectId || !deliverableId || !taskId,
    });

  return {
    allTaskByIdData,
    loading: fetchingAllTasks || loadingAllTasks,
    refetchAllTasks,
    allTaskError,
  };
}

export const updateTask = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [updateTask, { data, isLoading, error }] = useUpdateDeliverableTaskMutation();
  return {
    updateTask,
    data,
    loading: isLoading,
    error,
  };
}
export const useDeleteTask = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [deleteTask, { data, isLoading, error }] = useDeleteDeliverableTaskMutation();

  return {
    deleteTask,
    data,
    loading: isLoading,
    error,
  };
}

export const usePayment = (projectId?: string) => {
  const { loggedIn } = useAppSelector((state) => state?.auth);

  const {
    data: allPaymentsData,
    isFetching: fetchingAllPayments,
    isLoading: loadingAllPayments,
    refetch: refetchAllPayments,
    error: allPaymentError,
  } = useGetAllExtraCostsQuery(
    projectId ?? '',
    {
      refetchOnMountOrArgChange: true,
      skip: !loggedIn || !projectId,
    }
  );

  return {
    allPaymentsData,
    loading: fetchingAllPayments || loadingAllPayments,
    refetchAllPayments,
    allPaymentError,
  };
}

export const useDeletePayment = () => {
  const [deletePayment, { data, isLoading, error }] = useDeleteExtraCostMutation();

  return {
    deletePayment,
    data,
    loading: isLoading,
    error,
  };
}

export const useUpdatePayment = () => {
  const [updatePayment, { data, isLoading, error }] = useUpdateExtraCostMutation();

  return {
    updatePayment,
    data,
    loading: isLoading,
    error,
  };
}

export const usePaymentById = (projectId?: string, extraCostId?: string) => {
  const { loggedIn } = useAppSelector((state) => state?.auth);

  const {
    data: allPaymentByIdData,
    isFetching: fetchingAllPayments,
    isLoading: loadingAllPayments,
    refetch: refetchAllPayments,
    error: allPaymentError,
  } = useGetExtraCostByIdQuery(
    { projectId: projectId ?? '', extraCostId: extraCostId ?? '' },
    {
      refetchOnMountOrArgChange: true,
      skip: !loggedIn || !projectId || !extraCostId,
    }
  );

  return {
    allPaymentByIdData,
    loading: fetchingAllPayments || loadingAllPayments,
    refetchAllPayments,
    allPaymentError,
  };
}

export const useDeletePaymentSchedule = () => {
  const [deletePaymentSchedule, { data, isLoading, error }] = useDeleteExtraCostMutation();

  return {
    deletePaymentSchedule,
    data,
    loading: isLoading,
    error,
  };
}

export const usePaymentSchedule = (projectId?: string) => {
  const { loggedIn } = useAppSelector((state) => state?.auth);

  const {
    data: allPaymentScheduleData,
    isFetching: fetchingAllPaymentSchedule,
    isLoading: loadingAllPaymentSchedule,
    refetch: refetchAllPaymentSchedule,
    error: aallPaymentScheduleError,
  } = useGetAllPaymentScheduleQuery(
    projectId ?? '',
    {
      refetchOnMountOrArgChange: true,
      skip: !loggedIn || !projectId,
    }
  );

  return {
    allPaymentScheduleData,
    loading: fetchingAllPaymentSchedule|| loadingAllPaymentSchedule,
    refetchAllPaymentSchedule,
    aallPaymentScheduleError,
  };
};

export const useDeleteAgreement = () => { 
  const [deleteAgreement, { data, isLoading, error }] = useDeleteExtraCostMutation();

  return {
    deleteAgreement,
    data,
    loading: isLoading,
    error,
  };
}

export const useInvoices = (params: InvoiceParams) => {
  const { loggedIn } = useAppSelector((state) => state?.auth);

  const cleanedFilters = Object.fromEntries(
    Object.entries(params).filter(([, value]) =>
      Boolean(Array.isArray(value) ? value.length > 0 : value),
    ),
  );

  const {
    data: allInvoicesData,
    isFetching: fetchingAllInvoices,
    isLoading: loadingAllInvoices,
    refetch: refetchAllInvoices,
    error: allInvoicesError,
  } = useGetInvoicesQuery(cleanedFilters, {
    refetchOnMountOrArgChange: true,
    skip: !loggedIn,
  });

  return {
    allInvoicesData,
    loading: fetchingAllInvoices || loadingAllInvoices,
    refetchAllInvoices,
    allInvoicesError,
  };
};

export const useInvoicesById = (invoiceId?: string) => {
  const { loggedIn } = useAppSelector((state) => state?.auth);
  const {
    data: allInvoicesByIdData,
    isFetching: fetchingAllInvoicesById,
    isLoading: loadingAllInvoicesById,
    refetch: refetchAllInvoicesById,
    error: allInvoicesError,
  } = useGetMyInvoicesQuery( invoiceId ?? '', {
      refetchOnMountOrArgChange: true,
      skip: !loggedIn || !invoiceId,
    });
  return {
    allInvoicesByIdData,
    loading: fetchingAllInvoicesById || loadingAllInvoicesById,
    refetchAllInvoicesById,
    allInvoicesError,
  };
};


