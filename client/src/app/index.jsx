import { useEffect } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { useDispatch, useSelector } from 'react-redux';

import { Navbar } from 'components';
import { useErrorHandler } from 'hooks';
import { getUser, selectAuth } from 'store/auth';

import * as Styles from './styles';
import { useNotifier } from './use-notifier';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, error } = useSelector(selectAuth);
  useErrorHandler(error);
  useNotifier();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUser());
    }
  }, [isAuthenticated]);

  return (
    <>
      <CssBaseline />

      <Styles.Container>
        <Navbar />
        <Toolbar />
        <Outlet />
      </Styles.Container>
    </>
  );
};

export default App;
