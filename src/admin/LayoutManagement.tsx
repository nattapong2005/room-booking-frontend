import { useState, useEffect } from "react";
import { Alert } from "../utils/sweetAlert";
import { Plus, Trash2, Layout as LayoutIcon, Pencil } from "lucide-react";
import Swal from 'sweetalert2';
import { layoutService } from "../services/layoutService";

interface RoomLayout {
  id: string;
  name: string;
  _count?: {
    bookings: number;
  };
}

export default function LayoutManagement() {
  const [layouts, setLayouts] = useState<RoomLayout[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLayouts = async () => {
    try {
      setLoading(true);
      const response = await layoutService.getAllLayouts();
      setLayouts(response.data);
    } catch (error) {
      console.error("Failed to fetch layouts", error);
      Alert.error("ผิดพลาด", "ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLayouts();
  }, []);

  const handleAddItem = async () => {
    const { value: name } = await Swal.fire({
      title: 'เพิ่มรูปแบบการจัดห้อง',
      input: 'text',
      inputPlaceholder: 'ชื่อรูปแบบ (เช่น Classroom)',
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก',
      inputValidator: (value) => {
        if (!value) return 'กรุณากรอกข้อมูล';
      }
    });

    if (name) {
      try {
        await layoutService.createLayout(name);
        Alert.success('สำเร็จ', 'เพิ่มข้อมูลเรียบร้อยแล้ว');
        fetchLayouts();
      } catch (error) {
        console.error(error);
        Alert.error("ผิดพลาด", "ไม่สามารถเพิ่มข้อมูลได้");
      }
    }
  };

  const handleEditItem = async (item: RoomLayout) => {
    const { value: name } = await Swal.fire({
      title: 'แก้ไขรูปแบบการจัดห้อง',
      input: 'text',
      inputValue: item.name,
      inputPlaceholder: 'ชื่อรูปแบบ',
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก',
      inputValidator: (value) => {
        if (!value) return 'กรุณากรอกข้อมูล';
      }
    });

    if (name && name !== item.name) {
      try {
        await layoutService.updateLayout(item.id, name);
        Alert.success('สำเร็จ', 'แก้ไขข้อมูลเรียบร้อยแล้ว');
        fetchLayouts();
      } catch (error) {
        console.error(error);
        Alert.error("ผิดพลาด", "ไม่สามารถแก้ไขข้อมูลได้");
      }
    }
  };

  const handleDeleteItem = async (id: string, bookingCount?: number) => {
      if (bookingCount && bookingCount > 0) {
        await Swal.fire({
          icon: 'warning',
          title: 'ไม่สามารถลบได้',
          text: `มีการใช้งานรูปแบบนี้ในการจอง ${bookingCount} รายการ`,
          confirmButtonText: 'เข้าใจแล้ว'
        });
        return;
      }

      const result = await Alert.confirm("ยืนยันการลบ", "ต้องการลบข้อมูลนี้ใช่หรือไม่?", "ลบ", true);
      if (result.isConfirmed) {
          try {
            await layoutService.deleteLayout(id);
            Alert.success("ลบสำเร็จ", "ข้อมูลถูกลบเรียบร้อยแล้ว");
            fetchLayouts();
          } catch (error) {
            console.error(error);
            Alert.error("ผิดพลาด", "ไม่สามารถลบข้อมูลได้");
          }
      }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">จัดการรูปแบบการจัดห้อง</h2>
            <p className="text-sm text-gray-500">จัดการรูปแบบการจัดโต๊ะและที่นั่งสำหรับแสดงให้ผู้ใช้เลือก</p>
        </div>
        <button 
            onClick={handleAddItem}
            disabled={loading}
            className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer disabled:opacity-50"
        >
          <Plus size={18} />
          เพิ่มรูปแบบ
        </button>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อรูปแบบการจัดที่นั่ง</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">การใช้งาน (ครั้ง)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                      กำลังโหลดข้อมูล...
                    </td>
                  </tr>
                ) : layouts.length > 0 ? (
                  layouts.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <LayoutIcon size={18} />
                                </div>
                                <span className="text-sm text-gray-900 font-medium">{item.name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-500">
                            {item._count?.bookings || 0}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                                <button 
                                    onClick={() => handleEditItem(item)}
                                    className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                                    title="แก้ไข"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button 
                                    onClick={() => handleDeleteItem(item.id, item._count?.bookings)}
                                    className={`p-2 rounded-lg transition-colors ${
                                      (item._count?.bookings || 0) > 0 
                                      ? "text-gray-400 cursor-not-allowed" 
                                      : "text-red-600 hover:text-red-900 hover:bg-red-50"
                                    }`}
                                    title={(item._count?.bookings || 0) > 0 ? "ไม่สามารถลบได้เนื่องจากมีการใช้งาน" : "ลบ"}
                                    disabled={(item._count?.bookings || 0) > 0}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))
                ) : (
                    <tr>
                        <td colSpan={3} className="px-6 py-10 text-center text-gray-500 text-sm">
                            ไม่พบข้อมูลรูปแบบการจัดห้อง
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}
