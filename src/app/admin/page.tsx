'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, Trash2, GripVertical, Save, User, Link2, 
  ExternalLink, Eye, EyeOff, Loader2, Check, Settings,
  ArrowLeft, Sparkles
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import Link from 'next/link';

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

// Emoji picker
const EMOJIS = ['🔗', '🌟', '💼', '📧', '📱', '💻', '🎨', '📸', '🎵', '🎬', '📚', '🎮', '🚀', '💡', '🔥', '⚡', '🎯', '👋', '🌍', '💰'];

export default function AdminPage() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'links'>('profile');

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: '',
    bio: '',
    avatarUrl: '',
  });

  // New link form
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
        setProfile(profileData[0]);
        setProfileForm({
          name: profileData[0].name,
          bio: profileData[0].bio || '',
          avatarUrl: profileData[0].avatarUrl || '',
        });
      }
    } catch (error) {
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
    } catch (error) {
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

    // Validate URL
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
    } catch (error) {
      toast.error('Link eklenemedi');
    }
  };

  const deleteLink = async (id: number, title: string) => {
    if (!confirm(`"${title}" linkini silmek istediğinize emin misiniz?`)) return;

    try {
      await fetch(`/api/links/${id}`, { method: 'DELETE' });
      toast.success('Link silindi');
      fetchData();
    } catch (error) {
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
    } catch (error) {
      toast.error('Durum değiştirilemedi');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8">
        <div className="container mx-auto max-w-2xl space-y-6">
          <Skeleton className="h-12 w-48 bg-zinc-900" />
          <Skeleton className="h-96 bg-zinc-900" />
          <Skeleton className="h-64 bg-zinc-900" />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950">
      <Toaster position="top-right" richColors closeButton theme="dark" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
        <div className="container mx-auto max-w-2xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white hover:bg-zinc-900">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Admin Panel
                </h1>
                <p className="text-zinc-600 text-sm">Link Hub yönetimi</p>
              </div>
            </div>
            
            <Link href="/" target="_blank">
              <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white">
                <Eye className="w-4 h-4 mr-2" />
                Önizle
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('profile')}
            className={activeTab === 'profile' ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}
          >
            <User className="w-4 h-4 mr-2" />
            Profil
          </Button>
          <Button
            variant={activeTab === 'links' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('links')}
            className={activeTab === 'links' ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}
          >
            <Link2 className="w-4 h-4 mr-2" />
            Linkler
            {links.length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-zinc-800 text-zinc-400">
                {links.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5 text-zinc-400" />
                Profil Bilgileri
              </CardTitle>
              <CardDescription className="text-zinc-600">
                Ana sayfada görünecek profil bilgileriniz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Avatar Preview */}
              {profileForm.avatarUrl && (
                <div className="flex justify-center mb-4">
                  <img
                    src={profileForm.avatarUrl}
                    alt="Avatar preview"
                    className="w-20 h-20 rounded-full border-2 border-zinc-800 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-zinc-400 flex items-center gap-2">
                  İsim <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-700 focus:border-zinc-600 focus:ring-zinc-700"
                  placeholder="Adınız"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-400">Biyografi</Label>
                <Input
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-700 focus:border-zinc-600 focus:ring-zinc-700"
                  placeholder="Kendinizi tanıtın..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-400">Avatar URL</Label>
                <Input
                  value={profileForm.avatarUrl}
                  onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                  className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-700 focus:border-zinc-600 focus:ring-zinc-700"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <Button 
                onClick={saveProfile} 
                className="w-full bg-white text-zinc-950 hover:bg-zinc-200"
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Profili Kaydet
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Links Tab */}
        {activeTab === 'links' && (
          <div className="space-y-6">
            {/* Add Link Card */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-500" />
                  Yeni Link Ekle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
                  {/* Emoji Picker */}
                  <div className="relative">
                    <Label className="text-zinc-400 mb-1.5 block">İkon</Label>
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="w-14 h-10 rounded-lg bg-zinc-950 border border-zinc-800 text-2xl hover:bg-zinc-900 transition-colors flex items-center justify-center"
                    >
                      {newLink.icon}
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute top-full left-0 mt-2 p-2 bg-zinc-900 border border-zinc-800 rounded-lg grid grid-cols-5 gap-1 z-10 shadow-xl">
                        {EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                              setNewLink({ ...newLink, icon: emoji });
                              setShowEmojiPicker(false);
                            }}
                            className="w-8 h-8 hover:bg-zinc-800 rounded text-xl"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-zinc-400 flex items-center gap-2">
                        Başlık <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={newLink.title}
                        onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                        className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-700 focus:border-zinc-600"
                        placeholder="Link başlığı"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-400 flex items-center gap-2">
                    URL <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-700 focus:border-zinc-600"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-400">Açıklama</Label>
                  <Input
                    value={newLink.description}
                    onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                    className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-700 focus:border-zinc-600"
                    placeholder="Opsiyonel açıklama"
                  />
                </div>

                <Button 
                  onClick={addLink} 
                  className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Link Ekle
                </Button>
              </CardContent>
            </Card>

            {/* Links List */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-zinc-500" />
                    Mevcut Linkler
                  </span>
                  <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">
                    {links.length} link
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {links.length === 0 ? (
                  <div className="text-center py-8">
                    <Link2 className="w-12 h-12 text-zinc-800 mx-auto mb-3" />
                    <p className="text-zinc-600">Henüz link eklenmedi</p>
                    <p className="text-zinc-700 text-sm mt-1">Yukarıdaki formu kullanarak ilk linkinizi ekleyin</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {links.map((link) => (
                      <div
                        key={link.id}
                        className={`group flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                          link.isActive
                            ? 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                            : 'bg-zinc-950/50 border-zinc-900 opacity-50'
                        }`}
                      >
                        {/* Drag handle */}
                        <GripVertical className="w-4 h-4 text-zinc-700 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-xl flex-shrink-0">
                          {link.icon}
                        </div>
                        
                        {/* Content */}
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
                            className="text-zinc-600 text-sm truncate hover:text-zinc-400 transition-colors flex items-center gap-1"
                          >
                            {link.url}
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => toggleLink(link.id, !link.isActive)}
                            className={`h-8 w-8 ${link.isActive ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-zinc-600 hover:bg-zinc-800'}`}
                            title={link.isActive ? 'Gizle' : 'Göster'}
                          >
                            {link.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteLink(link.id, link.title)}
                            className="h-8 w-8 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
