import config from '@/lib/config';
import { getLocalStorage } from '@/services';
import { createSlice } from '@reduxjs/toolkit';

interface IAuth {
  loggedIn: boolean
}

const userDetails = getLocalStorage(config.tokenKey);

const initialState: IAuth = {
  loggedIn: !!userDetails?.accessToken || false,
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
        user: payload,
      };
    },

    logout: () => initialState,
  },
});

export const { logout, loginSuccess } = authSlice.actions;

export default authSlice.reducer;
