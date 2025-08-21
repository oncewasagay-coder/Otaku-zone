import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Download } from 'lucide-react';

export const MalIntegrationPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="flex items-center gap-4 mb-8">
        <FileText className="w-8 h-8 text-gray-300" />
        <h2 className="text-3xl font-bold text-white">MyAnimeList Integration</h2>
      </div>

      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8">
        <p className="text-gray-300 mb-6 text-center">
          Import your existing watch list from MyAnimeList or export your h!anime list to share or back it up.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Import Card */}
            <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600/50 flex flex-col items-center text-center">
                <Upload className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Import from MAL</h3>
                <p className="text-sm text-gray-400 mb-4">Upload your `animelist.xml` file to import your list.</p>
                <motion.button 
                    className="w-full bg-blue-500/80 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 1)' }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Upload className="w-4 h-4" />
                    Choose File
                </motion.button>
            </div>

            {/* Export Card */}
             <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600/50 flex flex-col items-center text-center">
                <Download className="w-10 h-10 text-green-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Export to MAL format</h3>
                <p className="text-sm text-gray-400 mb-4">Download your h!anime list as an `xml` file.</p>
                <motion.button 
                    className="w-full bg-green-500/80 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(34, 197, 94, 1)' }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Download className="w-4 h-4" />
                    Download
                </motion.button>
            </div>
        </div>
      </div>
    </motion.div>
  );
};
