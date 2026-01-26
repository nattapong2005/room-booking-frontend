import api from '../utils/api';

export const bookingService = {
  getAllBookings: () => api.get('/bookings'),
  createBooking: (payload: any) => api.post('/bookings', payload),
  cancelBooking: (id: string | number) => api.post(`/bookings/${id}/cancel`),
  approveBooking: (id: string | number, comment: string) => api.post(`/bookings/${id}/approve`, { comment }),
  rejectBooking: (id: string | number, comment: string) => api.post(`/bookings/${id}/reject`, { comment }),
};
