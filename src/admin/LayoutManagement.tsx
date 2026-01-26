import { useState, useEffect } from "react";
import { Alert } from "../utils/sweetAlert";
import { Plus, Trash2, Layout as LayoutIcon } from "lucide-react";
import Swal from 'sweetalert2';

interface RoomLayout {
  id: string;
  name: string;
}

export default function LayoutManagement() {
  const [layouts, setLayouts] = useState<RoomLayout[]>([]);

  useEffect(() => {
    const savedLayouts = localStorage.getItem('layouts');
    if (savedLayouts) setLayouts(JSON.parse(savedLayouts));
    else setLayouts([
        { id: '1', name: 'Classroom (แบบห้องเรียน)' }, 
        { id: '2', name: 'Theater (แบบโรงละคร)' }, 
        { id: '3', name: 'U-Shape (แบบรูปตัวยู)' },
        { id: '4', name: 'Boardroom (แบบโต๊ะประชุมใหญ่)' }
    ]);
  }, []);

  useEffect(() => {
    localStorage.setItem('layouts', JSON.stringify(layouts));
  }, [layouts]);

  const handleAddItem = async () => {
    const { value: name } = await Swal.fire({
      title: 'เพิ่มรูปแบบการจัดห้อง',
      input: 'text',
      inputPlaceholder: 'ชื่อรูปแบบ (เช่น Classroom)',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return 'กรุณากรอกข้อมูล';
      }
    });

    if (name) {
      const newItem = { id: Date.now().toString(), name };
      setLayouts([...layouts, newItem]);
      Alert.success('สำเร็จ', 'เพิ่มข้อมูลเรียบร้อยแล้ว');
    }
  };

  const handleDeleteItem = async (id: string) => {
      const result = await Alert.confirm("ยืนยันการลบ", "ต้องการลบข้อมูลนี้ใช่หรือไม่?", "ลบ", true);
      if (result.isConfirmed) {
          setLayouts(layouts.filter((i) => i.id !== id));
          Alert.success("ลบสำเร็จ", "ข้อมูลถูกลบเรียบร้อยแล้ว");
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
            className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer"
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
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {layouts.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <LayoutIcon size={18} />
                                </div>
                                <span className="text-sm text-gray-900 font-medium">{item.name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                            <button 
                                onClick={() => handleDeleteItem(item.id)}
                                className="text-red-600 hover:text-red-900 p-2"
                            >
                                <Trash2 size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
                {layouts.length === 0 && (
                    <tr>
                        <td colSpan={2} className="px-6 py-4 text-center text-gray-500 text-sm">ไม่พบข้อมูล</td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-yellow-600 bg-yellow-50 p-2 rounded border border-yellow-100 italic">
        * หมายเหตุ: ในเวอร์ชัน Demo ข้อมูลนี้จะถูกบันทึกไว้ใน Browser ของคุณเท่านั้น
      </p>
    </div>
  );
}
