export interface BookingRequest {
  id: number;
  roomName: string;
  userName: string;
  department: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  participants: number;
  timestamp: string; // Time when request was made
}

export const mockBookingRequests: BookingRequest[] = [
  {
    id: 101,
    roomName: "หอประชุมวิทยาลัยอาชีวศึกษานครปฐม",
    userName: "สมชาย ใจดี",
    department: "แผนกวิชาคอมพิวเตอร์",
    date: "2026-02-15",
    startTime: "09:00",
    endTime: "12:00",
    reason: "อบรมเชิงปฏิบัติการ AI เบื้องต้น",
    status: "pending",
    participants: 150,
    timestamp: "2026-01-25T10:30:00",
  },
  {
    id: 102,
    roomName: "ห้องประชุมบานบุรี",
    userName: "วิไลวรรณ รักเรียน",
    department: "แผนกวิชาบัญชี",
    date: "2026-02-16",
    startTime: "13:00",
    endTime: "16:00",
    reason: "ประชุมสรุปงบประมาณประจำปี",
    status: "pending",
    participants: 20,
    timestamp: "2026-01-26T08:15:00",
  },
  {
    id: 103,
    roomName: "ห้องประชุมเฉลิมพระเกียรติ",
    userName: "ธนพล คนเก่ง",
    department: "งานบริหารงานทั่วไป",
    date: "2026-02-18",
    startTime: "08:30",
    endTime: "16:30",
    reason: "ต้อนรับคณะศึกษาดูงาน",
    status: "approved",
    participants: 80,
    timestamp: "2026-01-24T14:20:00",
  },
  {
    id: 104,
    roomName: "ห้องประชุมสมาคม",
    userName: "กานดา พาเพลิน",
    department: "ชมรมศิษย์เก่า",
    date: "2026-02-20",
    startTime: "10:00",
    endTime: "12:00",
    reason: "ประชุมคณะกรรมการชมรม",
    status: "rejected",
    participants: 10,
    timestamp: "2026-01-23T09:45:00",
  },
  {
    id: 105,
    roomName: "หอประชุมวิทยาลัยอาชีวศึกษานครปฐม",
    userName: "มานะ อดทน",
    department: "ฝ่ายพัฒนากิจการนักเรียน",
    date: "2026-02-25",
    startTime: "08:00",
    endTime: "16:00",
    reason: "กิจกรรมปฐมนิเทศนักศึกษาใหม่",
    status: "pending",
    participants: 500,
    timestamp: "2026-01-26T11:00:00",
  },
];
