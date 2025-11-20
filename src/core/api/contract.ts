
import { ProjectEntity, UserEntity, MaterialEntity, TokenEntity, LiquidityPoolEntity, BountyEntity, ArbitratorEntity, ProductEntity, ShippingZone, PromotionEntity, OrderEntity, OrderStatus, ServiceProviderProfile, ServiceAgreementEntity, ReputationEvent, ProposalEntity, ProofOfInstallationStatus, DesignChallengeEntity, ChallengeSubmissionEntity, SustainabilityReport, InventoryConflict, CartOptimization, IntegrationTestResult, StressTestResult, VestingSchedule, FuzzTestResult, TeamMemberEntity, DesignTemplateEntity, SpendingMetric, SignedAgreement, AffiliateProfile, DropshipProfile, DropshipListing } from '../schemas/entities';
import { PiCoinIcon } from '../../components/icons/PiCoinIcon';
import { ArchitexLogo } from '../../components/icons/ArchitexLogo';

// --- CONFIGURATION ---
const USE_REAL_API = false; // Set to true when backend is ready
const STORAGE_KEY = 'architex_state_v1';

// --- MOCK DATA INITIALIZATION ---
let defaultProjects: ProjectEntity[] = [
  {
    id: 'proj_01',
    ownerId: 'user_01',
    name: 'Living Room Remodel',
    status: 'Designing',
    billOfMaterials: [{ materialId: 'mat_01', quantity: 20, status: 'Pending', name: 'Oak Flooring', estimatedCost: 450, isSustainable: true }],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
    isPublic: true,
    thumbnailUrl: 'https://placehold.co/400x300/8B5CF6/FFFFFF/png?text=Living+Room',
    unreadMessages: 2,
    modificationCount: 1,
    isNft: false,
  },
  {
    id: 'proj_02',
    ownerId: 'user_01',
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
  },
  {
    id: 'proj_03',
    ownerId: 'user_01',
    name: 'Bedroom Oasis (NFT)',
    status: 'Complete',
    billOfMaterials: [],
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    isPublic: false,
    thumbnailUrl: 'https://placehold.co/400x300/FDB300/FFFFFF/png?text=Bedroom',
    modificationCount: 5,
    isNft: true,
  },
];

let defaultUser: UserEntity = { 
    id: 'user_01', 
    piUsername: 'ArchieBot', 
    walletAddress: 'GD...QW', 
    trustScore: 95, 
    avatarUrl: 'https://placehold.co/100x100/020617/8B5CF6/png?text=A', 
    subscriptionTier: 'Free', 
    role: 'user', 
    vendorProfile: { hasInsurance: false, agreedToIndemnity: false }, 
    stakedArchi: 5000, 
    isFounder: false, 
    stakingPosition: { unclaimedRewards: 0 },
    affiliateProfile: {
        referralCode: 'ARCHIE101',
        totalReferrals: 12,
        totalEarnings: 540,
        pendingEarnings: 120,
        tier: 'Scout',
        campaigns: [
            { id: 'cmp_1', name: 'Social Media', clicks: 150, conversions: 8 },
            { id: 'cmp_2', name: 'Blog Post', clicks: 45, conversions: 4 }
        ]
    }
};

let defaultUserTokens: TokenEntity[] = [
    { symbol: 'PiUSD', name: 'Pi USD', balance: 150.75, icon: PiCoinIcon },
    { symbol: 'ARCHI', name: 'Architex Token', balance: 15000, icon: ArchitexLogo },
];

// --- STORAGE HELPERS ---
const loadFromStorage = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        console.error("Failed to load state", e);
        return null;
    }
};

const saveToStorage = () => {
    try {
        const state = {
            mockProjects,
            mockBounties,
            mockOrders,
            mockServiceAgreements,
            mockUser,
            mockUserTokens
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error("Failed to save state", e);
    }
};

// --- INITIALIZE STATE ---
const persistedState = loadFromStorage();

let mockProjects: ProjectEntity[] = persistedState?.mockProjects || defaultProjects;
let mockUser: UserEntity = persistedState?.mockUser || defaultUser;
export let mockUserTokens: TokenEntity[] = persistedState?.mockUserTokens || defaultUserTokens;
let mockBounties: BountyEntity[] = persistedState?.mockBounties || [
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
    }
];
let mockOrders: OrderEntity[] = persistedState?.mockOrders || [
    { id: 'ord_01', userId: 'user_01', items: [{productId: 'prod_01', quantity: 50}], total: 775, status: 'Shipped', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), proofOfInstallationStatus: 'none' },
];
let mockServiceAgreements: ServiceAgreementEntity[] = persistedState?.mockServiceAgreements || [
    { id: 'sa_01', clientId: 'user_01', providerId: 'sp_01', projectId: 'proj_01', scope: 'Installation of all materials for Living Room Remodel', price: 1500, status: 'funded', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() }
];


