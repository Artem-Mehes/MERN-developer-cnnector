import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { selectAuth } from 'store/auth';

const Protected = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector(selectAuth);

  return isAuthenticated && !isLoading ? children : <Navigate to="/sign-in" />;
};

export { Protected };
