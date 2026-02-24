import { useState, useEffect } from "react";
import { bookingService } from "../services/bookingService";
import Swal from 'sweetalert2';

interface BookingRecord {
  id: string;
  roomId: string;
  roomName: string;
  startTime: string;
  endTime: string;
  date: string;
  time: string;
  participants: number;
  phone: string;
  bookerName: string;
  position: string;
  department: string;
  purpose: string;
  roomSetup: string;
  equipments: { 
    equipmentId: string; 
    quantity: number; 
    equipment?: { name: string } 
  }[];
  status: "approved" | "pending" | "cancelled" | "rejected";
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
          roomId: b.roomId || "",
          roomName: b.room?.name || b.roomId || "ไม่ระบุห้อง",
          startTime: b.startTime,
          endTime: b.endTime,
          date: start.toLocaleDateString("th-TH"),
          time: `${start.toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' })}`,
          participants: b.participants || 0,
          phone: b.phone || "-",
          bookerName: b.bookerName || b.user?.fullName || "ไม่ระบุ",
          position: b.position || "-",
          department: b.departments?.name || b.department || "ไม่ระบุ",
          purpose: b.purpose || "-",
          roomSetup: b.roomLayout?.name || b.roomLayoutId || "-",
          equipments: b.equipments || [],
          status: (b.status || "pending").toLowerCase(),
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

