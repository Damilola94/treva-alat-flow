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
}

const userDetails = getCookie('_tk') || getLocalStorage(config.tokenKey);

const initialState: IAuth = {
  loggedIn: !!userDetails?.accessToken || false,
  role: null,
  expiry: '',
  userId: '',
  email: '',
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
  },
});

export const { logout, loginSuccess } = authSlice.actions;

export default authSlice.reducer;
