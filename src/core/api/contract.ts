import { ProjectEntity, UserEntity, MaterialEntity, TokenEntity, LiquidityPoolEntity, BountyEntity, ArbitratorEntity, ProductEntity, ShippingZone, PromotionEntity, OrderEntity, OrderStatus, ServiceProviderProfile, ServiceAgreementEntity, ReputationEvent, ProposalEntity, ProofOfInstallationStatus, DesignChallengeEntity, ChallengeSubmissionEntity } from '../schemas/entities';
import { PiCoinIcon } from '../../components/icons/PiCoinIcon';
import { ArchitexLogo } from '../../components/icons/ArchitexLogo';

// --- MOCK DATA ---
const mockProjects: ProjectEntity[] = [
  {
    id: 'proj_01',
    ownerId: 'user_01',
    name: 'Living Room Remodel',
    status: 'Designing',
    billOfMaterials: [{ materialId: 'mat_01', quantity: 20, status: 'Pending' }],
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

export let mockUserTokens: TokenEntity[] = [
    { symbol: 'PiUSD', name: 'Pi USD', balance: 150.75, icon: PiCoinIcon },
    { symbol: 'ARCHI', name: 'Architex Token', balance: 15000, icon: ArchitexLogo },
];

export const mockLiquidityPool: LiquidityPoolEntity = {
    pair: [mockUserTokens[0], mockUserTokens[1]],
    userShare: 0.05,
    totalValueLocked: 5000000,
};

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
    { id: 'prod_01', vendorId: 'user_01', name: 'Eco-Friendly Timber', price: 15.50, inStock: 500, imageUrl: 'https://placehold.co/100x100/10B981/FFFFFF/png?text=Timber', tags: ['requires-installation'] },
    { id: 'prod_02', vendorId: 'user_01', name: 'Recycled Steel Beams', price: 125.00, inStock: 80, imageUrl: 'https://placehold.co/100x100/8B5CF6/FFFFFF/png?text=Steel', tags: ['requires-installation'] },
    { id: 'prod_03', vendorId: 'user_01', name: 'Low-VOC Paint', price: 45.00, inStock: 250, imageUrl: 'https://placehold.co/100x100/FDB300/FFFFFF/png?text=Paint' },
];

let mockOrders: OrderEntity[] = [
    { id: 'ord_01', userId: 'user_01', items: [{productId: 'prod_01', quantity: 50}], total: 775, status: 'Shipped', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), proofOfInstallationStatus: 'none' },
    { id: 'ord_02', userId: 'user_01', items: [{productId: 'prod_03', quantity: 5}], total: 225, status: 'Processing', createdAt: new Date().toISOString(), proofOfInstallationStatus: 'none' },
    { id: 'ord_03', userId: 'user_01', items: [{productId: 'prod_02', quantity: 10}], total: 1250, status: 'Delivered', createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), proofOfInstallationStatus: 'none' },
];

const mockShippingZones: ShippingZone[] = [{ id: 'zone_na', name: 'North America', active: true },{ id: 'zone_eu', name: 'European Union', active: true },{ id: 'zone_asia', name: 'Asia-Pacific', active: false }];
const mockPromotions: PromotionEntity[] = [{ id: 'promo_01', type: 'item', description: '15% off Eco-Timber', discountValue: 15, targetId: 'prod_01' },{ id: 'promo_02', type: 'invoice', description: '10% off orders over 200 PiUSD', discountValue: 10, minSpend: 200 }];

