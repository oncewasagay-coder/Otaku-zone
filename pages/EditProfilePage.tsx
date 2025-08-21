import React, { useState, useEffect, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { User, CheckCircle, Pencil, LockKeyhole } from 'lucide-react';
import { ImageWithLoader } from '../components/ImageWithLoader';
import { useAuth } from '../contexts/AuthContext';
import { User as UserType } from '../types';

interface EditProfilePageProps {
    onSave: (profile: Partial<UserType>) => void;
}

export const EditProfilePage: React.FC<EditProfilePageProps> = ({ onSave }) => {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setAvatar(user.avatar);
        }
    }, [user]);
    
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, avatar });
    };

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatar(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    if (!user) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-5xl mx-auto"
        >
            <div className="flex items-center gap-4 mb-8">
                <User className="w-8 h-8 text-gray-300" />
                <h2 className="text-3xl font-bold text-white">Edit Profile</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
                {/* Form Section */}
                <form className="md:col-span-2 space-y-6" onSubmit={handleSave}>
                    <div>
                        <label className="text-xs font-bold text-gray-400 tracking-wider">EMAIL ADDRESS</label>
                        <div className="relative mt-2">
                             <input
                                type="email"
                                value={user.email}
                                readOnly
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                            />
                            {user.emailVerified && (
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                    <span className="flex items-center gap-1.5 bg-green-900/50 text-green-400 py-1 px-2 rounded-md border border-green-500/20">
                                        <CheckCircle size={14} /> Verified
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 tracking-wider">YOUR NAME</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 mt-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 tracking-wider">JOINED</label>
                        <input
                            type="text"
                            value={user.joinDate}
                            readOnly
                            className="w-full px-4 py-3 mt-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                        />
                    </div>

                    <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                         <motion.button
                            type="button"
                            className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <LockKeyhole className="w-5 h-5" />
                            <span>Change password</span>
                        </motion.button>
                        <motion.button
                            type="submit"
                            className="w-full sm:w-auto px-10 py-3 bg-[#f9a8d4] text-black font-bold rounded-lg hover:bg-[#f472b6] transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Save
                        </motion.button>
                    </div>
                </form>

                {/* Avatar Section */}
                <div className="flex flex-col items-center justify-start pt-2">
                    <div className="relative group">
                        <ImageWithLoader
                            src={avatar}
                            alt="User Avatar"
                            className="w-40 h-40 rounded-full object-cover border-4 border-gray-700"
                        />
                         <label htmlFor="avatar-upload" className="absolute bottom-2 right-2 p-2.5 bg-white text-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer focus-within:opacity-100 focus-within:ring-2 focus-within:ring-pink-500/50" aria-label="Edit profile picture">
                            <Pencil className="w-4 h-4" />
                            <input id="avatar-upload" type="file" className="sr-only" accept="image/*" onChange={handleAvatarChange} />
                        </label>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
