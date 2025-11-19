
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ProjectEntity, UserEntity, MaterialEntity, TokenEntity, LiquidityPoolEntity, BountyEntity, ArbitratorEntity, ProductEntity, ShippingZone, PromotionEntity, OrderEntity, OrderStatus, ServiceProviderProfile, ServiceAgreementEntity, ReputationEvent, ProposalEntity, ProofOfInstallationStatus, DesignChallengeEntity, ChallengeSubmissionEntity, ScanAnalysis, BillOfMaterialsEntry, ProposalComment, CartItem, MessageEntity, VestingSchedule, OracleData, FuzzTestResult, SignedAgreement, IntegrationTestResult, IntegrationTestStep, StressTestResult, InventoryConflict, CartOptimization, ArbitratorProfile } from '../schemas/entities';
import { PiCoinIcon } from '../../components/icons/PiCoinIcon';
import { ArchitexLogo } from '../../components/icons/ArchitexLogo';

// Initialize Gemini API
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

// --- PERSISTENCE LAYER HELPERS ---
const STORAGE_KEY_PREFIX = 'architex_v1_';

const save = (key: string, data: any) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
    }
};

const load = <T>(key: string, defaultData: T): T => {
    if (typeof window !== 'undefined') {
        const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
        if (item) return JSON.parse(item);
    }
    return defaultData;
};

// --- AUDIO HELPERS (PCM Decoding) ---
const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
};

export const generateSpeech = async (text: string): Promise<AudioBuffer | null> => {
    if (!apiKey) {
        console.warn("TTS Skipped: No API Key");
        return null;
    }
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) return null;

        const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        const audioBuffer = await decodeAudioData(
            decode(base64Audio),
            outputAudioContext,
            24000,
            1,
        );
        return audioBuffer;
    } catch (e) {
        console.error("TTS Generation Failed:", e);
        return null;
    }
};


// --- DEFAULT MOCK DATA (Used for initialization) ---
const defaultProjects: ProjectEntity[] = [
  {
    id: 'proj_01',
    ownerId: 'user_01',
    ownerName: 'ArchieBot',
    name: 'Living Room Remodel',
    status: 'Designing',
    billOfMaterials: [
        { materialId: 'mat_01', name: 'Eco-Friendly Timber', quantity: 20, status: 'Pending', estimatedCost: 1200, ecoImpactScore: 8, imageUrl: 'https://placehold.co/100x100/10B981/FFFFFF/png?text=Timber' },
        { materialId: 'prod_03', name: 'Low-VOC Paint', quantity: 5, status: 'Pending', estimatedCost: 225, ecoImpactScore: 9, imageUrl: 'https://placehold.co/100x100/FDB300/FFFFFF/png?text=Paint' }
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
    isPublic: true,
    thumbnailUrl: 'https://placehold.co/400x300/8B5CF6/FFFFFF/png?text=Living+Room',
    unreadMessages: 2,
    modificationCount: 1,
    isNft: false,
    likes: 12
  },
  {
    id: 'proj_02',
    ownerId: 'user_01',
    ownerName: 'ArchieBot',
    name: 'Kitchen Modernization',
    status: 'Sourcing',
    billOfMaterials: [],
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isPublic: true,
    thumbnailUrl: 'https://placehold.co/400x300/10B981/FFFFFF/png?text=Kitchen',
    unreadMessages: 0,
    modificationCount: 0,
    isNft: false,
    likes: 45
  },
  {
    id: 'proj_03',
    ownerId: 'user_01',
    ownerName: 'ArchieBot',
    name: 'Bedroom Oasis (NFT)',
    status: 'Complete',
    billOfMaterials: [],
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    isPublic: false,
    thumbnailUrl: 'https://placehold.co/400x300/FDB300/FFFFFF/png?text=Bedroom',
    modificationCount: 5,
    isNft: true,
    likes: 8
  },
];

const defaultPublicProjects: ProjectEntity[] = [
    {
        id: 'pub_01', ownerId: 'user_99', ownerName: 'DesignPro_X', name: 'Cyberpunk Loft', status: 'Complete', billOfMaterials: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isPublic: true, thumbnailUrl: 'https://placehold.co/400x300/FDB300/000000/png?text=Cyberpunk', modificationCount: 10, isNft: true, likes: 1250
    },
    {
        id: 'pub_02', ownerId: 'user_88', ownerName: 'EcoWarrior', name: 'Bamboo Zen Garden', status: 'Complete', billOfMaterials: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isPublic: true, thumbnailUrl: 'https://placehold.co/400x300/10B981/FFFFFF/png?text=Zen', modificationCount: 3, isNft: false, likes: 890
    },
    {
        id: 'pub_03', ownerId: 'user_77', ownerName: 'MinimalistMike', name: 'Void Space', status: 'Designing', billOfMaterials: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isPublic: true, thumbnailUrl: 'https://placehold.co/400x300/FFFFFF/000000/png?text=Void', modificationCount: 1, isNft: false, likes: 340
    }
];

const defaultUserTokens: TokenEntity[] = [
    { symbol: 'PiUSD', name: 'Pi USD', balance: 150.75, icon: PiCoinIcon },
    { symbol: 'ARCHI', name: 'Architex Token', balance: 15000, icon: ArchitexLogo },
];

const defaultBounties: BountyEntity[] = [
    {
        id: 'bty_01',
        projectId: 'proj_01',
        title: 'Finalize Lighting Plan',
        description: 'Need an expert to choose and place lighting fixtures for the living room model.',
        reward: 500,
        status: 'Open',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        escrowState: 'Unfunded',
    },
    {
        id: 'bty_02',
        projectId: 'proj_02',
        title: 'Source Eco-Friendly Countertops',
        description: 'Find a supplier for quartz countertops with a high eco-rating.',
        reward: 1200,
        status: 'In Progress',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        escrowState: 'Funded',
        winnerId: 'designer_01',
    },
];

const defaultOrders: OrderEntity[] = [
    { id: 'ord_01', userId: 'user_01', items: [{productId: 'prod_01', quantity: 50}], total: 775, status: 'Shipped', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), proofOfInstallationStatus: 'none' },
    { id: 'ord_02', userId: 'user_01', items: [{productId: 'prod_03', quantity: 5}], total: 225, status: 'Processing', createdAt: new Date().toISOString(), proofOfInstallationStatus: 'none' },
];

const defaultUser: UserEntity = { 
    id: 'user_01', 
    piUsername: 'ArchieBot', 
    walletAddress: 'GD...QW', 
    trustScore: 95, 
    avatarUrl: 'https://placehold.co/100x100/020617/8B5CF6/png?text=A', 
    subscriptionTier: 'Free', 
    role: 'user', 
    vendorProfile: { hasInsurance: false, agreedToIndemnity: false }, 
    stakedArchi: 5000,
    stakingPosition: { amount: 5000, startTime: new Date(Date.now() - 86400000 * 30).toISOString(), lastClaimTime: new Date(Date.now() - 86400000 * 1).toISOString(), unclaimedRewards: 50 },
    miningPosition: { lpTokenAmount: 0, lastClaimTime: new Date().toISOString(), unclaimedRewards: 0 },
    isFounder: false // Default false
};

// --- RICH DATA SEEDING ---
const defaultProducts: ProductEntity[] = [
    { id: 'prod_01', vendorId: 'user_01', name: 'Bamboo Flooring (Dark Walnut)', price: 45.50, inStock: 500, imageUrl: 'https://placehold.co/100x100/5D4037/FFFFFF/png?text=Bamboo', tags: ['Eco-Friendly', 'Structural'] },
    { id: 'prod_02', vendorId: 'user_01', name: 'Recycled Steel I-Beams', price: 125.00, inStock: 80, imageUrl: 'https://placehold.co/100x100/607D8B/FFFFFF/png?text=Steel', tags: ['Structural', 'Industrial'] },
    { id: 'prod_03', vendorId: 'user_01', name: 'Low-VOC Paint (Eggshell)', price: 45.00, inStock: 250, imageUrl: 'https://placehold.co/100x100/FFF9C4/000000/png?text=Paint', tags: ['Decor', 'Eco-Friendly'] },
    { id: 'prod_04', vendorId: 'user_02', name: 'Solar Glass Roof Tiles', price: 85.00, inStock: 1200, imageUrl: 'https://placehold.co/100x100/0288D1/FFFFFF/png?text=Solar', tags: ['Eco-Friendly', 'Energy'] },
    { id: 'prod_05', vendorId: 'user_02', name: 'Hempcrete Blocks', price: 12.00, inStock: 3000, imageUrl: 'https://placehold.co/100x100/8D6E63/FFFFFF/png?text=Hemp', tags: ['Insulation', 'Eco-Friendly'] },
    { id: 'prod_06', vendorId: 'user_03', name: 'Smart Thermostat V2', price: 199.00, inStock: 150, imageUrl: 'https://placehold.co/100x100/212121/FFFFFF/png?text=Smart', tags: ['Smart Home', 'Automation'] },
];

