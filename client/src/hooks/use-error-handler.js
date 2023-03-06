import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { enqueueSnackbar } from 'store/snackbar';

export const useErrorHandler = (errors) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (errors) {
      errors.forEach((error) => {
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
    }
  }, [errors, dispatch]);
};
