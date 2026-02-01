/**
 * Password Validation Utility
 * Enforces strict password policies for the application.
 */

export interface HelperValidationResult {
    isValid: boolean;
    errors: string[];
}

export const validatePassword = (
    password: string,
    email?: string,
    username?: string
): HelperValidationResult => {
    const errors: string[] = [];

    // 1. Length Check (8-64 characters)
    if (password.length < 8 || password.length > 64) {
        errors.push("Password must be between 8 and 64 characters long");
    }

    // 2. Complexity Checks
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter");
    }
    if (!/\d/.test(password)) {
        errors.push("Password must contain at least one number");
    }
    if (!/[@$!%*?&#^()_\-+=\[\]{};:'",.<>\/|`~]/.test(password)) {
        errors.push("Password must contain at least one special character");
    }

    // 3. Common Weak Passwords (simplified list)
    const weakPasswords = [
        "password",
        "12345678",
        "admin123",
        "qwerty",
        "user123",
        "pass1234",
        "adminadmin",
    ];
    if (weakPasswords.includes(password.toLowerCase())) {
        errors.push("Password is too common/weak");
    }

    // 4. No Spaces
    if (/\s/.test(password)) {
        errors.push("Password must not contain spaces");
    }

    // 5. User Specific Checks (Email & Username)
    if (email && password.toLowerCase().includes(email.split("@")[0].toLowerCase())) {
        errors.push("Password must not contain parts of your email");
    }

    // Checking full email too just in case
    if (email && password.toLowerCase().includes(email.toLowerCase())) {
        // Already covered by above usually but good to be explicit if split logic misses something specific
        if (!errors.includes("Password must not contain parts of your email")) {
            errors.push("Password must not contain your email address");
        }
    }

    if (username && password.toLowerCase().includes(username.toLowerCase())) {
        errors.push("Password must not contain your username");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};
