import { toast } from 'sonner';

/**
 * Custom hook wrapping Sonner toast notification helper methods.
 */
export default function useToast() {
  return {
    toast: (message, options) => toast(message, options),
    success: (message, options) => {
      toast.success(message, {
        ...options,
        style: {
          background: '#162A3E',
          color: '#F0ECE3',
          borderColor: '#B87333',
          ...options?.style
        }
      });
    },
    error: (message, options) => {
      toast.error(message, {
        ...options,
        style: {
          background: '#162A3E',
          color: '#F0ECE3',
          borderColor: '#EF4444',
          ...options?.style
        }
      });
    },
    info: (message, options) => {
      toast.info(message, {
        ...options,
        style: {
          background: '#162A3E',
          color: '#F0ECE3',
          borderColor: '#3B82F6',
          ...options?.style
        }
      });
    }
  };
}
