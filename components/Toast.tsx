import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ message, type }) => {
  const isSuccess = type === 'success';

  return (
    <motion.div
      layout
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -60, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 p-4 rounded-xl shadow-lg text-black ${
        isSuccess ? 'bg-[#f9a8d4]' : 'bg-red-400'
      }`}
    >
      {isSuccess ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
      <div>
        <h3 className="font-bold">{isSuccess ? 'Success' : 'Error'}</h3>
        <p className="text-sm">{message}</p>
      </div>
    </motion.div>
  );
};