const defaultMaterials: MaterialEntity[] = [
    { id: 'mat_01', name: 'Reclaimed Oak', description: 'Salvaged from old barns, high durability.', supplierId: 'supp_01', ecoRating: 9.5, price: 120, imageUrl: 'https://placehold.co/100x100/795548/FFFFFF/png?text=Oak' },
    { id: 'mat_02', name: 'Recycled Aluminum', description: '90% recycled content, lightweight.', supplierId: 'supp_02', ecoRating: 8.8, price: 80, imageUrl: 'https://placehold.co/100x100/B0BEC5/000000/png?text=Alum' },
];

const defaultVestingSchedules: VestingSchedule[] = [
    {
        id: 'vest_01',
        beneficiaryId: 'user_01',
        totalAmount: 100000,
        releasedAmount: 25000,
        startTime: new Date(Date.now() - 86400000 * 90).toISOString(), // Started 90 days ago
        cliff: 0,
        duration: 31536000, // 1 Year
        revocable: false
    }
];


// --- LIVE STATE (Loaded from LocalStorage) ---
let mockProjects = load('projects', defaultProjects);
let mockPublicProjects = load('publicProjects', defaultPublicProjects);
export let mockUserTokens = load('tokens', defaultUserTokens); // Export for SwapInterface
let mockBounties = load('bounties', defaultBounties);
let mockOrders = load('orders', defaultOrders);
let mockUser = load('user', defaultUser);
let mockProducts = load('products', defaultProducts); 
let mockMaterials = load('materials', defaultMaterials);
let mockVestingSchedules = load<VestingSchedule[]>('vestingSchedules', defaultVestingSchedules);
let mockMessages = load<MessageEntity[]>('messages', [
    { id: 'msg_01', contextId: 'proj_01', senderId: 'sys', senderName: 'System', text: 'Project initialized.', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), isSystem: true },
    { id: 'msg_02', contextId: 'proj_01', senderId: 'user_01', senderName: 'ArchieBot', text: 'I need to change the floor texture.', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() }
]);
let mockSignedAgreements = load<SignedAgreement[]>('signedAgreements', []);

// --- TOKENOMICS CONSTANTS ---
export const TOKEN_TOTAL_SUPPLY = 1_000_000_000;
export const TOKEN_SYMBOL = 'ARCHI';
export let treasuryBalance = load('treasuryBalance', 250000); // Seeded treasury
export let escrowBalance = load('escrowBalance', 0); // Total value in escrow

// --- LAUNCH PARAMETERS (For Admin Bot) ---
export const LAUNCH_PARAMETERS = {
    BOUNTY_COMMISSION_RATE: 0.10, // 10% to Treasury
    NFT_MINT_FEE: 250, // ARCHI to Treasury
    QUORUM_PERCENTAGE: 0.20,
    STAKING_APY: 0.15,
    LIQUIDITY_MINING_APY: 0.25
};

// --- ORACLE STATE ---
export let oracleState: OracleData = load('oracleState', {
    price: 21.5, // 1 PiUSD = 21.5 ARCHI
    lastUpdate: new Date().toISOString(),
    confidenceScore: 98,
    isCircuitBreakerActive: false
});

const mockArbitrators: ArbitratorEntity[] = [
    { id: 'arb_01', name: 'Judge Pi', specialty: 'Residential Design', fee: 50, resolutionRate: 98, casesResolved: 152, avatarUrl: 'https://placehold.co/100x100/020617/FDB300/png?text=JP', conflictsWithProjectIds: ['proj_03'] },
    { id: 'arb_02', name: 'ArchiLex', specialty: 'Commercial & NFT', fee: 100, resolutionRate: 95, casesResolved: 88, avatarUrl: 'https://placehold.co/100x100/020617/10B981/png?text=AL' },
    { id: 'arb_03', name: 'Structura', specialty: 'Engineering Disputes', fee: 75, resolutionRate: 92, casesResolved: 45, avatarUrl: 'https://placehold.co/100x100/020617/8B5CF6/png?text=ST' }
];

const mockShippingZones: ShippingZone[] = [{ id: 'zone_na', name: 'North America', active: true },{ id: 'zone_eu', name: 'European Union', active: true },{ id: 'zone_asia', name: 'Asia-Pacific', active: false }];
const mockPromotions: PromotionEntity[] = [{ id: 'promo_01', type: 'item', description: '15% off Eco-Timber', discountValue: 15, targetId: 'prod_01' },{ id: 'promo_02', type: 'invoice', description: '10% off orders over 200 PiUSD', discountValue: 10, minSpend: 200 }];
const mockServiceProviders: Omit<UserEntity, 'role'>[] = [
    { id: 'sp_01', piUsername: 'InstallPro', walletAddress: 'GC...P1', trustScore: 98, avatarUrl: 'https://placehold.co/100x100/10B981/FFFFFF/png?text=IP', subscriptionTier: 'Accelerator', serviceProviderProfile: { specialty: 'General Construction', portfolioUrl: '#', serviceZones: ['USA-CA'], hasLiabilityInsurance: true, verificationStatus: 'verified' }, isFounder: true },
    { id: 'sp_02', piUsername: 'ElecTech', walletAddress: 'GC...P2', trustScore: 95, avatarUrl: 'https://placehold.co/100x100/FDB300/FFFFFF/png?text=ET', subscriptionTier: 'Accelerator', serviceProviderProfile: { specialty: 'Electrical & Automation', portfolioUrl: '#', serviceZones: ['USA-CA', 'USA-NV'], hasLiabilityInsurance: true, verificationStatus: 'verified' }, isFounder: false },
];
let mockServiceAgreements = load<ServiceAgreementEntity[]>('serviceAgreements', [
    { id: 'sa_01', clientId: 'user_01', providerId: 'sp_01', projectId: 'proj_01', scope: 'Installation of all materials for Living Room Remodel', price: 1500, status: 'funded', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() }
]);
let reputationEvents = load<ReputationEvent[]>('reputationEvents', [
    {id: 'rev_01', userId: 'user_01', type: 'BountyCompleted', value: 10, description: "Completed bounty 'Source Eco-Friendly Countertops'", timestamp: new Date().toISOString()}
]);
let mockProposals = load<ProposalEntity[]>('proposals', [
    { id: 'prop_01', title: 'Reduce Bounty Commission to 8%', description: 'Lowering the platform fee will attract more high-quality designers.', proposerId: 'user_01', status: 'Voting', forVotes: 125000, againstVotes: 30000, createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), endsAt: new Date(Date.now() + 86400000 * 2).toISOString(), quorum: 0.20, turnout: 0.155, comments: [] },
    { id: 'prop_02', title: 'Fund a new Eco-Grant Program', description: 'Allocate 1M ARCHI from the treasury to fund projects using sustainable materials.', proposerId: 'designer_01', status: 'Passed', forVotes: 550000, againstVotes: 100000, createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), endsAt: new Date(Date.now() - 86400000 * 3).toISOString(), quorum: 0.20, turnout: 0.65, comments: [
        {id: 'c_01', proposalId: 'prop_02', authorId: 'user_99', authorName: 'GreenBuild', text: 'This is essential for growth.', timestamp: new Date(Date.now() - 86400000 * 8).toISOString()}
    ] },
]);

export const mockLiquidityPool: LiquidityPoolEntity = {
    pair: [mockUserTokens[0], mockUserTokens[1]],
    userShare: 0.05,
    totalValueLocked: 5000000,
    protocolLiquidity: 4000000, // $4M provided by the protocol/fund
};

// --- Design Challenge Mocks ---
let mockDesignChallenges = load<DesignChallengeEntity[]>('challenges', [
    { id: 'dc_01', title: 'Best Eco-Kitchen', description: 'Design a kitchen using at least 3 sustainable materials from the marketplace.', reward: 25000, status: 'Voting', endsAt: new Date(Date.now() + 86400000 * 3).toISOString() },
    { id: 'dc_02', title: 'Minimalist Bedroom Sanctuary', description: 'Create a serene bedroom design focusing on simplicity and natural light.', reward: 15000, status: 'Open', endsAt: new Date(Date.now() + 86400000 * 10).toISOString() },
]);

