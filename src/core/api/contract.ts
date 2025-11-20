
import { ProjectEntity, UserEntity, MaterialEntity, TokenEntity, LiquidityPoolEntity, BountyEntity, ArbitratorEntity, ProductEntity, ShippingZone, PromotionEntity, OrderEntity, OrderStatus, ServiceProviderProfile, ServiceAgreementEntity, ReputationEvent, ProposalEntity, ProofOfInstallationStatus, DesignChallengeEntity, ChallengeSubmissionEntity, SustainabilityReport, InventoryConflict, CartOptimization, IntegrationTestResult, StressTestResult, VestingSchedule, FuzzTestResult, TeamMemberEntity, DesignTemplateEntity, SpendingMetric, SignedAgreement, AffiliateProfile, DropshipProfile, DropshipListing } from '../schemas/entities';
import { PiCoinIcon } from '../../components/icons/PiCoinIcon';
import { ArchitexLogo } from '../../components/icons/ArchitexLogo';

// --- MOCK DATA ---
// ... [Previous mock data remains mostly the same, extended below] ...

const mockProjects: ProjectEntity[] = [
  {
    id: 'proj_01',
    ownerId: 'user_01',
    ownerName: 'ArchieBot',
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
    likes: 42,
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
    likes: 15,
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
    likes: 120,
  },
];

// Mock Public Projects
const mockPublicProjects: ProjectEntity[] = [
    ...mockProjects,
    {
        id: 'proj_pub_01',
        ownerId: 'user_99',
        ownerName: 'DesignGuru',
        name: 'Zen Garden Loft',
        status: 'Complete',
        billOfMaterials: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: true,
        thumbnailUrl: 'https://placehold.co/400x300/334155/FFFFFF/png?text=Zen+Loft',
        likes: 350,
        isNft: true
    },
    {
        id: 'proj_pub_02',
        ownerId: 'user_88',
        ownerName: 'EcoBuilder',
        name: 'Sustainable Tiny Home',
        status: 'Designing',
        billOfMaterials: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: true,
        thumbnailUrl: 'https://placehold.co/400x300/10B981/FFFFFF/png?text=Tiny+Home',
        likes: 89,
        isNft: false
    }
];

export let mockUserTokens: TokenEntity[] = [
    { symbol: 'PiUSD', name: 'Pi USD', balance: 150.75, icon: PiCoinIcon },
    { symbol: 'ARCHI', name: 'Architex Token', balance: 15000, icon: ArchitexLogo },
];

export const mockLiquidityPool: LiquidityPoolEntity = {
    pair: [mockUserTokens[0], mockUserTokens[1]],
    userShare: 0.05,
    totalValueLocked: 5000000,
    protocolLiquidity: 2000000,
};

export const treasuryBalance = 1500000;
export const escrowBalance = 500000;

let mockBounties: BountyEntity[] = [
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
    {
        id: 'bty_03',
        projectId: 'proj_03',
        title: 'NFT Showcase Animation',
        description: 'Create a short, looping animation for my newly minted NFT design.',
        reward: 2500,
        status: 'Arbitration',
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        escrowState: 'Funded',
        winnerId: 'designer_02',
    }
];

const mockArbitrators: ArbitratorEntity[] = [
    {
        id: 'arb_01',
        name: 'Judge Pi',
        specialty: 'Residential Design',
        fee: 50,
        resolutionRate: 98,
        casesResolved: 152,
        avatarUrl: 'https://placehold.co/100x100/020617/FDB300/png?text=JP',
        conflictsWithProjectIds: ['proj_03'],
    },
    {
        id: 'arb_02',
        name: 'ArchiLex',
        specialty: 'Commercial & NFT',
        fee: 100,
        resolutionRate: 95,
        casesResolved: 88,
        avatarUrl: 'https://placehold.co/100x100/020617/10B981/png?text=AL',
    }
];

