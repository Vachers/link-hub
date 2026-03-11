import { db } from '@/db';
import { links, profile } from '@/db/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [profileData, linksData] = await Promise.all([
    db.select().from(profile).limit(1),
    db.select().from(links).where(eq(links.isActive, true)),
  ]);

  const user = profileData[0];
  const userLinks = linksData.sort((a, b) => a.order - b.order);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-16 max-w-lg">
        {/* Profile Section */}
        <div className="text-center mb-8">
          {user?.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white/20"
            />
          )}
          <h1 className="text-3xl font-bold text-white mb-2">
            {user?.name || 'Link Hub'}
          </h1>
          {user?.bio && (
            <p className="text-slate-400 text-sm">{user.bio}</p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-3">
          {userLinks.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              <p>Henüz link eklenmedi</p>
              <Link href="/admin" className="text-blue-400 hover:underline text-sm mt-2 block">
                Admin paneline git →
              </Link>
            </div>
          ) : (
            userLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-4">
                    <span className="text-2xl">{link.icon || '🔗'}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">{link.title}</h3>
                      {link.description && (
                        <p className="text-slate-400 text-sm truncate">{link.description}</p>
                      )}
                    </div>
                    <ExternalLink className="text-slate-400 w-4 h-4 flex-shrink-0" />
                  </CardContent>
                </Card>
              </a>
            ))
          )}
        </div>

        {/* Admin Link */}
        <div className="mt-8 text-center">
          <Link href="/admin">
            <Button variant="ghost" className="text-slate-500 hover:text-white">
              ⚙️ Admin
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
