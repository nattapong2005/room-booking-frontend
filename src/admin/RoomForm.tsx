import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert } from "../utils/sweetAlert";
import { Save, ArrowLeft, Upload, X } from "lucide-react";
import api from "../utils/api";
import { roomService } from "../services/roomService";

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
  images: RoomImage[];
}

export default function RoomForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    description: "",
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<RoomImage[]>([]);

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
    if (isEditMode) {
      fetchRoom();
    }
  }, [id]);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      const response = await roomService.getRoomById(id as string);
      const room: Room = response.data;
      setFormData({
        name: room.name,
        capacity: room.capacity.toString(),
        description: room.description || "",
        isActive: room.isActive
      });
      setExistingImages(room.images || []);
      
      if (room.images && room.images.length > 0) {
          const fullUrl = room.images[0].url.startsWith('http') 
            ? room.images[0].url 
            : `${getBaseOrigin()}${room.images[0].url}`;
          setImagePreview(fullUrl);
      }
    } catch (error) {
      console.error("Failed to fetch room:", error);
      Alert.error("เกิดข้อผิดพลาด", "ไม่สามารถดึงข้อมูลห้องประชุมได้");
      navigate("/admin/rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleActive = () => {
    setFormData(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.capacity) {
      Alert.error("ข้อมูลไม่ครบถ้วน", "กรุณากรอกชื่อห้องและความจุ");
      return;
    }

    try {
      setLoading(true);
      
      // Use FormData to match backend RoomService which handles file uploads
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("capacity", formData.capacity);
      submitData.append("description", formData.description || "");
      submitData.append("isActive", String(formData.isActive));

      // Only append images if a new file was selected
      // Backend RoomService will upload these and replace existing ones
      if (imageFile) {
        submitData.append("images", imageFile);
      }

      if (isEditMode) {
        await roomService.updateRoom(id as string, submitData);
        Alert.success("สำเร็จ", "แก้ไขข้อมูลห้องประชุมเรียบร้อยแล้ว");
      } else {
        await roomService.createRoom(submitData);
        Alert.success("สำเร็จ", "เพิ่มห้องประชุมเรียบร้อยแล้ว");
      }
      
      navigate("/admin/rooms");
    } catch (error: any) {
      console.error("Submit error:", error);
      const message = error.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้";
      Alert.error("ผิดพลาด", message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode && !formData.name) {
      return <div className="p-8 text-center">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button 
            onClick={() => navigate("/admin/rooms")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
        >
            <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            {isEditMode ? "แก้ไขห้องประชุม" : "เพิ่มห้องประชุมใหม่"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อห้องประชุม <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2.5"
                        placeholder="ระบุชื่อห้องประชุม"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ความจุ (คน) <span className="text-red-500">*</span></label>
                    <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2.5"
                        placeholder="ระบุจำนวนคน"
                        required
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดเพิ่มเติม</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2.5"
                        placeholder="รายละเอียดอุปกรณ์, ขนาดห้อง, หรือข้อมูลอื่นๆ"
                    />
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <button 
                        type="button"
                        onClick={handleToggleActive}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${formData.isActive ? 'bg-indigo-600' : 'bg-gray-200'}`}
                    >
                        <span className="sr-only">Use setting</span>
                        <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.isActive ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                    </button>
                    <span className="text-sm font-medium text-gray-700">เปิดใช้งานห้องประชุมนี้</span>
                </div>
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">รูปภาพห้องประชุม</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors relative min-h-[240px]">
                    {imagePreview ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <img src={imagePreview} alt="Preview" className="max-h-[300px] w-full object-cover rounded-md" />
                            <button 
                                type="button"
                                onClick={() => {
                                    setImagePreview(null);
                                    setImageFile(null);
                                    if (isEditMode) setExistingImages([]);
                                }}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <Upload className="w-12 h-12 text-gray-400 mb-3" />
                            <p className="text-sm text-gray-500 mb-2">คลิกเพื่ออัปโหลดรูปภาพ</p>
                            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                            <input 
                                type="file" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </>
                    )}
                </div>
                {imageFile && <p className="text-xs text-green-600 font-medium">ไฟล์ที่เลือก: {imageFile.name}</p>}
            </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
            <button
                type="button"
                onClick={() => navigate("/admin/rooms")}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                ยกเลิก
            </button>
            <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        กำลังบันทึก...
                    </>
                ) : (
                    <>
                        <Save size={18} className="mr-2" />
                        บันทึกข้อมูล
                    </>
                )}
            </button>
        </div>
      </form>
    </div>
  );
}