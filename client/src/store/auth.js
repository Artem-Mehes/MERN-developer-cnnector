import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import api from 'api';
import { createPayloadCreator } from './helpers';

const token = localStorage.getItem('token');

export const registerUser = createAsyncThunk(
  'auth/register',
  createPayloadCreator(api.auth.signUp)
);

export const getUser = createAsyncThunk(
  'auth/getUser',
  createPayloadCreator(api.auth.getUser)
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  createPayloadCreator(api.auth.signIn)
);

const initialState = {
  user: null,
  error: null,
  isLoading: false,
  token: token || null,
  isAuthenticated: Boolean(token),
};

const rejectReducer = (state, { payload }) => {
  localStorage.removeItem('token');
  state.isAuthenticated = false;
  state.isLoading = initialState.isLoading;
  state.error = payload;
  state.token = null;
  state.user = initialState.user;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: rejectReducer,
  },
  extraReducers: {
    [registerUser.pending]: (state) => {
      state.isLoading = true;
    },
    [registerUser.fulfilled]: (state, { payload }) => {
      localStorage.setItem('token', JSON.stringify(payload.token));
      state.error = null;
      state.isLoading = false;
      state.token = payload.token;
      state.isAuthenticated = true;
    },
    [registerUser.rejected]: rejectReducer,
    [getUser.pending]: (state) => {
      state.isLoading = true;
    },
    [getUser.fulfilled]: (state, { payload }) => {
      state.error = null;
      state.user = payload;
      state.isLoading = false;
    },
    [getUser.rejected]: rejectReducer,
    [signIn.pending]: (state) => {
      state.isLoading = true;
    },
    [signIn.fulfilled]: (state, { payload }) => {
      localStorage.setItem('token', JSON.stringify(payload.token));
      state.error = null;
      state.isLoading = false;
      state.token = payload.token;
      state.isAuthenticated = true;
    },
    [signIn.rejected]: rejectReducer,
  },
});

export const selectAuth = (state) => state?.auth;

export const { logout } = authSlice.actions;

export default authSlice.reducer;
