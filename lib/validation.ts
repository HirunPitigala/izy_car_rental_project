
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
