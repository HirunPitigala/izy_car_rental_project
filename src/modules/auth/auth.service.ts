import { authRepository } from "./auth.repository";
import bcrypt from "bcrypt";
import { validatePassword } from "@/lib/passwordUtils";
import { generateToken } from "@/lib/token";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";
import { encrypt } from "@/lib/auth"; // We will duplicate/move this logic later to keep it self-contained or import from shared
import { LoginDto, RegisterCustomerDto, RegisterManagerDto, RegisterEmployeeDto } from "./auth.dto";
import { randomBytes } from "crypto";

export class AuthService {
    async login(dto: LoginDto): Promise<{ success: boolean; error?: string; token?: string; role?: string; user?: any; expiresAt?: Date; status?: number }> {
        const email = dto.email.trim().toLowerCase();
        const { password } = dto;

        // 1. Check for Admin Bypass (Env variables)
        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (adminEmail && email === adminEmail && password === adminPassword) {
            const role = "admin" as const;

            // Try to find if this admin is in the DB to get their actual ID
            const dbUser = await authRepository.findUserByEmail(email);
            const userId = dbUser?.userId || 0;
            const relatedId = dbUser?.relatedId || 0;

            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
            const token = await encrypt({ userId, role, relatedId, expiresAt });

            return {
                success: true,
                token,
                role,
                expiresAt,
                user: { id: userId, role, email: adminEmail, name: dbUser?.name || "System Admin" }
            };
        }

        // 2. Check Database for regular users or DB-resident admin
        const user = await authRepository.findUserByEmail(email);
        if (!user || !user.passwordHash) {
            return { success: false, error: "Invalid credentials", status: 401 };
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash as string);
        if (!passwordMatch) {
            return { success: false, error: "Invalid credentials", status: 401 };
        }

        if (user.status !== "active") {
            return { success: false, error: "Account is disabled", status: 403 };
        }

        const role = user.role as "admin" | "manager" | "employee" | "customer";
        const userId = user.userId;
        const relatedId = user.relatedId || undefined;
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const token = await encrypt({ userId, role, relatedId, expiresAt });

        return {
            success: true,
            token,
            role,
            expiresAt,
            user: { id: userId, role, email: user.email, name: user.name || "User" }
        };
    }

    async registerCustomer(dto: RegisterCustomerDto) {
        const { email, password, confirmPassword } = dto;

        if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }

        const { isValid, errors } = validatePassword(password, email);
        if (!isValid) {
            throw new Error(errors[0]);
        }

        const existingUser = await authRepository.findUserByEmail(email);
        if (existingUser) {
            throw new Error("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userId = await authRepository.createUser({
            email,
            passwordHash: hashedPassword,
            role: "customer",
            name: "New Customer",
            status: "active",
        });

        const token = generateToken();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await authRepository.saveVerificationToken(userId, token, expiresAt);
        await sendVerificationEmail(email, token);

        return { success: true, message: "Customer registered successfully." };
    }

    async verifyEmail(token: string) {
        const record = await authRepository.findToken(token);

        if (!record || record.expiresAt < new Date()) {
            throw new Error("Token expired or invalid");
        }

        await authRepository.markEmailVerified(record.userId);
        await authRepository.deleteToken(record.id);

        return { success: true, message: "Email verified successfully" };
    }

    async registerManager(dto: RegisterManagerDto) {
        const { email, password, confirmPassword } = dto;

        if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }

        const { isValid, errors } = validatePassword(password, email);
        if (!isValid) {
            throw new Error(errors[0]);
        }

        const existingUser = await authRepository.findUserByEmail(email);
        if (existingUser) {
            throw new Error("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const managerId = await authRepository.createManager({
            name: "New Manager",
            email,
            phone: "",
            password: hashedPassword,
        });

        const userId = await authRepository.createUser({
            email,
            passwordHash: hashedPassword,
            role: "manager",
            relatedId: managerId,
            name: "New Manager",
            status: "active",
        });

        const token = generateToken();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await authRepository.saveVerificationToken(userId, token, expiresAt);
        await sendVerificationEmail(email, token);

        return { success: true, message: "Manager registered successfully." };
    }

    async registerEmployee(dto: RegisterEmployeeDto) {
        const { name, email, password, confirmPassword } = dto;

        if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }

        const { isValid, errors } = validatePassword(password, email);
        if (!isValid) {
            throw new Error(errors[0]);
        }

        const existingUser = await authRepository.findUserByEmail(email);
        if (existingUser) {
            throw new Error("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const employeeId = await authRepository.createEmployee({
            name,
            email,
            password: hashedPassword,
            phone: "", 
        });

        const userId = await authRepository.createUser({
            email,
            passwordHash: hashedPassword,
            role: "employee",
            relatedId: employeeId,
            name,
            status: "inactive",
        });

        const token = generateToken();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await authRepository.saveVerificationToken(userId, token, expiresAt);
        await sendVerificationEmail(email, token);

        return { success: true, message: "Employee registered successfully." };
    }

    async forgotPassword(email: string) {
        const user = await authRepository.findUserByEmail(email);

        if (!user) {
            // Return success to avoid enumeration
            return { success: true, message: "If an account exists with this email, you will receive a password reset link shortly." };
        }

        const token = randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        await authRepository.deleteResetToken(user.userId);
        await authRepository.saveResetToken(user.userId, token, expiresAt);
        await sendPasswordResetEmail(email, token);

        return { success: true, message: "If an account exists with this email, you will receive a password reset link shortly." };
    }

    async resetPassword(token: string, password: string) {
        if (password.length < 8) {
            throw new Error("Password must be at least 8 characters long");
        }

        const resetToken = await authRepository.findResetToken(token);
        if (!resetToken) {
            throw new Error("Invalid or expired reset token. Please request a new password reset link.");
        }

        const passwordHash = await bcrypt.hash(password, 10);
        await authRepository.updateUserPassword(resetToken.userId, passwordHash);
        await authRepository.deleteResetTokenById(resetToken.id);

        return { success: true, message: "Password has been reset successfully." };
    }
}

export const authService = new AuthService();
