import config from '@/lib/config';
import { getLocalStorage } from '@/services';
import type { IRoles } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

interface IAuth {
  loggedIn: boolean
  role: IRoles | null
}

const userDetails = getLocalStorage(config.tokenKey);

const initialState: IAuth = {
  loggedIn: !!userDetails?.accessToken || false,
  role: null
};

export const authSlice = createSlice({
  initialState,
  name: 'auth',
  reducers: {
    loginSuccess: (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loggedIn: true,
        user: payload
      };
    },

    logout: () => initialState,
  },
});

export const { logout, loginSuccess } = authSlice.actions;

export default authSlice.reducer;
