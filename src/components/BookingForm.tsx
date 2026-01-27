import { useState, useEffect } from "react";
import { departmentService } from "../services/departmentService";
import { Alert } from "../utils/sweetAlert";

interface Room {
  id: string;
  name: string;
  status?: string;
}

interface Equipment {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
}

interface BookingFormProps {
  rooms: Room[];
  equipments: Equipment[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

// ตัวเลือกตำแหน่ง (สมมติ)
const POSITIONS = ["ผู้อำนวยการ", "รองผู้อำนวยการ", "หัวหน้าสาขา", "หัวหน้างาน", "ครู", "เจ้าหน้าที่"];

export default function BookingForm({ rooms, equipments, onSubmit, onCancel }: BookingFormProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  
  // ดึงข้อมูลผู้ใช้จาก localStorage เพื่อ pre-fill
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const [formData, setFormData] = useState({
    bookerName: user?.fullName || "",
    department: "",
    position: "",
    phone: "",
    roomId: "",
    date: "",
    participants: 1,
    startTime: "",
    endTime: "",
    roomSetup: "", // open_space, u_shape, classroom
    equipments: [] as string[],
    purpose: "",
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await departmentService.getAllDepartments();
        setDepartments(response.data);
        
        // พยายามจับคู่แผนกของผู้ใช้
        if (user?.departmentId) {
          const userDept = response.data.find((d: any) => d.id === user.departmentId);
          if (userDept) {
            setFormData(prev => ({ ...prev, department: userDept.id }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  // กรองห้องที่พร้อมใช้งาน (isActive: true)
  const availableRooms = rooms.filter(room => room.status === "available");

  // จัดการ Input ทั่วไป
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === "participants" ? Number(value) : value 
    }));
  };

  // จัดการ Checkbox อุปกรณ์
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return { ...prev, equipments: [...prev.equipments, value] };
      } else {
        return { ...prev, equipments: prev.equipments.filter((item) => item !== value) };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. ตรวจสอบว่าเลือกห้องหรือยัง
    if (!formData.roomId) {
      Alert.error("ข้อมูลไม่ครบถ้วน", "กรุณาเลือกห้องประชุม");
      return;
    }

    // 2. ตรวจสอบเวลา
    const now = new Date();
    const start = new Date(`${formData.date}T${formData.startTime}`);
    const end = new Date(`${formData.date}T${formData.endTime}`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      Alert.error("ข้อมูลไม่ครบถ้วน", "กรุณาระบุวันที่และเวลาให้ถูกต้อง");
      return;
    }

    if (start < now) {
      Alert.error("เวลาไม่ถูกต้อง", "ไม่สามารถจองเวลาย้อนหลังได้");
      return;
    }

    if (start >= end) {
      Alert.error("เวลาไม่ถูกต้อง", "เวลาเริ่มต้องก่อนเวลาสิ้นสุด");
      return;
    }

    // 3. ตรวจสอบรูปแบบการจัดที่นั่ง
    if (!formData.roomSetup) {
      Alert.error("ข้อมูลไม่ครบถ้วน", "กรุณาเลือกรูปแบบการจัดที่นั่ง");
      return;
    }

    // 4. ตรวจสอบความยาวจุดประสงค์ (DB VARCHAR 191)
    if (formData.purpose.length > 190) {
      Alert.warning("ข้อความยาวเกินไป", "กรุณาย่อจุดประสงค์การใช้งานลงเพื่อให้สามารถบันทึกข้อมูลได้");
      return;
    }

    // Transform to target JSON structure
    const payload = {
      roomId: formData.roomId,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      participants: formData.participants,
      phone: formData.phone,
      bookerName: formData.bookerName,
      position: formData.position,
      department: formData.department,
      purpose: formData.purpose,
      roomSetup: formData.roomSetup,
      equipments: formData.equipments.map((id) => ({
        equipmentId: id,
        quantity: 1
      }))
    };

    onSubmit(payload);
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-10 shadow-xl border border-gray-100 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
        <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">แบบฟอร์มจองห้องประชุม</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Row 1: ชื่อผู้จอง / ฝ่ายงาน */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="bookerName" className="block text-sm font-bold text-gray-600 uppercase tracking-wider ml-1">
              ชื่อผู้จอง *
            </label>
            <input
              type="text"
              id="bookerName"
              name="bookerName"
              value={formData.bookerName}
              onChange={handleChange}
              required
              placeholder="ชื่อ-นามสกุล"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="department" className="block text-sm font-bold text-gray-600 uppercase tracking-wider ml-1">
              ฝ่ายงาน / แผนก *
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all appearance-none"
            >
              <option value="">เลือกฝ่ายงาน / แผนก</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: ตำแหน่ง / เบอร์โทร */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="position" className="block text-sm font-bold text-gray-600 uppercase tracking-wider ml-1">
              ตำแหน่ง *
            </label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all appearance-none"
            >
              <option value="">เลือกตำแหน่ง</option>
              {POSITIONS.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-bold text-gray-600 uppercase tracking-wider ml-1">
              เบอร์โทรศัพท์ติดต่อ *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="เช่น 0812345678"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Row 3: ห้องประชุม / วันที่ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="roomId" className="block text-sm font-bold text-gray-600 uppercase tracking-wider ml-1">
              เลือกห้องประชุม *
            </label>
            <select
              id="roomId"
              name="roomId"
              value={formData.roomId}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all appearance-none"
            >
              <option value="">เลือกห้องประชุม</option>
              {availableRooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
            {availableRooms.length === 0 && (
              <p className="text-xs text-red-500 mt-1 font-bold">ขณะนี้ไม่มีห้องว่างที่เปิดใช้งาน</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-bold text-gray-600 uppercase tracking-wider ml-1">
              วันที่ขอใช้ *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Row 4: ผู้เข้าร่วม / เวลา */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="participants" className="block text-sm font-bold text-gray-600 uppercase tracking-wider ml-1">
              จำนวนผู้เข้าร่วม *
            </label>
            <input
              type="number"
              id="participants"
              name="participants"
              value={formData.participants}
              onChange={handleChange}
              required
              min="1"
              placeholder="ระบุจำนวนคน"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="startTime" className="block text-sm font-bold text-gray-600 uppercase tracking-wider ml-1">
              เวลาเริ่ม *
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="endTime" className="block text-sm font-bold text-gray-600 uppercase tracking-wider ml-1">
              เวลาสิ้นสุด *
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* รูปแบบการจัดที่นั่ง */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider ml-1">
            รูปแบบการจัดที่นั่ง *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "พื้นที่ว่าง (Open Space)", value: "open_space" },
              { label: "ตัวยู (U-Shape)", value: "u_shape" },
              { label: "ชั้นเรียน (Classroom)", value: "classroom" },
            ].map((option) => (
              <label 
                key={option.value} 
                className={`flex items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer text-center
                  ${formData.roomSetup === option.value 
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md ring-2 ring-blue-500/20" 
                    : "border-gray-100 bg-gray-50/50 text-gray-500 hover:border-gray-200 hover:bg-white"}`}
              >
                <input
                  type="radio"
                  name="roomSetup"
                  value={option.value}
                  checked={formData.roomSetup === option.value}
                  onChange={handleChange}
                  required
                  className="hidden"
                />
                <span className="text-sm font-bold uppercase tracking-tight">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* อุปกรณ์ */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider ml-1">
            อุปกรณ์โสตทัศนูปกรณ์ที่ต้องการ
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {equipments.map((item) => (
              <label 
                key={item.id} 
                className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer
                  ${formData.equipments.includes(item.id.toString())
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                    : "border-gray-100 bg-gray-50/50 text-gray-500 hover:border-gray-200 hover:bg-white"}`}
              >
                <input
                  type="checkbox"
                  value={item.id}
                  checked={formData.equipments.includes(item.id.toString())}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 rounded-lg text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-xs font-bold uppercase tracking-tight">{item.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* รายละเอียดเพิ่มเติม */}
        <div className="space-y-2">
          <label htmlFor="purpose" className="block text-sm font-bold text-gray-600 uppercase tracking-wider ml-1">
            จุดประสงค์การใช้งาน / รายละเอียดเพิ่มเติม
          </label>
          <textarea
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            rows={3}
            maxLength={190}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
            placeholder="กรุณาระบุจุดประสงค์การใช้งาน"
          />
          <div className="flex justify-end pr-2">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${formData.purpose.length >= 170 ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-400'}`}>
              {formData.purpose.length}/190
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-48 px-8 py-4 rounded-2xl border-2 border-gray-100 text-gray-500 font-bold hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95 uppercase tracking-widest text-sm"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-12 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 uppercase tracking-widest text-sm"
          >
            ยืนยันการจองห้องประชุม
          </button>
        </div>
      </form>
    </div>
  );
}
