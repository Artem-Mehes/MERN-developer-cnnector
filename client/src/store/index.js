import { configureStore } from '@reduxjs/toolkit';

import auth from './auth';
import snackbar from './snackbar';

export const store = configureStore({
  reducer: {
    auth,
    snackbar,
  },
});