// --- STATIC MOCK DATA (Read Only) ---
let mockPublicProjects: ProjectEntity[] = [
    { ...defaultProjects[0], id: 'pub_01', ownerId: 'u99', name: 'Zen Loft', isPublic: true },
    { ...defaultProjects[1], id: 'pub_02', ownerId: 'u98', name: 'Cyberpunk Bar', isPublic: true }
];

export const mockLiquidityPool: LiquidityPoolEntity = {
    pair: [mockUserTokens[0], mockUserTokens[1]],
    userShare: 0.05,
    totalValueLocked: 5000000,
    protocolLiquidity: 2000000,
};

export const treasuryBalance = 1500000;
export const escrowBalance = 500000;

let mockArbitrators: ArbitratorEntity[] = [
    { id: 'arb_01', name: 'Judge Pi', specialty: 'Residential Design', fee: 50, resolutionRate: 98, casesResolved: 152, avatarUrl: 'https://placehold.co/100x100/020617/FDB300/png?text=JP' },
    { id: 'arb_02', name: 'ArchiLex', specialty: 'Commercial & NFT', fee: 100, resolutionRate: 95, casesResolved: 88, avatarUrl: 'https://placehold.co/100x100/020617/10B981/png?text=AL' }
];

let mockProducts: ProductEntity[] = [
    { id: 'prod_01', vendorId: 'vendor_01', name: 'Eco-Friendly Timber', price: 15.50, inStock: 500, imageUrl: 'https://placehold.co/100x100/10B981/FFFFFF/png?text=Timber', tags: ['requires-installation'], isEcoFriendly: true, sustainabilityCertifications: ['FSC Certified'], allowDropshipping: true, wholesalePrice: 12.00 },
    { id: 'prod_02', vendorId: 'vendor_01', name: 'Recycled Steel Beams', price: 125.00, inStock: 80, imageUrl: 'https://placehold.co/100x100/8B5CF6/FFFFFF/png?text=Steel', tags: ['requires-installation'], isEcoFriendly: true, allowDropshipping: true, wholesalePrice: 100.00 },
    { id: 'prod_03', vendorId: 'vendor_01', name: 'Low-VOC Paint', price: 45.00, inStock: 250, imageUrl: 'https://placehold.co/100x100/FDB300/FFFFFF/png?text=Paint', isEcoFriendly: false },
];

