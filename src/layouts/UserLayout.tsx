import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import BookingHistory from "../components/BookingHistory";
import EditCancelBooking from "../components/EditCancelBooking";
import { Alert } from "../utils/sweetAlert";
import { CalendarCheck, UserCog, ChevronLeft, ChevronRight, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { roomService } from "../services/roomService";
import { equipmentService } from "../services/equipmentService";
import { bookingService } from "../services/bookingService";

type RoomStatus = "available" | "booked";

export interface Room {
  id: string;
  name: string;
  capacity: string;
  status: RoomStatus;
  booking?: string;
  nextBooking?: string;
}

const thaiMonths = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

const thaiDays = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

export default function UserLayout() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rooms, setRooms] = useState<Room[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [equipments, setEquipments] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsResponse, equipmentsResponse, bookingsResponse] = await Promise.all([
        roomService.getAllRooms(),
        equipmentService.getAllEquipments(),
        bookingService.getAllBookings()
      ]);
      
      const fetchedRooms = roomsResponse.data.map((r: any) => ({
        id: r.id,
        name: r.name,
        capacity: `${r.capacity} คน`,
        status: r.isActive ? "available" : "booked",
        nextBooking: r.isActive ? "ไม่มีการจอง" : "ปิดปรับปรุง",
      }));
      setRooms(fetchedRooms);
      setEquipments(equipmentsResponse.data);
      setAllBookings(bookingsResponse.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const handleTabChange = (index: number) => {
    if (index > 0 && !user) {
      Alert.warning("กรุณาเข้าสู่ระบบ", "คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถใช้บริการจองห้องได้");
      navigate("/login");
      return;
    }
    setActiveTab(index);
  };

  const tabs = [
    { label: "ตรวจสอบสถานะห้อง", variant: "blue" as const },
    { label: "จองห้องประชุม", variant: "orange" as const },
    { label: "ดูประวัติการจอง", variant: "purple" as const },
    { label: "แก้ไข/ยกเลิกการจอง", variant: "coral" as const },
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[80px] md:min-h-[120px] bg-gray-50/50 rounded-md border border-gray-100" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isWeekend = (firstDay + day - 1) % 7 === 0 || (firstDay + day - 1) % 7 === 6;
      
      const bookingsForDay = allBookings.filter(b => {
        const bStart = new Date(b.startTime);
        return bStart.getDate() === day && 
               bStart.getMonth() === currentDate.getMonth() && 
               bStart.getFullYear() === currentDate.getFullYear() &&
               b.status !== 'CANCELLED';
      });

      days.push(
        <div
          key={day}
          className={`min-h-[80px] md:min-h-[120px] p-1 md:p-2 rounded-md border flex flex-col transition-all overflow-hidden
            ${isWeekend ? "bg-blue-50/30 border-blue-100" : "bg-white border-gray-100"}
            hover:shadow-md hover:border-blue-300`}
        >
          <span className={`text-xs md:text-sm font-bold mb-1 ${isWeekend ? "text-blue-600" : "text-gray-500"}`}>
            {day}
          </span>
          <div className="flex flex-col gap-1 overflow-y-auto max-h-[60px] md:max-h-[90px] scrollbar-hide">
            {bookingsForDay.map((booking, idx) => (
              <div 
                key={idx} 
                className={`text-[10px] md:text-xs px-1 py-0.5 rounded truncate shadow-sm border-l-2
                  ${booking.status === 'APPROVED' ? 'bg-green-100 text-green-700 border-green-500' : 
                    booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border-amber-500' : 
                    'bg-blue-100 text-blue-700 border-blue-500'}`}
                title={`${booking.room.name}: ${booking.purpose}`}
              >
                <span className="font-semibold">{new Date(booking.startTime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</span> {booking.room.name}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  const handleBookingSubmit = async (data: any) => {
    try {
      console.log("Booking Data from Form:", data);

      // Ensure IDs are numbers if possible, as the backend previously expected numbers
      const roomIdNum = Number(data.roomId);
      const departmentIdNum = Number(data.department);
      
      const payload = {
        ...data,
        roomId: isNaN(roomIdNum) ? data.roomId : roomIdNum,
        department: isNaN(departmentIdNum) ? data.department : departmentIdNum,
        equipments: data.equipments.map((eq: any) => ({
          ...eq,
          equipmentId: !isNaN(Number(eq.equipmentId)) ? Number(eq.equipmentId) : eq.equipmentId
        }))
      };

      console.log("Final Booking Payload:", payload);

      await bookingService.createBooking(payload);
      Alert.success("บันทึกสำเร็จ", "การจองของคุณถูกบันทึกเรียบร้อยแล้ว");
      fetchData(); // Refresh calendar
      setActiveTab(0);
    } catch (error: any) {
      console.error("Booking error:", error);
      Alert.error("การจองล้มเหลว", error.response?.data?.message || "ไม่สามารถทำรายการจองได้");
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f7fa]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1e3a8a] to-[#2751ad] py-4 md:py-8 relative shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl transform hover:rotate-3 transition-transform">
                <CalendarCheck className="w-8 h-8 md:w-10 md:h-10 text-[#4da6e0]" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">วิทยาลัยอาชีวศึกษานครปฐม</h1>
                <p className="text-blue-100 text-sm md:text-lg font-medium opacity-90">ระบบจองห้องประชุมออนไลน์</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-3">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/20">
                    <UserIcon size={16} />
                    <span className="text-sm font-semibold">{user.fullName}</span>
                  </div>
                  <div className="flex gap-2">
                    {user.role === 'ADMIN' && (
                      <button 
                        onClick={() => navigate("/admin")}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 md:px-4 md:py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg cursor-pointer transform hover:-translate-y-0.5"
                      >
                        <UserCog size={18} />
                        <span className="hidden md:inline">แผงควบคุม</span>
                      </button>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="bg-rose-500 hover:bg-rose-600 text-white p-2 md:px-4 md:py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg cursor-pointer transform hover:-translate-y-0.5"
                    >
                      <LogOut size={18} />
                      <span className="hidden md:inline">ออกจากระบบ</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => navigate("/login")}
                  className="bg-white text-[#2751ad] hover:bg-blue-50 px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 shadow-2xl cursor-pointer transform hover:scale-105 active:scale-95"
                >
                  <LogIn size={20} />
                  เข้าสู่ระบบ
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="max-w-6xl mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-4 justify-center">
          {tabs.map((tab, index) => (
            <button
              type="button"
              key={tab.label}
              onClick={() => handleTabChange(index)}
              className={`px-3 md:px-8 py-2.5 md:py-4 rounded-xl font-bold text-xs md:text-base transition-all cursor-pointer shadow-sm
                ${
                  activeTab === index 
                  ? "bg-white text-[#2751ad] ring-4 ring-blue-500/20 shadow-xl scale-105 z-10"
                  : (tab.variant === "blue"
                    ? `bg-blue-600 text-white hover:bg-blue-700`
                    : tab.variant === "orange"
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : tab.variant === "purple"
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "bg-rose-500 text-white hover:bg-rose-600")
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-12">
        {activeTab === 0 && (
          <div className="space-y-6 md:space-y-8">
            <section className="bg-white rounded-3xl p-5 md:p-8 shadow-xl shadow-blue-900/5 animate-fade-in border border-gray-100">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                <h2 className="text-xl md:text-3xl font-black text-gray-800 tracking-tight">สถานะห้องประชุม</h2>
              </div>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500 font-medium">กำลังโหลดข้อมูลห้องประชุม...</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {rooms.map((room) => (
                    <div key={room.id} className="group relative bg-gray-50/50 rounded-2xl p-5 border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <h3 className="font-bold text-gray-800 md:text-lg group-hover:text-blue-600 transition-colors">{room.name}</h3>
                          <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm">
                            <UserIcon size={14} className="opacity-70" />
                            <span>ความจุ: {room.capacity}</span>
                          </div>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-wider shadow-sm border ${
                          room.status === "available" 
                          ? "bg-green-50 text-green-600 border-green-200" 
                          : "bg-orange-50 text-orange-500 border-orange-200"
                        }`}>
                          {room.status === "available" ? "ว่าง" : "ถูกจอง"}
                        </span>
                      </div>
                      <div className="pt-3 border-t border-gray-200/60">
                        <p className="text-gray-400 text-[10px] md:text-xs font-medium uppercase tracking-wide mb-1">สถานะถัดไป</p>
                        <p className={`text-xs md:text-sm font-bold ${room.status === 'available' ? 'text-gray-600' : 'text-orange-600'}`}>
                          {room.status === "booked" ? room.booking : room.nextBooking}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white rounded-3xl p-5 md:p-8 shadow-xl shadow-blue-900/5 animate-fade-in border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                  <h2 className="text-xl md:text-3xl font-black text-gray-800 tracking-tight">ปฏิทินการจอง</h2>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-4">
                  <button onClick={prevMonth} className="p-2 md:px-5 md:py-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-sm">
                    <ChevronLeft size={20} />
                  </button>
                  <h3 className="text-lg md:text-2xl font-black text-gray-800 min-w-[150px] text-center">
                    {thaiMonths[currentDate.getMonth()]} {currentDate.getFullYear() + 543}
                  </h3>
                  <button onClick={nextMonth} className="p-2 md:px-5 md:py-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-sm">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 md:gap-3">
                {thaiDays.map((day) => (
                  <div key={day} className="h-10 md:h-12 flex items-center justify-center font-black text-gray-400 text-[10px] md:text-sm uppercase tracking-widest">{day}</div>
                ))}
                {renderCalendar()}
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4 md:gap-6 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></div>
                  <span className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider">อนุมัติแล้ว</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></div>
                  <span className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider">รออนุมัติ</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></div>
                  <span className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider">อื่นๆ</span>
                </div>
              </div>
            </section>
          </div>
        )}
        {activeTab === 1 && <BookingForm rooms={rooms} equipments={equipments} onSubmit={handleBookingSubmit} onCancel={() => setActiveTab(0)} />}
        {activeTab === 2 && <BookingHistory />}
        {activeTab === 3 && <EditCancelBooking />}
      </main>
    </div>
  );
}
