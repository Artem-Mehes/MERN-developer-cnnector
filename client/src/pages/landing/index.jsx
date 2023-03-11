import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Button, Container, Typography } from '@mui/material';

import * as Styles from './styles';

import { selectAuth } from 'store/auth';

const Landing = () => {
  const { isAuthenticated } = useSelector(selectAuth);

  return (
    <Styles.Container>
      <Container
        maxWidth="md"
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography
            variant="h2"
            color="common.white"
            sx={{ fontWeight: '600', textAlign: 'center' }}
          >
            Developer Connector
          </Typography>
          <Typography
            variant="h6"
            component="p"
            color="common.white"
            sx={{ textAlign: 'center' }}
          >
            Create a developer profile/portfolio, share posts and get help from
            other developers
          </Typography>
        </Box>

        {!isAuthenticated && (
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              size="large"
              to="sign-up"
              component={Link}
              variant="contained"
            >
              Sign Up
            </Button>
            <Button
              to="sign-in"
              size="large"
              color="inherit"
              component={Link}
              variant="contained"
            >
              Sign in
            </Button>
          </Box>
        )}
      </Container>
    </Styles.Container>
  );
};

export { Landing };
