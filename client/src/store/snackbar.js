import { createSlice, nanoid } from '@reduxjs/toolkit';

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState: { notifications: [] },
  reducers: {
    enqueueSnackbar: {
      reducer: (state, { payload }) => {
        state.notifications.push(payload);
      },
      prepare: (payload) => ({ payload: { ...payload, id: nanoid() } }),
    },
    closeSnackbar: {
      reducer: (state, action) => {
        const { payload } = action;
        state.notifications = state.notifications.map((notification) => {
          const shouldDismiss =
            payload.dismissAll || notification.id === payload.id;
          return shouldDismiss
            ? { ...notification, dismissed: true }
            : { ...notification };
        });
      },
      prepare: (id) => ({ payload: { id, dismissAll: !id } }),
    },
    removeSnackbar: (state, { payload }) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== payload
      );
    },
  },
});

export const {
  actions: { enqueueSnackbar, closeSnackbar, removeSnackbar },
} = snackbarSlice;

export default snackbarSlice.reducer;
