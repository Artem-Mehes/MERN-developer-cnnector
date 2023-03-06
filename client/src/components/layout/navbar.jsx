import { Logout } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Tab,
  Tabs,
  AppBar,
  Toolbar,
  Container,
  Typography,
} from '@mui/material';

import { logout, selectAuth } from 'store/auth';

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector(selectAuth);

  return (
    <Container maxWidth="xl" sx={{ display: 'flex' }}>
      <AppBar component="nav" color="default">
        <Toolbar>
          {/*TODO: Link to home*/}
          <Typography
            to="/"
            variant="h5"
            color="inherit"
            component={Link}
            sx={{ textDecoration: 'none' }}
          >
            DevConnector
          </Typography>

          {!isLoading && (
            <Tabs value={location.pathname} sx={{ ml: 'auto' }}>
              <Tab
                to="/developers"
                component={Link}
                label="Developers"
                value="/developers"
              />
              {isAuthenticated ? (
                <Tab
                  label="Logout"
                  icon={<Logout />}
                  onClick={() => dispatch(logout())}
                />
              ) : (
                <>
                  <Tab
                    to="/sign-up"
                    label="Sign up"
                    component={Link}
                    value="/sign-up"
                  />
                  <Tab
                    to="/sign-in"
                    value="/sign-in"
                    label="Sign in"
                    component={Link}
                  />
                </>
              )}
            </Tabs>
          )}
        </Toolbar>
      </AppBar>
    </Container>
  );
};

export { Navbar };
