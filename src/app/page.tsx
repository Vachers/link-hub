import { db } from '@/db';
import { links, profile } from '@/db/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Sparkles } from 'lucide-react';
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
    <main className="min-h-screen relative overflow-hidden bg-zinc-950">
      {/* Subtle grid pattern */}
      <div 
        className="fixed inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,1) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="container mx-auto px-4 py-16 max-w-lg relative">
        {/* Profile Section */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          {/* Avatar */}
          <div className="relative inline-block mb-6">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="relative w-28 h-28 rounded-full mx-auto border-2 border-zinc-800 object-cover ring-1 ring-zinc-700"
              />
            ) : (
              <div className="relative w-28 h-28 rounded-full mx-auto border-2 border-zinc-800 bg-zinc-900 flex items-center justify-center ring-1 ring-zinc-700">
                <span className="text-4xl text-zinc-400 font-bold">
                  {user?.name?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
            )}
            
            {/* Online indicator */}
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-zinc-950" />
          </div>

          {/* Name */}
          <h1 className="text-3xl font-bold text-white mb-2">
            {user?.name || 'Link Hub'}
          </h1>
          
          {user?.bio && (
            <p className="text-zinc-500 text-base max-w-xs mx-auto leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* Stats */}
          {userLinks.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm">
                <Sparkles className="w-3.5 h-3.5" />
                {userLinks.length} Link
              </span>
            </div>
          )}
        </div>

        {/* Links */}
        <div className="space-y-4">
          {userLinks.length === 0 ? (
            <div className="text-center py-12 animate-in fade-in duration-500">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-zinc-700" />
              </div>
              <p className="text-zinc-600 mb-4">Henüz link eklenmedi</p>
              <Link href="/admin" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
                Admin paneline git →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {userLinks.map((link, index) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group animate-in fade-in slide-in-from-left-4"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                >
                  <Card className="relative overflow-hidden bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-200 hover:scale-[1.01] cursor-pointer">
                    <CardContent className="relative flex items-center gap-4 p-4">
                      {/* Icon container */}
                      <div className="w-11 h-11 rounded-lg bg-zinc-800 flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-zinc-700 transition-colors">
                        {link.icon || '🔗'}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium text-base truncate group-hover:text-zinc-100 transition-colors">
                          {link.title}
                        </h3>
                        {link.description && (
                          <p className="text-zinc-600 text-sm truncate mt-0.5 group-hover:text-zinc-500 transition-colors">
                            {link.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Arrow indicator */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-all duration-200 group-hover:translate-x-0.5">
                        <ExternalLink className="text-zinc-600 w-4 h-4 group-hover:text-zinc-400 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center animate-in fade-in duration-700 delay-500">
          <div className="inline-flex items-center gap-2 text-zinc-700 text-sm">
            <span>Powered by</span>
            <span className="text-zinc-500">Link Hub</span>
          </div>
          
          <div className="mt-4">
            <Link href="/admin">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-zinc-600 hover:text-white hover:bg-zinc-900"
              >
                ⚙️ Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
