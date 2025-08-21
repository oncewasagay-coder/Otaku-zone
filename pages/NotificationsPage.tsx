import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="flex items-center gap-4 mb-8">
        <Bell className="w-8 h-8 text-gray-300" />
        <h2 className="text-3xl font-bold text-white">Notifications</h2>
      </div>

      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-80">
        <Bell className="w-16 h-16 text-gray-600 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No new notifications</h3>
        <p className="text-gray-400">
          This is where you'll see updates about new episodes, recommendations, and more.
          <br />
          Customize your notification preferences in the Settings page.
        </p>
      </div>
    </motion.div>
  );
};
