
export const LEGAL_CONTENT = {
    privacy: {
        metadata: {
            title: "Privacy Policy",
            lastUpdated: "October 24, 2025",
            version: "1.2.0"
        },
        sections: [
            {
                heading: "1. Data Collection & Local Processing",
                content: "Architex prioritizes a 'Local-First' approach. Room scans (LiDAR point clouds) and camera feeds are processed directly on your device or via our local Python Privacy Node whenever possible. Raw images are not uploaded to our centralized servers unless explicitly shared for community challenges or social features."
            },
            {
                heading: "2. Pi Network Data",
                content: "We authenticate your identity using the Pi Network SDK. We store your wallet address and pseudonym (username) to manage your profile, inventory, and reputation score. We do not have access to your Pi passphrase."
            },
            {
                heading: "3. Smart Contract Interactions",
                content: "Transactions made on the Architex marketplace (Bounties, Purchases) are recorded on the blockchain. This data is public and immutable. Do not include personally identifiable information (PII) in transaction memos or bounty descriptions."
            },
            {
                heading: "4. Third-Party Services",
                content: "We may use decentralized storage (IPFS) for hosting NFT metadata and project assets. While we encrypt sensitive data, data on public IPFS gateways should be considered permanent."
            }
        ]
    },
    terms: {
        metadata: {
            title: "Terms of Service",
            lastUpdated: "October 15, 2025",
            version: "1.1.5"
        },
        sections: [
            {
                heading: "1. Acceptance of Terms",
                content: "By accessing Architex, you agree to be bound by these Terms and the Pi Network Developer Terms. If you do not agree, you may not use the protocol."
            },
            {
                heading: "2. No Professional Advice",
                content: "AI-generated designs and structural suggestions are for visualization purposes only. Architex is not a licensed architectural firm. Always consult a certified structural engineer before removing walls or making structural modifications."
            },
            {
                heading: "3. NFT Ownership",
                content: "When you mint a design as an NFT, you retain full ownership of the generated asset. However, you grant Architex a perpetual, non-exclusive license to display the work for platform promotion."
            },
            {
                heading: "4. Dispute Resolution",
                content: "All disputes arising from Bounties or Service Agreements must be resolved through the Architex Decentralized Arbitration Protocol. The decision of the selected Arbitrator is final and enforced via Smart Contract."
            },
            {
                heading: "5. User Conduct",
                content: "You agree not to upload illegal content, manipulate the Trust Score system, or exploit smart contract vulnerabilities. Violations will result in a permanent ban and forfeiture of staked tokens."
            }
        ]
    }
};
