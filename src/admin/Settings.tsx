import { useState, useEffect } from "react";
import { Alert } from "../utils/sweetAlert";
import { Save, Plus, Trash2, Layout, Briefcase, Settings as SettingsIcon } from "lucide-react";
import { systemService } from "../services/systemService";
import Swal from 'sweetalert2';

interface SystemConfig {
  id: string;
  maxBookingHours: number;
  advanceBookingDays: number;
  enableNotification: boolean;
}

// Mock Interfaces for missing backend features
interface Position {
  id: string;
  name: string;
}

interface RoomLayout {
  id: string;
  name: string;
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'system' | 'positions' | 'layouts'>('system');
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Local State for missing backend features
  const [positions, setPositions] = useState<Position[]>([]);
  const [layouts, setLayouts] = useState<RoomLayout[]>([]);

  useEffect(() => {
    fetchConfig();
    // Load mocks from local storage
    const savedPositions = localStorage.getItem('positions');
    if (savedPositions) setPositions(JSON.parse(savedPositions));
    else setPositions([
        { id: '1', name: 'แผนกวิชาคอมพิวเตอร์' }, 
        { id: '2', name: 'งานบริหารงานทั่วไป' }
    ]);

    const savedLayouts = localStorage.getItem('layouts');
    if (savedLayouts) setLayouts(JSON.parse(savedLayouts));
    else setLayouts([
        { id: '1', name: 'Classroom' }, 
        { id: '2', name: 'Theater' }, 
        { id: '3', name: 'U-Shape' }
    ]);
  }, []);

  useEffect(() => {
    localStorage.setItem('positions', JSON.stringify(positions));
  }, [positions]);

  useEffect(() => {
    localStorage.setItem('layouts', JSON.stringify(layouts));
  }, [layouts]);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await systemService.getSystemConfig();
      setConfig(response.data);
    } catch (error) {
      console.error("Failed to fetch config:", error);
      // Alert.error("เกิดข้อผิดพลาด", "ไม่สามารถดึงค่าคอนฟิกได้");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!config) return;
    try {
      await systemService.updateSystemConfig({
        maxBookingHours: Number(config.maxBookingHours),
        advanceBookingDays: Number(config.advanceBookingDays),
        enableNotification: config.enableNotification
      });
      Alert.success("บันทึกสำเร็จ", "ตั้งค่าระบบเรียบร้อยแล้ว");
    } catch (error: any) {
      Alert.error("ผิดพลาด", error.response?.data?.message || "ไม่สามารถบันทึกค่าได้");
    }
  };

  // Generic Mock Handlers
  const handleAddItem = async (
    title: string, 
    placeholder: string, 
    items: any[], 
    setItems: any
  ) => {
    const { value: name } = await Swal.fire({
      title: title,
      input: 'text',
      inputPlaceholder: placeholder,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return 'กรุณากรอกข้อมูล';
      }
    });

    if (name) {
      const newItem = { id: Date.now().toString(), name };
      setItems([...items, newItem]);
      Alert.success('สำเร็จ', 'เพิ่มข้อมูลเรียบร้อยแล้ว');
    }
  };

  const handleDeleteItem = async (id: string, items: any[], setItems: any) => {
      const result = await Alert.confirm("ยืนยันการลบ", "ต้องการลบข้อมูลนี้ใช่หรือไม่?", "ลบ", true);
      if (result.isConfirmed) {
          setItems(items.filter((i: any) => i.id !== id));
          Alert.success("ลบสำเร็จ", "ข้อมูลถูกลบเรียบร้อยแล้ว");
      }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">ตั้งค่าระบบ</h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          className={`flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap ${
            activeTab === 'system'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('system')}
        >
          <SettingsIcon size={18} />
          ตั้งค่าทั่วไป
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap ${
            activeTab === 'positions'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('positions')}
        >
          <Briefcase size={18} />
          จัดการตำแหน่ง/แผนก
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap ${
            activeTab === 'layouts'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('layouts')}
        >
          <Layout size={18} />
          รูปแบบการจัดที่นั่ง
        </button>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'system' && (
            loading ? <div className="text-center py-8">กำลังโหลด...</div> : config ? (
            <div className="max-w-xl space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ระยะเวลาจองสูงสุด (ชั่วโมง)</label>
                    <input 
                        type="number" 
                        value={config.maxBookingHours}
                        onChange={(e) => setConfig({...config, maxBookingHours: parseInt(e.target.value)})}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">จองล่วงหน้าได้สูงสุด (วัน)</label>
                    <input 
                        type="number" 
                        value={config.advanceBookingDays}
                        onChange={(e) => setConfig({...config, advanceBookingDays: parseInt(e.target.value)})}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <input 
                        type="checkbox" 
                        id="notify"
                        checked={config.enableNotification}
                        onChange={(e) => setConfig({...config, enableNotification: e.target.checked})}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="notify" className="text-sm font-medium text-gray-700">เปิดใช้งานการแจ้งเตือน</label>
                </div>

                <button 
                    onClick={handleSaveConfig}
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto"
                >
                    <Save size={18} />
                    บันทึกการตั้งค่า
                </button>
            </div>
            ) : <div className="text-red-500">ไม่พบข้อมูลการตั้งค่า</div>
        )}

        {activeTab === 'positions' && (
             <div>
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-500">จัดการรายชื่อตำแหน่งหรือแผนกสำหรับผู้ใช้งาน</div>
                    <button 
                        onClick={() => handleAddItem('เพิ่มตำแหน่ง/แผนก', 'ชื่อตำแหน่ง/แผนก', positions, setPositions)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-700"
                    >
                        <Plus size={16} /> เพิ่ม
                    </button>
                </div>
                <div className="bg-white border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="bg-white divide-y divide-gray-200">
                            {positions.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <button 
                                            onClick={() => handleDeleteItem(item.id, positions, setPositions)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {positions.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="px-6 py-4 text-center text-gray-500 text-sm">ไม่พบข้อมูล</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <p className="mt-2 text-xs text-yellow-600">* ข้อมูลนี้ถูกบันทึกในเบราว์เซอร์เท่านั้น (Demo)</p>
             </div>
        )}

        {activeTab === 'layouts' && (
             <div>
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-500">จัดการรูปแบบการจัดโต๊ะ/ที่นั่งในห้องประชุม</div>
                    <button 
                        onClick={() => handleAddItem('เพิ่มรูปแบบ', 'ชื่อรูปแบบ (เช่น Classroom)', layouts, setLayouts)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-700"
                    >
                        <Plus size={16} /> เพิ่ม
                    </button>
                </div>
                <div className="bg-white border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="bg-white divide-y divide-gray-200">
                            {layouts.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <button 
                                            onClick={() => handleDeleteItem(item.id, layouts, setLayouts)}
                                            className="text-red-600 hover:text-red-900"
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
                <p className="mt-2 text-xs text-yellow-600">* ข้อมูลนี้ถูกบันทึกในเบราว์เซอร์เท่านั้น (Demo)</p>
             </div>
        )}
      </div>
    </div>
  );
}
