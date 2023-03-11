import { useEffect } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Toolbar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Navbar } from 'components';
import { useErrorHandler } from 'hooks';
import { getUser, selectAuth } from 'store/auth';

import * as Styles from './styles';
import { useNotifier } from './use-notifier';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, error, user, isLoading } = useSelector(selectAuth);
  useErrorHandler(error);
  useNotifier();

  useEffect(() => {
    if (isAuthenticated && !user && !isLoading) {
      dispatch(getUser());
    }
  }, [isAuthenticated, user, isLoading]);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('dashboard');
    }
  }, [isAuthenticated, isLoading]);

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
