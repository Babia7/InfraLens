import { toast } from 'sonner';

const truncate = (text?: string, limit = 280) => {
  if (!text) return undefined;
  return text.length > limit ? `${text.slice(0, limit)}…` : text;
};

export const notifyError = (message: string, detail?: string) => {
  toast.error(message, {
    description: truncate(detail)
  });
};

export const notifySuccess = (message: string, detail?: string) => {
  toast.success(message, {
    description: truncate(detail)
  });
};

export const notifyInfo = (message: string, detail?: string) => {
  toast(message, {
    description: truncate(detail)
  });
};
