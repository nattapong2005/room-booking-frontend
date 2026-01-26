import { useState, useEffect } from "react";
import { Alert } from "../utils/sweetAlert";
import { Plus, Trash2, Briefcase } from "lucide-react";
import Swal from 'sweetalert2';
import { departmentService } from "../services/departmentService";

interface Department {
  id: string;
  name: string;
}

export default function PositionManagement() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentService.getAllDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      Alert.error("เกิดข้อผิดพลาด", "ไม่สามารถดึงข้อมูลแผนกได้");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    const { value: name } = await Swal.fire({
      title: 'เพิ่มตำแหน่ง/แผนก',
      input: 'text',
      inputPlaceholder: 'ชื่อตำแหน่ง/แผนก',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return 'กรุณากรอกข้อมูล';
      }
    });

    if (name) {
      try {
        await departmentService.createDepartment(name);
        Alert.success('สำเร็จ', 'เพิ่มข้อมูลเรียบร้อยแล้ว');
        fetchDepartments();
      } catch (error: any) {
        Alert.error("ผิดพลาด", error.response?.data?.message || "ไม่สามารถเพิ่มข้อมูลได้");
      }
    }
  };

  const handleDeleteItem = async (id: string) => {
      const result = await Alert.confirm("ยืนยันการลบ", "ต้องการลบข้อมูลนี้ใช่หรือไม่?", "ลบ", true);
      if (result.isConfirmed) {
          try {
            await departmentService.deleteDepartment(id);
            setDepartments(departments.filter((i) => i.id !== id));
            Alert.success("ลบสำเร็จ", "ข้อมูลถูกลบเรียบร้อยแล้ว");
          } catch (error: any) {
            Alert.error("ผิดพลาด", error.response?.data?.message || "ไม่สามารถลบข้อมูลได้");
          }
      }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">จัดการตำแหน่ง/แผนก</h2>
            <p className="text-sm text-gray-500">จัดการรายชื่อตำแหน่งหรือแผนกสำหรับผู้ใช้งานในระบบ</p>
        </div>
        <button 
            onClick={handleAddItem}
            className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer"
        >
          <Plus size={18} />
          เพิ่มตำแหน่ง
        </button>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        {loading ? (
            <div className="p-10 text-center text-gray-500">กำลังโหลดข้อมูล...</div>
        ) : (
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อตำแหน่ง/แผนก</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {departments.length > 0 ? (
                        departments.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                            <Briefcase size={18} />
                                        </div>
                                        <span className="text-sm text-gray-900 font-medium">{item.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-medium">
                                    <button 
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="text-red-600 hover:text-red-900 p-2 cursor-pointer"
                                        title="ลบ"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={2} className="px-6 py-4 text-center text-gray-500 text-sm">ไม่พบข้อมูล</td>
                        </tr>
                    )}
                </tbody>
            </table>
        )}
      </div>
    </div>
  );
}