const mockProducts: ProductEntity[] = [
    { 
        id: 'prod_01', 
        vendorId: 'vendor_01', 
        name: 'Eco-Friendly Timber', 
        price: 15.50, 
        inStock: 500, 
        imageUrl: 'https://placehold.co/100x100/10B981/FFFFFF/png?text=Timber', 
        tags: ['requires-installation'], 
        isEcoFriendly: true, 
        sustainabilityCertifications: ['FSC Certified'],
        allowDropshipping: true,
        wholesalePrice: 12.00 
    },
    { 
        id: 'prod_02', 
        vendorId: 'vendor_01', 
        name: 'Recycled Steel Beams', 
        price: 125.00, 
        inStock: 80, 
        imageUrl: 'https://placehold.co/100x100/8B5CF6/FFFFFF/png?text=Steel', 
        tags: ['requires-installation'], 
        isEcoFriendly: true,
        allowDropshipping: true,
        wholesalePrice: 100.00
    },
    { 
        id: 'prod_03', 
        vendorId: 'vendor_01', 
        name: 'Low-VOC Paint', 
        price: 45.00, 
        inStock: 250, 
        imageUrl: 'https://placehold.co/100x100/FDB300/FFFFFF/png?text=Paint', 
        isEcoFriendly: false 
    },
];

let mockOrders: OrderEntity[] = [
    { id: 'ord_01', userId: 'user_01', items: [{productId: 'prod_01', quantity: 50}], total: 775, status: 'Shipped', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), proofOfInstallationStatus: 'none' },
    { id: 'ord_02', userId: 'user_01', items: [{productId: 'prod_03', quantity: 5}], total: 225, status: 'Processing', createdAt: new Date().toISOString(), proofOfInstallationStatus: 'none' },
];

const mockShippingZones: ShippingZone[] = [{ id: 'zone_na', name: 'North America', active: true },{ id: 'zone_eu', name: 'European Union', active: true },{ id: 'zone_asia', name: 'Asia-Pacific', active: false }];
const mockPromotions: PromotionEntity[] = [{ id: 'promo_01', type: 'item', description: '15% off Eco-Timber', discountValue: 15, targetId: 'prod_01' },{ id: 'promo_02', type: 'invoice', description: '10% off orders over 200 PiUSD', discountValue: 10, minSpend: 200 }];

const mockServiceProviders: Omit<UserEntity, 'role'>[] = [
    { id: 'sp_01', piUsername: 'InstallPro', walletAddress: 'GC...P1', trustScore: 98, avatarUrl: 'https://placehold.co/100x100/10B981/FFFFFF/png?text=IP', subscriptionTier: 'Accelerator', serviceProviderProfile: { specialty: 'General Construction', portfolioUrl: '#', serviceZones: ['USA-CA'], hasLiabilityInsurance: true } },
    { id: 'sp_02', piUsername: 'ElecTech', walletAddress: 'GC...P2', trustScore: 95, avatarUrl: 'https://placehold.co/100x100/FDB300/FFFFFF/png?text=ET', subscriptionTier: 'Accelerator', serviceProviderProfile: { specialty: 'Electrical & Automation', portfolioUrl: '#', serviceZones: ['USA-CA', 'USA-NV'], hasLiabilityInsurance: true } },
];

// Mock Gig Workers
const mockGigWorkers: UserEntity[] = [
    {
        id: 'gig_01',
        piUsername: 'MarioPlumb',
        walletAddress: 'GC...GP1',
        trustScore: 92,
        avatarUrl: 'https://placehold.co/100x100/FF0000/FFFFFF/png?text=MP',
        subscriptionTier: 'Free',
        role: 'service-provider',
        serviceProviderProfile: {
            specialty: 'Plumbing',
            portfolioUrl: '#',
            serviceZones: ['Local'],
            hasLiabilityInsurance: false,
            isGigWorker: true,
            gigCategories: ['Plumbing'],
            hourlyRate: 25,
            isAvailable: true,
            distance: '0.8 km'
        }
    },
    // ... other gig workers
];