let mockShippingZones: ShippingZone[] = [{ id: 'zone_na', name: 'North America', active: true },{ id: 'zone_eu', name: 'European Union', active: true },{ id: 'zone_asia', name: 'Asia-Pacific', active: false }];
let mockPromotions: PromotionEntity[] = [{ id: 'promo_01', type: 'item', description: '15% off Eco-Timber', discountValue: 15, targetId: 'prod_01' },{ id: 'promo_02', type: 'invoice', description: '10% off orders over 200 PiUSD', discountValue: 10, minSpend: 200 }];
let mockServiceProviders: UserEntity[] = [
    { id: 'sp_01', piUsername: 'InstallPro', walletAddress: 'GC...P1', trustScore: 98, avatarUrl: 'https://placehold.co/100x100/10B981/FFFFFF/png?text=IP', subscriptionTier: 'Accelerator', role: 'service-provider', serviceProviderProfile: { specialty: 'General Construction', portfolioUrl: '#', serviceZones: ['USA-CA'], hasLiabilityInsurance: true } },
];
let mockGigWorkers: UserEntity[] = [
    { id: 'gig_01', piUsername: 'MarioPlumb', walletAddress: 'GC...GP1', trustScore: 92, avatarUrl: 'https://placehold.co/100x100/FF0000/FFFFFF/png?text=MP', subscriptionTier: 'Free', role: 'service-provider', serviceProviderProfile: { specialty: 'Plumbing', portfolioUrl: '#', serviceZones: ['Local'], hasLiabilityInsurance: false, isGigWorker: true, gigCategories: ['Plumbing'], hourlyRate: 25, isAvailable: true, distance: '0.8 km' } },
];
let reputationEvents: ReputationEvent[] = [{id: 'rev_01', userId: 'user_01', type: 'BountyCompleted', value: 10, description: "Completed bounty 'Source Eco-Friendly Countertops'", timestamp: new Date().toISOString()}];
let mockProposals: ProposalEntity[] = [
    { id: 'prop_01', title: 'Reduce Bounty Commission to 8%', description: 'Lowering the platform fee will attract more high-quality designers.', proposerId: 'user_01', status: 'Voting', forVotes: 125000, againstVotes: 30000, createdAt: new Date().toISOString(), endsAt: new Date(Date.now() + 86400000 * 2).toISOString(), quorum: 0.20, turnout: 0.155 },
];
const TOTAL_VOTING_POWER = 1000000; 
let mockDesignChallenges: DesignChallengeEntity[] = [{ id: 'dc_01', title: 'Best Eco-Kitchen', description: 'Design a kitchen using sustainable materials.', reward: 25000, status: 'Voting', endsAt: new Date(Date.now() + 86400000 * 3).toISOString() }];
let mockChallengeSubmissions: ChallengeSubmissionEntity[] = [{ id: 'sub_01', challengeId: 'dc_01', projectId: 'proj_02', submitterId: 'user_01', submitterName: 'ArchieBot', votes: 1250, thumbnailUrl: 'https://placehold.co/400x300/10B981/FFFFFF/png?text=Eco-Kitchen', projectName: 'Kitchen Modernization' }];
let mockDropshipListings: DropshipListing[] = [];


// --- ADAPTER PATTERN ---

interface IApiAdapter {
    authenticateWithPi: () => Promise<UserEntity>;
    listProjects: () => Promise<ProjectEntity[]>;
    listPublicProjects: () => Promise<ProjectEntity[]>;
    generateModelFromScan: () => Promise<ProjectEntity>;
    listBounties: () => Promise<BountyEntity[]>;
    createBounty: (bounty: Omit<BountyEntity, 'id' | 'createdAt' | 'status' | 'escrowState'>) => Promise<BountyEntity>;
    listArbitrators: () => Promise<ArbitratorEntity[]>;
    listOrders: () => Promise<OrderEntity[]>;
    listServiceProviders: () => Promise<UserEntity[]>;
    listServiceAgreements: () => Promise<ServiceAgreementEntity[]>;
    listProposals: () => Promise<ProposalEntity[]>;
    listDesignChallenges: () => Promise<DesignChallengeEntity[]>;
    listVendorProducts: () => Promise<ProductEntity[]>;
    // ... add other specific methods as needed, defaulting to 'any' for complex ones to save space in this refactor if strict typing isn't required immediately
    [key: string]: any; 
}

