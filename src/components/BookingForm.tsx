import { useState } from "react";

interface Room {
  id: number;
  name: string;
}

interface BookingFormProps {
  rooms: Room[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

// ตัวเลือกตำแหน่ง (สมมติ)
const POSITIONS = ["Manager", "Staff", "Supervisor", "Director", "Other"];

export default function BookingForm({ rooms, onSubmit, onCancel }: BookingFormProps) {
  const [formData, setFormData] = useState({
    bookerName: "",
    department: "",
    position: "",
    phone: "",
    roomId: "",
    date: "",
    participants: "",
    startTime: "",
    endTime: "",
    seatingType: "", // Open Space, U-Shape, Classroom
    equipment: [] as string[],
    description: "",
  });

  // จัดการ Input ทั่วไป
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // จัดการ Checkbox อุปกรณ์
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return { ...prev, equipment: [...prev.equipment, value] };
      } else {
        return { ...prev, equipment: prev.equipment.filter((item) => item !== value) };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg p-8 shadow-sm mx-auto border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">แบบฟอร์มจองห้องประชุม</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1: ชื่อผู้จอง / ฝ่ายงาน */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="bookerName" className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อผู้จอง *
            </label>
            <input
              type="text"
              id="bookerName"
              name="bookerName"
              value={formData.bookerName}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              ฝ่ายงาน / แผนก *
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Row 2: ตำแหน่ง / เบอร์โทร */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              ตำแหน่ง *
            </label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">เลือกตำแหน่ง</option>
              {POSITIONS.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              เบอร์โทรศัพท์ติดต่อ *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Row 3: ห้องประชุม / วันที่ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-1">
              เลือกห้องประชุม *
            </label>
            <select
              id="roomId"
              name="roomId"
              value={formData.roomId}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">เลือกห้องประชุม</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              วันที่ขอใช้ *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="mm/dd/yyyy"
            />
          </div>
        </div>

        {/* Row 4: ผู้เข้าร่วม / เวลาเริ่ม */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-1">
              จำนวนผู้เข้าร่วมประชุม *
            </label>
            <input
              type="number"
              id="participants"
              name="participants"
              value={formData.participants}
              onChange={handleChange}
              required
              min="1"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
              เวลาเริ่ม *
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Row 5: เวลาสิ้นสุด */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
              เวลาสิ้นสุด *
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Row 6: รูปแบบการจัดที่นั่ง */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            รูปแบบการจัดที่นั่ง *
          </label>
          <div className="flex flex-wrap gap-6">
            {[
              { label: "พื้นที่ว่าง (Open Space)", value: "open_space" },
              { label: "ตัวยู (U-Shape)", value: "u_shape" },
              { label: "ชั้นเรียน (Classroom)", value: "classroom" },
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="seatingType"
                  value={option.value}
                  checked={formData.seatingType === option.value}
                  onChange={handleChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Row 7: อุปกรณ์ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            อุปกรณ์โสตทัศนูปกรณ์ที่ต้องการ
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "โปรเจกเตอร์",
              "ไมค์",
              "ลำโพง",
              "อินเทอร์เน็ต",
              "จอแสดงผล",
              "เครื่องเสียง",
            ].map((item) => (
              <label key={item} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={item}
                  checked={formData.equipment.includes(item)}
                  onChange={handleCheckboxChange}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Row 8: รายละเอียดเพิ่มเติม */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            จุดประสงค์การใช้งาน / รายละเอียดเพิ่มเติม
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="กรุณาระบุจุดประสงค์การใช้งานและรายละเอียดเพิ่มเติม"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-2.5 rounded border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-8 py-2.5 rounded bg-blue-800 text-white font-medium hover:bg-blue-900 transition-colors shadow-sm"
          >
            ส่งคำขอจองห้องประชุม
          </button>
        </div>
      </form>
    </div>
  );
}
