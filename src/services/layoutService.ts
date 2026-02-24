import api from '../utils/api';

export const layoutService = {
  getAllLayouts: () => api.get('/RoomLayouts'),
  getLayoutById: (id: string) => api.get(`/RoomLayouts/${id}`),
  createLayout: (name: string) => api.post('/RoomLayouts', { name }),
  updateLayout: (id: string, name: string) => api.put(`/RoomLayouts/${id}`, { name }),
  deleteLayout: (id: string) => api.delete(`/RoomLayouts/${id}`),
};
