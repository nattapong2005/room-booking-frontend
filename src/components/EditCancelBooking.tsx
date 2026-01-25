import { useState } from "react";

export default function EditCancelBooking() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      alert("กรุณากรอกเบอร์โทรศัพท์");
      return;
    }
    // Simulate search
    setHasSearched(true);
  };

  const handleReset = () => {
    setPhoneNumber("");
    setHasSearched(false);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mx-auto ">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">แก้ไข / ยกเลิกการจอง</h2>
        <p className="text-gray-500">กรอกเบอร์โทรศัพท์เพื่อค้นหารายการจองของคุณ</p>
      </div>

      {!hasSearched ? (
        <form onSubmit={handleSearch} className="space-y-6">
          <div>
            <label htmlFor="phoneSearch" className="block text-sm font-medium text-gray-700 mb-2">
              เบอร์โทรศัพท์
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phoneSearch"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                placeholder="0xx-xxx-xxxx"
                required
              />
              <div className="absolute left-3 top-3.5 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-rose-500 text-white font-medium py-3 rounded-lg hover:bg-rose-600 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            ค้นหาข้อมูล
          </button>
        </form>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Mock Result State */}
          <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-rose-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-rose-800">ไม่พบข้อมูลการจอง</h3>
            <p className="text-rose-600 mt-1 text-sm">
              ไม่พบรายการจองสำหรับเบอร์โทรศัพท์ <span className="font-bold">{phoneNumber}</span>
            </p>
          </div>

          <button
            onClick={handleReset}
            className="w-full border border-gray-300 text-gray-600 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ค้นหาใหม่
          </button>
        </div>
      )}
    </div>
  );
}
