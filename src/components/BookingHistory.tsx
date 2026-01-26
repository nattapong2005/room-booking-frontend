import { useState, useEffect } from "react";
import { bookingService } from "../services/bookingService";

interface BookingRecord {
  id: string;
  roomName: string;
  title: string;
  date: string;
  time: string;
  status: "approved" | "pending" | "cancelled" | "rejected";
  department: string;
}

export default function BookingHistory() {
  const [historyData, setHistoryData] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getAllBookings();
      const bookings = response.data.map((b: any) => {
        const start = new Date(b.startTime);
        const end = new Date(b.endTime);
        return {
          id: b.id,
          roomName: b.room?.name || "ไม่ระบุห้อง",
          title: b.purpose,
          date: start.toLocaleDateString("th-TH"),
          time: `${start.toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' })}`,
          status: b.status.toLowerCase(),
          department: b.user?.fullName || "ไม่ระบุ", // Using user name as department/contact info
        };
      });
      setHistoryData(bookings);
    } catch (error) {
      console.error("Failed to fetch booking history:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: BookingRecord["status"]) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status: BookingRecord["status"]) => {
    switch (status) {
      case "approved":
        return "อนุมัติแล้ว";
      case "pending":
        return "รออนุมัติ";
      case "cancelled":
        return "ยกเลิกแล้ว";
      case "rejected":
        return "ไม่อนุมัติ";
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-8 shadow-xl border border-gray-100 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-purple-600 rounded-full"></div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">ประวัติการจองห้องประชุม</h2>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-green-100">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> อนุมัติ
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-100">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> รออนุมัติ
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-rose-100">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> ยกเลิก
          </span>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-400 border-b border-gray-100">
              <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">วันที่ / เวลา</th>
              <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">ห้องประชุม</th>
              <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">หัวข้อการประชุม</th>
              <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">ผู้จอง</th>
              <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-center">สถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
               <tr>
                 <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">กำลังโหลดข้อมูล...</p>
                    </div>
                 </td>
               </tr>
            ) : historyData.length > 0 ? (
              historyData.map((item) => (
                <tr key={item.id} className="hover:bg-purple-50/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="text-sm font-black text-gray-800">{item.date}</div>
                    <div className="text-xs font-bold text-gray-400 mt-0.5 tracking-tight">{item.time}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-lg border border-purple-100">
                      {item.roomName}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-semibold text-gray-600 line-clamp-2 max-w-xs">{item.title}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-black text-gray-400 border border-gray-200 uppercase">
                        {item.department.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-gray-600">{item.department}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border ${getStatusStyle(item.status)}`}>
                      {getStatusLabel(item.status)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">ไม่พบประวัติการจอง</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="py-12 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">กำลังโหลด...</p>
          </div>
        ) : historyData.length > 0 ? (
          historyData.map((item) => (
            <div key={item.id} className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.date}</div>
                  <div className="text-xs font-black text-gray-800 tracking-tight">{item.time}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-sm ${getStatusStyle(item.status)}`}>
                  {getStatusLabel(item.status)}
                </span>
              </div>
              
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">ห้องประชุม</div>
                <div className="text-sm font-black text-gray-800">{item.roomName}</div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">หัวข้อการประชุม</div>
                <p className="text-sm font-bold text-gray-600 leading-relaxed">{item.title}</p>
              </div>

              <div className="pt-3 border-t border-gray-200/50 flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[10px] font-black text-gray-400 border border-gray-100 shadow-sm uppercase">
                  {item.department.charAt(0)}
                </div>
                <div className="text-xs font-black text-gray-500 tracking-tight">{item.department}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">ไม่พบประวัติการจอง</p>
          </div>
        )}
      </div>
    </div>
  );
}
