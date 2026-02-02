import { useState, useEffect } from "react";
import { Alert } from "../utils/sweetAlert";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  User,
  X,
} from "lucide-react";
import { bookingService } from "../services/bookingService";
import { roomService } from "../services/roomService";
import { equipmentService } from "../services/equipmentService";
import BookingForm from "../components/BookingForm";

interface Booking {
  id: string;
  roomName: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  room: any; // Full object for form
  equipments: any[];
  [key: string]: any;
}

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [equipments, setEquipments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any | null>(null);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, roomsRes, equipmentsRes] = await Promise.all([
        bookingService.getAllBookings(),
        roomService.getAllRooms(),
        equipmentService.getAllEquipments(),
      ]);

      setBookings(bookingsRes.data);
      setRooms(roomsRes.data);
      setEquipments(equipmentsRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      Alert.error("เกิดข้อผิดพลาด", "ไม่สามารถดึงข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Alert.confirm(
      "ยืนยันการลบ",
      "คุณแน่ใจหรือไม่ที่จะลบการจองนี้? การกระทำนี้ไม่สามารถย้อนกลับได้",
      "ลบการจอง",
      true,
    );
    if (result.isConfirmed) {
      try {
        await bookingService.deleteBooking(id);
        setBookings(bookings.filter((b) => b.id !== id));
        setSelectedBookings(selectedBookings.filter((sid) => sid !== id));
        Alert.success("ลบสำเร็จ", "การจองถูกลบออกจากระบบแล้ว");
      } catch (error: any) {
        Alert.error(
          "ผิดพลาด",
          error.response?.data?.message || "ไม่สามารถลบการจองได้",
        );
      }
    }
  };

  const handleBulkDelete = async () => {
    const result = await Alert.confirm(
      "ยืนยันการลบหมู่",
      `คุณต้องการลบการจอง ${selectedBookings.length} รายการที่เลือกใช่หรือไม่?`,
      "ลบทั้งหมด",
      true,
    );
    if (result.isConfirmed) {
      try {
        await Promise.all(
          selectedBookings.map((id) => bookingService.deleteBooking(id)),
        );
        setBookings(bookings.filter((b) => !selectedBookings.includes(b.id)));
        setSelectedBookings([]);
        Alert.success("ลบสำเร็จ", "ลบรายการที่เลือกเรียบร้อยแล้ว");
      } catch (error: any) {
        Alert.error("ผิดพลาด", "เกิดข้อผิดพลาดในการลบข้อมูลบางรายการ");
      }
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = filteredBookings.map((b) => b.id);
      setSelectedBookings(allIds);
    } else {
      setSelectedBookings([]);
    }
  };

  const handleSelectBooking = (id: string) => {
    if (selectedBookings.includes(id)) {
      setSelectedBookings(selectedBookings.filter((sid) => sid !== id));
    } else {
      setSelectedBookings([...selectedBookings, id]);
    }
  };

  const handleCreate = () => {
    setEditingBooking(null);
    setShowModal(true);
  };

  const handleEdit = (booking: any) => {
    setEditingBooking(booking);
    setShowModal(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingBooking) {
        await bookingService.updateBooking(editingBooking.id, data);
        Alert.success("สำเร็จ", "แก้ไขการจองเรียบร้อยแล้ว");
      } else {
        await bookingService.createBooking(data);
        Alert.success("สำเร็จ", "สร้างการจองเรียบร้อยแล้ว");
      }
      setShowModal(false);
      fetchData(); // Refresh list
    } catch (error: any) {
      console.error("Submit error:", error);
      Alert.error(
        "ผิดพลาด",
        error.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
      );
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const search = searchTerm.toLowerCase();
    const roomName = b.room?.name || "";
    const userName = b.bookerName || b.user?.fullName || "";
    return (
      roomName.toLowerCase().includes(search) ||
      userName.toLowerCase().includes(search) ||
      b.status.toLowerCase().includes(search)
    );
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          จัดการข้อมูลการจอง
        </h2>
        <div className="flex gap-2 w-full sm:w-auto">
          {selectedBookings.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="w-full sm:w-auto bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer"
            >
              <Trash2 size={18} />
              ลบที่เลือก ({selectedBookings.length})
            </button>
          )}
          <button
            onClick={handleCreate}
            className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer"
          >
            <Plus size={18} />
            เพิ่มการจอง
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="ค้นหาห้อง, ผู้จอง, สถานะ..."
          className="pl-9 md:pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
            {loading ? (
              <div className="p-10 text-center text-gray-500">
                กำลังโหลดข้อมูล...
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left w-10">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        checked={
                          filteredBookings.length > 0 &&
                          selectedBookings.length === filteredBookings.length
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      วัน-เวลา
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ห้องประชุม
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ผู้จอง
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สถานะ
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => {
                      const start = new Date(booking.startTime);
                      const end = new Date(booking.endTime);
                      const dateStr = start.toLocaleDateString("th-TH");
                      const timeStr = `${start.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}`;

                      return (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                              checked={selectedBookings.includes(booking.id)}
                              onChange={() => handleSelectBooking(booking.id)}
                            />
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                <Calendar size={14} /> {dateStr}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock size={14} /> {timeStr}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-900">
                                {booking.room?.name || "Unknown Room"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex items-center gap-2">
                              <User size={16} className="text-gray-400" />
                              <div className="text-sm text-gray-900">
                                {booking.bookerName ||
                                  booking.user?.fullName ||
                                  "Unknown"}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 pl-6">
                              {booking.department ||
                                booking.departments?.name ||
                                "-"}
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                booking.status === "APPROVED"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : booking.status === "REJECTED"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center justify-center gap-2 md:gap-3">
                              <button
                                onClick={() => handleEdit(booking)}
                                className="text-blue-600 hover:text-blue-900 p-1 cursor-pointer"
                                title="แก้ไข"
                              >
                                <Edit2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                              </button>
                              <button
                                onClick={() => handleDelete(booking.id)}
                                className="text-red-600 hover:text-red-900 p-1 cursor-pointer"
                                title="ลบ"
                              >
                                <Trash2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-4 text-center text-gray-500 text-sm"
                      >
                        ไม่พบข้อมูลการจอง
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>


{showModal && (
  <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    {/* Backdrop */}
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
      aria-hidden="true" 
      onClick={() => setShowModal(false)}
    ></div>
    
    {/* Modal Container */}
    <div className="flex min-h-full items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900" id="modal-title">
            {editingBooking ? "แก้ไขการจอง" : "สร้างการจองใหม่"}
          </h3>
          <button
            type="button"
            className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            onClick={() => setShowModal(false)}
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(92vh-64px)] bg-gray-50/50">
          <div className="p-6">
            <BookingForm 
              rooms={rooms}
              equipments={equipments}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowModal(false)}
              initialData={editingBooking}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
)}



    </div>
  );
}
