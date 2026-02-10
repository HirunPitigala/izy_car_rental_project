import { db } from "@/src/db";
import { users, emailVerificationTokens, manager, passwordResetTokens } from "@/src/db/schema";
import { eq, and, gt } from "drizzle-orm";

export class AuthRepository {
    async findUserByEmail(email: string) {
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        return user;
    }


    async createUser(data: typeof users.$inferInsert) {
        const [result] = await db.insert(users).values(data);
        return (result as any).insertId as number;
    }

    async saveVerificationToken(userId: number, token: string, expiresAt: Date) {
        await db.insert(emailVerificationTokens).values({
            userId,
            token,
            expiresAt,
        });
    }

    async findToken(token: string) {
        const [record] = await db.select().from(emailVerificationTokens).where(eq(emailVerificationTokens.token, token));
        return record;
    }

    async markEmailVerified(userId: number) {
        await db.update(users)
            .set({ emailVerified: true, emailVerifiedAt: new Date() })
            .where(eq(users.id, userId));
    }

    async deleteToken(id: number) {
        await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.id, id));
    }

    async createManager(data: typeof manager.$inferInsert) {
        const [result] = await db.insert(manager).values(data);
        return (result as any).insertId as number;
    }

    async deleteResetToken(userId: number) {
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, userId));
    }

    async saveResetToken(userId: number, token: string, expiresAt: Date) {
        await db.insert(passwordResetTokens).values({
            userId,
            token,
            expiresAt,
        });
    }

    async findResetToken(token: string) {
        // Find valid token
        const [record] = await db.select()
            .from(passwordResetTokens)
            .where(
                and(
                    eq(passwordResetTokens.token, token),
                    gt(passwordResetTokens.expiresAt, new Date())
                )
            ).limit(1);
        return record;
    }

    async updateUserPassword(userId: number, hash: string) {
        await db.update(users).set({ passwordHash: hash }).where(eq(users.id, userId));
    }

    async deleteResetTokenById(id: number) {
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, id));
    }
}

export const authRepository = new AuthRepository();
