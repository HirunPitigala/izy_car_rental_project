
/**
 * Validates Sri Lankan National Identity Card (NIC) numbers.
 * Supports:
 * - Old format: 9 digits followed by V, v, X, or x.
 * - New format: 12 digits.
 * 
 * @param nic The NIC number to validate
 * @returns Object with `valid` boolean and optional `error` message
 */
export function validateNIC(nic: string): { valid: boolean; error?: string } {
    if (!nic) return { valid: false, error: "NIC number is required" };

    const trimmedNic = nic.trim();
    if (!trimmedNic) return { valid: false, error: "NIC number cannot be empty" };

    // Check for old format (9 digits + V/X)
    if (/^[0-9]{9}[a-zA-Z]$/.test(trimmedNic)) {
        if (!/^[0-9]{9}[vVxX]$/.test(trimmedNic)) {
            return { valid: false, error: "Old NIC must end with 'V' or 'X'" };
        }
        return { valid: true };
    }

    // Check for new format (12 digits)
    if (/^[0-9]+$/.test(trimmedNic)) {
        if (trimmedNic.length !== 12) {
            return { valid: false, error: `New NIC must be 12 digits (you entered ${trimmedNic.length})` };
        }
        return { valid: true };
    }

    // Check for common mistakes
    if (/^[0-9]{9}$/.test(trimmedNic)) {
        return { valid: false, error: "Old NIC must end with 'V' or 'X'" };
    }

    return { valid: false, error: "Invalid format. Use 9 digits + V/X or 12 digits" };
}
/**
 * Validates Address input based on specific business rules.
 * Rules:
 * - Not empty (trimmed).
 * - Length: 5 - 200 characters.
 * - Allowed characters: Letters, Numbers, Spaces, and , . / - #
 * - Must contain at least one letter (a-z or A-Z).
 * 
 * @param address The address string to validate
 * @returns Object with `valid` boolean and optional `error` message
 */
export function validateAddress(address: string): { valid: boolean; error?: string } {
    if (!address) return { valid: false, error: "Address is required" };

    const trimmed = address.trim();
    if (!trimmed) return { valid: false, error: "Address is required" };

    if (trimmed.length < 5) return { valid: false, error: "Address is too short" };
    if (trimmed.length > 200) return { valid: false, error: "Address is too long" };

    // Allowed characters: A-Za-z0-9 , . / - # and spaces
    const allowedCharsRegex = /^[A-Za-z0-9\s,.\/\-#]+$/;
    if (!allowedCharsRegex.test(trimmed)) {
        return { valid: false, error: "Address contains invalid characters" };
    }

    // Must contain at least one letter
    if (!/[A-Za-z]/.test(trimmed)) {
        return { valid: false, error: "Address must contain valid location details" };
    }

    return { valid: true };
}

/**
 * Validates Sri Lankan Postal Code.
 * Rule: Exactly 5 digits.
 * 
 * @param code The postal code string to validate
 * @returns Object with `valid` boolean and optional `error` message
 */
export function validatePostalCode(code: string): { valid: boolean; error?: string } {
    if (!code) return { valid: false, error: "Postal code is required" };
    const trimmed = code.trim();
    if (!/^[0-9]{5}$/.test(trimmed)) {
        return { valid: false, error: "Invalid postal code" };
    }
    return { valid: true };
}
