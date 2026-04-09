import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { passwordResetTokens } from '@/src/db/schema';
import type { PasswordResetToken, NewPasswordResetToken } from '../types';

/** Retrieve all password reset tokens */
export async function getAllPasswordResetTokens(): Promise<PasswordResetToken[]> {
  return db.select().from(passwordResetTokens);
}

/** Retrieve a single password reset token by primary key */
export async function getPasswordResetTokenById(
  id: number,
): Promise<PasswordResetToken | undefined> {
  const rows = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.id, id));
  return rows[0];
}

/** Retrieve a token record by the token string itself */
export async function getPasswordResetTokenByToken(
  token: string,
): Promise<PasswordResetToken | undefined> {
  const rows = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token, token));
  return rows[0];
}

/** Retrieve all tokens belonging to a specific user */
export async function getPasswordResetTokensByUserId(
  userId: number,
): Promise<PasswordResetToken[]> {
  return db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.userId, userId));
}

/** Insert a new password reset token */
export async function createPasswordResetToken(
  data: NewPasswordResetToken,
): Promise<void> {
  await db.insert(passwordResetTokens).values(data);
}

/** Delete a token by primary key (called after successful password reset) */
export async function deletePasswordResetToken(id: number): Promise<void> {
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, id));
}

/** Delete all tokens for a specific user (cleanup on new reset request) */
export async function deletePasswordResetTokensByUserId(userId: number): Promise<void> {
  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.userId, userId));
}
