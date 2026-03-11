import { pgTable, serial, varchar, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 100 }).notNull(),
  url: text('url').notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }), // emoji or icon name
  isActive: boolean('is_active').default(true).notNull(),
  order: serial('order'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const profile = pgTable('profile', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
export type Profile = typeof profile.$inferSelect;
export type NewProfile = typeof profile.$inferInsert;
