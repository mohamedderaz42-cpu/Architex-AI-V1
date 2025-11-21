
/**
 * Secure Admin Authentication Module
 * Enforces access control based on wallet whitelisting.
 */

// Hardcoded whitelist of authorized admin wallet addresses (Public Keys)
// In production, this might be queried from a smart contract or secure enclave.
export const ADMIN_WALLETS = [
    'GD...7X', // The default mock user wallet from contract.ts
    'GB...SUPER_ADMIN_ALPHA',
    'GC...GOVERNANCE_MULTISIG'
];

/**
 * Verifies if a given wallet address has Super Admin privileges.
 * @param walletAddress The public key of the connected user.
 */
export const verifyAdminAccess = (walletAddress: string | undefined): boolean => {
    if (!walletAddress) return false;
    // Case-insensitive check
    return ADMIN_WALLETS.some(admin => admin.toLowerCase() === walletAddress.toLowerCase());
};

export const AdminAuth = {
    verify: verifyAdminAccess
};
