'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Spotlight } from '@/components/ui/aceternity/spotlight';
import { SparklesCore } from '@/components/ui/aceternity/sparkles';
import { TextGenerateEffect } from '@/components/ui/aceternity/text-generate';
import { BackgroundGradient } from '@/components/ui/aceternity/background-gradient';
import { motion } from 'framer-motion';

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

  useEffect(() => {
    async function fetchData() {
      try {
        const [linksRes, profileRes] = await Promise.all([
          fetch('/api/links'),
          fetch('/api/profile'),
        ]);
        const linksData = await linksRes.json();
        const profileData = await profileRes.json();

        // Filter active links
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

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full"
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full rounded-md bg-zinc-950 relative overflow-hidden">
      {/* Spotlight Effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="rgba(255,255,255,0.03)"
      />

      {/* Sparkles Background */}
      <div className="absolute inset-0 z-0">
        <SparklesCore
          id="tsparticles"
          background="transparent"
          minSize={0.2}
          maxSize={0.8}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#3f3f46"
        />
      </div>

      {/* Radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_80%,_rgba(63,63,70,0.1),_#09090b,_#09090b)]" />

      <div className="relative z-10 container mx-auto px-4 py-20 max-w-lg">
        {/* Profile Section */}
        <div className="text-center mb-12">
          {/* Avatar */}
          <motion.div 
            className="relative inline-block mb-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <BackgroundGradient className="rounded-full">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-28 h-28 rounded-full object-cover"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-zinc-900 flex items-center justify-center">
                  <span className="text-4xl text-zinc-500 font-bold">
                    {profile?.name?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
              )}
            </BackgroundGradient>
            
            {/* Online indicator */}
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-zinc-950" />
          </motion.div>

          {/* Name with TextGenerateEffect */}
          <TextGenerateEffect
            words={profile?.name || 'Link Hub'}
            className="text-4xl font-bold text-white mb-3"
          />
          
          {profile?.bio && (
            <motion.p 
              className="text-zinc-500 text-base max-w-xs mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {profile.bio}
            </motion.p>
          )}

          {/* Stats */}
          {links.length > 0 && (
            <motion.div 
              className="flex items-center justify-center gap-2 mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 text-sm backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                {links.length} Link
              </span>
            </motion.div>
          )}
        </div>

        {/* Links */}
        <div className="space-y-4">
          {links.length === 0 ? (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-zinc-900/50 border border-zinc-800 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-zinc-700" />
              </div>
              <p className="text-zinc-600 mb-2 text-lg">Henüz link eklenmedi</p>
              <p className="text-zinc-700 text-sm mb-6">Admin panelinden linklerinizi ekleyin</p>
              <Link href="/admin" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                Admin paneline git <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {links.map((link, index) => (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="block group"
                >
                  <BackgroundGradient 
                    className="rounded-2xl"
                    animate={false}
                  >
                    <div className="flex items-center gap-4 p-4 bg-zinc-950 rounded-2xl group-hover:bg-zinc-900/50 transition-colors">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 group-hover:bg-zinc-800 flex items-center justify-center text-2xl flex-shrink-0 transition-all duration-300 group-hover:scale-110">
                        {link.icon || '🔗'}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-lg truncate group-hover:text-zinc-100 transition-colors">
                          {link.title}
                        </h3>
                        {link.description && (
                          <p className="text-zinc-600 text-sm truncate mt-0.5 group-hover:text-zinc-500 transition-colors">
                            {link.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Arrow */}
                      <motion.div 
                        className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-900 group-hover:bg-zinc-800 flex items-center justify-center"
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <ExternalLink className="text-zinc-600 w-4 h-4 group-hover:text-zinc-400 transition-colors" />
                      </motion.div>
                    </div>
                  </BackgroundGradient>
                </motion.a>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="inline-flex items-center gap-2 text-zinc-700 text-sm mb-4">
            <span>Powered by</span>
            <span className="text-zinc-500 font-medium">Link Hub</span>
          </div>
          
          <div>
            <Link href="/admin">
              <motion.button 
                className="text-zinc-600 hover:text-white text-sm transition-colors flex items-center gap-2 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ⚙️ Admin
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
