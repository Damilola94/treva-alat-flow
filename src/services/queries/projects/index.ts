import { useMutation, useQuery, useQueryClient } from 'react-query';

import api from '../../api';
import {
  errorToast,
  handleErrors,
  successToast
} from '../../helper';
import queryKey from './keys';
import { type AxiosError } from 'axios';
import config from '@/lib/config';
import { type ProjectManagement } from './types';
import { ProjectType } from './enums';

const BASE_URL = config.services;

const useCreate = (options: { onSuccess?: (response: any) => void }) => {
  const {
    onSuccess = () => { }
  } = options;

  const queryClient = useQueryClient();
  const { mutate, ...response } = useMutation(api.post, {
    mutationKey: [queryKey.create],
    ...options,
    onSuccess: async (data) => { // data is the actual API response
      onSuccess(data); // Pass API response to onSuccess
      await queryClient.invalidateQueries({
        queryKey: [queryKey.read]
      });

      successToast('Project added');
    },
    onError: (err: AxiosError) => {
      errorToast(handleErrors(err));
    }
  });

  interface Body {
    title: string
    description: string
    expectedDeliveryDate: string
    priority: string
    totalAmount?: string
    clientId?: string
    projectType: string
  }

  return {
    ...response,
    mutate: (body: Body) => {
      const requestBody = {
        title: body.title,
        description: body.description,
        projectType: body.projectType,
        expectedDeliveryDate: body.expectedDeliveryDate,
        priority: body.priority,
        ...(body.projectType === ProjectType.ClientProject && {
          totalAmount: body.totalAmount,
          clientId: body.clientId
        })
      };

      mutate({
        url: `${BASE_URL.project}`,
        body: requestBody,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  };
};

const useRead = ({ pageNumber = 1, pageSize = 50, search = '', userId = '', organizationId = '', forCurrentUser = '', projectType = '' } = {}, options = {}) => {
  const response = useQuery(
    [queryKey.read, pageNumber, pageSize],
    async () => {
      const queryParams = new URLSearchParams()
      if (userId) queryParams.append('UserId', String(userId))
      if (organizationId) queryParams.append('OrganizationId', String(organizationId))
      if (forCurrentUser) queryParams.append('ForCurrentUser', String(forCurrentUser))
      if (projectType) queryParams.append('ProjectType', String(projectType))
      queryParams.append('PageNumber', pageNumber.toString())
      queryParams.append('PageSize', pageSize.toString())
      if (search) queryParams.append('SearchKey', search);

      const url = `${BASE_URL.project}?${queryParams.toString()}`
      return await api.get({ url })
    },
    {
      ...options,
      onSuccess: () => { },
      onError: (err: AxiosError) => {
        errorToast(handleErrors(err))
      }
    }
  )

  return {
    ...response,
    data: (response.data?.data || []) as ProjectManagement[],
    metaData: response.data?.metaData
  }
}

const useReadOne = ({ projectId = '', pageNumber = 1, pageSize = 50 } = {}, options = {}) => {
  const url = `${BASE_URL.project}/${projectId}`

  const response = useQuery(
    [queryKey.readOne, projectId, pageNumber, pageSize], async () => await api.get({ url }),
    {
      ...options,
      enabled: !!projectId,
      onSuccess: () => { },
      onError: (err: AxiosError) => {
        errorToast(handleErrors(err))
      }
    }
  )

  return {
    ...response,
    // data: response.data?.data as ProjectManagement | undefined,
    data: response.data?.data || [],

    metaData: response.data?.metaData
  }
}

const useUpdate = (options: { onSuccess?: (response: any) => void }) => {
  const {
    onSuccess = () => { }
  } = options;
  const queryClient = useQueryClient();
  const { mutate, ...response } = useMutation(api.put, {
    mutationKey: [queryKey.update],
    ...options,
    onSuccess: async (data) => {
      onSuccess(data);
      await queryClient.invalidateQueries({
        queryKey: [queryKey.read]
      });
      successToast('Project updated');
    },
    onError: (err: AxiosError) => {
      errorToast(handleErrors(err));
    }
  });

  interface Body {
    projectId: string
    title?: string
    description?: string
    expectedDeliveryDate?: string
    priority?: string
    totalAmount?: string
    clientId?: string
    projectType: string
  }

  return {
    ...response,
    mutate: (body: Body) => {
      const requestBody = {
        projectId: body.projectId,
        title: body?.title,
        description: body?.description,
        projectType: body?.projectType,
        expectedDeliveryDate: body?.expectedDeliveryDate,
        priority: body?.priority,
        ...(body.projectType === ProjectType.ClientProject && {
          totalAmount: body?.totalAmount,
          clientId: body?.clientId
        })
      };

      mutate({
        url: `${BASE_URL.project}/${body.projectId}`,
        body: requestBody,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  };
};

const useDelete = (options: { onSuccess: () => void }) => {
  const {
    onSuccess = () => { }
  } = options
  const queryClient = useQueryClient()

  const { mutate, ...response } = useMutation(api.delete, {
    mutationKey: [queryKey.delete],
    ...options,
    onSuccess: async () => {
      onSuccess()
      await queryClient.invalidateQueries({
        queryKey: [queryKey.read]
      })
      successToast('Project deleted')
    },
    onError: (err: AxiosError) => {
      errorToast(handleErrors(err))
    }
  })

  interface Body {
    projectId: string
  }
  return {
    ...response,
    mutate: (body: Body) => {
      mutate({
        url: `${BASE_URL.project}/${body.projectId}`,
        body,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  }
}

const useCreateTasks = (options: { onSuccess?: (response: any) => void }) => {
  const {
    onSuccess = () => { }
  } = options

  const queryClient = useQueryClient()
  const { mutate, ...response } = useMutation(api.post, {
    mutationKey: [queryKey.createTasks],
    ...options,
    onSuccess: async (data) => {
      onSuccess(data)
      await queryClient.invalidateQueries({
        queryKey: [queryKey.readTasks]
      })

      successToast('Task Created')
    },
    onError: (err: AxiosError) => {
      errorToast(handleErrors(err))
    }
  })

  interface Body {
    projectId: string
    taskName: string
    startDate: string
    dueDate: string
    taskPriority: string

  }

  return {
    ...response,
    mutate: (body: Body) => {
      const requestBody = {
        projectId: body.projectId,
        taskName: body.taskName,
        startDate: body.startDate,
        dueDate: body.dueDate,
        taskPriority: body.taskPriority
      };

      mutate({
        url: `${BASE_URL.project}/${body.projectId}/tasks`,
        body: requestBody,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  };
};

const useReadTasks = ({ projectId = '' } = {}, options = {}) => {
  const response = useQuery(
    [queryKey.readTasks, projectId],
    async () => {
      const queryParams = new URLSearchParams()
      queryParams.append('ProjectId', projectId)
      // queryParams.append('PageNumber', pageNumber.toString())
      // queryParams.append('PageSize', pageSize.toString())
      // if (search) queryParams.append('SearchKey', search);

      const url = `${BASE_URL.project}/${projectId}/tasks?${queryParams.toString()}`
      console.log('API URL:', url)
      return await api.get({ url })
    },
    {
      ...options,
      onSuccess: () => { },
      onError: (err: AxiosError) => {
        errorToast(handleErrors(err))
      }
    }
  )

  return {
    ...response,
    // data: (response.data || undefined) as ApiResponse<ProjectManagement[]> | undefined,
    data: response.data?.data || [],
    metaData: response.data?.metaData
  }
}

const useReadTasksOne = ({ projectId = '', taskId = '', pageNumber = 1, pageSize = 50 } = {}, options = {}) => {
  const url = `${BASE_URL.project}/${projectId}/tasks/${taskId}`

  const response = useQuery(
    [queryKey.readTasksOne, projectId, taskId, pageNumber, pageSize], async () => await api.get({ url }),
    {
      ...options,
      enabled: !!(projectId && taskId),
      onSuccess: () => { },
      onError: (err: AxiosError) => {
        errorToast(handleErrors(err))
      }
    }
  )

  return {
    ...response,
    data: response.data?.data as ProjectManagement | undefined,
    metaData: response.data?.metaData
  }
}

const useUpdateTasks = (taskId: any, options: { onSuccess: () => void }) => {
  const {
    onSuccess = () => { }
  } = options;
  const queryClient = useQueryClient();
  const { mutate, ...response } = useMutation(api.put, {
    mutationKey: [queryKey.updateTasks],
    ...options,
    onSuccess: async () => {
      onSuccess();
      await queryClient.invalidateQueries({
        queryKey: [queryKey.readTasks, taskId]
      });
      successToast('Project updated');
    },
    onError: (err: AxiosError) => {
      errorToast(handleErrors(err));
    }
  });

  interface Body {
    id: string
    taskId: string
    taskName: string
    startDate: string
    dueDate: string
    taskPriority: string
    taskStatus: string
  }

  return {
    ...response,
    mutate: (body: Body) => {
      const formData = new FormData();
      formData.append('ProjectId', body.id);
      formData.append('TaskId', body.taskId);
      formData.append('TaskName', body.taskName);
      formData.append('StartDate', body.startDate);
      formData.append('DueDate', body.dueDate);
      formData.append('TaskPriority', body.taskPriority);
      formData.append('TaskStatus', body.taskStatus);

      mutate({
        url: `${BASE_URL.project}/${body.id}/tasks/${taskId}`,
        body: formData,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  };
};

const useDeleteTasks = (options: { onSuccess: () => void }) => {
  const {
    onSuccess = () => { }
  } = options
  const queryClient = useQueryClient()

  const { mutate, ...response } = useMutation(api.delete, {
    mutationKey: [queryKey.deleteTasks],
    ...options,
    onSuccess: async () => {
      onSuccess()
      await queryClient.invalidateQueries({
        queryKey: [queryKey.readTasks]
      })
      successToast('Project deleted')
    },
    onError: (err: AxiosError) => {
      errorToast(handleErrors(err))
    }
  })
  return {
    ...response,
    mutate: (projectId: string, taskId: string) => {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      mutate({
        url: `${BASE_URL.project}/${projectId}/tasks/${taskId}`,
        ...config
      })
    }
  }
}

const useCreateDeliverables = (options: { onSuccess?: (response: any) => void }) => {
  const {
    onSuccess = () => { }
  } = options

  const queryClient = useQueryClient()
  const { mutate, ...response } = useMutation(api.post, {
    mutationKey: [queryKey.createDeliverables],
    ...options,
    onSuccess: async (data) => {
      onSuccess(data)
      await queryClient.invalidateQueries({
        queryKey: [queryKey.readDeliverables]
      })

      successToast('Deliverable Created')
    },
    onError: (err: AxiosError) => {
      errorToast(handleErrors(err))
    }
  })

  interface Body {
    projectId: string
    deliverableName: string
    description: string
    startDate: string
    dueDate: string
    amount: string

  }

  return {
    ...response,
    mutate: (body: Body) => {
      const requestBody = {
        projectId: body.projectId,
        deliverableName: body.deliverableName,
        description: body.description,
        startDate: body.startDate,
        dueDate: body.dueDate,
        amount: body.amount
      };

      mutate({
        url: `${BASE_URL.project}/${body.projectId}/deliverables`,
        body: requestBody,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  };
};

const useReadDeliverables = ({ projectId = '' } = {}, options = {}) => {
  const response = useQuery(
    [queryKey.readDeliverables, projectId],
    async () => {
      const queryParams = new URLSearchParams()
      queryParams.append('ProjectId', projectId)

      // queryParams.append('PageNumber', pageNumber.toString())
      // queryParams.append('PageSize', pageSize.toString())
      // if (search) queryParams.append('SearchKey', search);

      const url = `${BASE_URL.project}/${projectId}/deliverables?${queryParams.toString()}`
      return await api.get({ url })
    },
    {
      ...options,
      onSuccess: () => { },
      onError: (err: AxiosError) => {
        errorToast(handleErrors(err))
      }
    }
  )

  return {
    ...response,
    // data: (response.data || undefined) as ApiResponse<ProjectManagement[]> | undefined,
    // data: (response.data?.data || []) as ProjectManagement[],
    data: response.data?.data || [],
    metaData: response.data?.metaData
  }
}

const useReadDeliverablesOne = ({ projectId = '', deliverableId = '', pageNumber = 1, pageSize = 50 } = {}, options = {}) => {
  const url = `${BASE_URL.project}/${projectId}/deliverables/${deliverableId}`

  const response = useQuery(
    [queryKey.readOneDeliverables, projectId, deliverableId, pageNumber, pageSize], async () => await api.get({ url }),
    {
      ...options,
      enabled: !!(projectId && deliverableId),
      onSuccess: () => { },
      onError: (err: AxiosError) => {
        errorToast(handleErrors(err))
      }
    }
  )

  return {
    ...response,
    // data: response.data?.data as ProjectManagement | undefined,
    data: response.data?.data || [],
    metaData: response.data?.metaData
  }
}

const useUpdateDeliverables = ({ deliverableId = '', projectId = '' } = {}, options: { onSuccess: () => void }) => {
  const {
    onSuccess = () => { }
  } = options;
  const queryClient = useQueryClient();
  const { mutate, ...response } = useMutation(api.put, {
    mutationKey: [queryKey.updateDeliverables],
    ...options,
    onSuccess: async () => {
      onSuccess();
      await queryClient.invalidateQueries({
        queryKey: [queryKey.readDeliverables, deliverableId, projectId]
      });
      successToast('Deliverables updated');
    },
    onError: (err: AxiosError) => {
      errorToast(handleErrors(err));
    }
  });

  interface Body {
    projectId: string
    deliverableId: string
    deliverableName: string
    description: string
    startDate: string
    dueDate: string
    amount: string

  }

  return {
    ...response,
    mutate: (body: Body) => {
      const requestBody = {
        projectId: body.projectId,
        deliverableId: body.deliverableId,
        deliverableName: body.deliverableName,
        description: body.description,
        startDate: body.startDate,
        dueDate: body.dueDate,
        amount: body.amount
      };

      mutate({
        url: `${BASE_URL.project}/${body.projectId}/deliverables/${body.deliverableId}`,
        body: requestBody,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  };
};

const useDeleteDeliverables = ({ deliverableId = '', projectId = '' } = {}, options: { onSuccess: () => void }) => {
  const { onSuccess = () => {} } = options;
  const queryClient = useQueryClient();

  const { mutate, ...response } = useMutation(api.delete, {
    mutationKey: [queryKey.deleteDeliverables, deliverableId, projectId],
    ...options,
    onSuccess: async () => {
      onSuccess();
      await queryClient.invalidateQueries({
        queryKey: [queryKey.readDeliverables]
      });
      successToast('Deliverables deleted');
    },
    onError: (err: AxiosError) => {
      errorToast(handleErrors(err));
    }
  });

  interface Body {
    projectId: string
    deliverableId: string
  }

  return {
    ...response,
    mutate: (body: Body) => {
      const requestBody = {
        projectId: body.projectId,
        deliverableId: body.deliverableId
      };

      mutate({
        url: `${BASE_URL.project}/${body.projectId}/deliverables/${body.deliverableId}`,
        body: requestBody,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  };
};

const useCreatePayment = (options: { onSuccess?: (response: any) => void }) => {
  const {
    onSuccess = () => { }
  } = options

  const queryClient = useQueryClient()
  const { mutate, ...response } = useMutation(api.post, {
    mutationKey: [queryKey.createPayment],
    ...options,
    onSuccess: async (data) => {
      onSuccess(data)
      await queryClient.invalidateQueries({
        queryKey: [queryKey.readPayment]
      })

      successToast('Payment Created')
    },
    onError: (err: AxiosError) => {
      errorToast(handleErrors(err))
    }
  })

  interface Body {
    projectId: string
    perRequired: string
    dueDate: string
    reminderFrequency: string

  }

  return {
    ...response,
    mutate: (body: Body) => {
      const requestBody = {
        projectId: body.projectId,
        perRequired: body.perRequired,
        dueDate: body.dueDate,
        reminderFrequency: body.reminderFrequency
      };

      mutate({
        url: `${BASE_URL.project}/${body.projectId}/payments`,
        body: requestBody,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  };
};

const useCreateAgreement = (options: { onSuccess?: (response: any) => void }) => {
  const { onSuccess = () => {} } = options;

  const queryClient = useQueryClient();
  const { mutate, ...response } = useMutation(api.put, {
    mutationKey: [queryKey.updateAgreement], // Ensure this key is correct
    ...options,
    onSuccess: async (data) => {
      onSuccess(data);
      await queryClient.invalidateQueries({
        queryKey: [queryKey.readAgreement]
      });

      successToast('Agreement Created');
    },
    onError: (err: AxiosError) => {
      errorToast(handleErrors(err));
    }
  });

  interface Body {
    projectId: string
    projectAgreementUrl?: File | null
  }

  return {
    ...response,
    mutate: (body: Body) => {
      const formData = new FormData();
      if (body.projectAgreementUrl) {
        formData.append('AgreementFile', body.projectAgreementUrl);
      }
      formData.append('ProjectId', body.projectId);

      mutate({
        body: formData,
        url: `${BASE_URL.project}/${body.projectId}/agreements`,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
  };
};

const useDeleteAgreement = ({ projectId = '' } = {}, options: { onSuccess: () => void }) => {
  const { onSuccess = () => {} } = options;
  const queryClient = useQueryClient();

  const { mutate, ...response } = useMutation(api.delete, {
    mutationKey: [queryKey.deleteAgreement, projectId],
    ...options,
    onSuccess: async () => {
      onSuccess();
      await queryClient.invalidateQueries({
        queryKey: [queryKey.readAgreement]
      });
      successToast('Agreement deleted');
    },
    onError: (err: AxiosError) => {
      errorToast(handleErrors(err));
    }
  });

  interface Body {
    projectId: string
  }

  return {
    ...response,
    mutate: (body: Body) => {
      const requestBody = {
        projectId: body.projectId
      };

      mutate({
        url: `${BASE_URL.project}/${body.projectId}/agreements`,
        body: requestBody,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  };
};

const queries = { create: useCreate, read: useRead, update: useUpdate, delete: useDelete, readone: useReadOne, createTasks: useCreateTasks, readTasks: useReadTasks, readTasksOne: useReadTasksOne, updateTasks: useUpdateTasks, deleteTasks: useDeleteTasks, createDeliverables: useCreateDeliverables, readDeliverables: useReadDeliverables, readDeliverablesOne: useReadDeliverablesOne, updateDeliverables: useUpdateDeliverables, deleteDeliverables: useDeleteDeliverables, createPayment: useCreatePayment, updateAgreement: useCreateAgreement, deleteAgreement: useDeleteAgreement };

export default queries;
