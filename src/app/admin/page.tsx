'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, Trash2, Save, User, Link2, 
  ExternalLink, Eye, EyeOff, Loader2, Check, Settings,
  ArrowLeft, Sparkles, GripVertical
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Spotlight } from '@/components/ui/aceternity/spotlight';
import { BackgroundGradient } from '@/components/ui/aceternity/background-gradient';

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
    fetchData();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full"
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-zinc-950 relative overflow-hidden">
      <Toaster position="top-right" richColors closeButton theme="dark" />
      
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(255,255,255,0.02)" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="container mx-auto max-w-2xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white hover:bg-zinc-900">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Admin
                </h1>
                <p className="text-zinc-600 text-sm">Link Hub yönetimi</p>
              </div>
            </div>
            
            <Link href="/" target="_blank">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white">
                  <Eye className="w-4 h-4 mr-2" />
                  Önizle
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-2xl px-4 py-8 relative z-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {['profile', 'links'].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab as 'profile' | 'links')}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                activeTab === tab
                  ? 'bg-white text-zinc-950'
                  : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab === 'profile' ? <User className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
              {tab === 'profile' ? 'Profil' : 'Linkler'}
              {tab === 'links' && links.length > 0 && (
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <BackgroundGradient className="rounded-3xl" animate={false}>
                <div className="p-6 bg-zinc-950 rounded-3xl">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                    <User className="w-5 h-5 text-zinc-400" />
                    Profil Bilgileri
                  </h2>
                  
                  {profileForm.avatarUrl && (
                    <div className="flex justify-center mb-6">
                      <img
                        src={profileForm.avatarUrl}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full border-2 border-zinc-800 object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label className="text-zinc-400 text-sm">İsim *</Label>
                      <Input
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="mt-1.5 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-zinc-600"
                        placeholder="Adınız"
                      />
                    </div>

                    <div>
                      <Label className="text-zinc-400 text-sm">Biyografi</Label>
                      <Input
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        className="mt-1.5 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-zinc-600"
                        placeholder="Kendinizi tanıtın..."
                      />
                    </div>

                    <div>
                      <Label className="text-zinc-400 text-sm">Avatar URL</Label>
                      <Input
                        value={profileForm.avatarUrl}
                        onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                        className="mt-1.5 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-zinc-600"
                        placeholder="https://..."
                      />
                    </div>

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button 
                        onClick={saveProfile} 
                        className="w-full bg-white text-zinc-950 hover:bg-zinc-200 h-11"
                        disabled={saving}
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Kaydet
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </BackgroundGradient>
            </motion.div>
          )}

          {/* Links Tab */}
          {activeTab === 'links' && (
            <motion.div
              key="links"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Add Link */}
              <BackgroundGradient className="rounded-3xl" animate={false}>
                <div className="p-6 bg-zinc-950 rounded-3xl">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                    <Plus className="w-5 h-5 text-emerald-500" />
                    Yeni Link
                  </h2>

                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="relative">
                        <Label className="text-zinc-400 text-sm">İkon</Label>
                        <button
                          type="button"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="mt-1.5 w-14 h-11 rounded-lg bg-zinc-900 border border-zinc-800 text-2xl hover:bg-zinc-800 transition-colors flex items-center justify-center"
                        >
                          {newLink.icon}
                        </button>
                        {showEmojiPicker && (
                          <div className="absolute top-full left-0 mt-2 p-2 bg-zinc-900 border border-zinc-800 rounded-xl grid grid-cols-5 gap-1 z-20 shadow-2xl">
                            {EMOJIS.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => {
                                  setNewLink({ ...newLink, icon: emoji });
                                  setShowEmojiPicker(false);
                                }}
                                className="w-9 h-9 hover:bg-zinc-800 rounded-lg text-xl"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <Label className="text-zinc-400 text-sm">Başlık *</Label>
                        <Input
                          value={newLink.title}
                          onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                          className="mt-1.5 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
                          placeholder="Link başlığı"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-zinc-400 text-sm">URL *</Label>
                      <Input
                        value={newLink.url}
                        onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                        className="mt-1.5 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
                        placeholder="https://example.com"
                      />
                    </div>

                    <div>
                      <Label className="text-zinc-400 text-sm">Açıklama</Label>
                      <Input
                        value={newLink.description}
                        onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                        className="mt-1.5 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
                        placeholder="Opsiyonel"
                      />
                    </div>

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button 
                        onClick={addLink} 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 h-11"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Ekle
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </BackgroundGradient>

              {/* Links List */}
              <BackgroundGradient className="rounded-3xl" animate={false}>
                <div className="p-6 bg-zinc-950 rounded-3xl">
                  <h2 className="text-lg font-semibold text-white flex items-center justify-between mb-6">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-zinc-500" />
                      Linkler
                    </span>
                    <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">
                      {links.length}
                    </Badge>
                  </h2>

                  {links.length === 0 ? (
                    <div className="text-center py-12">
                      <Link2 className="w-12 h-12 text-zinc-800 mx-auto mb-3" />
                      <p className="text-zinc-600">Henüz link yok</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {links.map((link, index) => (
                        <motion.div
                          key={link.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`group flex items-center gap-3 p-3 rounded-xl border transition-all ${
                            link.isActive
                              ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                              : 'bg-zinc-900/20 border-zinc-900 opacity-50'
                          }`}
                        >
                          <GripVertical className="w-4 h-4 text-zinc-700 opacity-0 group-hover:opacity-100 cursor-grab" />
                          
                          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-xl">
                            {link.icon}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium truncate">{link.title}</span>
                              {!link.isActive && (
                                <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-600">
                                  Gizli
                                </Badge>
                              )}
                            </div>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-zinc-600 text-sm truncate hover:text-zinc-400 flex items-center gap-1"
                            >
                              {link.url}
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
                                  ? 'text-emerald-500 hover:bg-emerald-500/10'
                                  : 'text-zinc-600 hover:bg-zinc-800'
                              }`}
                            >
                              {link.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteLink(link.id, link.title)}
                              className="p-2 rounded-lg text-red-500 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </BackgroundGradient>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
