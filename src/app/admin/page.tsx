'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, GripVertical, Save, User } from 'lucide-react';

type Link = {
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

export default function AdminPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });
      alert('Profil kaydedildi!');
      fetchData();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const addLink = async () => {
    if (!newLink.title || !newLink.url) return;

    try {
      await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLink),
      });
      setNewLink({ title: '', url: '', description: '', icon: '🔗' });
      fetchData();
    } catch (error) {
      console.error('Error adding link:', error);
    }
  };

  const deleteLink = async (id: number) => {
    if (!confirm('Bu linki silmek istediğinize emin misiniz?')) return;

    try {
      await fetch(`/api/links/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const toggleLink = async (id: number, isActive: boolean) => {
    try {
      await fetch(`/api/links/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });
      fetchData();
    } catch (error) {
      console.error('Error toggling link:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 p-8">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-8">🛠️ Admin Panel</h1>

        {/* Profile Section */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5" />
              Profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-300">İsim</Label>
              <Input
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-300">Biyografi</Label>
              <Input
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-300">Avatar URL</Label>
              <Input
                value={profileForm.avatarUrl}
                onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="https://..."
              />
            </div>
            <Button onClick={saveProfile} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Profili Kaydet
            </Button>
          </CardContent>
        </Card>

        {/* Add Link Section */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Yeni Link Ekle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-[auto_1fr] gap-4">
              <div>
                <Label className="text-slate-300">İkon</Label>
                <Input
                  value={newLink.icon}
                  onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white w-16 text-center text-2xl"
                />
              </div>
              <div>
                <Label className="text-slate-300">Başlık</Label>
                <Input
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Link başlığı"
                />
              </div>
            </div>
            <div>
              <Label className="text-slate-300">URL</Label>
              <Input
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="https://..."
              />
            </div>
            <div>
              <Label className="text-slate-300">Açıklama (opsiyonel)</Label>
              <Input
                value={newLink.description}
                onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Kısa açıklama"
              />
            </div>
            <Button onClick={addLink} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Link Ekle
            </Button>
          </CardContent>
        </Card>

        {/* Links List */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Linkler ({links.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {links.length === 0 ? (
                <p className="text-slate-500 text-center py-4">Henüz link yok</p>
              ) : (
                links.map((link) => (
                  <div
                    key={link.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      link.isActive
                        ? 'bg-slate-700/50 border-slate-600'
                        : 'bg-slate-800/50 border-slate-700 opacity-50'
                    }`}
                  >
                    <GripVertical className="w-4 h-4 text-slate-500 cursor-grab" />
                    <span className="text-xl">{link.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate">{link.title}</div>
                      <div className="text-slate-400 text-sm truncate">{link.url}</div>
                    </div>
                    <Button
                      size="sm"
                      variant={link.isActive ? 'default' : 'outline'}
                      onClick={() => toggleLink(link.id, !link.isActive)}
                    >
                      {link.isActive ? 'Aktif' : 'Pasif'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteLink(link.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preview Link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-blue-400 hover:underline"
            target="_blank"
          >
            🔗 Önizleme sayfasını gör →
          </a>
        </div>
      </div>
    </main>
  );
}