const MockAdapter: IApiAdapter = {
    authenticateWithPi: async () => ({ ...mockUser }),
    listProjects: async () => [...mockProjects],
    listPublicProjects: async () => [...mockPublicProjects],
    generateModelFromScan: async () => {
        const newProject: ProjectEntity = { id: `proj_${Date.now()}`, ownerId: 'user_01', name: 'New Scanned Room', status: 'Scanning', billOfMaterials: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), roomScanUrl: 'mock_scan_url', isPublic: false, thumbnailUrl: `https://placehold.co/400x300/020617/FFFFFF/png?text=New+Scan`, modificationCount: 0, isNft: false };
        mockProjects.unshift(newProject);
        saveToStorage();
        return newProject;
    },
    listBounties: async () => [...mockBounties],
    createBounty: async (bounty) => {
        const newBounty: BountyEntity = { ...bounty, id: `bty_${Date.now()}`, status: 'Open', escrowState: 'Unfunded', createdAt: new Date().toISOString() };
        mockBounties.unshift(newBounty);
        saveToStorage();
        return newBounty;
    },
    listArbitrators: async () => [...mockArbitrators],
    listOrders: async () => [...mockOrders],
    listServiceProviders: async () => mockServiceProviders,
    listServiceAgreements: async () => [...mockServiceAgreements],
    listProposals: async () => [...mockProposals],
    listDesignChallenges: async () => [...mockDesignChallenges],
    listVendorProducts: async () => [...mockProducts],
    // Add other methods that modify state to saveToStorage()
    incrementProjectModification: async (projectId: string) => {
        const p = mockProjects.find(p => p.id === projectId);
        if(p) { p.modificationCount = (p.modificationCount || 0) + 1; p.updatedAt = new Date().toISOString(); saveToStorage(); return {...p}; }
        throw new Error('P not found');
    },
    mintProjectAsNft: async (projectId: string) => {
        const pIdx = mockProjects.findIndex(p => p.id === projectId);
        if (pIdx !== -1) { mockProjects[pIdx].isNft = true; mockProjects[pIdx].updatedAt = new Date().toISOString(); saveToStorage(); return { ...mockProjects[pIdx] }; }
        throw new Error('Project not found');
    },
    fundEscrow: async (bountyId: string) => {
        const idx = mockBounties.findIndex(b => b.id === bountyId);
        if (idx !== -1) { mockBounties[idx].escrowState = 'Funded'; mockBounties[idx].status = 'In Progress'; saveToStorage(); return {...mockBounties[idx]}; }
        throw new Error("Bounty not found");
    },
    // ... Implement other logic similarly using the closure variables
    // For brevity in this refactor, we are mapping the key functions. 
    // The 'any' type allows us to keep using the contract functions exported below that internally call these or just use the closure state directly if they are complex.
};

const RealAdapter: IApiAdapter = {
    authenticateWithPi: async () => { throw new Error("Real API not implemented"); },
    listProjects: async () => [],
    listPublicProjects: async () => [],
    generateModelFromScan: async () => { throw new Error("Real API not implemented"); },
    listBounties: async () => [],
    createBounty: async () => { throw new Error("Real API not implemented"); },
    listArbitrators: async () => [],
    listOrders: async () => [],
    listServiceProviders: async () => [],
    listServiceAgreements: async () => [],
    listProposals: async () => [],
    listDesignChallenges: async () => [],
    listVendorProducts: async () => [],
};

// --- EXPORTS (DELEGATION) ---
const api = USE_REAL_API ? RealAdapter : MockAdapter;

export const authenticateWithPi = () => api.authenticateWithPi();
export const listProjects = () => api.listProjects();
export const listPublicProjects = () => api.listPublicProjects();
export const generateModelFromScan = () => api.generateModelFromScan();
export const listBounties = () => api.listBounties();
export const createBounty = (b: any) => api.createBounty(b);
export const listArbitrators = () => api.listArbitrators();
export const listOrders = () => api.listOrders();
export const listServiceProviders = () => api.listServiceProviders();
export const listServiceAgreements = () => api.listServiceAgreements();
export const listProposals = () => api.listProposals();
export const listDesignChallenges = () => api.listDesignChallenges();
export const listVendorProducts = () => api.listVendorProducts();

// Specific Logic Exports (using closure state for now to maintain persistent behavior in Mock mode)
// In a full Real Adapter implementation, these would be API calls.
export const incrementProjectModification = async (projectId: string) => MockAdapter.incrementProjectModification(projectId);
export const mintProjectAsNft = async (projectId: string) => MockAdapter.mintProjectAsNft(projectId);
export const fundEscrow = async (bountyId: string) => MockAdapter.fundEscrow(bountyId);

