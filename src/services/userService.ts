import api from '../utils/api';

export const userService = {
  getAllUsers: () => api.get('/users'),
  createUser: (data: any) => api.post('/users', data),
  updateUser: (id: string | number, data: any) => api.put(`/users/${id}`, data),
  deleteUser: (id: string | number) => api.delete(`/users/${id}`),
};