  const getRoomSetupLabel = (setup: string) => {
    switch (setup) {
      case "open_space": return "พื้นที่ว่าง (Open Space)";
      case "u_shape": return "ตัวยู (U-Shape)";
      case "classroom": return "ชั้นเรียน (Classroom)";
      default: return setup;
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

  const showBookingDetails = (item: BookingRecord) => {
    Swal.fire({
      title: `<div class="flex items-center justify-between border-b border-gray-100 pb-4 mb-2">
        <div class="flex items-center gap-3">
           <span class="text-xl font-black text-gray-800 tracking-tight">รายละเอียดการจอง</span>
        </div>
      </div>`,
      html: `
        <div class="text-left space-y-5">
          <!-- Main Info Card -->
          <div class="bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
            <div class="mb-4">
               <div class="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-1">ห้องประชุม</div>
               <div class="text-xl font-black text-gray-800">${item.roomName}</div>
            </div>
            
            <div class="grid grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-gray-400">📅</span>
                  <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">วันที่</div>
                </div>
                <div class="text-sm font-bold text-gray-700 pl-6">${item.date}</div>
              </div>
               <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-gray-400">⏰</span>
                  <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">เวลา</div>
                </div>
                <div class="text-sm font-bold text-gray-700 pl-6">${item.time}</div>
              </div>
              <div>
                 <div class="flex items-center gap-2 mb-1">
                  <span class="text-gray-400">🪑</span>
                  <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">การจัดห้อง</div>
                 </div>
                 <div class="text-sm font-bold text-gray-700 pl-6">${getRoomSetupLabel(item.roomSetup)}</div>
              </div>
               <div>
                 <div class="flex items-center gap-2 mb-1">
                  <span class="text-gray-400">👥</span>
                  <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ผู้เข้าร่วม</div>
                 </div>
                 <div class="text-sm font-bold text-gray-700 pl-6">${item.participants} ท่าน</div>
              </div>
            </div>
          </div>

          <!-- Purpose -->
          <div>
             <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">หัวข้อการประชุม</div>
             <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-sm font-medium text-gray-600 leading-relaxed">
               ${item.purpose}
             </div>
          </div>
          
          <!-- Equipment -->
          ${item.equipments.length > 0 ? `
            <div>
               <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">อุปกรณ์ที่จอง</div>
               <div class="flex flex-wrap gap-2">
                  ${item.equipments.map(eq => 
                    `<div class="bg-blue-50/50 text-blue-700 px-3 py-2 rounded-xl text-xs font-bold border border-blue-100 flex items-center gap-2">
                      <span class="text-base">🛠️</span> 
                      <span>${eq.equipment?.name || eq.equipmentId}</span>
                      <span class="bg-white px-1.5 py-0.5 rounded text-[10px] border border-blue-100 shadow-sm">x${eq.quantity}</span>
                     </div>`
                  ).join('')}
               </div>
            </div>
          ` : ''}

          <!-- Booker Info -->
          <div class="pt-2">
             <div class="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100/80">
                <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-sm font-black text-gray-400 border border-gray-100 shadow-sm uppercase shrink-0">
                  ${item.bookerName.charAt(0)}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">ผู้จอง</div>
                    <div class="text-sm font-black text-gray-800 truncate">${item.bookerName}</div>
                    <div class="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span class="truncate">${item.department}</span>
                      <span class="w-1 h-1 bg-gray-300 rounded-full shrink-0"></span>
                      <span>${item.phone}</span>
                    </div>
                </div>
             </div>
          </div>
        </div>
      `,
      width: '30rem',
      showConfirmButton: true,
      confirmButtonText: 'ปิดหน้าต่าง',
      buttonsStyling: false,
      customClass: {
        popup: 'rounded-[2rem] shadow-2xl overflow-hidden font-sans p-0',
        title: '!p-6 !pb-0 !m-0 !text-left',
        htmlContainer: '!p-6 !pt-2 !m-0',
        confirmButton: 'w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-3 rounded-xl font-bold transition-all transform active:scale-[0.98] shadow-lg shadow-gray-200 mt-2',
        actions: '!px-6 !pb-6 !mt-0 w-full'
      }
    });
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
              <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest w-[15%]">วันที่ / เวลา</th>
              <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest w-[15%]">ห้องประชุม</th>
              <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest w-[25%]">รายละเอียดเพิ่มเติม</th>
              <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest w-[20%]">ผู้จอง</th>
              <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-center w-[12%]">สถานะ</th>
              <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-center w-[13%]">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
               <tr>
                 <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">กำลังโหลดข้อมูล...</p>
                    </div>
                 </td>
               </tr>
            ) : historyData.length > 0 ? (
              historyData.map((item) => (
                <tr key={item.id} className="hover:bg-purple-50/30 transition-colors group">
                  <td className="px-6 py-5 align-middle">
                    <div className="text-sm font-black text-gray-800">{item.date}</div>
                    <div className="text-[10px] font-bold text-gray-400 mt-0.5 tracking-tight">{item.time}</div>
                  </td>
                  <td className="px-6 py-5 align-middle">
                    <span className="text-sm font-bold text-purple-600">
                      {item.roomName}
                    </span>
                  </td>
                  <td className="px-6 py-5 align-middle">
                    <p className="text-sm font-semibold text-gray-600 line-clamp-1" title={item.purpose}>
                      {item.purpose}
                    </p>
                  </td>
                  <td className="px-6 py-5 align-middle">
                    <div className="text-sm font-bold text-gray-800">{item.bookerName}</div>
                    <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">{item.department}</div>
                  </td>
                  <td className="px-6 py-5 align-middle text-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm border ${getStatusStyle(item.status)}`}>
                      {getStatusLabel(item.status)}
                    </span>
                  </td>
                  <td className="px-6 py-5 align-middle text-center">
                    <button 
                      onClick={() => showBookingDetails(item)}
                      className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-purple-100 hover:bg-purple-600 hover:text-white transition-all transform active:scale-95"
                    >
                      ดูทั้งหมด
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
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
              
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <div className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-0.5">ห้องประชุม</div>
                    <div className="text-sm font-black text-gray-800">{item.roomName}</div>
                </div>
                <button 
                   onClick={() => showBookingDetails(item)}
                   className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold shadow-md shadow-purple-200 active:scale-95 transition-transform"
                >
                   รายละเอียด
                </button>
              </div>

              <div className="flex items-center gap-3 px-1">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[10px] font-black text-gray-400 border border-gray-100 shadow-sm uppercase shrink-0">
                    {item.bookerName.charAt(0)}
                  </div>
                  <div>
                      <div className="text-xs font-black text-gray-700">{item.bookerName}</div>
                      <div className="text-[10px] text-gray-400 font-bold">{item.department}</div>
                  </div>
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
