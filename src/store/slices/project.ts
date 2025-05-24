import { createSlice } from "@reduxjs/toolkit";

interface ProjectState {
  title: string;
  description: string;
  deliverableDescription: string;
  startDate: string;
  expectedDeliveryDate: string;
  type: string;
  priority?: string;
  clientUserId?: string;
  projectId: string;
  name: string;
  endDate: string;
  dueDate: string;
  unitAmount: string;
  unit: string;
  id: string;
  createdDate: string;
  isDeleted?: boolean;
  deletedDate?: string;
  deletedBy?: string;
  documentUrl: string;
  deliverableId?: string;
  status?: string;
}

const initialState: ProjectState = {
  title: '',
  description: '',
  deliverableDescription: '',
  startDate: '',
  expectedDeliveryDate: '',
  type: '',
  projectId: '',
  name: '',
  endDate: '',
  dueDate: '',
  unitAmount: '',
  unit: '',
  id: '',
  createdDate: '',
  documentUrl: ''
}

export const projectSlice = createSlice({
  initialState,
  name: 'project',
  reducers: {
    storeValues: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        ...payload,
      };
    },
    clearValues: () => {
      return initialState;
    },
  },
});

export const { storeValues, clearValues } = projectSlice.actions;
export default projectSlice.reducer;
