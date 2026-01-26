import { useState, useEffect } from "react";
import { AlertTriangle, Trash2, Calendar, Clock, MapPin } from "lucide-react";
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
      // Filter for PENDING or APPROVED and future dates
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
          roomName: b.room?.name || "Unknown Room",
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
        fetchActiveBookings(); // Refresh list
      } catch (error: any) {
        Alert.error("เกิดข้อผิดพลาด", error.response?.data?.message || "ไม่สามารถยกเลิกการจองได้");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="bg-white rounded-3xl p-5 md:p-8 shadow-xl border border-gray-100 animate-fade-in max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-rose-500 rounded-full"></div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">จัดการรายการจอง</h2>
        </div>
        <p className="text-gray-400 font-bold text-xs md:text-sm uppercase tracking-widest max-w-[300px] md:text-right">
          รายการที่สามารถยกเลิกได้ (เฉพาะรายการที่ยังมาไม่ถึง)
        </p>
      </div>

      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => {
            const start = new Date(booking.startTime);
            const end = new Date(booking.endTime);
            const dateStr = start.toLocaleDateString("th-TH", {
              year: 'numeric', month: 'long', day: 'numeric', weekday: 'short'
            });
            const timeStr = `${start.toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' })}`;

            return (
              <div key={booking.id} className="group relative bg-gray-50/50 rounded-3xl p-6 border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-rose-900/5 transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border shadow-sm ${
                            booking.status === 'APPROVED' 
                            ? 'bg-green-50 text-green-600 border-green-100' 
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                            {booking.status === 'APPROVED' ? 'อนุมัติแล้ว' : 'รออนุมัติ'}
                        </span>
                    </div>
                    
                    <h3 className="font-black text-xl text-gray-800 group-hover:text-rose-500 transition-colors leading-tight">
                      {booking.purpose}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                          <MapPin size={16} />
                        </div>
                        <span className="text-sm font-bold text-gray-600">{booking.roomName}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
                          <Calendar size={16} />
                        </div>
                        <span className="text-sm font-bold text-gray-600">{dateStr}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm sm:col-span-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                          <Clock size={16} />
                        </div>
                        <span className="text-sm font-bold text-gray-600">{timeStr}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="w-full md:w-auto px-8 py-4 bg-white border-2 border-rose-100 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest shadow-lg shadow-rose-900/5 active:scale-95"
                  >
                    <Trash2 size={18} />
                    ยกเลิกการจอง
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-6 transform -rotate-6">
            <AlertTriangle className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-black text-gray-800 tracking-tight">ไม่มีรายการจองที่สามารถยกเลิกได้</h3>
          <p className="text-gray-400 font-bold text-sm mt-2 uppercase tracking-widest">คุณไม่มีรายการจองในอนาคต</p>
        </div>
      )}
    </div>
  );
}