let mockChallengeSubmissions = load<ChallengeSubmissionEntity[]>('submissions', [
    { id: 'sub_01', challengeId: 'dc_01', projectId: 'proj_02', submitterId: 'user_01', submitterName: 'ArchieBot', votes: 1250, thumbnailUrl: 'https://placehold.co/400x300/10B981/FFFFFF/png?text=Eco-Kitchen', projectName: 'Kitchen Modernization' },
]);

const TOTAL_VOTING_POWER = 1000000; 

// --- HELPERS ---
// Helper to persist token balance changes easily
const updateTokens = (newTokens: TokenEntity[]) => {
    mockUserTokens = newTokens;
    save('tokens', mockUserTokens);
    // Update liquidity pool ref if needed (though pool is derived)
    mockLiquidityPool.pair = [mockUserTokens[0], mockUserTokens[1]];
};

const updateOraclePrice = (newPrice: number) => {
    const deviation = Math.abs((newPrice - oracleState.price) / oracleState.price);
    
    // Circuit Breaker: Stop update if deviation > 10%
    if (deviation > 0.10) {
        oracleState.isCircuitBreakerActive = true;
        oracleState.confidenceScore = 50; // Drop confidence
        console.warn("Oracle Circuit Breaker Triggered: Price deviation too high.");
    } else {
        oracleState.price = newPrice;
        oracleState.isCircuitBreakerActive = false;
        oracleState.confidenceScore = 98;
    }
    oracleState.lastUpdate = new Date().toISOString();
    save('oracleState', oracleState);
};

// Helper for Fee Calculation with Staking Discount
export const calculateFeeDetails = (reward: number, stakedAmount: number = 0) => {
    const baseRate = LAUNCH_PARAMETERS.BOUNTY_COMMISSION_RATE; // 0.10
    let discountMultiplier = 0;

    // Tiered Discount Structure
    if (stakedAmount >= 10000) discountMultiplier = 0.50; // 50% off
    else if (stakedAmount >= 5000) discountMultiplier = 0.25; // 25% off
    else if (stakedAmount >= 1000) discountMultiplier = 0.10; // 10% off

    const effectiveRate = baseRate * (1 - discountMultiplier);
    const fee = reward * effectiveRate;
    
    return {
        fee,
        effectiveRate,
        discountPercent: discountMultiplier * 100,
        originalFee: reward * baseRate
    };
};


// --- DYNAMIC AGREEMENT ENGINE ---

const generateAgreementHash = (content: string): string => {
    // Simple mock hash for simulation
    let hash = 0;
    if (content.length === 0) return '0x0';
    for (let i = 0; i < content.length; i++) {
        const char = content.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return '0x' + Math.abs(hash).toString(16) + Date.now().toString(16);
};

export const generateLegalAgreement = (type: 'Bounty' | 'Service' | 'Purchase', parties: string[], terms: any): string => {
    const date = new Date().toLocaleDateString();
    const connectorClause = `
    ARCHITEX TECHNOLOGY CONNECTOR PLATFORM TERMS
    --------------------------------------------
    1. STATUS. Architex is a technology connector platform, not a construction firm, design agency, or employer.
    2. INDEMNIFICATION. Users hold Architex harmless from all liability regarding the quality, safety, or legality of goods/services.
    `;
    
    const arbitrationClause = `
    SECTION 5: BINDING ARBITRATION
    ------------------------------
    All disputes arising from this Agreement shall be resolved exclusively through the Architex Decentralized Arbitration Protocol. 
    By electronically signing this agreement, all parties waive their right to a trial by jury or class action lawsuit.
    Decisions made by the selected Arbitrator(s) are final and enforced by Smart Contract.
    `;

    if (type === 'Bounty') {
        return `
    PROJECT BOUNTY AGREEMENT
    Date: ${date}
    Parties: ${parties.join(', ')}
    
    ${connectorClause}
    
    Scope of Work: ${terms.title}
    Description: ${terms.description}
    Reward: ${terms.reward} ARCHI
    
    ESCROW RELEASE CONDITIONS:
    Funds held in Smart Contract Escrow until Client confirms satisfactory delivery or Arbitrator ruling.
    
    ${arbitrationClause}
        `.trim();
    } else if (type === 'Service') {
        return `
    SERVICE LEVEL AGREEMENT (SLA)
    Date: ${date}
    Parties: ${parties.join(', ')}
    
    ${connectorClause}
    
    Project: ${terms.projectId}
    Scope: ${terms.scope}
    Agreed Price: ${terms.price} PiUSD
    
    QUALITY ASSURANCE:
    ${terms.validatorId ? `Validator ${terms.validatorId} must approve work before fund release.` : 'Client self-verification required.'}
    
    ${arbitrationClause}
        `.trim();
    } else {
        // Purchase
        return `
    DIGITAL GOODS SALE AGREEMENT
    Date: ${date}
    Buyer: ${parties[0]}
    
    ${connectorClause}
    
    Items:
    ${terms.items.map((i: any) => `- Product ID ${i.productId} (x${i.quantity})`).join('\n')}
    
    Total: ${terms.total} PiUSD
    
    WARRANTY DISCLAIMER:
    Goods are sold "AS IS". Architex facilitates the transaction but does not manufacture products.
    
    ${arbitrationClause}
        `.trim();
    }
};

export const signAgreement = async (type: 'Bounty' | 'Service' | 'Purchase', referenceId: string, text: string): Promise<SignedAgreement> => {
    const hash = generateAgreementHash(text);
    const agreement: SignedAgreement = {
        id: `legal_${Date.now()}`,
        type,
        referenceId,
        parties: [mockUser.id], // In real app, would be multiple
        timestamp: new Date().toISOString(),
        contentHash: hash,
        fullText: text,
        status: 'Active'
    };
    mockSignedAgreements.push(agreement);
    save('signedAgreements', mockSignedAgreements);
    return agreement;
};

export const listSignedAgreements = async (): Promise<SignedAgreement[]> => {
    return mockSignedAgreements;
};

export const generatePurchaseAgreement = async (cart: {product: ProductEntity, quantity: number}[], total: number): Promise<string> => {
    const items = cart.map(c => ({ productId: c.product.id, quantity: c.quantity }));
    return generateLegalAgreement('Purchase', [mockUser.piUsername], { items, total });
};


// --- SMART CHECKOUT & INVENTORY LOGIC ---

export const checkInventory = async (cart: {product: ProductEntity, quantity: number}[]): Promise<InventoryConflict[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network latency
    
    const conflicts: InventoryConflict[] = [];
    
    // Mock Logic: "Recycled Steel Beams" (prod_02) always triggers a conflict if quantity > 10 for demo purposes.
    // Or randomly trigger one for demonstration.
    
    cart.forEach(item => {
        // Simulate conflict for Steel or random chance
        if (item.product.id === 'prod_02' || (Math.random() > 0.85)) {
             const available = Math.floor(item.quantity * 0.5); // Only 50% available
             conflicts.push({
                 productId: item.product.id,
                 available,
                 requested: item.quantity,
                 alternativeProductId: item.product.id === 'prod_01' ? 'prod_04' : undefined // Mock alternative
             });
        }
    });
    
    return conflicts;
};

export const getCartOptimizations = async (cart: {product: ProductEntity, quantity: number}[]): Promise<CartOptimization[]> => {
    if (!apiKey) {
        // Fallback Mock
        await new Promise(resolve => setTimeout(resolve, 1200));
        return [{
            originalProductId: 'prod_01',
            suggestedProductId: 'prod_05',
            reason: "Hempcrete Blocks have a 20% lower carbon footprint and are currently 10% cheaper.",
            savings: 15.50
        }];
    }
    
    try {
        // Gemini Logic
        const cartContext = cart.map(i => `${i.quantity}x ${i.product.name} (${i.product.price} PiUSD each)`).join(', ');
        const prompt = `Review this shopping cart: ${cartContext}. Suggest 1 eco-friendly or cheaper alternative swap from our catalog (assume generic catalog). Return JSON: [{ "originalProductId": "...", "suggestedProductId": "...", "reason": "...", "savings": 5.0 }]`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        
        // For demo, we map suggestions to real mock IDs if possible, or just return mock data if Gemini hallucinates unknown IDs
        const raw = JSON.parse(response.text || '[]');
        // Map back to known IDs for safety or use mocked return
        return raw.map((r: any) => ({
            ...r,
            suggestedProductId: 'prod_05', // Force a known product ID for the demo UI to work
            savings: r.savings || 10
        }));

    } catch (e) {
        console.error("AI Optimization Failed", e);
        return [];
    }
};


// --- API CONTRACT ---

export const authenticateWithPi = async (): Promise<UserEntity> => { 
    // Always reload user from storage in case of changes
    mockUser = load('user', mockUser);
    return { ...mockUser }; 
};

export const claimFounderStatus = async (): Promise<UserEntity> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    mockUser.isFounder = true;
    // In a real scenario, this would also check eligibility or whitelist
    save('user', mockUser);
    return {...mockUser};
};

