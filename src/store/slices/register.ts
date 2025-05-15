import { createSlice } from '@reduxjs/toolkit';

type ActorType = 'Client' | 'Creative' | '';
type AccountType = 'Individual' | 'Company';

interface RegisterState {
  actorType: ActorType;
  accountType: AccountType;
  email: string;
  fullName: string;
  middleName: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
}

const initialState: RegisterState = {
  actorType: '',
  accountType: 'Individual',
  email: '',
  fullName: '',
  middleName: '',
  countryCode: '',
  phoneNumber: '',
  password: '',
};

export const registerSlice = createSlice({
  initialState,
  name: 'register',
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

export const { storeValues, clearValues } = registerSlice.actions;
export default registerSlice.reducer;