const mockServiceProviders: Omit<UserEntity, 'role'>[] = [
    { id: 'sp_01', piUsername: 'InstallPro', walletAddress: 'GC...P1', trustScore: 98, avatarUrl: 'https://placehold.co/100x100/10B981/FFFFFF/png?text=IP', subscriptionTier: 'Accelerator', serviceProviderProfile: { specialty: 'General Construction', portfolioUrl: '#', serviceZones: ['USA-CA'], hasLiabilityInsurance: true } },
    { id: 'sp_02', piUsername: 'ElecTech', walletAddress: 'GC...P2', trustScore: 95, avatarUrl: 'https://placehold.co/100x100/FDB300/FFFFFF/png?text=ET', subscriptionTier: 'Accelerator', serviceProviderProfile: { specialty: 'Electrical & Automation', portfolioUrl: '#', serviceZones: ['USA-CA', 'USA-NV'], hasLiabilityInsurance: true } },
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
    { id: 'prop_03', title: 'Integrate a new 3D modeling engine', description: 'A proposal to research and potentially integrate a more advanced rendering engine.', proposerId: 'designer_02', status: 'Failed', forVotes: 80000, againstVotes: 95000, createdAt: new Date(Date.now() - 86400000 * 15).toISOString(), endsAt: new Date(Date.now() - 86400000 * 8).toISOString(), quorum: 0.20, turnout: 0.175 },
];

let mockUser: UserEntity = { id: 'user_01', piUsername: 'ArchieBot', walletAddress: 'GD...QW', trustScore: 95, avatarUrl: 'https://placehold.co/100x100/020617/8B5CF6/png?text=A', subscriptionTier: 'Free', role: 'user', vendorProfile: { hasInsurance: false, agreedToIndemnity: false }, stakedArchi: 5000 };

const TOTAL_VOTING_POWER = 1000000; // Mock total voting power in the DAO for turnout calculation

// --- Design Challenge Mocks ---
let mockDesignChallenges: DesignChallengeEntity[] = [
    { id: 'dc_01', title: 'Best Eco-Kitchen', description: 'Design a kitchen using at least 3 sustainable materials from the marketplace.', reward: 25000, status: 'Voting', endsAt: new Date(Date.now() + 86400000 * 3).toISOString() },
    { id: 'dc_02', title: 'Minimalist Bedroom Sanctuary', description: 'Create a serene bedroom design focusing on simplicity and natural light.', reward: 15000, status: 'Open', endsAt: new Date(Date.now() + 86400000 * 10).toISOString() },
    { id: 'dc_03', title: 'Futuristic Living Room', description: 'Show us your vision of a living room in the year 2077.', reward: 20000, status: 'Complete', endsAt: new Date(Date.now() - 86400000 * 5).toISOString(), winnerId: 'user_02' }
];

let mockChallengeSubmissions: ChallengeSubmissionEntity[] = [
    { id: 'sub_01', challengeId: 'dc_01', projectId: 'proj_02', submitterId: 'user_01', submitterName: 'ArchieBot', votes: 1250, thumbnailUrl: 'https://placehold.co/400x300/10B981/FFFFFF/png?text=Eco-Kitchen', projectName: 'Kitchen Modernization' },
    { id: 'sub_02', challengeId: 'dc_01', projectId: 'proj_xx', submitterId: 'user_02', submitterName: 'CreativeCat', votes: 1840, thumbnailUrl: 'https://placehold.co/400x300/10B981/020617/png?text=Green+Kitchen', projectName: 'Verdant Kitchen' }
];


// --- API CONTRACT ---
export const authenticateWithPi = async (): Promise<UserEntity> => { return { ...mockUser }; };
export const listProjects = async (): Promise<ProjectEntity[]> => { return [...mockProjects]; };
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