export const subscribeToAccelerator = async (): Promise<UserEntity> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    mockUser.subscriptionTier = 'Accelerator';
    // Set expiry to 30 days from now
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    mockUser.subscriptionExpiry = expiry.toISOString();
    
    save('user', mockUser);
    return {...mockUser};
};

export const generateApiKey = async (): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Simulate provisioning
    return "arch_pk_live_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const getMarketMetrics = async (): Promise<{ name: string, change: number, price: number }[]> => {
    // Mock live data feed
    return [
        { name: 'Eco-Friendly Timber', change: 2.5, price: 15.50 },
        { name: 'Recycled Steel Beams', change: -1.8, price: 125.00 },
        { name: 'Solar Glass Tiles', change: 5.2, price: 85.00 },
        { name: 'Hempcrete Blocks', change: 0.4, price: 12.00 },
        { name: 'Low-VOC Paint', change: -0.2, price: 45.00 }
    ];
};

export const getUserTokens = async (): Promise<TokenEntity[]> => {
    return [...mockUserTokens];
};

export const getOracleData = async (): Promise<OracleData> => {
    return { ...oracleState };
};

// --- ONBOARDING LOGIC (SERVICE PROVIDER & ARBITRATOR) ---

export const registerServiceProvider = async (profileData: ServiceProviderProfile): Promise<UserEntity> => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate verification delay
    
    mockUser.serviceProviderProfile = {
        ...profileData,
        verificationStatus: 'verified' // Auto-verify for demo
    };
    mockUser.role = 'service-provider';
    
    save('user', mockUser);
    return { ...mockUser };
};

export const registerArbitrator = async (profileData: ArbitratorProfile): Promise<UserEntity> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    mockUser.arbitratorProfile = {
        ...profileData,
        verificationStatus: 'pending' // Manual verification flow typically
    };
    // Don't change role immediately until verified, or allow dual roles
    // For demo, we keep role as user but they have a pending profile
    
    save('user', mockUser);
    return { ...mockUser };
};

// --- CONFLICT OF INTEREST ALGORITHM ---
// Rules:
// 1. Arbitrator cannot be the project owner.
// 2. Arbitrator cannot have a history of disputes with the project owner (mocked).
// 3. Arbitrator cannot judge their own project (redundant with 1 but explicit).
// 4. Arbitrator must be verified.

export const checkConflictOfInterest = (arbitrator: ArbitratorEntity, projectId: string, projectOwnerId: string): boolean => {
    // 1. Self-check
    if (arbitrator.id === projectOwnerId) return true;
    
    // 2. Explicit project conflict list (e.g. previous involvement)
    if (arbitrator.conflictsWithProjectIds?.includes(projectId)) return true;
    
    // 3. Mock "History" check - randomly disqualify 10% of arbitrators to simulate CoI
    // In a real app, this would query the blockchain for past interactions between the two addresses
    const hash = (arbitrator.id + projectId).split('').reduce((a,b) => a + b.charCodeAt(0), 0);
    if (hash % 10 === 0) return true;

    return false;
};

export const listAvailableArbitrators = async (projectId: string): Promise<ArbitratorEntity[]> => { 
    const project = mockProjects.find(p => p.id === projectId) || { ownerId: 'unknown' };
    
    // Filter from the global list of arbitrators
    const safeArbitrators = mockArbitrators.filter(arb => {
        return !checkConflictOfInterest(arb, projectId, project.ownerId);
    });
    
    return safeArbitrators; 
};

// --- Vesting Contract Logic ---
export const getVestingSchedule = async (userId: string): Promise<VestingSchedule | undefined> => {
    return mockVestingSchedules.find(v => v.beneficiaryId === userId);
};

export const claimVestedTokens = async (userId: string): Promise<{ claimed: number, newBalance: number }> => {
    const idx = mockVestingSchedules.findIndex(v => v.beneficiaryId === userId);
    if (idx === -1) throw new Error("No vesting schedule found.");
    
    const schedule = mockVestingSchedules[idx];
    const now = Date.now();
    const startTime = new Date(schedule.startTime).getTime();
    const durationMillis = schedule.duration * 1000;
    const cliffMillis = schedule.cliff * 1000;

    if (now < startTime + cliffMillis) {
        throw new Error("Cliff period not yet reached.");
    }

    const timeElapsed = Math.min(now - startTime, durationMillis);
    const vested = Math.floor(schedule.totalAmount * (timeElapsed / durationMillis));
    const claimable = vested - schedule.releasedAmount;

    if (claimable <= 0) {
        throw new Error("No tokens available to claim at this time.");
    }

    // Update Schedule
    mockVestingSchedules[idx].releasedAmount += claimable;
    save('vestingSchedules', mockVestingSchedules);

    // Update User Balance
    const tIdx = mockUserTokens.findIndex(t => t.symbol === 'ARCHI');
    mockUserTokens[tIdx].balance += claimable;
    updateTokens([...mockUserTokens]);

    return { claimed: claimable, newBalance: mockUserTokens[tIdx].balance };
};

// --- Incentive Contracts: Staking & Mining ---

export const stakeArchi = async (amount: number): Promise<UserEntity> => { 
    const tIdx = mockUserTokens.findIndex(t => t.symbol === 'ARCHI'); 
    if (mockUserTokens[tIdx].balance < amount) throw new Error('Insufficient ARCHI'); 
    
    mockUserTokens[tIdx].balance -= amount; 
    updateTokens([...mockUserTokens]);
    
    // Initialize or update position
    if (!mockUser.stakingPosition) {
        mockUser.stakingPosition = { amount: 0, startTime: new Date().toISOString(), lastClaimTime: new Date().toISOString(), unclaimedRewards: 0 };
    }
    
    // Calculate rewards before adding new stake to avoid dilution
    const now = new Date();
    const lastClaim = new Date(mockUser.stakingPosition.lastClaimTime);
    const timeDiff = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24 * 365); // Years
    const pendingReward = mockUser.stakingPosition.amount * LAUNCH_PARAMETERS.STAKING_APY * timeDiff;
    
    mockUser.stakingPosition.unclaimedRewards += pendingReward;
    mockUser.stakingPosition.amount += amount;
    mockUser.stakingPosition.lastClaimTime = now.toISOString();
    
    mockUser.stakedArchi = mockUser.stakingPosition.amount; // Denormalized for quick access
    
    save('user', mockUser);
    return { ...mockUser }; 
};

export const unstakeArchi = async (amount: number): Promise<UserEntity> => { 
    if (!mockUser.stakingPosition || mockUser.stakingPosition.amount < amount) throw new Error('Insufficient staked ARCHI'); 
    
    // Claim pending rewards first logic usually applies, simplifying here
    const now = new Date();
    const lastClaim = new Date(mockUser.stakingPosition.lastClaimTime);
    const timeDiff = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24 * 365);
    const pendingReward = mockUser.stakingPosition.amount * LAUNCH_PARAMETERS.STAKING_APY * timeDiff;
    
    mockUser.stakingPosition.unclaimedRewards += pendingReward;
    mockUser.stakingPosition.amount -= amount;
    mockUser.stakingPosition.lastClaimTime = now.toISOString();
    mockUser.stakedArchi = mockUser.stakingPosition.amount;

    const tIdx = mockUserTokens.findIndex(t => t.symbol === 'ARCHI'); 
    mockUserTokens[tIdx].balance += amount; 
    updateTokens([...mockUserTokens]);
    
    save('user', mockUser);
    return { ...mockUser }; 
};

export const claimStakingRewards = async (): Promise<UserEntity> => {
    if (!mockUser.stakingPosition) throw new Error("No staking position");

    const now = new Date();
    const lastClaim = new Date(mockUser.stakingPosition.lastClaimTime);
    const timeDiff = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24 * 365);
    const pendingReward = mockUser.stakingPosition.amount * LAUNCH_PARAMETERS.STAKING_APY * timeDiff;
    const totalReward = mockUser.stakingPosition.unclaimedRewards + pendingReward;

    if (totalReward <= 0) throw new Error("No rewards to claim");

    // Reset
    mockUser.stakingPosition.unclaimedRewards = 0;
    mockUser.stakingPosition.lastClaimTime = now.toISOString();

    // Credit Tokens (Minting rewards from Inflation/Treasury)
    const tIdx = mockUserTokens.findIndex(t => t.symbol === 'ARCHI'); 
    mockUserTokens[tIdx].balance += totalReward; 
    updateTokens([...mockUserTokens]);
    
    // Deduct from Treasury (simulate payout)
    treasuryBalance -= totalReward;
    save('treasuryBalance', treasuryBalance);

    save('user', mockUser);
    return { ...mockUser };
};

