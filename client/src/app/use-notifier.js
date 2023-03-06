import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';

import { removeSnackbar } from 'store/snackbar';

let displayed = [];

const useNotifier = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (store) => store.snackbar.notifications || []
  );
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const storeDisplayed = (id) => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = (id) => {
    displayed = [...displayed.filter((key) => id !== key)];
  };

  useEffect(() => {
    notifications.forEach(
      ({ id, message, options = {}, dismissed = false }) => {
        if (dismissed) {
          closeSnackbar(id);
          return;
        }

        if (displayed.includes(id)) return;
        enqueueSnackbar(message, {
          id,
          ...options,
          onExited: (event, id) => {
            dispatch(removeSnackbar(id));
            removeDisplayed(id);
          },
        });
        storeDisplayed(id);
      }
    );
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

  return null;
};

export { useNotifier };