const mockServiceAgreements: ServiceAgreementEntity[] = [
    { id: 'sa_01', clientId: 'user_01', providerId: 'sp_01', projectId: 'proj_01', scope: 'Installation of all materials for Living Room Remodel', price: 1500, status: 'funded', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() }
];

let reputationEvents: ReputationEvent[] = [
    {id: 'rev_01', userId: 'user_01', type: 'BountyCompleted', value: 10, description: "Completed bounty 'Source Eco-Friendly Countertops'", timestamp: new Date().toISOString()}
];

let mockProposals: ProposalEntity[] = [
    { id: 'prop_01', title: 'Reduce Bounty Commission to 8%', description: 'Lowering the platform fee will attract more high-quality designers.', proposerId: 'user_01', status: 'Voting', forVotes: 125000, againstVotes: 30000, createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), endsAt: new Date(Date.now() + 86400000 * 2).toISOString(), quorum: 0.20, turnout: 0.155 },
    { id: 'prop_02', title: 'Fund a new Eco-Grant Program', description: 'Allocate 1M ARCHI from the treasury to fund projects using sustainable materials.', proposerId: 'designer_01', status: 'Passed', forVotes: 550000, againstVotes: 100000, createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), endsAt: new Date(Date.now() - 86400000 * 3).toISOString(), quorum: 0.20, turnout: 0.65 },
];