export const stakeLpTokens = async (amount: number): Promise<UserEntity> => {
    // Mocking LP token as a separate balance for now, usually it's an ERC20
    if (!mockUser.miningPosition) {
        mockUser.miningPosition = { lpTokenAmount: 0, lastClaimTime: new Date().toISOString(), unclaimedRewards: 0 };
    }
    
    // Calculate pending
    const now = new Date();
    const lastClaim = new Date(mockUser.miningPosition.lastClaimTime);
    const timeDiff = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24 * 365);
    const pendingReward = mockUser.miningPosition.lpTokenAmount * LAUNCH_PARAMETERS.LIQUIDITY_MINING_APY * timeDiff; // Higher APY for mining

    mockUser.miningPosition.unclaimedRewards += pendingReward;
    mockUser.miningPosition.lpTokenAmount += amount; // We assume LP tokens were burned/transferred from wallet
    mockUser.miningPosition.lastClaimTime = now.toISOString();

    save('user', mockUser);
    return { ...mockUser };
};

export const claimMiningRewards = async (): Promise<UserEntity> => {
    if (!mockUser.miningPosition) throw new Error("No mining position");
    
    const now = new Date();
    const lastClaim = new Date(mockUser.miningPosition.lastClaimTime);
    const timeDiff = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24 * 365);
    const pendingReward = mockUser.miningPosition.lpTokenAmount * LAUNCH_PARAMETERS.LIQUIDITY_MINING_APY * timeDiff;
    const totalReward = mockUser.miningPosition.unclaimedRewards + pendingReward;
    
    if (totalReward <= 0) throw new Error("No rewards to claim");

    mockUser.miningPosition.unclaimedRewards = 0;
    mockUser.miningPosition.lastClaimTime = now.toISOString();

    const tIdx = mockUserTokens.findIndex(t => t.symbol === 'ARCHI'); 
    mockUserTokens[tIdx].balance += totalReward; 
    updateTokens([...mockUserTokens]);

    treasuryBalance -= totalReward;
    save('treasuryBalance', treasuryBalance);
    save('user', mockUser);
    return { ...mockUser };
};


export const listProjects = async (): Promise<ProjectEntity[]> => { 
    return [...mockProjects]; 
};

export const listPublicProjects = async (): Promise<ProjectEntity[]> => {
    return [...mockPublicProjects];
};

export const incrementProjectModification = async (projectId: string): Promise<ProjectEntity> => { 
    const idx = mockProjects.findIndex(p => p.id === projectId); 
    if(idx > -1) { 
        mockProjects[idx].modificationCount = (mockProjects[idx].modificationCount || 0) + 1; 
        mockProjects[idx].updatedAt = new Date().toISOString(); 
        save('projects', mockProjects);
        return {...mockProjects[idx]}; 
    } 
    throw new Error('P not found'); 
};

// --- COMMUNICATION SYSTEM ---
export const getMessages = async (contextId: string): Promise<MessageEntity[]> => {
    return mockMessages.filter(m => m.contextId === contextId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export const sendMessage = async (contextId: string, text: string): Promise<MessageEntity> => {
    const newMessage: MessageEntity = {
        id: `msg_${Date.now()}`,
        contextId,
        senderId: mockUser.id,
        senderName: mockUser.piUsername,
        text,
        timestamp: new Date().toISOString()
    };
    mockMessages.push(newMessage);
    save('messages', mockMessages);
    return newMessage;
};

export const askArchie = async (query: string): Promise<string> => {
    if (!apiKey) {
        return "I'm currently offline (No API Key). Please check my connection settings.";
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: query,
            config: {
                systemInstruction: "You are Archie, an intelligent design assistant for the Architex app on Pi Network. You are helpful, concise, and eco-conscious. You help users navigate the app, find sustainable materials, and solve design challenges.",
                temperature: 0.7,
            },
        });
        return response.text || "I'm not sure how to answer that right now.";
    } catch (e) {
        console.error("ArchieBot Error:", e);
        return "I'm having trouble connecting to my knowledge base.";
    }
};


// --- ADMIN PANEL ---
export const requestAdminMfa = async (password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (password === 'admin') return true; // Mock password
    return false;
};

export const verifyAdminMfa = async (code: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (code === '123456') return true; // Mock code
    return false;
};


// --- AI POWERED FUNCTIONS ---

export const getRoomAnalysis = async (): Promise<ScanAnalysis> => {
    try {
        if (apiKey) {
             const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: "Analyze a standard 12x14 foot room scan. Provide a JSON output with 'dimensions', 'style' (infer one), 'lighting' (infer one), and a 'summary' of the layout.",
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            dimensions: { type: Type.STRING },
                            style: { type: Type.STRING },
                            lighting: { type: Type.STRING },
                            summary: { type: Type.STRING }
                        }
                    }
                }
            });
            return JSON.parse(response.text || '{}') as ScanAnalysis;
        }
    } catch (e) {
        console.error("AI Analysis failed, falling back to mock", e);
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
        dimensions: "14' x 18' (approx. 252 sq ft)",
        style: "Contemporary / Mixed",
        lighting: "Good natural light, North facing windows",
        summary: "Rectangular layout with a central focal point. Ideal for open-plan living."
    };
};

export const generateAIProject = async (params: { roomType: string, style: string, prompt: string }): Promise<ProjectEntity> => {
    let imageUrl = `https://placehold.co/400x300/020617/FFFFFF/png?text=${params.style}+${params.roomType}`;
    let billOfMaterials: BillOfMaterialsEntry[] = [];

    if (apiKey) {
        try {
            // 1. Generate Image with Imagen
            const fullPrompt = `Photorealistic interior design of a ${params.style} ${params.roomType}. ${params.prompt}. High quality, architectural photography.`;
            const imageResponse = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: fullPrompt,
                config: { numberOfImages: 1, aspectRatio: '4:3', outputMimeType: 'image/jpeg' }
            });
            
            const base64Image = imageResponse.generatedImages[0].image.imageBytes;
            imageUrl = `data:image/jpeg;base64,${base64Image}`;

            // 2. Generate BOM with Gemini using the generated image
            const bomResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Generate a Bill of Materials for a ${params.style} ${params.roomType} that includes: ${params.prompt}. Return JSON array of objects with 'name' and 'quantity'.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                quantity: { type: Type.NUMBER }
                            }
                        }
                    }
                }
            });
            
            const materialsRaw = JSON.parse(bomResponse.text || '[]');
            billOfMaterials = materialsRaw.map((m: any, idx: number) => ({
                materialId: `gen_mat_${Date.now()}_${idx}`,
                name: m.name,
                quantity: m.quantity || 1,
                status: 'Pending',
                estimatedCost: Math.floor(Math.random() * 100) + 20, // Mock cost per item
                ecoImpactScore: Math.floor(Math.random() * 5) + 5, // Mock eco score
                imageUrl: `https://placehold.co/64x64/10B981/FFFFFF/png?text=${m.name.slice(0,3)}`
            }));

        } catch (e) {
            console.error("AI Generation failed", e);
        }
    }

    const newProject: ProjectEntity = {
        id: `proj_${Date.now()}`,
        ownerId: mockUser.id,
        ownerName: mockUser.piUsername,
        name: `${params.style} ${params.roomType}`,
        status: 'Designing',
        billOfMaterials: billOfMaterials,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: false,
        thumbnailUrl: imageUrl,
        modificationCount: 0,
        isNft: false,
        likes: 0
    };

    mockProjects.unshift(newProject);
    save('projects', mockProjects);
    return newProject;
};

export const generateModelFromScan = async (): Promise<ProjectEntity> => { 
    const newProject: ProjectEntity = { 
        id: `proj_${Date.now()}`, 
        ownerId: 'user_01', 
        ownerName: mockUser.piUsername,
        name: `Scanned Room ${new Date().toLocaleTimeString()}`, 
        status: 'Scanning', 
        billOfMaterials: [], 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(), 
        roomScanUrl: 'mock_scan_url', 
        isPublic: false, 
        thumbnailUrl: `https://placehold.co/400x300/020617/FFFFFF/png?text=New+Scan`, 
        modificationCount: 0, 
        isNft: false, 
        likes: 0
    }; 
    mockProjects.unshift(newProject); 
    save('projects', mockProjects);
    return newProject; 
};

