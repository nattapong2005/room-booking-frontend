import api from '../utils/api';

export const authService = {
  login: (credentials: any) => api.post('/auth/login', credentials),
};
