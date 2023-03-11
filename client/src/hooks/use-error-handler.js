import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { enqueueSnackbar } from 'store/snackbar';

export const useErrorHandler = (error) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      if (Array.isArray(error)) {
        error.forEach((error) => {
          dispatch(
            enqueueSnackbar({
              message: error.msg,
              options: {
                variant: 'error',
                autoHideDuration: 3000,
              },
            })
          );
        });
      } else {
        dispatch(
          enqueueSnackbar({
            message: error.message,
            options: {
              variant: 'error',
              autoHideDuration: 3000,
            },
          })
        );
      }
    }

  }, [error, dispatch]);
};