export const listMaterials = async (): Promise<MaterialEntity[]> => { return [...mockMaterials]; };

export const swapTokens = async (from: TokenEntity['symbol'], to: TokenEntity['symbol'], amount: number): Promise<boolean> => { 
    const fromIdx = mockUserTokens.findIndex(t => t.symbol === from);
    const toIdx = mockUserTokens.findIndex(t => t.symbol === to);
    
    if (mockUserTokens[fromIdx].balance < amount) return false;
    
    // Use Oracle Price
    const rate = from === 'PiUSD' ? oracleState.price : 1/oracleState.price;
    
    mockUserTokens[fromIdx].balance -= amount;
    mockUserTokens[toIdx].balance += (amount * rate);
    
    updateTokens([...mockUserTokens]);
    
    // Simulate price impact on Oracle (Simple Linear Model)
    // Buying ARCHI (From PiUSD) increases price, Selling decreases.
    const priceChange = (amount / 10000) * (from === 'PiUSD' ? 1 : -1);
    updateOraclePrice(oracleState.price + priceChange);

    return true; 
}

export const addLiquidity = async (amountA: number, amountB: number): Promise<boolean> => { 
    // Simplified: just deduct tokens
    const t1 = mockUserTokens.findIndex(t => t.symbol === 'PiUSD');
    const t2 = mockUserTokens.findIndex(t => t.symbol === 'ARCHI');
    
    if(mockUserTokens[t1].balance >= amountA && mockUserTokens[t2].balance >= amountB) {
        mockUserTokens[t1].balance -= amountA;
        mockUserTokens[t2].balance -= amountB;
        updateTokens([...mockUserTokens]);
        
        // Auto-stake LP for simplicity in this step
        await stakeLpTokens(amountA + amountB); // Mock LP amount
        return true;
    }
    return false;
}

export const listBounties = async (): Promise<BountyEntity[]> => { return [...mockBounties]; };

export const createBounty = async (bounty: Omit<BountyEntity, 'id' | 'createdAt' | 'status' | 'escrowState'>): Promise<BountyEntity> => { 
    // REVENUE ROUTING: Enforce Commission with Staking Discount
    const { fee } = calculateFeeDetails(bounty.reward, mockUser.stakedArchi || 0);
    const totalCost = bounty.reward + fee; 
    
    const idx = mockUserTokens.findIndex(t => t.symbol === 'ARCHI'); 
    if (mockUserTokens[idx].balance < totalCost) { throw new Error('Insufficient ARCHI balance including commission.'); } 
    
    // Deduct User Balance
    mockUserTokens[idx].balance -= totalCost; 
    updateTokens([...mockUserTokens]);

    // 1. Route Fee to Treasury (Multi-Sig)
    treasuryBalance += fee;
    save('treasuryBalance', treasuryBalance);

    // 2. Hold Reward (Simulated here, typically in Escrow Contract)
    
    mockUserTokens[idx].balance += bounty.reward; 
    updateTokens([...mockUserTokens]); 
    
    const newBounty: BountyEntity = { ...bounty, id: `bty_${Date.now()}`, status: 'Open', escrowState: 'Unfunded', createdAt: new Date().toISOString() }; 
    mockBounties.unshift(newBounty); 
    save('bounties', mockBounties);
    return newBounty; 
}

export const mintProjectAsNft = async (projectId: string): Promise<ProjectEntity> => { 
    // REVENUE ROUTING: 100% of Mint Fee to Treasury
    const MINT_FEE = LAUNCH_PARAMETERS.NFT_MINT_FEE; 
    const idx = mockUserTokens.findIndex(t => t.symbol === 'ARCHI'); 
    
    if (mockUserTokens[idx].balance < MINT_FEE) { throw new Error('Insufficient ARCHI balance for minting fee.'); } 
    
    const pIdx = mockProjects.findIndex(p => p.id === projectId); 
    if (pIdx === -1) { throw new Error('Project not found'); } 
    
    // Deduct User Balance
    mockUserTokens[idx].balance -= MINT_FEE; 
    updateTokens([...mockUserTokens]);

    // Route to Treasury
    treasuryBalance += MINT_FEE;
    save('treasuryBalance', treasuryBalance);
    
    mockProjects[pIdx].isNft = true; 
    mockProjects[pIdx].updatedAt = new Date().toISOString(); 
    save('projects', mockProjects);
    return { ...mockProjects[pIdx] }; 
};

export const getDynamicAgreementText = async (bounty: BountyEntity): Promise<string> => { 
    return generateLegalAgreement('Bounty', [mockUser.piUsername], bounty);
};

export const fundEscrow = async (bountyId: string): Promise<BountyEntity> => { 
    const idx = mockBounties.findIndex(b => b.id === bountyId); 
    if (idx === -1) throw new Error("Bounty not found"); 
    
    const bounty = mockBounties[idx];
    const tIdx = mockUserTokens.findIndex(t => t.symbol === 'ARCHI');
    
    if (mockUserTokens[tIdx].balance < bounty.reward) {
         throw new Error("Insufficient ARCHI to fund escrow.");
    }

    // Sign Agreement first
    await signAgreement('Bounty', bountyId, await getDynamicAgreementText(bounty));

    // REVENUE ROUTING: 100% of Reward to Escrow Contract
    mockUserTokens[tIdx].balance -= bounty.reward;
    updateTokens([...mockUserTokens]);

    escrowBalance += bounty.reward;
    save('escrowBalance', escrowBalance);
    
    mockBounties[idx].escrowState = 'Funded'; 
    mockBounties[idx].status = 'In Progress'; 
    save('bounties', mockBounties);
    return {...mockBounties[idx]}; 
};

export const releaseEscrow = async (bountyId: string): Promise<BountyEntity> => { 
    const idx = mockBounties.findIndex(b => b.id === bountyId); 
    if (idx === -1) throw new Error("Bounty not found"); 
    
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    const bounty = mockBounties[idx];
    mockBounties[idx].escrowState = 'Released'; 
    mockBounties[idx].status = 'Complete'; 
    
    // REVENUE ROUTING: Funds leave Escrow to Winner (External Wallet)
    escrowBalance -= bounty.reward;
    save('escrowBalance', escrowBalance);

    // Add Reputation
    reputationEvents.push({ id: `rev_${Date.now()}`, userId: mockBounties[idx].winnerId || 'unknown', type: 'BountyCompleted', value: 10, description: `Completed bounty: ${mockBounties[idx].title}`, timestamp: new Date().toISOString()}); 
    save('reputationEvents', reputationEvents);
    save('bounties', mockBounties);
    
    return {...mockBounties[idx]}; 
}

export const raiseDispute = async (bountyId: string): Promise<BountyEntity> => { 
    const idx = mockBounties.findIndex(b => b.id === bountyId); 
    if (idx === -1) throw new Error("Bounty not found"); 
    mockBounties[idx].status = 'In Dispute'; 
    save('bounties', mockBounties);
    return {...mockBounties[idx]}; 
}

export const listArbitrators = async (): Promise<ArbitratorEntity[]> => { return [...mockArbitrators]; };

export const selectArbitrator = async (bountyId: string, arbitratorId: string): Promise<BountyEntity> => { 
    const bIdx = mockBounties.findIndex(b => b.id === bountyId); 
    if (bIdx === -1) throw new Error("Bounty not found"); 
    const a = mockArbitrators.find(a => a.id === arbitratorId); 
    if (!a) throw new Error("Arbitrator not found"); 
    
    // Arbitrator fee is paid by the user selecting (in UI layer via processPayment)
    
    mockBounties[bIdx].status = 'Arbitration'; 
    save('bounties', mockBounties);
    return {...mockBounties[bIdx]}; 
};

export const resolveArbitration = async (bountyId: string, decision: 'Release' | 'Refund'): Promise<BountyEntity> => { 
    const idx = mockBounties.findIndex(b => b.id === bountyId); 
    if (idx === -1) throw new Error("Bounty not found"); 
    
    const bounty = mockBounties[idx];
    mockBounties[idx].status = 'Complete'; 
    mockBounties[idx].escrowState = decision === 'Release' ? 'Released' : 'Refunded'; 
    
    // REVENUE ROUTING: Funds leave Escrow
    escrowBalance -= bounty.reward;
    save('escrowBalance', escrowBalance);

    if (decision === 'Refund') { 
        // Return funds to User Wallet
        const tIdx = mockUserTokens.findIndex(t => t.symbol === 'ARCHI'); 
        mockUserTokens[tIdx].balance += bounty.reward; 
        updateTokens([...mockUserTokens]);
    } 
    
    save('bounties', mockBounties);
    return {...mockBounties[idx]}; 
};

