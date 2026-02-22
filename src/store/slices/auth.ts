import config from '@/lib/config';
import { getLocalStorage } from '@/services';
import type { IRoles } from '@/types';
import { getCookie } from '@/utils';
import { createSlice } from '@reduxjs/toolkit';

interface IAuth {
  loggedIn: boolean;
  role: IRoles[] | null;
  expiry: string;
  userId: string;
  email: string;
  isOnboardingCompleted: boolean;
}

const accessToken = getCookie('_tk');
const fallbackAccessToken = getLocalStorage(config.tokenKey);

const initialState: IAuth = {
  loggedIn: !!accessToken || !!fallbackAccessToken?.accessToken || false,
  role: null,
  expiry: '',
  userId: '',
  email: '',
  isOnboardingCompleted: false,
};

export const authSlice = createSlice({
  initialState,
  name: 'auth',
  reducers: {
    loginSuccess: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        ...payload,
        loggedIn: true,
      };
    },

    logout: () => initialState,
    setOnboardingStatus: (state, action) => {
      state.isOnboardingCompleted = action.payload;
    },
  },
});

export const { logout, loginSuccess, setOnboardingStatus } = authSlice.actions;

export default authSlice.reducer;
