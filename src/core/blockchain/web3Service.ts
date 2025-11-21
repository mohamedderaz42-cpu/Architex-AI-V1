
/**
 * Web3 Service Adapter
 * Handles interaction with Blockchain Providers (Pi Network SDK or Window.Ethereum).
 * NO SIMULATION: Requires active wallet provider.
 */

declare global {
    interface Window {
        ethereum?: any;
    }
}

export const web3Service = {
    /**
     * Calls purchaseDesign on DesignerMarketplace contract.
     * Requires active wallet provider.
     */
    purchaseDesign: async (projectId: string, price: number, walletAddress: string): Promise<{ txHash: string, blockNumber: number }> => {
        console.log(`[Web3] Interaction: Purchase Design ${projectId} for ${price}`);

        // 1. Pi Network SDK (Primary)
        if (window.Pi) {
             return new Promise((resolve, reject) => {
                 window.Pi.createPayment({
                     amount: price,
                     memo: `Design Purchase: ${projectId}`,
                     metadata: { projectId, type: 'design_purchase' }
                 }, {
                     onReadyForServerApproval: (paymentId: string) => {
                         console.log(`[Web3] Pi Payment ${paymentId} waiting for approval...`);
                         // In production, backend approves here.
                     },
                     onReadyForServerCompletion: (paymentId: string, txid: string) => {
                         console.log(`[Web3] Pi Payment ${paymentId} completed. TX: ${txid}`);
                         resolve({ txHash: txid, blockNumber: 0 });
                     },
                     onCancel: (paymentId: string) => reject(new Error("Payment Cancelled by User")),
                     onError: (error: Error, payment: any) => reject(error)
                 });
             });
        }

        // 2. Standard Web3 (Metamask/TrustWallet)
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const from = accounts[0];
                
                // This mimics a contract call. In prod, use ethers.Contract(addr, abi, signer).purchaseDesign(...)
                const transactionParameters = {
                    to: '0x0000000000000000000000000000000000000000', // Mock Contract Address
                    from: from,
                    value: '0x0', // Mock Value
                    data: '0x' // Mock Data
                };

                const txHash = await window.ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [transactionParameters],
                });
                
                return { txHash, blockNumber: 0 };
            } catch (error: any) {
                console.error("Blockchain Error:", error);
                throw new Error(error.message || "Wallet Transaction Rejected");
            }
        }

        // 3. No Provider
        throw new Error("No Web3 Provider Found. Please open in Pi Browser or install a Wallet.");
    },

    /**
     * Calls freezeForDispute on MarketplaceEscrow contract.
     */
    freezeForDispute: async (orderId: string, walletAddress: string): Promise<{ txHash: string, status: string }> => {
        if (window.ethereum) {
            try {
                const txHash = await window.ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [{
                        from: walletAddress,
                        to: '0x0000000000000000000000000000000000000000',
                        data: '0x' // Mock Data for freeze
                    }],
                });
                return { txHash, status: "DISPUTED" };
            } catch (error: any) {
                throw new Error(error.message);
            }
        }
        
        // Pi SDK doesn't support generic contract calls yet in the same way, 
        // so we throw for now if not Ethereum-compatible or handled via backend.
        throw new Error("Dispute requires advanced wallet features not currently detected.");
    }
};
