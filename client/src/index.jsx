import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { SnackbarProvider } from 'notistack';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import App from 'app';
import { store } from 'store';
import { Protected } from 'components';
import { Landing, SignUp, SignIn, Dashboard } from 'pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Landing />,
      },
      {
        path: 'sign-up',
        element: <SignUp />,
      },
      {
        path: 'developers',
        element: <div>Developers</div>,
      },
      {
        path: 'sign-in',
        element: <SignIn />,
      },
      {
        path: 'dashboard',
        element: (
          <Protected>
            <Dashboard />
          </Protected>
        ),
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <SnackbarProvider maxSnack={3}>
        <RouterProvider router={router} />
      </SnackbarProvider>
    </Provider>
  </React.StrictMode>
);
