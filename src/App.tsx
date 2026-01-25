import { useState } from "react";
import BookingForm from "./components/BookingForm";
import BookingHistory from "./components/BookingHistory";
import EditCancelBooking from "./components/EditCancelBooking";

type RoomStatus = "available" | "booked";

interface Room {
  id: number;
  name: string;
  capacity: string;
  status: RoomStatus;
  booking?: string;
  nextBooking?: string;
}

const rooms: Room[] = [
  {
    id: 1,
    name: "หอประชุมวิทยาลัยอาชีวศึกษานครปฐม",
    capacity: "300-1,000 คน",
    status: "available",
    nextBooking: "ไม่มีการจอง",
  },
  {
    id: 2,
    name: "ห้องประชุมบานบุรี",
    capacity: "80-200 คน",
    status: "booked",
    booking: "09:00-12:00 (วันนี้)",
  },
  {
    id: 3,
    name: "ห้องประชุมเฉลิมพระเกียรติ",
    capacity: "50-150 คน",
    status: "available",
    nextBooking: "14:00-16:00 (พรุ่งนี้)",
  },
  {
    id: 4,
    name: "ห้องประชุมสมาคม",
    capacity: "15-30 คน",
    status: "available",
    nextBooking: "ไม่มีการจอง",
  },
];

const thaiMonths = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

const thaiDays = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // January 2026

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
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-16 bg-gray-100 rounded-md"
        />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isWeekend =
        (firstDay + day - 1) % 7 === 0 || (firstDay + day - 1) % 7 === 6;
      days.push(
        <div
          key={day}
          className={`h-16 rounded-md flex items-center justify-center text-lg font-medium cursor-pointer transition-colors
            ${isWeekend ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}
            hover:bg-blue-200`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const handleBookingSubmit = (data: any) => {
    console.log("Booking Data:", data);
    alert("บันทึกการจองสำเร็จ!");
    setActiveTab(0); // Go back to home
  };

  return (
    <div className="min-h-screen bg-[#e8f4f8]">
      {/* Header */}
      <header className="bg-[#2751ad] py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-md">
              <svg
                viewBox="0 0 32 32"
                fill="none"
                className="w-8 h-8"
              >
                <rect x="4" y="3" width="24" height="26" rx="3" fill="#4da6e0" />
                <rect x="6" y="8" width="20" height="19" rx="2" fill="white" />
                <path
                  d="M11 17l3 3 7-7"
                  stroke="#4da6e0"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              วิทยาลัยอาชีวศึกษานครปฐม
            </h1>
          </div>
          <p className="text-white text-lg">ระบบจองห้องประชุมออนไลน์</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {tabs.map((tab, index) => (
            <button
              type="button"
              key={tab.label}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-3 rounded-lg font-medium text-sm md:text-base transition-all cursor-pointer
                ${
                  activeTab === index 
                  ? (tab.variant === "blue" ? "border-2 border-blue-500 bg-blue-500 text-white" : 
                     tab.variant === "orange" ? "bg-orange-500 text-white shadow-lg scale-105" :
                     tab.variant === "purple" ? "bg-purple-600 text-white shadow-lg scale-105" :
                     "bg-rose-500 text-white shadow-lg scale-105")
                  : (tab.variant === "blue"
                    ? `border-2 border-blue-500 text-white bg-blue-500`
                    : tab.variant === "orange"
                      ? "bg-orange-400 text-white hover:bg-orange-500"
                      : tab.variant === "purple"
                        ? "bg-purple-500 text-white hover:bg-purple-600"
                        : "bg-rose-400 text-white hover:bg-rose-500")
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-8">
        {activeTab === 0 && (
          <>
            {/* Room Status Section */}
            <section className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">
                สถานะห้องประชุม
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="border border-gray-200 rounded-lg p-4 flex justify-between items-start hover:shadow-md transition-shadow"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {room.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-1">
                        ความจุ: {room.capacity}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {room.status === "booked"
                          ? `จอง: ${room.booking}`
                          : `ถัดไป: ${room.nextBooking}`}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-1 rounded-md text-sm font-medium border ${
                        room.status === "available"
                          ? "border-green-500 text-green-600 bg-white"
                          : "border-orange-400 text-orange-500 bg-white"
                      }`}
                    >
                      {room.status === "available" ? "ว่าง" : "ถูกจอง"}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Calendar Section */}
            <section className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">
                ปฏิทินการจองห้องประชุม
              </h2>

              {/* Calendar Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="bg-blue-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <span>←</span> เดือนก่อน
                </button>
                <h3 className="text-xl font-semibold text-gray-800">
                  {thaiMonths[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="bg-blue-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  เดือนถัดไป <span>→</span>
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day Headers */}
                {thaiDays.map((day) => (
                  <div
                    key={day}
                    className="h-12 flex items-center justify-center font-semibold text-gray-600"
                  >
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {renderCalendar()}
              </div>
            </section>
          </>
        )}

        {activeTab === 1 && (
          <BookingForm 
            rooms={rooms} 
            onSubmit={handleBookingSubmit} 
            onCancel={() => setActiveTab(0)} 
          />
        )}

        {activeTab === 2 && (
          <BookingHistory />
        )}

        {activeTab === 3 && (
          <EditCancelBooking />
        )}
      </main>
    </div>
  );
}