
import React, { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useToast } from '../Toast';
import { AdminAuth } from '../../core/admin/AdminAuth';
import { UserRole } from '../../core/schemas/entities';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: UserRole | 'admin_wallet'; // 'admin_wallet' forces strict address check
    onRedirect: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole, onRedirect }) => {
    const { user } = useAppStore();
    const { addToast } = useToast();

    useEffect(() => {
        // 1. Check if User Exists
        if (!user) {
            addToast("Please log in to access this area.", "info");
            onRedirect();
            return;
        }

        // 2. Strict Admin Check (Wallet Whitelist)
        if (requiredRole === 'admin_wallet') {
            const isAdmin = AdminAuth.verify(user.walletAddress);
            if (!isAdmin) {
                addToast("⛔ ACCESS DENIED: Unauthorized Admin Wallet.", "error");
                onRedirect();
            }
            return;
        }

        // 3. Standard Role Check
        if (requiredRole && user.role !== requiredRole) {
            // Exception: Admin role can usually access everything, but we keep strict separation for now
            // unless specific logic allows admins to view vendor portals.
            
            addToast(`Restricted Area. Required Role: ${requiredRole.toUpperCase()}`, "error");
            onRedirect();
        }
    }, [user, requiredRole, onRedirect, addToast]);

    // If checks pass (or are pending effect), render children.
    // We return null if conditions fail to prevent flash of protected content before redirect.
    
    if (!user) return null;
    if (requiredRole === 'admin_wallet' && !AdminAuth.verify(user.walletAddress)) return null;
    if (requiredRole && requiredRole !== 'admin_wallet' && user.role !== requiredRole) return null;

    return <>{children}</>;
};
