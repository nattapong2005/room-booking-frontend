import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import Swal from 'sweetalert2';
import { User, Lock, ArrowLeft, Loader2, CalendarCheck } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login({
        username,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      Swal.fire({
        icon: 'success',
        title: 'เข้าสู่ระบบสำเร็จ',
        text: `ยินดีต้อนรับคุณ ${user.fullName}`,
        timer: 1500,
        showConfirmButton: false,
      });

      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'เข้าสู่ระบบไม่สำเร็จ',
        text: error.response?.data?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2751ad] via-[#4da6e0] to-[#e8f4f8] p-4 font-sans">
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in border border-white/20">
        
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2751ad] text-white rounded-2xl shadow-lg mb-4 transform hover:rotate-6 transition-transform">
            <CalendarCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">ระบบจองห้องประชุม</h2>
          <p className="text-gray-500 text-sm mt-1">วิทยาลัยอาชีวศึกษานครปฐม</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username Field */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1.5 ml-1" htmlFor="username">
              ชื่อผู้ใช้งาน
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2751ad] transition-colors">
                <User size={18} />
              </div>
              <input
                id="username"
                type="text"
                placeholder="กรอกชื่อผู้ใช้งาน"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2751ad]/20 focus:border-[#2751ad] transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1.5 ml-1" htmlFor="password">
              รหัสผ่าน
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2751ad] transition-colors">
                <Lock size={18} />
              </div>
              <input
                id="password"
                type="password"
                placeholder="กรอกรหัสผ่าน"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2751ad]/20 focus:border-[#2751ad] transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#2751ad] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/20 hover:bg-[#1e3d85] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                กำลังเข้าสู่ระบบ...
              </>
            ) : (
              'เข้าสู่ระบบ'
            )}
          </button>
        </form>

        {/* Helper Links */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
          <Link 
            to="/" 
            className="text-[#2751ad] hover:text-blue-700 text-sm font-medium flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={16} />
            กลับหน้าหลัก
          </Link>
          <span className="text-gray-400 text-xs">ติดต่อผู้ดูแลระบบ</span>
        </div>
      </div>
    </div>
  );
};

export default Login;