import Swal, { SweetAlertIcon, SweetAlertResult, SweetAlertOptions } from 'sweetalert2';

const baseConfig: SweetAlertOptions = {
  width: '26rem',
  padding: '2rem',
  buttonsStyling: false,
  background: '#ffffff',
  color: '#1f2937',
  customClass: {
    popup: 'rounded-2xl shadow-2xl border border-gray-100 font-sans',
    title: 'text-xl font-bold text-gray-800 mb-2',
    htmlContainer: 'text-gray-600 text-sm leading-relaxed',
    confirmButton: 'bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
    cancelButton: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-2.5 rounded-lg font-medium shadow-sm transition-all duration-200 ml-3 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2',
    actions: 'mt-6 gap-2',
  },
  showClass: {
    popup: 'animate-fade-in duration-300'
  },
  hideClass: {
    popup: 'transition-opacity duration-200 ease-in opacity-0'
  }
};

export const Alert = {
  success: (title: string, text?: string): Promise<SweetAlertResult> => {
    return Swal.fire({
      ...baseConfig,
      icon: 'success',
      title: title,
      text: text,
      confirmButtonText: 'ตกลง',
      customClass: {
        ...baseConfig.customClass,
        confirmButton: 'bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded-lg font-medium shadow-md transition-all duration-200 transform active:scale-95'
      }
    });
  },

  error: (title: string, text?: string): Promise<SweetAlertResult> => {
    return Swal.fire({
      ...baseConfig,
      icon: 'error',
      title: title,
      text: text,
      confirmButtonText: 'ปิด',
      customClass: {
        ...baseConfig.customClass,
        confirmButton: 'bg-red-600 hover:bg-red-700 text-white px-8 py-2.5 rounded-lg font-medium shadow-md transition-all duration-200 transform active:scale-95'
      }
    });
  },

  warning: (title: string, text?: string): Promise<SweetAlertResult> => {
    return Swal.fire({
      ...baseConfig,
      icon: 'warning',
      title: title,
      text: text,
      confirmButtonText: 'ตกลง',
      customClass: {
        ...baseConfig.customClass,
        confirmButton: 'bg-orange-500 hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg font-medium shadow-md transition-all duration-200 transform active:scale-95'
      }
    });
  },

  confirm: (title: string, text: string, confirmButtonText: string = 'ใช่, ดำเนินการ', isDestructive: boolean = false): Promise<SweetAlertResult> => {
    return Swal.fire({
      ...baseConfig,
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'ยกเลิก',
      reverseButtons: false,
      customClass: {
        ...baseConfig.customClass,
        confirmButton: isDestructive 
          ? 'bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
          : baseConfig.customClass?.confirmButton
      }
    });
  },

  custom: (icon: SweetAlertIcon, title: string, text?: string): Promise<SweetAlertResult> => {
    return Swal.fire({
      ...baseConfig,
      icon: icon,
      title: title,
      text: text,
    });
  }
};