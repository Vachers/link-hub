import { NextResponse } from 'next/server';
import { db } from '@/db';
import { profile } from '@/db/schema';

export async function GET() {
  const profileData = await db.select().from(profile);
  return NextResponse.json(profileData);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, bio, avatarUrl } = body;

  // Check if profile exists
  const existing = await db.select().from(profile);

  let result;
  if (existing.length > 0) {
    // Update existing
    result = await db
      .update(profile)
      .set({
        name,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
        updatedAt: new Date(),
      })
      .returning();
  } else {
    // Create new
    result = await db
      .insert(profile)
      .values({
        name,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
      })
      .returning();
  }

  return NextResponse.json(result[0]);
}