// --- New Functions for P9.4/5 ---
export const executeProposal = async(proposalId: string): Promise<ProposalEntity> => {
    console.log(`[AdminBot] Attempting to execute proposal ${proposalId}...`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const idx = mockProposals.findIndex(p => p.id === proposalId);
    if (idx === -1) throw new Error("Proposal not found.");

    const proposal = mockProposals[idx];
    const canExecute = proposal.status === 'Passed' && new Date() > new Date(proposal.endsAt) && proposal.turnout >= proposal.quorum;

    if (!canExecute) {
        throw new Error("Proposal is not in a state that can be executed.");
    }

    proposal.status = 'Executing';
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate execution time
    proposal.status = 'Executed';
    console.log(`[AdminBot] Successfully executed proposal: ${proposal.title}`);
    // In a real scenario, this would trigger on-chain changes, like modifying a contract variable.
    return {...proposal};
};

export const submitProofOfInstallation = async(orderId: string, photoData: string): Promise<OrderEntity> => {
    console.log(`API: Received proof of installation for order ${orderId}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const idx = mockOrders.findIndex(o => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');
    mockOrders[idx].proofOfInstallationStatus = 'submitted';
    return {...mockOrders[idx]};
}

export const verifyProofOfInstallation = async(orderId: string): Promise<OrderEntity> => {
    console.log(`API: Verifying proof for order ${orderId}...`);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI verification
    const idx = mockOrders.findIndex(o => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');
    
    // Simulate successful verification
    mockOrders[idx].proofOfInstallationStatus = 'verified';
    
    // Calculate and award cashback (e.g., 2% of order total in ARCHI)
    const CASHBACK_RATE = 0.02;
    const cashbackAmount = mockOrders[idx].total * CASHBACK_RATE;
    const archiIndex = mockUserTokens.findIndex(t => t.symbol === 'ARCHI');
    mockUserTokens[archiIndex].balance += cashbackAmount;
    
    console.log(`API: Awarded ${cashbackAmount} ARCHI as cashback.`);
    
    // Add reputation event
    reputationEvents.push({
        id: `rev_${Date.now()}`,
        userId: mockOrders[idx].userId,
        type: 'ProofOfInstallation',
        value: 5, // Positive reputation for contributing
        description: `Verified physical installation for order ${orderId}`,
        timestamp: new Date().toISOString(),
    });

    return {...mockOrders[idx]};
};

export const shareToPiFeed = async (projectId: string): Promise<{ success: boolean; message: string }> => {
    console.log(`[PiSocialAPI] User ${mockUser.id} is sharing project ${projectId}.`);
    await new Promise(resolve => setTimeout(resolve, 1200));
    console.log(`[PiSocialAPI] Share successful.`);
    return { success: true, message: 'Project shared to Pi Feed!' };
};

// --- Design Challenge API ---
export const listDesignChallenges = async (): Promise<DesignChallengeEntity[]> => {
    // In a real scenario, we'd also check dates to move from 'Voting' to 'Complete'
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
    return newSubmission;
};

export const voteOnChallengeSubmission = async (submissionId: string, votingPower: number): Promise<ChallengeSubmissionEntity> => {
    const idx = mockChallengeSubmissions.findIndex(s => s.id === submissionId);
    if (idx === -1) throw new Error("Submission not found");
    mockChallengeSubmissions[idx].votes += votingPower;
    return { ...mockChallengeSubmissions[idx] };
};

export const finalizeChallenge = async (challengeId: string): Promise<DesignChallengeEntity> => {
    const challengeIndex = mockDesignChallenges.findIndex(c => c.id === challengeId);
    if (challengeIndex === -1) throw new Error("Challenge not found");

    const submissions = mockChallengeSubmissions.filter(s => s.challengeId === challengeId);
    if (submissions.length === 0) {
        mockDesignChallenges[challengeIndex].status = 'Complete';
        return { ...mockDesignChallenges[challengeIndex] };
    }

    const winner = submissions.sort((a, b) => b.votes - a.votes)[0];
    mockDesignChallenges[challengeIndex].status = 'Complete';
    mockDesignChallenges[challengeIndex].winnerId = winner.submitterId;
    
    // In a real contract, this would be a token transfer. Here we just update a mock balance.
    // For simplicity, we assume the winner is the current user if they submitted.
    if (winner.submitterId === mockUser.id) {
        const tokenIndex = mockUserTokens.findIndex(t => t.symbol === 'ARCHI');
        mockUserTokens[tokenIndex].balance += mockDesignChallenges[challengeIndex].reward;
    }
    
    console.log(`[Contract] Challenge ${challengeId} finalized. Winner is ${winner.submitterName}. ${mockDesignChallenges[challengeIndex].reward} ARCHI awarded.`);
    return { ...mockDesignChallenges[challengeIndex] };
};
