import { useState, useEffect } from "react";
import { Trash2, Calendar, MapPin, Loader2 } from "lucide-react";
import { bookingService } from "../services/bookingService";
import { Alert } from "../utils/sweetAlert";

interface Booking {
  id: string;
  roomName: string;
  purpose: string;
  startTime: string;
  endTime: string;
  status: string;
}

export default function EditCancelBooking() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveBookings();
  }, []);

  const fetchActiveBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllBookings();
      const now = new Date();
      const active = response.data
        .filter((b: any) => {
          const end = new Date(b.endTime);
          return (
            (b.status === "PENDING" || b.status === "APPROVED") && 
            end > now
          );
        })
        .map((b: any) => ({
          id: b.id,
          roomName: b.room?.name || "ไม่ระบุห้อง",
          purpose: b.purpose,
          startTime: b.startTime,
          endTime: b.endTime,
          status: b.status,
        }));
      setBookings(active);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    const result = await Alert.confirm(
      "ยืนยันการยกเลิก",
      "คุณต้องการยกเลิกการจองนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้",
      "ยกเลิกการจอง",
      true
    );

    if (result.isConfirmed) {
      try {
        await bookingService.cancelBooking(id);
        Alert.success("ยกเลิกสำเร็จ", "การจองของคุณถูกยกเลิกแล้ว");
        fetchActiveBookings(); 
      } catch (error: any) {
        Alert.error("เกิดข้อผิดพลาด", error.response?.data?.message || "ไม่สามารถยกเลิกการจองได้");
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
        <p className="text-gray-400 font-medium text-xs">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">จัดการรายการจอง</h2>
          <p className="text-gray-500 text-sm mt-1">รายการจองในอนาคต</p>
        </div>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const start = new Date(booking.startTime);
            const end = new Date(booking.endTime);
            const dateStr = start.toLocaleDateString("th-TH", {
              day: 'numeric', month: 'short', year: 'numeric'
            });
            const timeStr = `${start.toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' })}`;

            return (
              <div key={booking.id} className="group bg-white rounded-2xl border border-gray-100 hover:border-rose-100 hover:shadow-md transition-all duration-200 p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <span className={`w-2 h-2 rounded-full ${booking.status === 'APPROVED' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                       <span className="text-xs font-medium text-gray-500">
                         {booking.status === 'APPROVED' ? 'อนุมัติแล้ว' : 'รออนุมัติ'}
                       </span>
                       <span className="text-gray-300 mx-1">•</span>
                       <span className="text-xs font-medium text-gray-500">{dateStr}</span>
                       <span className="text-gray-300 mx-1">•</span>
                       <span className="text-xs font-medium text-gray-500">{timeStr}</span>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-bold text-gray-800 line-clamp-1">{booking.purpose}</h3>
                      <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                         <MapPin size={14} className="text-gray-400" />
                         <span>{booking.roomName}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="w-full sm:w-auto px-4 py-2 bg-transparent text-rose-500 text-xs font-bold border border-rose-200 rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} />
                    ยกเลิก
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-700">ไม่มีรายการจอง</h3>
          <p className="text-gray-400 text-sm mt-1">ไม่มีรายการจองที่สามารถยกเลิกได้ในขณะนี้</p>
        </div>
      )}
    </div>
  );
}
