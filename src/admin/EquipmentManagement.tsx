import { useState, useEffect } from "react";
import { Alert } from "../utils/sweetAlert";
import { Plus, Search, Edit2, Trash2, Box } from "lucide-react";
import { equipmentService } from "../services/equipmentService";
import Swal from 'sweetalert2';

interface Equipment {
  id: string;
  name: string;
  detail: string;
}

export default function EquipmentManagement() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const response = await equipmentService.getAllEquipments();
      setEquipments(response.data);
    } catch (error) {
      console.error("Failed to fetch equipments:", error);
      Alert.error("เกิดข้อผิดพลาด", "ไม่สามารถดึงข้อมูลอุปกรณ์ได้");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Alert.confirm("ยืนยันการลบ", "คุณแน่ใจหรือไม่ที่จะลบอุปกรณ์นี้?", "ลบอุปกรณ์", true);
    if (result.isConfirmed) {
      try {
        await equipmentService.deleteEquipment(id);
        setEquipments(equipments.filter(item => item.id !== id));
        Alert.success("ลบสำเร็จ", "อุปกรณ์ถูกลบออกจากระบบแล้ว");
      } catch (error) {
        Alert.error("ผิดพลาด", "ไม่สามารถลบอุปกรณ์ได้");
      }
    }
  };

  const handleAddEquipment = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'เพิ่มอุปกรณ์ใหม่',
      html:
        '<div class="text-left mb-1"><label class="text-sm font-medium">ชื่ออุปกรณ์</label></div>' +
        '<input id="swal-input1" class="swal2-input mb-4" placeholder="ชื่ออุปกรณ์">' +
        '<div class="text-left mb-1"><label class="text-sm font-medium">รายละเอียด</label></div>' +
        '<textarea id="swal-input2" class="swal2-textarea" placeholder="รายละเอียดอุปกรณ์"></textarea>',
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const detail = (document.getElementById('swal-input2') as HTMLInputElement).value;
        
        if (!name) {
            Swal.showValidationMessage('กรุณากรอกชื่ออุปกรณ์');
            return false;
        }

        return {
          name,
          detail
        }
      }
    });

    if (formValues) {
        try {
            await equipmentService.createEquipment(formValues);
            Alert.success('สำเร็จ', 'เพิ่มอุปกรณ์เรียบร้อยแล้ว');
            fetchEquipments();
        } catch (error: any) {
            Alert.error('ผิดพลาด', error.response?.data?.message || 'ไม่สามารถเพิ่มอุปกรณ์ได้');
        }
    }
  };

  const handleEditEquipment = async (item: Equipment) => {
      const { value: formValues } = await Swal.fire({
          title: 'แก้ไขข้อมูลอุปกรณ์',
          html:
            '<div class="text-left mb-1"><label class="text-sm font-medium">ชื่ออุปกรณ์</label></div>' +
            `<input id="swal-edit-name" class="swal2-input mb-4" placeholder="ชื่ออุปกรณ์" value="${item.name}">` +
            '<div class="text-left mb-1"><label class="text-sm font-medium">รายละเอียด</label></div>' +
            `<textarea id="swal-edit-detail" class="swal2-textarea" placeholder="รายละเอียดอุปกรณ์">${item.detail || ''}</textarea>`,
          focusConfirm: false,
          preConfirm: () => {
              const name = (document.getElementById('swal-edit-name') as HTMLInputElement).value;
              const detail = (document.getElementById('swal-edit-detail') as HTMLInputElement).value;

              if (!name) {
                  Swal.showValidationMessage('กรุณากรอกชื่ออุปกรณ์');
                  return false;
              }

              return {
                  name,
                  detail
              }
          }
      });

      if (formValues) {
          try {
              await equipmentService.updateEquipment(item.id, formValues);
              Alert.success('สำเร็จ', 'แก้ไขข้อมูลเรียบร้อยแล้ว');
              fetchEquipments();
          } catch (error: any) {
              Alert.error('ผิดพลาด', error.response?.data?.message || 'ไม่สามารถแก้ไขข้อมูลได้');
          }
      }
  };

  const filteredEquipments = equipments.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.detail && item.detail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">จัดการอุปกรณ์ในห้อง</h2>
        <button 
            onClick={handleAddEquipment}
            className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer"
        >
          <Plus size={18} />
          เพิ่มอุปกรณ์
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="ค้นหาชื่ออุปกรณ์, รายละเอียด..."
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
                  <th className="px-4 md:px-6 py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่ออุปกรณ์</th>
                  <th className="px-4 md:px-6 py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">รายละเอียด</th>
                  <th className="px-4 md:px-6 py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 uppercase tracking-wider text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEquipments.length > 0 ? (
                  filteredEquipments.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
                            <Box size={18} />
                          </div>
                          <div className="ml-3 md:ml-4">
                            <div className="text-xs md:text-sm font-medium text-gray-900">{item.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="text-[11px] md:text-sm text-gray-500 truncate max-w-xs">{item.detail || '-'}</div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center justify-center gap-2 md:gap-3">
                          <button 
                            onClick={() => handleEditEquipment(item)}
                            className="text-blue-600 hover:text-blue-900 p-1 cursor-pointer" 
                            title="แก้ไข"
                          >
                            <Edit2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
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
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500 text-sm">
                      ไม่พบข้อมูลอุปกรณ์
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
