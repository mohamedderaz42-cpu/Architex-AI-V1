
import { LayersIcon } from '../../components/icons/LayersIcon';
import { GlobeIcon } from '../../components/icons/GlobeIcon';
import { ChartBarIcon } from '../../components/icons/ChartBarIcon';
import { FileTextIcon } from '../../components/icons/FileTextIcon';

// You can import live constants from your contract logic if you want the whitepaper 
// to stay in sync with actual code logic (e.g., fees).
export const PROTOCOL_CONSTANTS = {
    DROPSHIP_FEE: "2.0%",
    AFFILIATE_COMMISSION: "1.5%",
    BOUNTY_FEE: "10%",
    STAKING_APY: "8-15%",
    TOTAL_SUPPLY: "1,000,000,000"
};

export const WHITEPAPER_CONTENT = {
    version: "1.1.0 (Auto-Sync)",
    intro: {
        title: "Abstract",
        body: "Architex is a decentralized protocol designed to democratize interior design and architectural visualization. By leveraging the Pi Network for identity and payments, and combining it with local-first Artificial Intelligence (AI) and SLAM technology, Architex removes the barriers between imagination and realization.",
        problem: "Professional design is expensive, centralized, and lacks privacy. Users surrender data to cloud providers without compensation.",
        solution: "A P2P marketplace governed by a DAO, powered by privacy-preserving AI, and fueled by the ARCHI utility token."
    },
    tokenomics: {
        title: "The ARCHI Token",
        subtitle: "Utility & Governance Token on Pi Network",
        supply: PROTOCOL_CONSTANTS.TOTAL_SUPPLY,
        revenueModel: [
            {
                title: "Dropshipping Fee",
                value: PROTOCOL_CONSTANTS.DROPSHIP_FEE,
                desc: "Paid by Merchant per transaction to the Treasury."
            },
            {
                title: "Affiliate Commission",
                value: PROTOCOL_CONSTANTS.AFFILIATE_COMMISSION,
                desc: "Paid to the Affiliate automatically via Smart Contract."
            },
            {
                title: "Service Bounty Fee",
                value: PROTOCOL_CONSTANTS.BOUNTY_FEE,
                desc: "Waived for Founder Members, deducted from Escrow."
            },
            {
                title: "Staking APY",
                value: PROTOCOL_CONSTANTS.STAKING_APY,
                desc: "Variable yield based on protocol revenue redistribution."
            }
        ]
    },
    tech: [
        {
            title: "Privacy-First AI",
            icon: GlobeIcon,
            color: "text-ai-violet",
            desc: "Architex utilizes a Federated Learning approach (via OpenMined/PySyft concepts). Room scans and raw images are processed locally on the user's device or a secure edge node. Only encrypted gradients are shared to improve the global model, ensuring user privacy is never compromised."
        },
        {
            title: "Smart Contract Escrow",
            icon: LayersIcon,
            color: "text-pi-gold",
            desc: "All high-value transactions (Service Agreements, Bounties, Dropshipping) are secured by multi-signature smart contracts. Funds are locked in escrow and only released upon cryptographic proof of delivery or mutual sign-off."
        }
    ],
    roadmap: [
        { phase: 'Phase 1', title: 'Genesis (Current)', desc: 'Room Scanner, Basic AI, Wallet Integration.', active: true },
        { phase: 'Phase 2', title: 'Growth Engine', desc: 'Dropshipping Logic, Affiliate System, Governance Launch.', active: true }, // Updated status
        { phase: 'Phase 3', title: 'The Metaverse Bridge', desc: 'Export 3D models to VR/AR worlds. Enterprise API.', active: false }
    ]
};
