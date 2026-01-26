import { useState, useEffect } from "react";
import { Alert } from "../utils/sweetAlert";
import { Plus, Search, Edit2, Trash2, Monitor } from "lucide-react";
import api from "../utils/api";
import { roomService } from "../services/roomService";
import { useNavigate } from "react-router-dom";

interface RoomImage {
  id: string;
  url: string;
}

interface Room {
  id: string;
  name: string;
  capacity: number;
  description: string;
  isActive: boolean;
  images?: RoomImage[];
}

export default function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get the base URL for images by stripping /api/v1
  const getBaseOrigin = () => {
      try {
          const url = new URL(api.defaults.baseURL || 'http://localhost:3000/api/v1');
          return url.origin;
      } catch {
          return 'http://localhost:3000';
      }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomService.getAllRooms();
      setRooms(response.data);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      Alert.error("เกิดข้อผิดพลาด", "ไม่สามารถดึงข้อมูลห้องประชุมได้");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Alert.confirm("ยืนยันการลบ", "คุณแน่ใจหรือไม่ที่จะลบห้องประชุมนี้?", "ลบห้องประชุม", true);
    if (result.isConfirmed) {
      try {
        await roomService.deleteRoom(id);
        setRooms(rooms.filter(room => room.id !== id));
        Alert.success("ลบสำเร็จ", "ห้องประชุมถูกลบออกจากระบบแล้ว");
      } catch (error) {
        Alert.error("ผิดพลาด", "ไม่สามารถลบห้องประชุมได้");
      }
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (room.description && room.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">จัดการห้องประชุม</h2>
        <button 
            onClick={() => navigate("/admin/rooms/new")}
            className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer"
        >
          <Plus size={18} />
          เพิ่มห้องประชุม
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="ค้นหาชื่อห้อง, รายละเอียด..."
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
                <div className="p-10 text-center text-gray-500">กำลังโหลดข้อมูล...</div>
            ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อห้องประชุม</th>
                  <th className="px-4 md:px-6 py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">ความจุ (คน)</th>
                  <th className="hidden md:table-cell px-4 md:px-6 py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">รายละเอียด</th>
                  <th className="px-4 md:px-6 py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 uppercase tracking-wider text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRooms.length > 0 ? (
                  filteredRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50">
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-16 md:h-12 md:w-20 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 overflow-hidden border border-gray-200">
                            {room.images && room.images.length > 0 ? (
                                <img 
                                    src={room.images[0].url.startsWith('http') ? room.images[0].url : `${getBaseOrigin()}${room.images[0].url}`} 
                                    alt={room.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Monitor size={20} />
                            )}
                          </div>
                          <div className="ml-3 md:ml-4">
                            <div className="text-xs md:text-sm font-medium text-gray-900">{room.name}</div>
                            <div className={`text-[10px] ${room.isActive ? 'text-green-600' : 'text-red-500'}`}>
                                {room.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="text-[11px] md:text-sm text-gray-900">{room.capacity}</div>
                      </td>
                      <td className="hidden md:table-cell px-4 md:px-6 py-4">
                        <div className="text-[11px] md:text-sm text-gray-500 truncate max-w-xs">{room.description || '-'}</div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center justify-center gap-2 md:gap-3">
                          <button 
                            onClick={() => navigate(`/admin/rooms/${room.id}`)}
                            className="text-blue-600 hover:text-blue-900 p-1 cursor-pointer" 
                            title="แก้ไข"
                          >
                            <Edit2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                          </button>
                          <button 
                            onClick={() => handleDelete(room.id)}
                            className="text-red-600 hover:text-red-900 p-1 cursor-pointer" 
                            title="ลบ"
                          >
                            <Trash2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500 text-sm">
                      ไม่พบข้อมูลห้องประชุม
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}