import api from '../utils/api';

export const roomService = {
  getAllRooms: () => api.get('/rooms'),
  getRoomById: (id: string | number) => api.get(`/rooms/${id}`),
  createRoom: (data: any) => {
    if (data instanceof FormData) {
      return api.post('/rooms', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.post('/rooms', data);
  },
  updateRoom: (id: string | number, data: any) => {
    if (data instanceof FormData) {
      return api.put(`/rooms/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.put(`/rooms/${id}`, data);
  },
  deleteRoom: (id: string | number) => api.delete(`/rooms/${id}`),
};
