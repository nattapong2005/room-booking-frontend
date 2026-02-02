import api from '../utils/api';

export const bookingService = {
  getAllBookings: () => api.get('/bookings'),
  getBookingById: (id: string | number) => api.get(`/bookings/${id}`),
  getBookingsByRoom: (roomId: string, date: string) => api.get(`/bookings/room/${roomId}?date=${date}`),
  createBooking: (payload: any) => api.post('/bookings', payload),
  updateBooking: (id: string | number, payload: any) => api.put(`/bookings/${id}`, payload),
  cancelBooking: (id: string | number) => api.post(`/bookings/${id}/cancel`),
  deleteBooking: (id: string | number) => api.delete(`/bookings/${id}`),
  approveBooking: (id: string | number, comment: string) => api.post(`/bookings/${id}/approve`, { comment }),
  rejectBooking: (id: string | number, comment: string) => api.post(`/bookings/${id}/reject`, { comment }),
};
