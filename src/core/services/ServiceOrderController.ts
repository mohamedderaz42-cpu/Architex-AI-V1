
import { MockAdapter } from '../api/contract';
import { web3Service } from '../blockchain/web3Service';
import { OrderEntity } from '../schemas/entities';

export const ServiceOrderController = {
    
    /**
     * Fetches pending jobs for a specific provider.
     */
    getPendingJobs: async (providerId: string): Promise<OrderEntity[]> => {
        // In a real app, this filters orders by providerId and status 'Processing' or 'Shipped' (In Progress)
        return await MockAdapter.services.listPendingJobs(providerId);
    },

    /**
     * Marks a service job as complete.
     * 1. Triggers Smart Contract release.
     * 2. Updates database status.
     */
    markJobComplete: async (orderId: string, walletAddress: string): Promise<{ success: boolean, txHash?: string, message: string }> => {
        try {
            console.log(`[ServiceController] Initiating job completion for ${orderId}...`);
            
            // 1. Smart Contract Interaction
            const receipt = await web3Service.markOrderDelivered(orderId, walletAddress);
            
            // 2. Backend Update
            await MockAdapter.services.completeJob(orderId);

            return {
                success: true,
                txHash: receipt.txHash,
                message: "Job marked complete. Funds released from escrow."
            };
        } catch (error: any) {
            console.error("Job completion failed:", error);
            return {
                success: false,
                message: error.message || "Failed to complete job."
            };
        }
    }
};
