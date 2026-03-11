import { NextResponse } from 'next/server';
import { db } from '@/db';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const allLinks = await db.select().from(links);
  return NextResponse.json(allLinks);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, url, description, icon } = body;

  const result = await db.insert(links).values({
    title,
    url,
    description: description || null,
    icon: icon || '🔗',
    isActive: true,
  }).returning();

  return NextResponse.json(result[0]);
}
