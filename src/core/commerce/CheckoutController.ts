
import { InventoryService } from './InventoryService';
import { web3Service } from '../blockchain/web3Service';

export interface CheckoutResult {
    success: boolean;
    message: string;
    txHash?: string;
    reason?: 'INVENTORY_FAIL' | 'BLOCKCHAIN_FAIL' | 'USER_CANCEL';
}

export const CheckoutController = {
    /**
     * Orchestrates the Smart Checkout Process:
     * 1. Inventory Check
     * 2. Smart Contract Payment
     */
    handleSmartCheckout: async (projectId: string, price: number, walletAddress: string): Promise<CheckoutResult> => {
        console.log(`[Checkout] Starting Smart Checkout for ${projectId}...`);

        // 1. Inventory Guard
        // We derive a mock SKU. In a real app, this comes from the project BOM.
        // For testing purposes: If price is 999, we simulate an out-of-stock item to trigger the AI flow.
        const sku = price === 999 ? 'OUT_OF_STOCK_ITEM' : `PROJ_${projectId}_BUNDLE`;
        
        const isStockAvailable = await InventoryService.checkRealTimeStock(sku);

        if (!isStockAvailable) {
            return {
                success: false,
                message: "Stock Unavailable. AI is finding alternatives...",
                reason: 'INVENTORY_FAIL'
            };
        }

        // 2. Blockchain Settlement
        try {
            const receipt = await web3Service.purchaseDesign(projectId, price, walletAddress);
            return {
                success: true,
                message: "Payment Confirmed & Contract Signed.",
                txHash: receipt.txHash
            };
        } catch (error: any) {
            console.error("[Checkout] Blockchain Error:", error);
            return {
                success: false,
                message: error.message || "Transaction Failed",
                reason: 'BLOCKCHAIN_FAIL'
            };
        }
    }
};
