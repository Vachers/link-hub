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
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 max-w-lg relative">
        {/* Profile Section */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          {/* Avatar with glow effect */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse" />
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="relative w-28 h-28 rounded-full mx-auto border-4 border-white/20 object-cover ring-4 ring-purple-500/30"
              />
            ) : (
              <div className="relative w-28 h-28 rounded-full mx-auto border-4 border-white/20 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center ring-4 ring-purple-500/30">
                <span className="text-4xl text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
            )}
            
            {/* Online indicator */}
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-900" />
          </div>

          {/* Name with gradient */}
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
            {user?.name || 'Link Hub'}
          </h1>
          
          {user?.bio && (
            <p className="text-slate-400 text-base max-w-xs mx-auto leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* Stats badges */}
          {userLinks.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
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
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-500 mb-4">Henüz link eklenmedi</p>
              <Link href="/admin" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm">
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
                  <Card className="relative overflow-hidden bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer group">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <CardContent className="relative flex items-center gap-4 p-4">
                      {/* Icon container */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {link.icon || '🔗'}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-base group-hover:text-purple-200 transition-colors truncate">
                          {link.title}
                        </h3>
                        {link.description && (
                          <p className="text-slate-400 text-sm truncate mt-0.5 group-hover:text-slate-300 transition-colors">
                            {link.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Arrow indicator */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-all duration-300 group-hover:translate-x-1">
                        <ExternalLink className="text-slate-400 w-4 h-4 group-hover:text-purple-300 transition-colors" />
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
          <div className="inline-flex items-center gap-2 text-slate-600 text-sm">
            <span>Made with</span>
            <span className="text-red-400">♥</span>
            <span>using</span>
            <span className="text-purple-400">Link Hub</span>
          </div>
          
          <div className="mt-4">
            <Link href="/admin">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-slate-500 hover:text-white hover:bg-white/5"
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