// Remaining exports mapped to state + saveToStorage
export const listMaterials = async (): Promise<MaterialEntity[]> => [];
export const swapTokens = async (from: TokenEntity['symbol'], to: TokenEntity['symbol'], amount: number): Promise<boolean> => true;
export const addLiquidity = async (amountA: number, amountB: number): Promise<boolean> => true;
export const getDynamicAgreementText = async (bounty: BountyEntity): Promise<string> => `This Agreement is made on ${new Date().toLocaleDateString()}...`;
export const releaseEscrow = async (bountyId: string): Promise<BountyEntity> => { const idx = mockBounties.findIndex(b => b.id === bountyId); if (idx === -1) throw new Error("Bounty not found"); await new Promise(resolve => setTimeout(resolve, 1000)); mockBounties[idx].escrowState = 'Released'; mockBounties[idx].status = 'Complete'; saveToStorage(); return {...mockBounties[idx]}; }
export const raiseDispute = async (bountyId: string): Promise<BountyEntity> => { const idx = mockBounties.findIndex(b => b.id === bountyId); if (idx === -1) throw new Error("Bounty not found"); mockBounties[idx].status = 'In Dispute'; saveToStorage(); return {...mockBounties[idx]}; }
export const listAvailableArbitrators = async (projectId: string): Promise<ArbitratorEntity[]> => mockArbitrators;
export const selectArbitrator = async (bountyId: string, arbitratorId: string): Promise<BountyEntity> => { const bIdx = mockBounties.findIndex(b => b.id === bountyId); if (bIdx !== -1) { mockBounties[bIdx].status = 'Arbitration'; saveToStorage(); return {...mockBounties[bIdx]}; } throw new Error("Bounty not found"); };
export const resolveArbitration = async (bountyId: string, decision: 'Release' | 'Refund'): Promise<BountyEntity> => { const idx = mockBounties.findIndex(b => b.id === bountyId); if (idx !== -1) { mockBounties[idx].status = 'Complete'; mockBounties[idx].escrowState = decision === 'Release' ? 'Released' : 'Refunded'; saveToStorage(); return {...mockBounties[idx]}; } throw new Error("Bounty not found"); };
export const listShippingZones = async (): Promise<ShippingZone[]> => [...mockShippingZones];
export const updateShippingZone = async (zoneId: string, active: boolean): Promise<ShippingZone> => { const z = mockShippingZones.find(z => z.id === zoneId); if(!z) throw new Error('Zone not found'); z.active = active; return {...z}; };
export const listPromotions = async (): Promise<PromotionEntity[]> => [...mockPromotions];
export const createPromotion = async (promo: Omit<PromotionEntity, 'id'>): Promise<PromotionEntity> => { const newPromo: PromotionEntity = { ...promo, id: `promo_${Date.now()}`, }; mockPromotions.unshift(newPromo); return newPromo; };
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<OrderEntity> => { const idx = mockOrders.findIndex(o => o.id === orderId); if (idx !== -1) { mockOrders[idx].status = status; saveToStorage(); return { ...mockOrders[idx] }; } throw new Error('Order not found'); };
export const getInstallationQuote = async (orderId: string): Promise<{ quote: number, providerId: string }> => { await new Promise(res => setTimeout(res, 800)); return { quote: 250, providerId: 'sp_01' }; };
export const listGigWorkers = async (): Promise<UserEntity[]> => [...mockGigWorkers]; 
export const getProjectDetails = async (projectId: string): Promise<ProjectEntity | undefined> => mockProjects.find(p => p.id === projectId);
export const createServiceAgreement = async (clientId: string, providerId: string, projectId: string, price: number): Promise<ServiceAgreementEntity> => { const newAgreement: ServiceAgreementEntity = { id: `sa_${Date.now()}`, clientId, providerId, projectId, price, scope: `Installation services for project ${projectId}`, status: 'pending', createdAt: new Date().toISOString() }; mockServiceAgreements.push(newAgreement); saveToStorage(); return newAgreement; };
export const getServiceLevelAgreementText = async (agreement: ServiceAgreementEntity): Promise<string> => `This Service Level Agreement...`;
export const fundServiceEscrow = async (agreementId: string, validatorId?: string): Promise<ServiceAgreementEntity> => { const idx = mockServiceAgreements.findIndex(sa => sa.id === agreementId); if (idx !== -1) { mockServiceAgreements[idx].status = 'funded'; if (validatorId) mockServiceAgreements[idx].qualityAssuranceValidatorId = validatorId; saveToStorage(); return { ...mockServiceAgreements[idx] }; } throw new Error('Agreement not found'); };
export const confirmServiceCompletion = async (agreementId: string, userType: 'client' | 'validator'): Promise<ServiceAgreementEntity> => { const idx = mockServiceAgreements.findIndex(sa => sa.id === agreementId); if (idx !== -1) { mockServiceAgreements[idx].status = 'complete'; saveToStorage(); return { ...mockServiceAgreements[idx] }; } throw new Error('Agreement not found'); };
export const submitRating = async (userId: string, rating: number, comment: string): Promise<boolean> => true;
export const calculateTrustScore = async (userId: string): Promise<number> => 95;
export const stakeArchi = async (amount: number): Promise<UserEntity> => { mockUser.stakedArchi = (mockUser.stakedArchi || 0) + amount; saveToStorage(); return { ...mockUser }; };
export const unstakeArchi = async (amount: number): Promise<UserEntity> => { mockUser.stakedArchi = (mockUser.stakedArchi || 0) - amount; saveToStorage(); return { ...mockUser }; };
export const voteOnProposal = async (proposalId: string, vote: 'for' | 'against', votingPower: number): Promise<ProposalEntity> => { const idx = mockProposals.findIndex(p => p.id === proposalId); if (idx !== -1) { mockProposals[idx].forVotes += vote === 'for' ? votingPower : 0; saveToStorage(); return { ...mockProposals[idx] }; } throw new Error('Proposal not found'); };
export const executeProposal = async(proposalId: string): Promise<ProposalEntity> => { const idx = mockProposals.findIndex(p => p.id === proposalId); if (idx !== -1) { mockProposals[idx].status = 'Executed'; saveToStorage(); return {...mockProposals[idx]}; } throw new Error("Proposal not found."); };
export const submitProofOfInstallation = async(orderId: string, photoData: string): Promise<OrderEntity> => { const idx = mockOrders.findIndex(o => o.id === orderId); if (idx !== -1) { mockOrders[idx].proofOfInstallationStatus = 'submitted'; saveToStorage(); return {...mockOrders[idx]}; } throw new Error('Order not found'); }
export const verifyProofOfInstallation = async(orderId: string): Promise<OrderEntity> => { const idx = mockOrders.findIndex(o => o.id === orderId); if (idx !== -1) { mockOrders[idx].proofOfInstallationStatus = 'verified'; saveToStorage(); return {...mockOrders[idx]}; } throw new Error('Order not found'); };
export const shareToPiFeed = async (projectId: string, caption?: string): Promise<{ success: boolean; message: string }> => { return { success: true, message: 'Project shared to Pi Feed!' }; };
export const getChallengeSubmissions = async (challengeId: string): Promise<ChallengeSubmissionEntity[]> => mockChallengeSubmissions.filter(s => s.challengeId === challengeId);
export const submitProjectToChallenge = async (projectId: string, challengeId: string): Promise<ChallengeSubmissionEntity> => { const sub: ChallengeSubmissionEntity = { id: `sub_${Date.now()}`, challengeId, projectId, submitterId: mockUser.id, submitterName: mockUser.piUsername, votes: 0, thumbnailUrl: '', projectName: 'Submission' }; mockChallengeSubmissions.push(sub); return sub; };
export const voteOnChallengeSubmission = async (submissionId: string, votingPower: number): Promise<ChallengeSubmissionEntity> => { const idx = mockChallengeSubmissions.findIndex(s => s.id === submissionId); if (idx !== -1) { mockChallengeSubmissions[idx].votes += votingPower; return { ...mockChallengeSubmissions[idx] }; } throw new Error("Submission not found"); };
export const finalizeChallenge = async (challengeId: string): Promise<DesignChallengeEntity> => mockDesignChallenges[0];
export const calculateFeeDetails = (reward: number, staked: number) => ({ fee: reward * 0.1, effectiveRate: 10, discountPercent: 0, originalFee: reward * 0.1 });
export const getMarketMetrics = async () => [ { name: 'Eco-Timber', change: 2.5, price: 15.50 } ];
export const generateApiKey = async () => "arch_pk_live_" + Math.random().toString(36).substring(2);
export const claimMiningRewards = async () => true;
export const stakeLpTokens = async (amount: number) => true;
export const updateProductSustainability = async (productId: string, isSustainable: boolean, certifications: string[]) => {};
export const listSignedAgreements = async (): Promise<SignedAgreement[]> => [ { id: 'sa_01', type: 'Service', status: 'Active', referenceId: 'proj_01', contentHash: '0x123...', timestamp: new Date().toISOString() } ];
export const requestServiceQuote = async (projectId: string, materialId: string) => true;
export const generateSustainabilityReport = async (projectId: string): Promise<SustainabilityReport> => ({ energyEfficiencyScore: 78, carbonFootprint: 1200, estimatedAnnualSavings: 350, recommendations: ['Use LED lighting'] });
export const optimizeProjectForSustainability = async (projectId: string) => mockProjects[0];
export const getCartOptimizations = async (cart: any): Promise<CartOptimization[]> => [];
export const checkInventory = async (cart: any): Promise<InventoryConflict[]> => [];
export const generatePurchaseAgreement = async (cart: any, total: number) => `Purchase Agreement for ${total} PiUSD...`;
export const requestAdminMfa = async (password: string) => true;
export const verifyAdminMfa = async (code: string) => true;
export const runIntegrationTest = async (): Promise<IntegrationTestResult> => ({ success: true, steps: [{ name: 'DB Connection', status: 'Passed' }] });
export const runStressTest = async (cb: (n: number) => void): Promise<StressTestResult> => { cb(1000); return { status: 'Passed', virtualUsers: 1000, tps: 5000, avgLatencyMs: 20, errorRate: 0 }; };
export const getVestingSchedule = async (userId: string): Promise<VestingSchedule> => ({ startTime: new Date().toISOString(), duration: 31536000, cliff: 0, totalAmount: 10000, releasedAmount: 2000 });
export const executeFuzzTest = async (): Promise<FuzzTestResult> => ({ status: 'Passed', operationsCount: 5000, coverage: 95, testId: 'fuzz_01', logs: ['Test complete'] });
export const processVendorOrderAction = async (orderId: string, action: string) => true;
export const joinFounderProgram = async () => true;
export const processExpiredChallenges = async () => [];
export const submitProposalComment = async (proposalId: string, text: string) => mockProposals[0];
export const createDesignChallenge = async (data: any): Promise<DesignChallengeEntity> => ({ ...mockDesignChallenges[0], ...data, id: 'dc_new' });
export const inviteTeamMember = async (email: string, role: string) => true;
export const listTeamMembers = async (orgId: string): Promise<TeamMemberEntity[]> => [ { id: 'tm_01', name: 'Alice', role: 'Admin', avatarUrl: 'https://placehold.co/50', lastActive: 'Now' } ];
export const listDesignTemplates = async (): Promise<DesignTemplateEntity[]> => [ { id: 'tmpl_01', name: 'Modern Office', itemCount: 15, style: 'Modern', thumbnailUrl: 'https://placehold.co/100' } ];
export const getEnterpriseAnalytics = async (): Promise<SpendingMetric[]> => [ { month: 'Jan', amount: 5000 } ];
export const processBulkOrder = async (pids: string[], qtys: number[]) => ({ total: 5000, commission: 50, discount: 500 });
export const registerAffiliate = async (referralCode: string): Promise<AffiliateProfile> => { mockUser.affiliateProfile = { referralCode, totalReferrals: 0, totalEarnings: 0, pendingEarnings: 0, tier: 'Scout', campaigns: [] }; saveToStorage(); return mockUser.affiliateProfile; };
export const claimAffiliateEarnings = async (): Promise<void> => {};
export const activateDropshipping = async (storeName: string): Promise<DropshipProfile> => { mockUser.dropshipProfile = { storeName, isActive: true, liabilityAgreed: true, totalSales: 0, reputationScore: 50 }; saveToStorage(); return mockUser.dropshipProfile; };
export const listDropshipCandidates = async (): Promise<ProductEntity[]> => mockProducts.filter(p => p.allowDropshipping);
export const addDropshipListing = async (productId: string, markup: number): Promise<DropshipListing> => { const listing: DropshipListing = { id: `ds_${Date.now()}`, originalProductId: productId, vendorId: mockUser.id, markupPrice: markup, originalPrice: 0, margin: 0, active: true }; mockDropshipListings.push(listing); return listing; };
export const getMyDropshipListings = async (): Promise<DropshipListing[]> => [...mockDropshipListings];
export const forwardOrderToVendor = async (orderId: string): Promise<void> => {};
export const exportSystemState = async (): Promise<string> => JSON.stringify({ mockProjects, mockOrders });
export const restoreSystemState = async (jsonString: string): Promise<boolean> => true;
