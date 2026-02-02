import { useState, useEffect } from "react";
import { Alert } from "../utils/sweetAlert";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { userService } from "../services/userService";
import { departmentService } from "../services/departmentService";
import Swal from 'sweetalert2';

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  departmentId?: string;
  department?: {
    id: string;
    name: string;
  };
  isActive: boolean;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      Alert.error("เกิดข้อผิดพลาด", "ไม่สามารถดึงข้อมูลผู้ใช้งานได้");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAllDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Alert.confirm("ยืนยันการลบ", "คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?", "ลบผู้ใช้", true);
    if (result.isConfirmed) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
        Alert.success("ลบสำเร็จ", "ผู้ใช้ถูกลบออกจากระบบแล้ว");
      } catch (error) {
        Alert.error("ผิดพลาด", "ไม่สามารถลบผู้ใช้ได้");
      }
    }
  };

  const handleAddUser = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'เพิ่มผู้ใช้ใหม่',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="ชื่อผู้ใช้">' +
        '<input id="swal-input2" class="swal2-input" placeholder="รหัสผ่าน" type="password">' +
        '<input id="swal-input3" class="swal2-input" placeholder="ชื่อ-สกุล">' +
        '<input id="swal-input4" class="swal2-input" placeholder="อีเมล" type="email">' +
        '<select id="swal-input5" class="swal2-input">' +
        '<option value="">เลือกแผนก</option>' +
        departments.map(dept => `<option value="${dept.id}">${dept.name}</option>`).join('') +
        '</select>' +
        '<select id="swal-input6" class="swal2-input">' +
        '<option value="USER">ผู้ใช้ทั่วไป</option>' +
        '<option value="HEAD_BUILDING">หัวหน้างานอาคาร</option>' +
        '<option value="HEAD_MEDIA">หัวหน้างานสื่อการเรียนการสอน</option>' +
        '<option value="ADMIN">ผู้ดูแลระบบ</option>' +
        '</select>',
      focusConfirm: false,
      preConfirm: () => {
        return {
          username: (document.getElementById('swal-input1') as HTMLInputElement).value,
          password: (document.getElementById('swal-input2') as HTMLInputElement).value,
          fullName: (document.getElementById('swal-input3') as HTMLInputElement).value,
          email: (document.getElementById('swal-input4') as HTMLInputElement).value,
          departmentId: (document.getElementById('swal-input5') as HTMLSelectElement).value || null,
          role: (document.getElementById('swal-input6') as HTMLSelectElement).value
        }
      }
    });

    if (formValues) {
        try {
            await userService.createUser(formValues);
            Alert.success('สำเร็จ', 'เพิ่มผู้ใช้เรียบร้อยแล้ว');
            fetchUsers();
        } catch (error: any) {
            Alert.error('ผิดพลาด', error.response?.data?.message || 'ไม่สามารถเพิ่มผู้ใช้ได้');
        }
    }
  };

  const handleEditUser = async (user: User) => {
      const { value: formValues } = await Swal.fire({
          title: 'แก้ไขข้อมูลผู้ใช้',
          html:
              `<input id="swal-edit-fullname" class="swal2-input" placeholder="ชื่อ-สกุล" value="${user.fullName}">` +
              `<input id="swal-edit-email" class="swal2-input" placeholder="อีเมล" value="${user.email || ''}">` +
              `<select id="swal-edit-department" class="swal2-input">` +
              `<option value="">เลือกแผนก</option>` +
              departments.map(dept => `<option value="${dept.id}" ${user.departmentId === dept.id ? 'selected' : ''}>${dept.name}</option>`).join('') +
              `</select>` +
              `<select id="swal-edit-role" class="swal2-input">` +
              `<option value="USER" ${user.role === 'USER' ? 'selected' : ''}>ผู้ใช้ทั่วไป</option>` +
              `<option value="HEAD_BUILDING" ${user.role === 'HEAD_BUILDING' ? 'selected' : ''}>หัวหน้างานอาคาร</option>` +
              `<option value="HEAD_MEDIA" ${user.role === 'HEAD_MEDIA' ? 'selected' : ''}>หัวหน้างานสื่อการเรียนการสอน</option>` +
              `<option value="ADMIN" ${user.role === 'ADMIN' ? 'selected' : ''}>ผู้ดูแลระบบ</option>` +
              `</select>`,
          focusConfirm: false,
          preConfirm: () => {
              return {
                  fullName: (document.getElementById('swal-edit-fullname') as HTMLInputElement).value,
                  email: (document.getElementById('swal-edit-email') as HTMLInputElement).value,
                  departmentId: (document.getElementById('swal-edit-department') as HTMLSelectElement).value || null,
                  role: (document.getElementById('swal-edit-role') as HTMLSelectElement).value
              }
          }
      });

      if (formValues) {
          try {
              await userService.updateUser(user.id, formValues);
              Alert.success('สำเร็จ', 'แก้ไขข้อมูลเรียบร้อยแล้ว');
              fetchUsers();
          } catch (error: any) {
              Alert.error('ผิดพลาด', error.response?.data?.message || 'ไม่สามารถแก้ไขข้อมูลได้');
          }
      }
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.department?.name && user.department.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">จัดการผู้ใช้งาน</h2>
        <button 
            onClick={handleAddUser}
            className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer"
        >
          <Plus size={18} />
          เพิ่มผู้ใช้ใหม่
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="ค้นหาชื่อ, ชื่อผู้ใช้, หรือแผนก..."
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
                  <th className="px-4 md:px-6 py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ - สกุล</th>
                  <th className="px-4 md:px-6 py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">แผนก/ฝ่าย</th>
                  <th className="hidden md:table-cell px-4 md:px-6 py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">สิทธิ์</th>
                  <th className="px-4 md:px-6 py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 uppercase tracking-wider text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0 text-xs md:text-base">
                            {user.fullName.charAt(0)}
                          </div>
                          <div className="ml-3 md:ml-4">
                            <div className="text-xs md:text-sm font-medium text-gray-900">{user.fullName}</div>
                            <div className="text-[10px] md:text-sm text-gray-500">{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="text-[11px] md:text-sm text-gray-900">{user.department?.name || '-'}</div>
                      </td>
                      <td className="hidden md:table-cell px-4 md:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-[10px] md:text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้ทั่วไป'}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center justify-center gap-2 md:gap-3">
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-900 p-1 cursor-pointer" 
                            title="แก้ไข"
                          >
                            <Edit2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id)}
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
                      ไม่พบข้อมูลผู้ใช้งาน
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