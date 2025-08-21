
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon } from 'lucide-react';
import { Settings, ListFolder } from '../types';
import { useAppStore } from '../stores/useAppStore';

// Reusable Components for the Settings Page

const ToggleSwitch: React.FC<{
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}> = ({ label, description, enabled, onChange }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-800/50">
    <div>
      <p className="font-medium text-white">{label}</p>
      {description && <p className="text-sm text-gray-400">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-6 rounded-full transition ${enabled ? 'bg-pink-500' : 'bg-gray-600'}`}
    >
      <motion.div
        className="w-5 h-5 bg-white rounded-full absolute top-0.5"
        animate={{ x: enabled ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 700, damping: 30 }}
      />
    </button>
  </div>
);

const RadioGroup: React.FC<{
  label: string;
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
}> = ({ label, options, selectedValue, onChange }) => (
  <div className="py-4 border-b border-gray-800/50">
    <p className="font-medium text-white mb-3">{label}</p>
    <div className="flex items-center gap-6">
      {options.map((option) => (
        <label key={option} className="flex items-center gap-2 cursor-pointer text-gray-300" onClick={() => onChange(option)}>
          <div className="relative w-5 h-5 rounded-full border-2 border-gray-500 flex items-center justify-center">
            {selectedValue === option && (
              <motion.div
                layoutId={`radio-${label}`}
                className="w-2.5 h-2.5 rounded-full bg-blue-400"
              />
            )}
          </div>
          {option}
        </label>
      ))}
    </div>
  </div>
);

const CheckboxGroup: React.FC<{
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}> = ({ label, options, selectedValues, onChange }) => {
  const handleToggle = (option: string) => {
    const newSelection = selectedValues.includes(option)
      ? selectedValues.filter((item) => item !== option)
      : [...selectedValues, option];
    onChange(newSelection);
  };

  return (
    <div className="py-4 border-b border-gray-800/50">
      <p className="font-medium text-white mb-3">{label}</p>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 cursor-pointer text-gray-300" onClick={() => handleToggle(option)}>
            <div className="relative w-5 h-5 rounded-md border-2 border-gray-500 flex items-center justify-center bg-gray-700/50">
              {selectedValues.includes(option) && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.div>
              )}
            </div>
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};


export const SettingsPage: React.FC = () => {
  const { user, updateUserSettings } = useAppStore();
  const [settings, setSettings] = useState<Settings | null>(user?.settings || null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
        setSettings(user.settings);
    }
  }, [user]);

  const handleSettingChange = <T extends keyof Settings>(key: T, value: Settings[T]) => {
    setSettings(prev => prev ? { ...prev, [key]: value } : null);
  };
  
  const handleSaveChanges = () => {
      if (!settings) return;
      setIsSaving(true);
      updateUserSettings(settings).finally(() => {
        setIsSaving(false)
      });
  };

  const watchListStatusOptions: ListFolder[] = ['Watching', 'On-Hold', 'Plan to Watch', 'Dropped', 'Completed'];
  
  if (!settings) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-4 mb-8">
        <SettingsIcon className="w-8 h-8 text-gray-300" />
        <h2 className="text-3xl font-bold text-white">Settings</h2>
      </div>

      <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-2xl p-6 sm:p-8">
        <ToggleSwitch label="Auto Next" enabled={settings.autoNext} onChange={(val) => handleSettingChange('autoNext', val)} />
        <ToggleSwitch label="Auto Play" enabled={settings.autoPlay} onChange={(val) => handleSettingChange('autoPlay', val)} />
        <ToggleSwitch label="Auto Skip Intro" enabled={settings.autoSkipIntro} onChange={(val) => handleSettingChange('autoSkipIntro', val)} />
        <ToggleSwitch label="Enable DUB" enabled={settings.enableDub} onChange={(val) => handleSettingChange('enableDub', val)} />
        <ToggleSwitch label="Play Original Audio" description="If enabled, the player will play original audio by default." enabled={settings.playOriginalAudio} onChange={(val) => handleSettingChange('playOriginalAudio', val)} />
        <RadioGroup label="Language for anime name" options={['English', 'Japanese']} selectedValue={settings.animeNameLanguage} onChange={(val) => handleSettingChange('animeNameLanguage', val as 'English' | 'Japanese')} />
        <ToggleSwitch label="Show comments at home" enabled={settings.showCommentsAtHome} onChange={(val) => handleSettingChange('showCommentsAtHome', val)} />
        <ToggleSwitch label="Public Watch List" enabled={settings.publicWatchList} onChange={(val) => handleSettingChange('publicWatchList', val)} />
        <CheckboxGroup label="Notification ignore folders" options={watchListStatusOptions} selectedValues={settings.notificationIgnoreFolders} onChange={(val) => handleSettingChange('notificationIgnoreFolders', val as ListFolder[])} />
        <RadioGroup label="Notification ignore language" options={['None', 'SUB', 'DUB']} selectedValue={settings.notificationIgnoreLanguage} onChange={(val) => handleSettingChange('notificationIgnoreLanguage', val as 'None' | 'SUB' | 'DUB')} />
        
        <div className="mt-8">
             <motion.button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="w-full sm:w-auto px-10 py-3 bg-[#f9a8d4] text-black font-bold rounded-lg hover:bg-[#f472b6] transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500/50 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {isSaving ? 'Saving...' : 'Save Settings'}
            </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
