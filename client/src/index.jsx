import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { SnackbarProvider } from 'notistack';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import App from './app';
import { store } from './store';
import { Landing, SignUp, SignIn } from './components';

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
