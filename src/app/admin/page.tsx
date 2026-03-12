'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, Trash2, Save, User, Link2, 
  ExternalLink, Eye, EyeOff, Loader2, Check, Settings,
  ArrowLeft, Sun, Moon, GripVertical
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
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

const EMOJIS = ['🔗', '🌟', '💼', '📧', '📱', '💻', '🎨', '📸', '🎵', '🎬', '📚', '🎮', '🚀', '💡', '🔥', '⚡', '🎯', '👋', '🌍', '💰'];

export default function AdminPage() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'links'>('profile');
  const [darkMode, setDarkMode] = useState(true);

  const [profileForm, setProfileForm] = useState({
    name: '',
    bio: '',
    avatarUrl: '',
  });

  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    description: '',
    icon: '🔗',
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    
    fetchData();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const fetchData = async () => {
    try {
      const [linksRes, profileRes] = await Promise.all([
        fetch('/api/links'),
        fetch('/api/profile'),
      ]);
      const linksData = await linksRes.json();
      const profileData = await profileRes.json();

      setLinks(linksData);
      if (profileData[0]) {
        setProfileForm({
          name: profileData[0].name,
          bio: profileData[0].bio || '',
          avatarUrl: profileData[0].avatarUrl || '',
        });
      }
    } catch {
      toast.error('Veri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!profileForm.name.trim()) {
      toast.error('İsim alanı zorunludur');
      return;
    }

    setSaving(true);
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });
      toast.success('Profil kaydedildi!', {
        icon: <Check className="w-4 h-4 text-emerald-500" />,
      });
      fetchData();
    } catch {
      toast.error('Profil kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  const addLink = async () => {
    if (!newLink.title.trim() || !newLink.url.trim()) {
      toast.error('Başlık ve URL zorunludur');
      return;
    }

    try {
      new URL(newLink.url.startsWith('http') ? newLink.url : `https://${newLink.url}`);
    } catch {
      toast.error('Geçerli bir URL girin');
      return;
    }

    try {
      const url = newLink.url.startsWith('http') ? newLink.url : `https://${newLink.url}`;
      await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newLink, url }),
      });
      toast.success('Link eklendi!', {
        icon: <Check className="w-4 h-4 text-emerald-500" />,
      });
      setNewLink({ title: '', url: '', description: '', icon: '🔗' });
      fetchData();
    } catch {
      toast.error('Link eklenemedi');
    }
  };

  const deleteLink = async (id: number, title: string) => {
    if (!confirm(`"${title}" linkini silmek istediğinize emin misiniz?`)) return;

    try {
      await fetch(`/api/links/${id}`, { method: 'DELETE' });
      toast.success('Link silindi');
      fetchData();
    } catch {
      toast.error('Link silinemedi');
    }
  };

  const toggleLink = async (id: number, isActive: boolean) => {
    try {
      await fetch(`/api/links/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });
      toast.success(isActive ? 'Link aktifleştirildi' : 'Link gizlendi');
      fetchData();
    } catch {
      toast.error('Durum değiştirilemedi');
    }
  };

  const bgClass = darkMode ? 'bg-zinc-50' : 'bg-zinc-950';
  const cardClass = darkMode ? 'bg-white' : 'bg-zinc-900';
  const borderClass = darkMode ? 'border-zinc-200' : 'border-zinc-800';
  const textClass = darkMode ? 'text-zinc-900' : 'text-zinc-100';
  const textMutedClass = darkMode ? 'text-zinc-500' : 'text-zinc-400';
  const inputClass = darkMode ? 'bg-zinc-50 border-zinc-200 focus:border-zinc-400' : 'bg-zinc-950 border-zinc-800 focus:border-zinc-600';
  const hoverClass = darkMode ? 'hover:bg-zinc-100' : 'hover:bg-zinc-800';

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgClass} transition-colors duration-500`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`w-10 h-10 border-2 rounded-full ${darkMode ? 'border-zinc-200 border-t-zinc-900' : 'border-zinc-800 border-t-zinc-100'}`}
        />
      </div>
    );
  }

  return (
    <main className={`min-h-screen w-full ${bgClass} transition-colors duration-500`}>
      <Toaster position="top-right" richColors closeButton theme={darkMode ? 'light' : 'dark'} />
      
      {/* Header */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-zinc-50/95' : 'bg-zinc-950/95'} backdrop-blur-xl border-b ${borderClass}`}>
        <div className="w-full px-6 lg:px-12 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="icon" className={`${textMutedClass} ${hoverClass} rounded-xl`}>
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
              <div>
                <h1 className={`text-xl font-semibold ${textClass} flex items-center gap-2`}>
                  <Settings className="w-5 h-5" />
                  Admin Panel
                </h1>
                <p className={`text-sm ${textMutedClass}`}>Link Hub yönetimi</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-xl border ${borderClass} ${cardClass} ${textMutedClass} ${hoverClass} transition-colors`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </motion.button>
              
              <Link href="/" target="_blank">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className={`gap-2 ${darkMode ? 'bg-zinc-900 hover:bg-zinc-800 text-white' : 'bg-white hover:bg-zinc-100 text-zinc-900'}`}>
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Önizle</span>
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="w-full px-6 lg:px-12 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {[
              { id: 'profile', label: 'Profil', icon: User },
              { id: 'links', label: 'Linkler', icon: Link2 }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'profile' | 'links')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? darkMode 
                      ? 'bg-zinc-900 text-white' 
                      : 'bg-white text-zinc-900'
                    : `${textMutedClass} ${hoverClass}`
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'links' && links.length > 0 && (
                  <Badge variant="secondary" className={darkMode ? 'bg-zinc-200 text-zinc-700' : 'bg-zinc-800 text-zinc-300'}>
                    {links.length}
                  </Badge>
                )}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-8 rounded-2xl border ${borderClass} ${cardClass}`}
              >
                <h2 className={`text-lg font-semibold ${textClass} flex items-center gap-2 mb-8`}>
                  <User className="w-5 h-5" />
                  Profil Bilgileri
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8">
                  {/* Avatar */}
                  <div className="flex flex-col items-center">
                    {profileForm.avatarUrl ? (
                      <img
                        src={profileForm.avatarUrl}
                        alt="Avatar"
                        className={`w-32 h-32 rounded-2xl object-cover border-2 ${borderClass}`}
                      />
                    ) : (
                      <div className={`w-32 h-32 rounded-2xl flex items-center justify-center border-2 ${darkMode ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-800 border-zinc-700'}`}>
                        <span className={`text-5xl font-semibold ${textMutedClass}`}>
                          {profileForm.name?.charAt(0).toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                    <p className={`text-sm ${textMutedClass} mt-3`}>Avatar</p>
                  </div>

                  {/* Form */}
                  <div className="space-y-5">
                    <div>
                      <Label className={`text-sm ${textMutedClass}`}>İsim *</Label>
                      <Input
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className={`mt-1.5 h-12 ${inputClass} ${textClass}`}
                        placeholder="Adınız"
                      />
                    </div>

                    <div>
                      <Label className={`text-sm ${textMutedClass}`}>Biyografi</Label>
                      <Input
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        className={`mt-1.5 h-12 ${inputClass} ${textClass}`}
                        placeholder="Kendinizi tanıtın..."
                      />
                    </div>

                    <div>
                      <Label className={`text-sm ${textMutedClass}`}>Avatar URL</Label>
                      <Input
                        value={profileForm.avatarUrl}
                        onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                        className={`mt-1.5 h-12 ${inputClass} ${textClass}`}
                        placeholder="https://..."
                      />
                    </div>

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button 
                        onClick={saveProfile} 
                        className={`w-full h-12 ${darkMode ? 'bg-zinc-900 hover:bg-zinc-800 text-white' : 'bg-white hover:bg-zinc-100 text-zinc-900'}`}
                        disabled={saving}
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Profili Kaydet
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Links Tab */}
            {activeTab === 'links' && (
              <motion.div
                key="links"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Add Link */}
                <div className={`p-8 rounded-2xl border ${borderClass} ${cardClass}`}>
                  <h2 className={`text-lg font-semibold ${textClass} flex items-center gap-2 mb-6`}>
                    <Plus className="w-5 h-5 text-emerald-500" />
                    Yeni Link Ekle
                  </h2>

                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="relative">
                        <Label className={`text-sm ${textMutedClass}`}>İkon</Label>
                        <button
                          type="button"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className={`mt-1.5 w-14 h-12 rounded-xl border text-2xl flex items-center justify-center ${inputClass}`}
                        >
                          {newLink.icon}
                        </button>
                        {showEmojiPicker && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`absolute top-full left-0 mt-2 p-3 rounded-xl border shadow-xl z-20 ${cardClass} ${borderClass} grid grid-cols-5 gap-2`}
                          >
                            {EMOJIS.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => {
                                  setNewLink({ ...newLink, icon: emoji });
                                  setShowEmojiPicker(false);
                                }}
                                className={`w-10 h-10 rounded-lg text-xl ${hoverClass} transition-colors`}
                              >
                                {emoji}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </div>

                      <div className="flex-1">
                        <Label className={`text-sm ${textMutedClass}`}>Başlık *</Label>
                        <Input
                          value={newLink.title}
                          onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                          className={`mt-1.5 h-12 ${inputClass} ${textClass}`}
                          placeholder="Link başlığı"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className={`text-sm ${textMutedClass}`}>URL *</Label>
                      <Input
                        value={newLink.url}
                        onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                        className={`mt-1.5 h-12 ${inputClass} ${textClass}`}
                        placeholder="https://example.com"
                      />
                    </div>

                    <div>
                      <Label className={`text-sm ${textMutedClass}`}>Açıklama</Label>
                      <Input
                        value={newLink.description}
                        onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                        className={`mt-1.5 h-12 ${inputClass} ${textClass}`}
                        placeholder="Opsiyonel açıklama"
                      />
                    </div>

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button 
                        onClick={addLink} 
                        className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Link Ekle
                      </Button>
                    </motion.div>
                  </div>
                </div>

                {/* Links List */}
                <div className={`p-8 rounded-2xl border ${borderClass} ${cardClass}`}>
                  <h2 className={`text-lg font-semibold ${textClass} flex items-center justify-between mb-6`}>
                    <span className="flex items-center gap-2">
                      <Link2 className="w-5 h-5" />
                      Mevcut Linkler
                    </span>
                    <Badge variant="secondary" className={darkMode ? 'bg-zinc-200 text-zinc-700' : 'bg-zinc-800 text-zinc-300'}>
                      {links.length}
                    </Badge>
                  </h2>

                  {links.length === 0 ? (
                    <div className="text-center py-12">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${darkMode ? 'bg-zinc-100' : 'bg-zinc-800'}`}>
                        <Link2 className={`w-8 h-8 ${textMutedClass}`} />
                      </div>
                      <p className={`${textMutedClass}`}>Henüz link yok</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                      {links.map((link, index) => (
                        <motion.div
                          key={link.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className={`group flex items-center gap-3 p-4 rounded-xl border transition-all ${
                            link.isActive
                              ? `${borderClass}`
                              : `${darkMode ? 'border-zinc-100' : 'border-zinc-800'} opacity-50`
                          }`}
                        >
                          <GripVertical className={`w-4 h-4 ${textMutedClass} opacity-0 group-hover:opacity-100 cursor-grab transition-opacity`} />
                          
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${darkMode ? 'bg-zinc-100' : 'bg-zinc-800'}`}>
                            {link.icon}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium truncate ${textClass}`}>{link.title}</span>
                              {!link.isActive && (
                                <Badge variant="outline" className={`text-xs ${borderClass} ${textMutedClass}`}>
                                  Gizli
                                </Badge>
                              )}
                            </div>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-sm truncate flex items-center gap-1 ${textMutedClass} hover:${textClass} transition-colors`}
                            >
                              {link.url.replace(/^https?:\/\//, '').split('/')[0]}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          
                          <div className="flex gap-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleLink(link.id, !link.isActive)}
                              className={`p-2 rounded-lg transition-colors ${
                                link.isActive
                                  ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                                  : `${textMutedClass} ${hoverClass}`
                              }`}
                            >
                              {link.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteLink(link.id, link.title)}
                              className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
