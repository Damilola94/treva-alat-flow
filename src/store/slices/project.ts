import { createSlice, PayloadAction } from "@reduxjs/toolkit";


  interface projectIS  {
    title: string,
    description: string,
    expectedDeliveryDate: string,
    priority: string,
    // type: 'Client',
    clientUserId: string,
  };
interface ProjectState {
  title: string;
  description: string;
  deliverableDescription: string;
  startDate: string;
  expectedDeliveryDate: string;
  type: string;
  priority: string;
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
  paymentId?: string;
  paymentTitle: string;
  paymentAmount: string;
  paymentScheduleId: string;
  amount: string;
  paymentDescription?: string;
  currentStep: number;
  projectValues: projectIS
}

const initialState: ProjectState = {
  title: "",
  description: "",
  deliverableDescription: "",
  startDate: "",
  expectedDeliveryDate: "",
  type: "",
  projectId: "",
  name: "",
  endDate: "",
  dueDate: "",
  unitAmount: "",
  unit: "",
  id: "",
  createdDate: "",
  documentUrl: "",
  paymentId: "",
  paymentScheduleId: "",
  amount: "",
  paymentTitle: "",
  priority: "",
  clientUserId: "",
  deliverableId: "",
  currentStep: 1,
  paymentAmount: "",
  projectValues: {
    title: '',
    description: '',
    expectedDeliveryDate: '',
    priority: '',
    // type: 'Client',
    clientUserId: '',
  }
};

export const projectSlice = createSlice({
  initialState,
  name: "project",
  reducers: {
    storeValues: (state, action) => {
      const { payload } = action;
      state.projectValues = payload
      // {
      //   ...state,
      //   ...payload,
      // }
      // return {
      //   ...state,
      //   ...payload,
      // };
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },

    nextStep: (state) => {
      if (state.currentStep < 6) {
        state.currentStep += 1;
      }
    },

    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },

    clearValues: (state) => {
      return { ...initialState, currentStep: state.currentStep };
    },

    resetProject: () => initialState,

    // clearValues: () => {
    //   return initialState;
    // },
  },
});

export const {
  storeValues,
  setCurrentStep,
  nextStep,
  previousStep,
  clearValues,
  resetProject,
} = projectSlice.actions;
export default projectSlice.reducer;
