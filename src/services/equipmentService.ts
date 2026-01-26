import api from '../utils/api';

export const equipmentService = {
  getAllEquipments: () => api.get('/equipments'),
  createEquipment: (data: any) => api.post('/equipments', data),
  updateEquipment: (id: string | number, data: any) => api.put(`/equipments/${id}`, data),
  deleteEquipment: (id: string | number) => api.delete(`/equipments/${id}`),
};