export const listVendorProducts = async (): Promise<ProductEntity[]> => { 
    return [...mockProducts]; 
};
export const listShippingZones = async (): Promise<ShippingZone[]> => { return [...mockShippingZones]; };
export const updateShippingZone = async (zoneId: string, active: boolean): Promise<ShippingZone> => { const z = mockShippingZones.find(z => z.id === zoneId); if(!z) throw new Error('Zone not found'); z.active = active; return {...z}; };
export const listPromotions = async (): Promise<PromotionEntity[]> => { return [...mockPromotions]; };
export const createPromotion = async (promo: Omit<PromotionEntity, 'id'>): Promise<PromotionEntity> => { const newPromo: PromotionEntity = { ...promo, id: `promo_${Date.now()}`, }; mockPromotions.unshift(newPromo); return newPromo; };
export const listOrders = async (): Promise<OrderEntity[]> => { return [...mockOrders]; };

export const createOrder = async (items: CartItem[], totalAmount: number): Promise<OrderEntity> => {
    // REVENUE ROUTING: Payment is handled via Pi SDK then confirmed here.
    // In simulation, funds are deducted from user wallet for consistency in demo.
    // But in real app, Pi SDK payment is separate.
    // Here we just assume the funds are now held by the Escrow Contract (system wallet).
    
    const newOrder: OrderEntity = {
        id: `ord_${Date.now()}`,
        userId: mockUser.id,
        items,
        total: totalAmount,
        status: 'Processing',
        createdAt: new Date().toISOString(),
        proofOfInstallationStatus: 'none'
    };

    // Simulate escrow hold
    escrowBalance += totalAmount;
    save('escrowBalance', escrowBalance);
    
    // We should also sign a Purchase Agreement
    await signAgreement('Purchase', newOrder.id, await generateLegalAgreement('Purchase', [mockUser.piUsername], { items, total: totalAmount }));
    
    mockOrders.unshift(newOrder);
    save('orders', mockOrders);
    return newOrder;
};

export const calculateProjectSustainability = (materials: BillOfMaterialsEntry[]): number => {
    if (!materials.length) return 0;
    const totalScore = materials.reduce((acc, item) => acc + (item.ecoImpactScore || 0), 0);
    return Math.min(10, Math.round(totalScore / materials.length));
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<OrderEntity> => { 
    const idx = mockOrders.findIndex(o => o.id === orderId); 
    if (idx === -1) throw new Error('Order not found'); 
    
    mockOrders[idx].status = status; 
    const order = mockOrders[idx]; 
    const orderContainsInstallableItems = order.items.some(item => mockProducts.find(p => p.id === item.productId)?.tags?.includes('requires-installation')); 
    
    if (status === 'Delivered' && orderContainsInstallableItems) { 
        mockOrders[idx].proofOfInstallationStatus = 'pending'; 
    } 
    save('orders', mockOrders);
    return { ...mockOrders[idx] }; 
};

// --- FULFILLMENT, RETURNS & PAYOUT AUTOMATION ---

export const confirmOrderDelivery = async (orderId: string): Promise<OrderEntity> => {
    const idx = mockOrders.findIndex(o => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');
    
    const order = mockOrders[idx];

    // Automated Payout Trigger
    if (escrowBalance >= order.total) {
        escrowBalance -= order.total;
        save('escrowBalance', escrowBalance);
        // Funds would move to Vendor Wallet here
        console.log(`[Escrow] Released ${order.total} PiUSD to Vendor.`);
    }

    return updateOrderStatus(orderId, 'Delivered');
};

export const requestOrderReturn = async (orderId: string): Promise<OrderEntity> => {
    return updateOrderStatus(orderId, 'Return Requested');
};

export const processVendorOrderAction = async (orderId: string, action: 'ship' | 'approve_return' | 'dispute_return'): Promise<OrderEntity> => {
    const idx = mockOrders.findIndex(o => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');
    
    if (action === 'ship') {
        return updateOrderStatus(orderId, 'Shipped');
    } else if (action === 'approve_return') {
        // Refund Logic
        if (escrowBalance >= mockOrders[idx].total) {
             escrowBalance -= mockOrders[idx].total;
             save('escrowBalance', escrowBalance);
             // In real app, refund to user via Pi SDK / App Wallet
             console.log(`[Escrow] Refunded ${mockOrders[idx].total} PiUSD to User.`);
        }
        return updateOrderStatus(orderId, 'Refunded');
    } else if (action === 'dispute_return') {
        // Freeze Escrow is implicit as funds are not released
        return updateOrderStatus(orderId, 'In Dispute');
    }
    
    return mockOrders[idx];
};


export const getInstallationQuote = async (orderId: string): Promise<{ quote: number, providerId: string }> => { await new Promise(res => setTimeout(res, 800)); return { quote: 250, providerId: 'sp_01' }; };
export const listServiceProviders = async (): Promise<UserEntity[]> => { return mockServiceProviders.map(sp => ({ ...sp, role: 'service-provider' })); };
export const getProjectDetails = async (projectId: string): Promise<ProjectEntity | undefined> => { return mockProjects.find(p => p.id === projectId); };

export const createServiceAgreement = async (clientId: string, providerId: string, projectId: string, price: number): Promise<ServiceAgreementEntity> => { 
    const newAgreement: ServiceAgreementEntity = { id: `sa_${Date.now()}`, clientId, providerId, projectId, price, scope: `Installation services for project ${projectId}`, status: 'pending', createdAt: new Date().toISOString() }; 
    mockServiceAgreements.push(newAgreement); 
    save('serviceAgreements', mockServiceAgreements);
    return newAgreement; 
};

export const listServiceAgreements = async (): Promise<ServiceAgreementEntity[]> => { return [...mockServiceAgreements]; };

export const getServiceLevelAgreementText = async (agreement: ServiceAgreementEntity): Promise<string> => { 
    return generateLegalAgreement('Service', [mockUser.piUsername, agreement.providerId], agreement);
};

export const fundServiceEscrow = async (agreementId: string, validatorId?: string): Promise<ServiceAgreementEntity> => { 
    const idx = mockServiceAgreements.findIndex(sa => sa.id === agreementId); 
    if (idx === -1) throw new Error('Agreement not found'); 
    
    const agreement = mockServiceAgreements[idx];
    await signAgreement('Service', agreementId, await getServiceLevelAgreementText(agreement));

    mockServiceAgreements[idx].status = 'funded'; 
    if (validatorId) mockServiceAgreements[idx].qualityAssuranceValidatorId = validatorId; 
    
    // REVENUE ROUTING: 100% of Price to Escrow
    escrowBalance += agreement.price; 
    save('escrowBalance', escrowBalance);
    save('serviceAgreements', mockServiceAgreements);
    return { ...mockServiceAgreements[idx] }; 
};

export const confirmServiceCompletion = async (agreementId: string, userType: 'client' | 'validator'): Promise<ServiceAgreementEntity> => { 
    const idx = mockServiceAgreements.findIndex(sa => sa.id === agreementId); 
    if (idx === -1) throw new Error('Agreement not found'); 
    
    const agreement = mockServiceAgreements[idx]; 
    if (userType === 'client') agreement.status = 'client-confirmed'; 
    if (userType === 'validator' && agreement.status === 'client-confirmed') agreement.status = 'validator-confirmed'; 
    
    const isComplete = agreement.status === 'client-confirmed' && !agreement.qualityAssuranceValidatorId || agreement.status === 'validator-confirmed'; 
    if (isComplete) { 
        agreement.status = 'complete'; 
        // REVENUE ROUTING: Release from Escrow to Provider
        escrowBalance -= agreement.price;
        save('escrowBalance', escrowBalance);
    } 
    save('serviceAgreements', mockServiceAgreements);
    return { ...agreement }; 
};

export const submitRating = async (userId: string, rating: number, comment: string): Promise<boolean> => { 
    reputationEvents.push({ id: `rev_${Date.now()}`, userId, type: 'RatingReceived', value: rating, description: comment, timestamp: new Date().toISOString() }); 
    save('reputationEvents', reputationEvents);
    return true; 
};

export const calculateTrustScore = async (userId: string): Promise<number> => { 
    const userEvents = reputationEvents.filter(e => e.userId === userId); 
    let score = 50; 
    for (const event of userEvents) { score += event.value; } 
    mockUser.trustScore = Math.max(0, Math.min(100, score)); 
    save('user', mockUser);
    return mockUser.trustScore; 
};

export const listProposals = async (): Promise<ProposalEntity[]> => { 
    mockProposals.forEach(p => { 
        // Mock time passing
    }); 
    return [...mockProposals]; 
};

export const voteOnProposal = async (proposalId: string, vote: 'for' | 'against', votingPower: number): Promise<ProposalEntity> => { 
    const idx = mockProposals.findIndex(p => p.id === proposalId); 
    if (idx === -1) throw new Error('Proposal not found'); 
    
    if (vote === 'for') mockProposals[idx].forVotes += votingPower; 
    else mockProposals[idx].againstVotes += votingPower; 
    
    mockProposals[idx].turnout += (votingPower / TOTAL_VOTING_POWER); 
    save('proposals', mockProposals);
    return { ...mockProposals[idx] }; 
};

export const executeProposal = async(proposalId: string): Promise<ProposalEntity> => {
    console.log(`[AdminBot] Attempting to execute proposal ${proposalId}...`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const idx = mockProposals.findIndex(p => p.id === proposalId);
    if (idx === -1) throw new Error("Proposal not found.");

    const proposal = mockProposals[idx];
    proposal.status = 'Executing';
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate execution time
    proposal.status = 'Executed';
    
    save('proposals', mockProposals);
    return {...proposal};
};

export const submitProposalComment = async (proposalId: string, text: string): Promise<ProposalEntity> => {
    const idx = mockProposals.findIndex(p => p.id === proposalId);
    if (idx === -1) throw new Error("Proposal not found.");

    const newComment: ProposalComment = {
        id: `comm_${Date.now()}`,
        proposalId,
        authorId: mockUser.id,
        authorName: mockUser.piUsername,
        text,
        timestamp: new Date().toISOString()
    };

    if (!mockProposals[idx].comments) {
        mockProposals[idx].comments = [];
    }
    mockProposals[idx].comments!.push(newComment);
    save('proposals', mockProposals);
    return { ...mockProposals[idx] };
};

export const submitProofOfInstallation = async(orderId: string, photoData: string): Promise<OrderEntity> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const idx = mockOrders.findIndex(o => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');
    mockOrders[idx].proofOfInstallationStatus = 'submitted';
    save('orders', mockOrders);
    return {...mockOrders[idx]};
}

export const verifyProofOfInstallation = async(orderId: string): Promise<OrderEntity> => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI verification
    const idx = mockOrders.findIndex(o => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');
    
    mockOrders[idx].proofOfInstallationStatus = 'verified';
    
    const CASHBACK_RATE = 0.02;
    const cashbackAmount = mockOrders[idx].total * CASHBACK_RATE;
    const archiIndex = mockUserTokens.findIndex(t => t.symbol === 'ARCHI');
    mockUserTokens[archiIndex].balance += cashbackAmount;
    updateTokens([...mockUserTokens]);
    
    reputationEvents.push({
        id: `rev_${Date.now()}`,
        userId: mockOrders[idx].userId,
        type: 'ProofOfInstallation',
        value: 5, 
        description: `Verified physical installation for order ${orderId}`,
        timestamp: new Date().toISOString(),
    });
    save('reputationEvents', reputationEvents);
    save('orders', mockOrders);

    return {...mockOrders[idx]};
};

export const shareToPiFeed = async (projectId: string): Promise<{ success: boolean; message: string }> => {
    const project = mockProjects.find(p => p.id === projectId);
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: project?.name || 'Architex Project',
                text: `Check out this amazing design on Architex!`,
                url: window.location.href 
            });
            return { success: true, message: 'Shared successfully!' };
        } catch (err) {
            console.log('Share cancelled or failed', err);
            return { success: false, message: 'Share cancelled' };
        }
    }

    await new Promise(resolve => setTimeout(resolve, 1200));
    return { success: true, message: 'Shared to Pi Feed (Mock)!' };
};

