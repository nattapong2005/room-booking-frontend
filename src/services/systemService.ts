import api from '../utils/api';

export const systemService = {
  getSystemConfig: () => api.get('/system-config'),
  updateSystemConfig: (data: any) => api.put('/system-config', data),
};
