import { apiInstance } from './instance';

export const signUp = (data) =>
  apiInstance.post('/users', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const signIn = (data) =>
  apiInstance.post('/auth', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const getUser = () => apiInstance.get('/auth');