// Mock User with Affiliate and Dropship profiles initiated as undefined
let mockUser: UserEntity = { 
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

const TOTAL_VOTING_POWER = 1000000; 

// --- Design Challenge Mocks ---
let mockDesignChallenges: DesignChallengeEntity[] = [
    { id: 'dc_01', title: 'Best Eco-Kitchen', description: 'Design a kitchen using at least 3 sustainable materials from the marketplace.', reward: 25000, status: 'Voting', endsAt: new Date(Date.now() + 86400000 * 3).toISOString() },
];

let mockChallengeSubmissions: ChallengeSubmissionEntity[] = [
    { id: 'sub_01', challengeId: 'dc_01', projectId: 'proj_02', submitterId: 'user_01', submitterName: 'ArchieBot', votes: 1250, thumbnailUrl: 'https://placehold.co/400x300/10B981/FFFFFF/png?text=Eco-Kitchen', projectName: 'Kitchen Modernization' },
];

// --- Dropshipping Mocks ---
let mockDropshipListings: DropshipListing[] = [];

// --- API CONTRACT ---
export const authenticateWithPi = async (): Promise<UserEntity> => { return { ...mockUser }; };
export const listProjects = async (): Promise<ProjectEntity[]> => { return [...mockProjects]; };
export const listPublicProjects = async (): Promise<ProjectEntity[]> => { return [...mockPublicProjects]; }; 
export const incrementProjectModification = async (projectId: string): Promise<ProjectEntity> => { const p = mockProjects.find(p => p.id === projectId); if(p) { p.modificationCount = (p.modificationCount || 0) + 1; p.updatedAt = new Date().toISOString(); return {...p}; } throw new Error('P not found'); };
export const generateModelFromScan = async (): Promise<ProjectEntity> => { const newProject: ProjectEntity = { id: `proj_${Date.now()}`, ownerId: 'user_01', name: 'New Scanned Room', status: 'Scanning', billOfMaterials: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), roomScanUrl: 'mock_scan_url', isPublic: false, thumbnailUrl: `https://placehold.co/400x300/020617/FFFFFF/png?text=New+Scan`, modificationCount: 0, isNft: false, }; mockProjects.unshift(newProject); return newProject; };
export const listMaterials = async (): Promise<MaterialEntity[]> => { return []; };
export const swapTokens = async (from: TokenEntity['symbol'], to: TokenEntity['symbol'], amount: number): Promise<boolean> => { return true; }
export const addLiquidity = async (amountA: number, amountB: number): Promise<boolean> => { return true; }
export const listBounties = async (): Promise<BountyEntity[]> => { return [...mockBounties]; };
export const createBounty = async (bounty: Omit<BountyEntity, 'id' | 'createdAt' | 'status' | 'escrowState'>): Promise<BountyEntity> => { const platformFee = bounty.reward * 0.10; const totalCost = bounty.reward + platformFee; const idx = mockUserTokens.findIndex(t => t.symbol === 'ARCHI'); if (mockUserTokens[idx].balance < totalCost) { throw new Error('Insufficient ARCHI balance.'); } mockUserTokens[idx].balance -= totalCost; const newBounty: BountyEntity = { ...bounty, id: `bty_${Date.now()}`, status: 'Open', escrowState: 'Unfunded', createdAt: new Date().toISOString() }; mockBounties.unshift(newBounty); return newBounty; }
export const mintProjectAsNft = async (projectId: string): Promise<ProjectEntity> => { const MINT_FEE = 250; const idx = mockUserTokens.findIndex(t => t.symbol === 'ARCHI'); if (mockUserTokens[idx].balance < MINT_FEE) { throw new Error('Insufficient ARCHI balance for minting fee.'); } const pIdx = mockProjects.findIndex(p => p.id === projectId); if (pIdx === -1) { throw new Error('Project not found'); } mockUserTokens[idx].balance -= MINT_FEE; mockProjects[pIdx].isNft = true; mockProjects[pIdx].updatedAt = new Date().toISOString(); return { ...mockProjects[pIdx] }; };
export const getDynamicAgreementText = async (bounty: BountyEntity): Promise<string> => { return `This Agreement is made on ${new Date().toLocaleDateString()}...`; };
export const fundEscrow = async (bountyId: string): Promise<BountyEntity> => { const idx = mockBounties.findIndex(b => b.id === bountyId); if (idx === -1) throw new Error("Bounty not found"); const b = mockBounties[idx]; const tIdx = mockUserTokens.findIndex(t => t.symbol === 'ARCHI'); if(mockUserTokens[tIdx].balance < b.reward) throw new Error("Insufficient ARCHI."); mockUserTokens[tIdx].balance -= b.reward; mockBounties[idx].escrowState = 'Funded'; mockBounties[idx].status = 'In Progress'; return {...mockBounties[idx]}; };
export const releaseEscrow = async (bountyId: string): Promise<BountyEntity> => { const idx = mockBounties.findIndex(b => b.id === bountyId); if (idx === -1) throw new Error("Bounty not found"); await new Promise(resolve => setTimeout(resolve, 1000)); mockBounties[idx].escrowState = 'Released'; mockBounties[idx].status = 'Complete'; reputationEvents.push({ id: `rev_${Date.now()}`, userId: mockBounties[idx].winnerId!, type: 'BountyCompleted', value: 10, description: `Completed bounty: ${mockBounties[idx].title}`, timestamp: new Date().toISOString()}); return {...mockBounties[idx]}; }
export const raiseDispute = async (bountyId: string): Promise<BountyEntity> => { const idx = mockBounties.findIndex(b => b.id === bountyId); if (idx === -1) throw new Error("Bounty not found"); mockBounties[idx].status = 'In Dispute'; return {...mockBounties[idx]}; }
export const listArbitrators = async (): Promise<ArbitratorEntity[]> => { return [...mockArbitrators]; };
export const listAvailableArbitrators = async (projectId: string): Promise<ArbitratorEntity[]> => { return mockArbitrators.filter(a => !a.conflictsWithProjectIds?.includes(projectId)); };
export const selectArbitrator = async (bountyId: string, arbitratorId: string): Promise<BountyEntity> => { const bIdx = mockBounties.findIndex(b => b.id === bountyId); if (bIdx === -1) throw new Error("Bounty not found"); const a = mockArbitrators.find(a => a.id === arbitratorId); if (!a) throw new Error("Arbitrator not found"); const tIdx = mockUserTokens.findIndex(t => t.symbol === 'PiUSD'); if(mockUserTokens[tIdx].balance < a.fee) throw new Error("Insufficient PiUSD for arbitrator fee."); mockUserTokens[tIdx].balance -= a.fee; mockBounties[bIdx].status = 'Arbitration'; return {...mockBounties[bIdx]}; };
export const resolveArbitration = async (bountyId: string, decision: 'Release' | 'Refund'): Promise<BountyEntity> => { const idx = mockBounties.findIndex(b => b.id === bountyId); if (idx === -1) throw new Error("Bounty not found"); mockBounties[idx].status = 'Complete'; mockBounties[idx].escrowState = decision === 'Release' ? 'Released' : 'Refunded'; if (decision === 'Refund') { const tIdx = mockUserTokens.findIndex(t => t.symbol === 'ARCHI'); mockUserTokens[tIdx].balance += mockBounties[idx].reward; } return {...mockBounties[idx]}; };
export const listVendorProducts = async (): Promise<ProductEntity[]> => { return [...mockProducts]; };
export const listShippingZones = async (): Promise<ShippingZone[]> => { return [...mockShippingZones]; };
export const updateShippingZone = async (zoneId: string, active: boolean): Promise<ShippingZone> => { const z = mockShippingZones.find(z => z.id === zoneId); if(!z) throw new Error('Zone not found'); z.active = active; return {...z}; };
export const listPromotions = async (): Promise<PromotionEntity[]> => { return [...mockPromotions]; };
export const createPromotion = async (promo: Omit<PromotionEntity, 'id'>): Promise<PromotionEntity> => { const newPromo: PromotionEntity = { ...promo, id: `promo_${Date.now()}`, }; mockPromotions.unshift(newPromo); return newPromo; };
export const listOrders = async (): Promise<OrderEntity[]> => { return [...mockOrders]; };
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<OrderEntity> => { const idx = mockOrders.findIndex(o => o.id === orderId); if (idx === -1) throw new Error('Order not found'); mockOrders[idx].status = status; const order = mockOrders[idx]; const orderContainsInstallableItems = order.items.some(item => mockProducts.find(p => p.id === item.productId)?.tags?.includes('requires-installation')); if (status === 'Delivered' && orderContainsInstallableItems) { mockOrders[idx].proofOfInstallationStatus = 'pending'; } return { ...mockOrders[idx] }; };
export const getInstallationQuote = async (orderId: string): Promise<{ quote: number, providerId: string }> => { await new Promise(res => setTimeout(res, 800)); return { quote: 250, providerId: 'sp_01' }; };
export const listServiceProviders = async (): Promise<UserEntity[]> => { return mockServiceProviders.map(sp => ({ ...sp, role: 'service-provider' })); };
export const listGigWorkers = async (): Promise<UserEntity[]> => { return [...mockGigWorkers]; }; 
export const getProjectDetails = async (projectId: string): Promise<ProjectEntity | undefined> => { return mockProjects.find(p => p.id === projectId); };
export const createServiceAgreement = async (clientId: string, providerId: string, projectId: string, price: number): Promise<ServiceAgreementEntity> => { const newAgreement: ServiceAgreementEntity = { id: `sa_${Date.now()}`, clientId, providerId, projectId, price, scope: `Installation services for project ${projectId}`, status: 'pending', createdAt: new Date().toISOString() }; mockServiceAgreements.push(newAgreement); return newAgreement; };
export const listServiceAgreements = async (): Promise<ServiceAgreementEntity[]> => { return [...mockServiceAgreements]; };
export const getServiceLevelAgreementText = async (agreement: ServiceAgreementEntity): Promise<string> => { return `This Service Level Agreement...`; };
export const fundServiceEscrow = async (agreementId: string, validatorId?: string): Promise<ServiceAgreementEntity> => { const idx = mockServiceAgreements.findIndex(sa => sa.id === agreementId); if (idx === -1) throw new Error('Agreement not found'); mockServiceAgreements[idx].status = 'funded'; if (validatorId) mockServiceAgreements[idx].qualityAssuranceValidatorId = validatorId; return { ...mockServiceAgreements[idx] }; };
export const confirmServiceCompletion = async (agreementId: string, userType: 'client' | 'validator'): Promise<ServiceAgreementEntity> => { const idx = mockServiceAgreements.findIndex(sa => sa.id === agreementId); if (idx === -1) throw new Error('Agreement not found'); const agreement = mockServiceAgreements[idx]; if (userType === 'client') agreement.status = 'client-confirmed'; if (userType === 'validator' && agreement.status === 'client-confirmed') agreement.status = 'validator-confirmed'; const isComplete = agreement.status === 'client-confirmed' && !agreement.qualityAssuranceValidatorId || agreement.status === 'validator-confirmed'; if (isComplete) { agreement.status = 'complete'; const provider = mockServiceProviders.find(p => p.id === agreement.providerId); if(provider) { provider.trustScore = Math.min(100, provider.trustScore + 2); } } return { ...agreement }; };
export const submitRating = async (userId: string, rating: number, comment: string): Promise<boolean> => { reputationEvents.push({ id: `rev_${Date.now()}`, userId, type: 'RatingReceived', value: rating, description: comment, timestamp: new Date().toISOString() }); return true; };
export const calculateTrustScore = async (userId: string): Promise<number> => { const userEvents = reputationEvents.filter(e => e.userId === userId); let score = 50; for (const event of userEvents) { score += event.value; } mockUser.trustScore = Math.max(0, Math.min(100, score)); return mockUser.trustScore; };
export const listProposals = async (): Promise<ProposalEntity[]> => { mockProposals.forEach(p => { if (new Date() > new Date(p.endsAt) && p.status === 'Voting') { p.status = p.forVotes > p.againstVotes && p.turnout >= p.quorum ? 'Passed' : 'Failed'; } }); return [...mockProposals]; };
export const stakeArchi = async (amount: number): Promise<UserEntity> => { const tIdx = mockUserTokens.findIndex(t => t.symbol === 'ARCHI'); if (mockUserTokens[tIdx].balance < amount) throw new Error('Insufficient ARCHI'); mockUserTokens[tIdx].balance -= amount; mockUser.stakedArchi = (mockUser.stakedArchi || 0) + amount; return { ...mockUser }; };
export const unstakeArchi = async (amount: number): Promise<UserEntity> => { if ((mockUser.stakedArchi || 0) < amount) throw new Error('Insufficient staked ARCHI'); const tIdx = mockUserTokens.findIndex(t => t.symbol === 'ARCHI'); mockUserTokens[tIdx].balance += amount; mockUser.stakedArchi -= amount; return { ...mockUser }; };
export const voteOnProposal = async (proposalId: string, vote: 'for' | 'against', votingPower: number): Promise<ProposalEntity> => { const idx = mockProposals.findIndex(p => p.id === proposalId); if (idx === -1) throw new Error('Proposal not found'); if (vote === 'for') mockProposals[idx].forVotes += votingPower; else mockProposals[idx].againstVotes += votingPower; mockProposals[idx].turnout += (votingPower / TOTAL_VOTING_POWER); return { ...mockProposals[idx] }; };
export const executeProposal = async(proposalId: string): Promise<ProposalEntity> => { console.log(`[AdminBot] Executing proposal ${proposalId}...`); await new Promise(r => setTimeout(r, 1000)); const idx = mockProposals.findIndex(p => p.id === proposalId); if (idx === -1) throw new Error("Proposal not found."); mockProposals[idx].status = 'Executed'; return {...mockProposals[idx]}; };
export const submitProofOfInstallation = async(orderId: string, photoData: string): Promise<OrderEntity> => { await new Promise(r => setTimeout(r, 1000)); const idx = mockOrders.findIndex(o => o.id === orderId); if (idx === -1) throw new Error('Order not found'); mockOrders[idx].proofOfInstallationStatus = 'submitted'; return {...mockOrders[idx]}; }
export const verifyProofOfInstallation = async(orderId: string): Promise<OrderEntity> => { await new Promise(r => setTimeout(r, 2000)); const idx = mockOrders.findIndex(o => o.id === orderId); if (idx === -1) throw new Error('Order not found'); mockOrders[idx].proofOfInstallationStatus = 'verified'; return {...mockOrders[idx]}; };
export const shareToPiFeed = async (projectId: string, caption?: string): Promise<{ success: boolean; message: string }> => { await new Promise(r => setTimeout(r, 1200)); return { success: true, message: 'Project shared to Pi Feed!' }; };
export const listDesignChallenges = async (): Promise<DesignChallengeEntity[]> => { return [...mockDesignChallenges]; };
export const getChallengeSubmissions = async (challengeId: string): Promise<ChallengeSubmissionEntity[]> => { return mockChallengeSubmissions.filter(s => s.challengeId === challengeId); };
export const submitProjectToChallenge = async (projectId: string, challengeId: string): Promise<ChallengeSubmissionEntity> => { const p = mockProjects.find(p => p.id === projectId); if (!p) throw new Error("Proj not found"); const sub: ChallengeSubmissionEntity = { id: `sub_${Date.now()}`, challengeId, projectId, submitterId: mockUser.id, submitterName: mockUser.piUsername, votes: 0, thumbnailUrl: p.thumbnailUrl || '', projectName: p.name }; mockChallengeSubmissions.push(sub); return sub; };
export const voteOnChallengeSubmission = async (submissionId: string, votingPower: number): Promise<ChallengeSubmissionEntity> => { const idx = mockChallengeSubmissions.findIndex(s => s.id === submissionId); if (idx === -1) throw new Error("Submission not found"); mockChallengeSubmissions[idx].votes += votingPower; return { ...mockChallengeSubmissions[idx] }; };
export const finalizeChallenge = async (challengeId: string): Promise<DesignChallengeEntity> => { return mockDesignChallenges[0]; };
export const calculateFeeDetails = (reward: number, staked: number) => { const discountPercent = staked > 1000 ? 50 : 0; const originalFee = reward * 0.1; const fee = originalFee * (1 - discountPercent / 100); return { fee, effectiveRate: 10 - (discountPercent/10), discountPercent, originalFee }; };
export const getMarketMetrics = async () => { return [ { name: 'Eco-Timber', change: 2.5, price: 15.50 }, { name: 'Steel Beams', change: -1.8, price: 125.00 }, { name: 'Glass', change: 0.5, price: 45.00 } ]; };
export const generateApiKey = async () => "arch_pk_live_" + Math.random().toString(36).substring(2);
export const claimMiningRewards = async () => true;
export const stakeLpTokens = async (amount: number) => true;
export const updateProductSustainability = async (productId: string, isSustainable: boolean, certifications: string[]) => { const p = mockProducts.find(x => x.id === productId); if(p) { p.isEcoFriendly = isSustainable; p.sustainabilityCertifications = certifications; } };
export const listSignedAgreements = async (): Promise<SignedAgreement[]> => { return [ { id: 'sa_01', type: 'Service', status: 'Active', referenceId: 'proj_01', contentHash: '0x123...', timestamp: new Date().toISOString() } ]; };
export const requestServiceQuote = async (projectId: string, materialId: string) => true;
export const generateSustainabilityReport = async (projectId: string): Promise<SustainabilityReport> => { return { energyEfficiencyScore: 78, carbonFootprint: 1200, estimatedAnnualSavings: 350, recommendations: ['Use LED lighting'] }; };
export const optimizeProjectForSustainability = async (projectId: string) => mockProjects.find(p => p.id === projectId) || mockProjects[0];
export const getCartOptimizations = async (cart: any): Promise<CartOptimization[]> => { return [{ originalProductId: 'prod_02', suggestedProductId: 'prod_01', reason: 'Switch to Timber', savings: 50 }]; };
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
export const submitProposalComment = async (proposalId: string, text: string) => mockProposals.find(pr => pr.id === proposalId) || mockProposals[0];
export const createDesignChallenge = async (data: any): Promise<DesignChallengeEntity> => { return { ...mockDesignChallenges[0], ...data, id: 'dc_new' }; };
export const inviteTeamMember = async (email: string, role: string) => true;
export const listTeamMembers = async (orgId: string): Promise<TeamMemberEntity[]> => [ { id: 'tm_01', name: 'Alice', role: 'Admin', avatarUrl: 'https://placehold.co/50', lastActive: 'Now' } ];
export const listDesignTemplates = async (): Promise<DesignTemplateEntity[]> => [ { id: 'tmpl_01', name: 'Modern Office', itemCount: 15, style: 'Modern', thumbnailUrl: 'https://placehold.co/100' } ];
export const getEnterpriseAnalytics = async (): Promise<SpendingMetric[]> => [ { month: 'Jan', amount: 5000 }, { month: 'Feb', amount: 12000 } ];
export const processBulkOrder = async (pids: string[], qtys: number[]) => ({ total: 5000, commission: 50, discount: 500 });

