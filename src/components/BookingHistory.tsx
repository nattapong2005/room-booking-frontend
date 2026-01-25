interface BookingRecord {
  id: string;
  roomName: string;
  title: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled";
  department: string;
}

const historyData: BookingRecord[] = [
  {
    id: "BK-001",
    roomName: "หอประชุมวิทยาลัยอาชีวศึกษานครปฐม",
    title: "ปฐมนิเทศนักศึกษาใหม่",
    date: "2026-01-20",
    time: "08:30 - 12:00",
    status: "confirmed",
    department: "ฝ่ายวิชาการ",
  },
  {
    id: "BK-002",
    roomName: "ห้องประชุมบานบุรี",
    title: "ประชุมคณะกรรมการสถานศึกษา",
    date: "2026-01-22",
    time: "13:30 - 16:30",
    status: "confirmed",
    department: "ฝ่ายบริหารงานทั่วไป",
  },
  {
    id: "BK-003",
    roomName: "ห้องประชุมเฉลิมพระเกียรติ",
    title: "สัมมนาทักษะวิชาชีพ",
    date: "2026-01-24",
    time: "09:00 - 16:00",
    status: "cancelled",
    department: "แผนกวิชาคอมพิวเตอร์",
  },
  {
    id: "BK-004",
    roomName: "ห้องประชุมสมาคม",
    title: "ประชุมทีมพัฒนาระบบ IT",
    date: "2026-01-25",
    time: "10:00 - 11:30",
    status: "pending",
    department: "ศูนย์ข้อมูลสารสนเทศ",
  },
];

export default function BookingHistory() {
  const getStatusStyle = (status: BookingRecord["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status: BookingRecord["status"]) => {
    switch (status) {
      case "confirmed":
        return "อนุมัติแล้ว";
      case "pending":
        return "รออนุมัติ";
      case "cancelled":
        return "ยกเลิกแล้ว";
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">ประวัติการจองห้องประชุม</h2>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-xs">
            <span className="w-3 h-3 rounded-full bg-green-500"></span> อนุมัติ
          </span>
          <span className="flex items-center gap-1 text-xs">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span> รออนุมัติ
          </span>
          <span className="flex items-center gap-1 text-xs">
            <span className="w-3 h-3 rounded-full bg-red-500"></span> ยกเลิก
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-purple-50 text-purple-900 border-b border-purple-100">
              <th className="px-4 py-4 font-semibold text-sm">วันที่ / เวลา</th>
              <th className="px-4 py-4 font-semibold text-sm">ห้องประชุม</th>
              <th className="px-4 py-4 font-semibold text-sm">หัวข้อการประชุม</th>
              <th className="px-4 py-4 font-semibold text-sm">หน่วยงาน</th>
              <th className="px-4 py-4 font-semibold text-sm text-center">สถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {historyData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900">{item.date}</div>
                  <div className="text-xs text-gray-500">{item.time}</div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700 font-medium">
                  {item.roomName}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {item.title}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {item.department}
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {historyData.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          ไม่พบประวัติการจอง
        </div>
      )}
    </div>
  );
}
