import api from '../utils/api';

export const departmentService = {
  getAllDepartments: () => api.get('/departments'),
  createDepartment: (name: string) => api.post('/departments', { name }),
  deleteDepartment: (id: string | number) => api.delete(`/departments/${id}`),
};
