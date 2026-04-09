import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { emailVerificationTokens } from '@/src/db/schema';
import type { EmailVerificationToken, NewEmailVerificationToken } from '../types';

/** Retrieve all email verification tokens */
export async function getAllEmailVerificationTokens(): Promise<
  EmailVerificationToken[]
> {
  return db.select().from(emailVerificationTokens);
}

/** Retrieve a single token record by primary key */
export async function getEmailVerificationTokenById(
  id: number,
): Promise<EmailVerificationToken | undefined> {
  const rows = await db
    .select()
    .from(emailVerificationTokens)
    .where(eq(emailVerificationTokens.id, id));
  return rows[0];
}

/** Retrieve a token record by the token string itself */
export async function getEmailVerificationTokenByToken(
  token: string,
): Promise<EmailVerificationToken | undefined> {
  const rows = await db
    .select()
    .from(emailVerificationTokens)
    .where(eq(emailVerificationTokens.token, token));
  return rows[0];
}

/** Retrieve all tokens belonging to a specific user */
export async function getEmailVerificationTokensByUserId(
  userId: number,
): Promise<EmailVerificationToken[]> {
  return db
    .select()
    .from(emailVerificationTokens)
    .where(eq(emailVerificationTokens.userId, userId));
}

/** Insert a new email verification token */
export async function createEmailVerificationToken(
  data: NewEmailVerificationToken,
): Promise<void> {
  await db.insert(emailVerificationTokens).values(data);
}

/** Delete a token by primary key (called after successful verification) */
export async function deleteEmailVerificationToken(id: number): Promise<void> {
  await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.id, id));
}

/** Delete all tokens for a specific user (cleanup on re-send / verified) */
export async function deleteEmailVerificationTokensByUserId(
  userId: number,
): Promise<void> {
  await db
    .delete(emailVerificationTokens)
    .where(eq(emailVerificationTokens.userId, userId));
}
