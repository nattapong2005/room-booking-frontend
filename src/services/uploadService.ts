import api from '../utils/api';

export const uploadService = {
  uploadFile: (formData: FormData) => api.post('/rooms', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};