// --- Design Challenge API ---
export const listDesignChallenges = async (): Promise<DesignChallengeEntity[]> => {
    return [...mockDesignChallenges];
};

export const getChallengeSubmissions = async (challengeId: string): Promise<ChallengeSubmissionEntity[]> => {
    return mockChallengeSubmissions.filter(s => s.challengeId === challengeId);
};

export const submitProjectToChallenge = async (projectId: string, challengeId: string): Promise<ChallengeSubmissionEntity> => {
    const project = mockProjects.find(p => p.id === projectId);
    if (!project) throw new Error("Project not found");

    const newSubmission: ChallengeSubmissionEntity = {
        id: `sub_${Date.now()}`,
        challengeId,
        projectId,
        submitterId: mockUser.id,
        submitterName: mockUser.piUsername,
        votes: 0,
        thumbnailUrl: project.thumbnailUrl || '',
        projectName: project.name,
    };
    mockChallengeSubmissions.push(newSubmission);
    save('submissions', mockChallengeSubmissions);
    return newSubmission;
};

export const voteOnChallengeSubmission = async (submissionId: string, votingPower: number): Promise<ChallengeSubmissionEntity> => {
    const idx = mockChallengeSubmissions.findIndex(s => s.id === submissionId);
    if (idx === -1) throw new Error("Submission not found");
    mockChallengeSubmissions[idx].votes += votingPower;
    save('submissions', mockChallengeSubmissions);
    return { ...mockChallengeSubmissions[idx] };
};

export const finalizeChallenge = async (challengeId: string): Promise<DesignChallengeEntity> => {
    const challengeIndex = mockDesignChallenges.findIndex(c => c.id === challengeId);
    if (challengeIndex === -1) throw new Error("Challenge not found");

    const submissions = mockChallengeSubmissions.filter(s => s.challengeId === challengeId);
    if (submissions.length === 0) {
        mockDesignChallenges[challengeIndex].status = 'Complete';
        save('challenges', mockDesignChallenges);
        return { ...mockDesignChallenges[challengeIndex] };
    }

    const winner = submissions.sort((a, b) => b.votes - a.votes)[0];
    mockDesignChallenges[challengeIndex].status = 'Complete';
    mockDesignChallenges[challengeIndex].winnerId = winner.submitterId;
    
    if (winner.submitterId === mockUser.id) {
        const tokenIndex = mockUserTokens.findIndex(t => t.symbol === 'ARCHI');
        mockUserTokens[tokenIndex].balance += mockDesignChallenges[challengeIndex].reward;
        updateTokens([...mockUserTokens]);
    }
    
    save('challenges', mockDesignChallenges);
    return { ...mockDesignChallenges[challengeIndex] };
};

export const requestServiceQuote = async (projectId: string, materialId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock quote request logic - typically creates a pending interaction
    return true;
};

export const executeFuzzTest = async (): Promise<FuzzTestResult> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
        testId: `fuzz_${Date.now()}`,
        timestamp: new Date().toISOString(),
        operationsCount: 5000,
        invariantsChecked: ['Solvency', 'Access Control', 'Reentrancy'],
        status: 'Passed',
        logs: [
            'INFO: Starting fuzz campaign...',
            'INFO: Generated 5000 random transaction vectors.',
            'CHECK: Treasury balance invariant holds.',
            'CHECK: Escrow lock invariant holds.',
            'SUCCESS: No vulnerabilities found.'
        ],
        coverage: 98.5
    };
};

export const runIntegrationTest = async (): Promise<IntegrationTestResult> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
        timestamp: new Date().toISOString(),
        success: true,
        steps: [
            { name: 'Contract Deployment', status: 'Passed', details: 'Contracts deployed to testnet.' },
            { name: 'Oracle Connection', status: 'Passed', details: 'Price feed active.' },
            { name: 'Treasury Initialization', status: 'Passed', details: 'Funds verified.' },
            { name: 'Escrow Logic', status: 'Passed', details: 'Lock/Release cycles valid.' }
        ],
        finalTreasuryBalance: 250000,
        finalEscrowBalance: 5000
    };
};

export const runStressTest = async (onProgress: (users: number) => void): Promise<StressTestResult> => {
    // Simulate progress
    for (let i = 0; i <= 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        onProgress(i * 100);
    }
    
    return {
        testId: `stress_${Date.now()}`,
        timestamp: new Date().toISOString(),
        virtualUsers: 1000,
        totalTransactions: 50000,
        tps: 4500,
        avgLatencyMs: 120,
        errorRate: 0.05,
        bottlenecks: ['Database Connection Pool'],
        status: 'Passed'
    };
};
