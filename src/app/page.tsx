'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Sun, Moon, Settings } from 'lucide-react';
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

  useEffect(() => {
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
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${darkMode ? 'bg-zinc-50' : 'bg-zinc-950'}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`w-10 h-10 border-2 rounded-full ${darkMode ? 'border-zinc-200 border-t-zinc-900' : 'border-zinc-800 border-t-zinc-100'}`}
        />
      </div>
    );
  }

  const bgClass = darkMode ? 'bg-zinc-50' : 'bg-zinc-950';
  const textClass = darkMode ? 'text-zinc-900' : 'text-zinc-100';
  const textMutedClass = darkMode ? 'text-zinc-500' : 'text-zinc-400';
  const cardClass = darkMode ? 'bg-white' : 'bg-zinc-900';
  const borderClass = darkMode ? 'border-zinc-200' : 'border-zinc-800';
  const hoverClass = darkMode ? 'hover:bg-zinc-100' : 'hover:bg-zinc-800/50';

  return (
    <main className={`min-h-screen w-full ${bgClass} transition-colors duration-500`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${darkMode ? 'bg-zinc-50/80' : 'bg-zinc-950/80'} backdrop-blur-xl border-b ${borderClass}`}>
        <div className="w-full px-6 lg:px-12 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-xl font-semibold ${textClass}`}
          >
            {profile?.name || 'Link Hub'}
          </motion.div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border ${borderClass} ${cardClass} ${textMutedClass} hover:${textClass} transition-colors`}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-full border ${borderClass} ${cardClass} ${textMutedClass} hover:${textClass} transition-colors`}
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
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full pt-32 pb-16 lg:pt-40 lg:pb-24 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">
            {/* Avatar */}
            <motion.div 
              className="flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="relative">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className={`w-32 h-32 lg:w-40 lg:h-40 rounded-2xl object-cover border-2 ${borderClass}`}
                  />
                ) : (
                  <div className={`w-32 h-32 lg:w-40 lg:h-40 rounded-2xl flex items-center justify-center border-2 ${darkMode ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-800 border-zinc-700'}`}>
                    <span className={`text-5xl lg:text-6xl font-semibold ${textMutedClass}`}>
                      {profile?.name?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                
                {/* Status indicator */}
                <div className={`absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 ${darkMode ? 'border-zinc-50' : 'border-zinc-950'}`} />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div 
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className={`text-4xl lg:text-5xl xl:text-6xl font-bold ${textClass} mb-4 leading-tight`}>
                {profile?.name || 'Link Hub'}
              </h1>
              
              {profile?.bio && (
                <p className={`text-lg lg:text-xl ${textMutedClass} max-w-lg mx-auto lg:mx-0 mb-6`}>
                  {profile.bio}
                </p>
              )}

              {/* Stats */}
              {links.length > 0 && (
                <div className="flex items-center justify-center lg:justify-start gap-4">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${borderClass} ${cardClass} text-sm ${textMutedClass}`}>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                    {links.length} Link
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Links Section */}
      <section className="w-full pb-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {links.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center border ${borderClass} ${darkMode ? 'bg-zinc-100' : 'bg-zinc-800'}`}>
                <span className="text-4xl">🔗</span>
              </div>
              <p className={`text-xl ${textMutedClass} mb-2`}>Henüz link eklenmedi</p>
              <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-zinc-600'} mb-6`}>
                Admin panelinden linklerinizi ekleyin
              </p>
              <Link 
                href="/admin" 
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'} font-medium hover:opacity-90 transition-opacity`}
              >
                Admin Paneline Git
                <ExternalLink className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {links.map((link, index) => (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05, duration: 0.4 }}
                  className={`group block p-6 rounded-2xl border ${borderClass} ${cardClass} ${hoverClass} transition-all duration-200 hover:scale-[1.02]`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${darkMode ? 'bg-zinc-100' : 'bg-zinc-800'} group-hover:scale-110 transition-transform duration-200`}>
                      {link.icon || '🔗'}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-semibold ${textClass} mb-1 group-hover:text-emerald-500 transition-colors`}>
                        {link.title}
                      </h3>
                      {link.description && (
                        <p className={`text-sm ${textMutedClass} line-clamp-2 mb-2`}>
                          {link.description}
                        </p>
                      )}
                      <div className={`flex items-center gap-1 text-xs ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        <span className="truncate">{link.url.replace(/^https?:\/\//, '').split('/')[0]}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className={`w-full py-8 border-t ${borderClass}`}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12 text-center">
          <p className={`text-sm ${textMutedClass}`}>
            Powered by <span className="font-medium">Link Hub</span>
          </p>
        </div>
      </footer>
    </main>
  );
}
