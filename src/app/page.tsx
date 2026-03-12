'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Sun, Moon, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type LinkType = {
  id: number;
  title: string;
  url: string;
  description: string | null;
  icon: string | null;
  isActive: boolean;
  order: number;
};

type Profile = {
  id: number;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
};

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    // Check system preference
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    
    async function fetchData() {
      try {
        const [linksRes, profileRes] = await Promise.all([
          fetch('/api/links'),
          fetch('/api/profile'),
        ]);
        const linksData = await linksRes.json();
        const profileData = await profileRes.json();

        const activeLinks = linksData.filter((l: LinkType) => l.isActive);
        setLinks(activeLinks.sort((a: LinkType, b: LinkType) => a.order - b.order));
        
        if (profileData[0]) {
          setProfile(profileData[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${darkMode ? 'bg-zinc-50' : 'bg-zinc-950'}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`w-8 h-8 border-2 rounded-full ${darkMode ? 'border-zinc-200 border-t-zinc-800' : 'border-zinc-800 border-t-zinc-200'}`}
        />
      </div>
    );
  }

  const bgClass = darkMode ? 'bg-zinc-50' : 'bg-zinc-950';
  const textClass = darkMode ? 'text-zinc-900' : 'text-zinc-100';
  const textMutedClass = darkMode ? 'text-zinc-500' : 'text-zinc-400';
  const cardClass = darkMode ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800';
  const hoverClass = darkMode ? 'hover:bg-zinc-100' : 'hover:bg-zinc-800';

  return (
    <main className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      {/* Theme Toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-6 right-6 z-50 p-2 rounded-full transition-colors ${cardClass} ${hoverClass} border`}
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait">
          {darkMode ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Admin Toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setShowAdmin(!showAdmin)}
        className={`fixed top-6 right-20 z-50 p-2 rounded-full transition-colors ${cardClass} ${hoverClass} border`}
        aria-label="Toggle admin"
      >
        <AnimatePresence mode="wait">
          {showAdmin ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Admin Panel */}
      <AnimatePresence>
        {showAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-6 z-40 p-4 rounded-xl border ${cardClass} shadow-lg`}
          >
            <Link href="/admin" className={`flex items-center gap-2 ${textMutedClass} hover:${textClass} transition-colors`}>
              Admin Paneline Git →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-20 max-w-md">
        {/* Profile Section */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Avatar */}
          <div className="relative inline-block mb-5">
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className={`w-24 h-24 rounded-full object-cover border-2 ${darkMode ? 'border-zinc-200' : 'border-zinc-800'}`}
              />
            ) : (
              <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 ${darkMode ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-800 border-zinc-700'}`}>
                <span className={`text-3xl font-semibold ${textMutedClass}`}>
                  {profile?.name?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
            )}
            
            {/* Online indicator */}
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-950" />
          </div>

          {/* Name */}
          <h1 className={`text-2xl font-semibold ${textClass} mb-2`}>
            {profile?.name || 'Link Hub'}
          </h1>
          
          {profile?.bio && (
            <p className={`${textMutedClass} text-base max-w-xs mx-auto`}>
              {profile.bio}
            </p>
          )}
        </motion.div>

        {/* Links */}
        <div className="space-y-3">
          {links.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className={`${textMutedClass} mb-4`}>Henüz link eklenmedi</p>
              <Link href="/admin" className={`${textClass} underline underline-offset-4`}>
                Admin paneline git →
              </Link>
            </motion.div>
          ) : (
            links.map((link, index) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${cardClass} ${hoverClass}`}
              >
                {/* Icon */}
                <span className="text-xl flex-shrink-0">
                  {link.icon || '🔗'}
                </span>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium truncate ${textClass}`}>
                    {link.title}
                  </h3>
                  {link.description && (
                    <p className={`text-sm truncate ${textMutedClass}`}>
                      {link.description}
                    </p>
                  )}
                </div>
                
                {/* Arrow */}
                <ExternalLink className={`w-4 h-4 flex-shrink-0 ${textMutedClass} group-hover:${textClass} transition-colors`} />
              </motion.a>
            ))
          )}
        </div>

        {/* Footer */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className={`text-sm ${textMutedClass}`}>
            Powered by <span className="font-medium">Link Hub</span>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
