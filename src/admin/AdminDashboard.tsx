import { useState, useEffect } from 'react';
import { Alert } from '../utils/sweetAlert';
import { bookingService } from '../services/bookingService';

export interface BookingRequest {
  id: string;
  roomName: string;
  userName: string;
  department: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  participants: number | string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllBookings();
      // Backend returns array of Booking
      const mappedRequests: BookingRequest[] = response.data.map((b: any) => {
        const start = new Date(b.startTime);
        const end = new Date(b.endTime);
        return {
          id: b.id,
          roomName: b.room?.name || 'Unknown Room',
          userName: b.bookerName || b.user?.fullName || 'Unknown User',
          department: b.departments?.name || b.department || b.user?.role || '-',
          date: start.toLocaleDateString('th-TH'),
          startTime: start.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
          endTime: end.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
          reason: b.purpose,
          status: b.status.toLowerCase(),
          participants: b.participants || '-',
          timestamp: b.createdAt
        };
      });
      setRequests(mappedRequests);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      Alert.error('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลการจองได้');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    const result = await Alert.confirm('ยืนยันการอนุมัติ', 'คุณต้องการอนุมัติการจองนี้ใช่หรือไม่?');
    if (result.isConfirmed) {
      try {
        await bookingService.approveBooking(id, "Approved by Admin");
        setRequests(requests.map(req => 
          req.id === id ? { ...req, status: 'approved' } : req
        ));
        Alert.success('อนุมัติสำเร็จ', 'การจองได้รับการอนุมัติเรียบร้อยแล้ว');
      } catch (error: any) {
        Alert.error('ผิดพลาด', error.response?.data?.message || 'ไม่สามารถอนุมัติได้');
      }
    }
  };

  const handleReject = async (id: string) => {
    const result = await Alert.confirm('ยืนยันการไม่อนุมัติ', 'คุณต้องการไม่อนุมัติการจองนี้ใช่หรือไม่?', 'ไม่อนุมัติ', true);
    if (result.isConfirmed) {
      try {
        await bookingService.rejectBooking(id, "Rejected by Admin");
        setRequests(requests.map(req => 
          req.id === id ? { ...req, status: 'rejected' } : req
        ));
        Alert.success('ดำเนินการสำเร็จ', 'การจองถูกปฏิเสธเรียบร้อยแล้ว');
      } catch (error: any) {
        Alert.error('ผิดพลาด', error.response?.data?.message || 'ไม่สามารถปฏิเสธได้');
      }
    }
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const historyRequests = requests.filter(req => req.status !== 'pending');

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">จัดการคำขอจองห้องประชุม</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="text-blue-600 font-medium text-sm md:text-base">คำขอรอตรวจสอบ</div>
          <div className="text-2xl md:text-3xl font-bold text-blue-700">{pendingRequests.length}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="text-green-600 font-medium text-sm md:text-base">อนุมัติแล้ว</div>
          <div className="text-2xl md:text-3xl font-bold text-green-700">
            {requests.filter(r => r.status === 'approved').length}
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 sm:col-span-2 md:col-span-1">
          <div className="text-gray-600 font-medium text-sm md:text-base">ทั้งหมด</div>
          <div className="text-2xl md:text-3xl font-bold text-gray-700">{requests.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto scrollbar-hide">
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap ${
            activeTab === 'pending'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('pending')}
        >
          รอการอนุมัติ ({pendingRequests.length})
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap ${
            activeTab === 'history'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('history')}
        >
          ประวัติการดำเนินการ
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
            <div className="text-center py-8 text-gray-500">กำลังโหลดข้อมูล...</div>
        ) : activeTab === 'pending' ? (
          pendingRequests.length > 0 ? (
            pendingRequests.map((req) => (
              <BookingRequestCard 
                key={req.id} 
                request={req} 
                onApprove={handleApprove} 
                onReject={handleReject} 
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              ไม่มีคำขอจองที่รอการตรวจสอบ
            </div>
          )
        ) : (
          historyRequests.map((req) => (
            <BookingRequestCard 
              key={req.id} 
              request={req} 
              readonly 
            />
          ))
        )}
      </div>
    </div>
  );
}

function BookingRequestCard({ 
  request, 
  onApprove, 
  onReject, 
  readonly = false 
}: { 
  request: BookingRequest; 
  onApprove?: (id: string) => void; 
  onReject?: (id: string) => void;
  readonly?: boolean;
}) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const statusLabels = {
    pending: 'รออนุมัติ',
    approved: 'อนุมัติแล้ว',
    rejected: 'ไม่อนุมัติ',
    cancelled: 'ยกเลิก',
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-medium border ${statusColors[request.status]}`}>
              {statusLabels[request.status]}
            </span>
            <span className="text-[11px] md:text-sm text-gray-500">
              วันที่ส่งคำขอ: {new Date(request.timestamp).toLocaleDateString('th-TH')}
            </span>
          </div>
          
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1">
            {request.roomName}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[13px] md:text-sm text-gray-600 mt-3">
            <div className="flex items-start gap-2">
              <span className="font-medium text-gray-900 min-w-[70px] md:min-w-[80px]">ผู้จอง:</span>
              <span className="break-words">{request.userName} ({request.department})</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium text-gray-900 min-w-[70px] md:min-w-[80px]">วันเวลา:</span>
              <span>{request.date} {request.startTime}-{request.endTime}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium text-gray-900 min-w-[70px] md:min-w-[80px]">หัวข้อ:</span>
              <span className="break-words">{request.reason}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium text-gray-900 min-w-[70px] md:min-w-[80px]">จำนวนคน:</span>
              <span>{request.participants} คน</span>
            </div>
          </div>
        </div>

        {!readonly && onApprove && onReject && (
          <div className="flex flex-row md:flex-col gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-4">
            <button
              onClick={() => onApprove(request.id)}
              className="flex-1 px-3 py-2 bg-green-600 text-white text-xs md:text-sm font-medium rounded-md hover:bg-green-700 transition-colors shadow-sm min-w-[80px] md:min-w-[100px]"
            >
              อนุมัติ
            </button>
            <button
              onClick={() => onReject(request.id)}
              className="flex-1 px-3 py-2 bg-red-50 text-red-600 text-xs md:text-sm font-medium rounded-md hover:bg-red-100 transition-colors border border-red-200 min-w-[80px] md:min-w-[100px]"
            >
              ไม่อนุมัติ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