// --- NEW: Affiliate & Dropshipping Functions ---

export const registerAffiliate = async (referralCode: string): Promise<AffiliateProfile> => {
    mockUser.affiliateProfile = {
        referralCode,
        totalReferrals: 0,
        totalEarnings: 0,
        pendingEarnings: 0,
        tier: 'Scout',
        campaigns: []
    };
    return mockUser.affiliateProfile;
};

export const claimAffiliateEarnings = async (): Promise<void> => {
    if (mockUser.affiliateProfile) {
        const idx = mockUserTokens.findIndex(t => t.symbol === 'ARCHI');
        mockUserTokens[idx].balance += mockUser.affiliateProfile.pendingEarnings;
        mockUser.affiliateProfile.totalEarnings += mockUser.affiliateProfile.pendingEarnings;
        mockUser.affiliateProfile.pendingEarnings = 0;
    }
};

export const activateDropshipping = async (storeName: string): Promise<DropshipProfile> => {
    mockUser.dropshipProfile = {
        storeName,
        isActive: true,
        liabilityAgreed: true,
        totalSales: 0,
        reputationScore: 50
    };
    return mockUser.dropshipProfile;
};

export const listDropshipCandidates = async (): Promise<ProductEntity[]> => {
    // Return all products eligible for dropshipping (not own products)
    return mockProducts.filter(p => p.allowDropshipping);
};

export const addDropshipListing = async (productId: string, markup: number): Promise<DropshipListing> => {
    const product = mockProducts.find(p => p.id === productId);
    if (!product) throw new Error("Product not found");
    
    const listing: DropshipListing = {
        id: `ds_list_${Date.now()}`,
        originalProductId: productId,
        vendorId: mockUser.id,
        markupPrice: markup,
        originalPrice: product.wholesalePrice || product.price,
        margin: markup - (product.wholesalePrice || product.price),
        active: true
    };
    mockDropshipListings.push(listing);
    return listing;
};

export const getMyDropshipListings = async (): Promise<DropshipListing[]> => {
    return [...mockDropshipListings];
};

export const forwardOrderToVendor = async (orderId: string): Promise<void> => {
    const order = mockOrders.find(o => o.id === orderId);
    if (order) {
        order.status = 'Forwarded to Vendor';
        // In real contract, this triggers payment split:
        // Vendor gets wholesale price
        // Platform gets fee
        // Dropshipper keeps margin (already held since they sold it)
    }
};
