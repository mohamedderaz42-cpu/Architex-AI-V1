
import { 
    ProjectEntity, UserEntity, BountyEntity, ArbitratorEntity, ProductEntity, ShippingZone, 
    PromotionEntity, OrderEntity, OrderStatus, ServiceAgreementEntity, ProposalEntity, 
    DesignChallengeEntity, ChallengeSubmissionEntity, SustainabilityReport, InventoryConflict, 
    CartOptimization, IntegrationTestResult, StressTestResult, VestingSchedule, FuzzTestResult, 
    TeamMemberEntity, DesignTemplateEntity, SpendingMetric, SignedAgreement, AffiliateProfile, 
    DropshipProfile, DropshipListing, TokenEntity, LiquidityPoolEntity, ServiceProviderProfile,
    ArbitratorProfile, MessageEntity, VendorProfile, ProjectStatus, BountyStatus, SubscriptionTier,
    ServiceAgreementStatus, ProposalStatus, DesignChallengeStatus, ProofOfInstallationStatus,
    UserRole, EscrowState
} from '../schemas/entities';
import { PiCoinIcon } from '../../components/icons/PiCoinIcon';
import { ArchitexLogo } from '../../components/icons/ArchitexLogo';
import { LegalEngine } from '../services/LegalEngine';

// ==========================================
// MOCK DATA
// ==========================================
const defaultUser: UserEntity = {
    id: 'user_01', piUsername: 'ArchieBuilder', walletAddress: 'GD...7X', trustScore: 88,
    subscriptionTier: 'Free', role: 'user', stakedArchi: 5000,
    reputationHistory: [],
    stakingPosition: { unclaimedRewards: 12.5 }
};

export const mockUserTokens: TokenEntity[] = [
    { symbol: 'PiUSD', name: 'Pi USD', balance: 250.00, icon: PiCoinIcon },
    { symbol: 'ARCHI', name: 'Architex Token', balance: 15000, icon: ArchitexLogo },
];

export const mockLiquidityPool = { 
    pair: [mockUserTokens[0], mockUserTokens[1]], 
    userShare: 0.05, 
    totalValueLocked: 5200000,
    protocolLiquidity: 3000000 
} as unknown as LiquidityPoolEntity;

const mockProductsList: ProductEntity[] = [
    { id: 'prod_1', vendorId: 'v1', name: 'Eco-Wood Panel', sku: 'WOOD-001', price: 45.00, inStock: 12, imageUrl: 'https://placehold.co/200/10B981/FFF?text=Wood', isEcoFriendly: true, tags: ['Structural', 'Eco', 'requires-installation'], sustainabilityRating: 'A' },
    { id: 'prod_2', vendorId: 'v1', name: 'Smart Bulb', sku: 'LITE-22', price: 15.00, inStock: 500, imageUrl: 'https://placehold.co/200/FDB300/000?text=Bulb', tags: ['Smart Home'], sustainabilityRating: 'B' },
    { id: 'prod_alt', vendorId: 'v2', name: 'Bamboo Composite', sku: 'BAM-99', price: 42.00, inStock: 500, imageUrl: 'https://placehold.co/200/10B981/FFF?text=Bamboo', tags: ['Structural', 'Eco', 'requires-installation'], sustainabilityRating: 'A' }
];

// ==========================================
// MOCK ADAPTER IMPLEMENTATION
// ==========================================
export const MockAdapter = {
    identity: {
        authenticate: async () => defaultUser,
        getProfile: async () => defaultUser,
        updateProfile: async (uid: string, data: any) => ({ ...defaultUser, ...data }),
        registerAsProvider: async (profile: any) => ({ ...defaultUser, role: 'service-provider', serviceProviderProfile: profile } as UserEntity),
        registerAsArbitrator: async (profile: any) => ({ ...defaultUser, role: 'arbitrator', arbitratorProfile: profile } as UserEntity),
        registerAsVendor: async (profile: any) => ({ ...defaultUser, role: 'vendor', vendorProfile: profile } as UserEntity),
        getVestingSchedule: async (uid?: string) => ({ startTime: new Date().toISOString(), duration: 31536000, cliff: 0, totalAmount: 10000, releasedAmount: 2500 } as VestingSchedule),
        joinFounderProgram: async () => true,
    },
    engineering: {
        listProjects: async (userId?: string) => [
            { id: 'p1', ownerId: 'user_01', name: 'Modern Loft', status: 'Designing' as ProjectStatus, billOfMaterials: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), thumbnailUrl: 'https://placehold.co/400x300/8B5CF6/FFFFFF?text=Loft', isPublic: true, isNft: false },
            { id: 'p2', ownerId: 'user_01', name: 'Office Space', status: 'Complete' as ProjectStatus, billOfMaterials: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), thumbnailUrl: 'https://placehold.co/400x300/10B981/FFFFFF?text=Office', isPublic: false, isNft: true }
        ],
        listPublicProjects: async () => [
            { id: 'pub1', ownerId: 'user_99', ownerName: 'DesignPro', name: 'Eco-Villa', status: 'Complete' as ProjectStatus, billOfMaterials: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), thumbnailUrl: 'https://placehold.co/400x300/FDB300/000000?text=Villa', isPublic: true, isNft: true, likes: 120 }
        ],
        createProjectFromScan: async (scanData?: any) => ({ id: `p_${Date.now()}`, ownerId: 'user_01', name: 'New Scan', status: 'Designing' as ProjectStatus, billOfMaterials: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), thumbnailUrl: 'https://placehold.co/400x300/333/FFF?text=New+Scan', isPublic: false, isNft: false }),
        incrementProjectModification: async (id: string) => ({ id, ownerId: 'user_01', name: 'New Scan', status: 'Designing' as ProjectStatus, billOfMaterials: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), thumbnailUrl: '', isPublic: false, isNft: false }), 
        updateProject: async (pid: string, data: any) => ({ ...data } as ProjectEntity),
        mintNft: async (pid: string) => ({ id: pid, ownerId: 'user_01', name: 'Minted Project', status: 'Complete' as ProjectStatus, billOfMaterials: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isNft: true, nftTokenId: '12345', thumbnailUrl: 'https://placehold.co/400x300', isPublic: true }),
        generateSustainabilityReport: async () => ({ energyEfficiencyScore: 85, carbonFootprint: 500, estimatedAnnualSavings: 1200, recommendations: ['Use LED', 'Recycled Wood'] } as SustainabilityReport),
        shareToFeed: async (projectId: string, caption?: string) => ({ success: true, message: 'Posted to Pi Network Feed' }),
    },
    commerce: {
        listProducts: async () => mockProductsList,
        getProduct: async (id: string) => mockProductsList.find(p => p.id === id),
        createProduct: async (p: any) => ({ ...p, id: `new_${Date.now()}` } as ProductEntity),
        updateProduct: async (p: any) => p as ProductEntity,
        deleteProduct: async (id: string) => true,
        listOrders: async (userId?: string) => [
             { id: 'ord_01', userId: 'user_01', items: [{ productId: 'prod_1', quantity: 2 }], total: 90, status: 'Shipped' as OrderStatus, createdAt: new Date().toISOString(), proofOfInstallationStatus: 'none' as ProofOfInstallationStatus }
        ],
        createOrder: async () => ({ id: `ord_${Date.now()}`, userId: 'user_01', items: [], total: 100, status: 'Processing' as OrderStatus, createdAt: new Date().toISOString(), proofOfInstallationStatus: 'none' as ProofOfInstallationStatus }),
        updateOrderStatus: async (oid: string, status: OrderStatus) => ({ id: oid, userId: 'user_01', items: [], total: 100, status, createdAt: new Date().toISOString(), proofOfInstallationStatus: 'none' as ProofOfInstallationStatus }),
        optimizeCart: async (cart?: any) => [{ originalProductId: 'prod_1', suggestedProductId: 'prod_2', reason: 'Cheaper & Greener', savings: 15 } as CartOptimization],
        
        // AUDIT FIX: Hardened Inventory Logic
        checkInventory: async (cart: any) => {
             const conflicts: InventoryConflict[] = [];
             // Mock logic: allow all unless explicit mock conflict needed
             if (Array.isArray(cart)) {
                 for(const item of cart) {
                     const globalProduct = mockProductsList.find(p => p.id === item.product.id);
                     if (globalProduct) {
                         const isStockout = item.product.id === 'prod_1' && item.quantity > 10;
                         if(isStockout) { 
                             console.log(`[Logistics] Stockout Detected for ${item.product.name}. Triggering ArchieBot Recommendation.`);
                             conflicts.push({
                                 productId: item.product.id,
                                 requested: item.quantity,
                                 available: 10,
                                 alternativeProductId: 'prod_alt' 
                             });
                         }
                     }
                 }
             }
             return conflicts;
        },

        registerAffiliate: async (code: string) => ({ referralCode: code, totalReferrals: 0, totalEarnings: 0, pendingEarnings: 0, tier: 'Scout', campaigns: [] } as AffiliateProfile),
        claimAffiliateEarnings: async () => {},
        activateDropshipping: async (name: string) => ({ storeName: name, isActive: true, liabilityAgreed: true, totalSales: 0, reputationScore: 100 } as DropshipProfile),
        addDropshipListing: async (pid: string, markup: number) => ({ id: `dl_${Date.now()}`, originalProductId: pid, vendorId: 'user_01', markupPrice: markup, originalPrice: 0, margin: 0, active: true } as DropshipListing),
        listDropshipCandidates: async () => [
             { id: 'cand_1', vendorId: 'v2', name: 'Designer Chair', price: 250, wholesalePrice: 180, inStock: 50, imageUrl: 'https://placehold.co/200', allowDropshipping: true } as ProductEntity
        ],
        getMyDropshipListings: async () => [] as DropshipListing[],
        processVendorOrderAction: async (oid: string, action: string) => {},
        listShippingZones: async () => [{id: 'z1', name: 'North America', active: true}, {id: 'z2', name: 'Europe', active: false}],
        updateShippingZone: async (id: string, active: boolean) => ({ id, name: 'Zone', active }),
        listPromotions: async () => [] as PromotionEntity[],
        createPromotion: async (p: any) => ({} as PromotionEntity),
        generatePurchaseAgreement: async (cart?: any, total?: number) => "Purchase Agreement Contract...",
        processBulkOrder: async (pids: string[], qtys: number[]) => ({ total: 5000, commission: 500, discount: 250 }),
        getInstallationQuote: async (oid: string) => ({ quote: 150, providerId: 'prov_1' })
    },
    services: {
        listProviders: async () => [
            { id: 'sp_1', piUsername: 'Sparky', role: 'service-provider', trustScore: 92, walletAddress: '...', subscriptionTier: 'Free', serviceProviderProfile: { specialty: 'Electrical', hourlyRate: 50, isAvailable: true, distance: '2.5km', portfolioUrl: '', serviceZones: [], hasLiabilityInsurance: true } } as UserEntity
        ],
        listGigWorkers: async () => [
             { id: 'gw_1', piUsername: 'FixItFelix', role: 'service-provider' as UserRole, trustScore: 85, walletAddress: '...', subscriptionTier: 'Free' as SubscriptionTier, serviceProviderProfile: { specialty: 'General', gigCategories: ['Plumbing'], hourlyRate: 40, isAvailable: true, distance: '1.2km', portfolioUrl: '', serviceZones: [], hasLiabilityInsurance: true } } as UserEntity
        ],
        createAgreement: async (cid: string, pid: string, projid: string, price: number) => ({ id: `sa_${Date.now()}`, clientId: cid, providerId: pid, projectId: projid, price, scope: 'Work', status: 'pending' as ServiceAgreementStatus, createdAt: new Date().toISOString() }),
        fundEscrow: async (aid: string, vid?: string) => ({ id: aid, clientId: 'c', providerId: 'p', projectId: 'p', scope: 'Work', price: 100, status: 'funded' as ServiceAgreementStatus, createdAt: new Date().toISOString(), qualityAssuranceValidatorId: vid }),
        completeAgreement: async (aid: string, userType?: string) => ({ id: aid, clientId: 'c', providerId: 'p', projectId: 'p', scope: 'Work', price: 100, status: 'complete' as ServiceAgreementStatus, createdAt: new Date().toISOString() }),
        getServiceLevelAgreementText: async (agreement?: any) => "Service Level Agreement Terms...",
        listPendingJobs: async (pid: string) => [
            { id: 'job_1', userId: 'client_1', items: [{productId: 'install_svc', quantity: 1}], total: 500, status: 'Shipped' as OrderStatus, createdAt: new Date().toISOString(), proofOfInstallationStatus: 'none' as ProofOfInstallationStatus, providerId: pid },
            { id: 'job_2', userId: 'client_2', items: [{productId: 'repair_svc', quantity: 1}], total: 250, status: 'Processing' as OrderStatus, createdAt: new Date(Date.now()-86400000).toISOString(), proofOfInstallationStatus: 'none' as ProofOfInstallationStatus, providerId: pid }
        ],
        completeJob: async (oid: string) => ({ id: oid, userId: 'x', items: [], total: 0, status: 'Delivered' as OrderStatus, createdAt: '', proofOfInstallationStatus: 'submitted' as ProofOfInstallationStatus })
    },
    governance: {
        listProposals: async () => [
            { id: 'prop_1', title: 'Increase Staking Rewards', description: 'Raise APY to 12%', proposerId: 'dao_mem', status: 'Voting' as ProposalStatus, forVotes: 5000, againstVotes: 200, createdAt: new Date().toISOString(), endsAt: new Date(Date.now()+86400000).toISOString(), quorum: 0.2, turnout: 0.1 }
        ],
        vote: async (pid: string, vote: string, power: number) => ({ id: pid, title: 'Voted Proposal', description: '', proposerId: '', status: 'Voting' as ProposalStatus, forVotes: vote === 'for' ? power : 0, againstVotes: vote === 'against' ? power : 0, createdAt: '', endsAt: '', quorum: 0.2, turnout: 0.1 }),
        executeProposal: async (pid: string) => ({ id: pid, title: 'Executed Proposal', description: '', proposerId: '', status: 'Executed' as ProposalStatus, forVotes: 0, againstVotes: 0, createdAt: '', endsAt: '', quorum: 0, turnout: 0 }),
        submitProposalComment: async (pid: string, text: string) => ({ id: pid } as ProposalEntity),
        listChallenges: async () => [
            { id: 'ch_1', title: 'Eco-Kitchen 2025', description: 'Design a green kitchen.', reward: 1000, status: 'Open' as DesignChallengeStatus, endsAt: new Date(Date.now()+86400000*5).toISOString() }
        ],
        createChallenge: async (data: any) => ({ ...data, id: `ch_${Date.now()}`, status: 'Open' as DesignChallengeStatus }),
        processExpiredChallenges: async () => [] as DesignChallengeEntity[],
        getChallengeSubmissions: async (cid: string) => [] as ChallengeSubmissionEntity[],
        submitToChallenge: async (pid: string, cid: string) => ({ id: 'sub_1', challengeId: cid, projectId: pid, submitterId: 'user_01', submitterName: 'Archie', votes: 0, thumbnailUrl: '', projectName: 'My Submission' }),
        voteOnChallengeSubmission: async (sid: string, power: number) => ({} as ChallengeSubmissionEntity),
        stakeTokens: async (amt: number) => ({ ...defaultUser, stakedArchi: (defaultUser.stakedArchi || 0) + amt }),
        unstakeTokens: async (amt: number) => ({ ...defaultUser, stakedArchi: Math.max(0, (defaultUser.stakedArchi || 0) - amt) }),
        claimMiningRewards: async () => true,
    },
    legal: {
        listArbitrators: async () => [
             { id: 'arb_1', name: 'Judge Dredd', specialty: 'Contract Law', fee: 50, resolutionRate: 99, casesResolved: 200, avatarUrl: 'https://placehold.co/100' } as ArbitratorEntity
        ],
        listAvailableArbitrators: async (pid?: string) => [] as ArbitratorEntity[],
        createBounty: async (b: any) => {
            const fee = b.reward * 0.10; // 10% Platform Fee
            console.log(`[Smart Contract] Deducting 10% fee (${fee}) to Treasury...`);
            return { 
                ...b, 
                id: `bty_${Date.now()}`, 
                status: 'Open' as BountyStatus, 
                escrowState: 'Unfunded' as EscrowState, 
                createdAt: new Date().toISOString() 
            } as BountyEntity;
        },
        listBounties: async () => [
             { id: 'bty_1', projectId: 'p1', title: '3D Rendering Needed', description: 'Need high quality render.', reward: 500, status: 'Open' as BountyStatus, createdAt: new Date().toISOString(), escrowState: 'Unfunded' as EscrowState }
        ],
        getDynamicAgreementText: async (bounty: BountyEntity) => {
            const agreement = await LegalEngine.generateAgreement({
                projectId: bounty.projectId,
                clientId: 'user_01',
                providerId: 'TBD',
                scope: bounty.description,
                price: bounty.reward,
                currency: 'ARCHI'
            });
            return `AGREEMENT HASH: ${agreement.contentHash}\n\n[Full PDF available at ${agreement.pdfUrl}]`;
        },
        fundBountyEscrow: async (id: string) => {
            console.log(`[MarketplaceEscrow] Verifying Agreement Hash on-chain...`);
            await new Promise(resolve => setTimeout(resolve, 800)); 
            console.log(`[MarketplaceEscrow] Hash Verified. Funds Locked.`);
            return { id, projectId: 'p1', title: '', description: '', reward: 0, createdAt: '', status: 'In Progress' as BountyStatus, escrowState: 'Funded' as EscrowState } as BountyEntity;
        },
        releaseBountyEscrow: async (id: string) => ({ id, projectId: 'p1', title: '', description: '', reward: 0, createdAt: '', status: 'Complete' as BountyStatus, escrowState: 'Released' as EscrowState } as BountyEntity),
        raiseDispute: async (id: string) => {
             console.log(`[Smart Contract] Escrow Frozen for Dispute ${id}`);
             return { id, projectId: 'p1', title: 'Disputed Bounty', description: '', reward: 100, status: 'In Dispute' as BountyStatus, createdAt: '', escrowState: 'Funded' as EscrowState } as BountyEntity;
        },
        freezeEscrow: async (id: string) => {
             console.log(`[EscrowContract] CRITICAL: Funds Frozen for Transaction ${id}. Awaiting Arbitrator.`);
             return;
        },
        selectArbitrator: async (bid: string, aid: string) => ({ id: bid, projectId: 'p1', title: '', description: '', reward: 0, createdAt: '', status: 'Arbitration' as BountyStatus, escrowState: 'Funded' as EscrowState } as BountyEntity),
        resolveDispute: async (id: string, ruling: any) => ({ id, projectId: 'p1', title: 'Resolved Bounty', description: '', reward: 100, status: 'Complete' as BountyStatus, createdAt: '', escrowState: (ruling === 'Release' ? 'Released' : 'Refunded') as EscrowState } as BountyEntity),
        listSignedAgreements: async (userId?: string) => [
            { id: 'agg_1', type: 'Service' as const, status: 'Active' as const, referenceId: 'sa_01', contentHash: '0x123...', timestamp: new Date().toISOString(), signatories: ['user_01', 'prov_1'] }
        ],
        submitRating: async (uid: string, rating: number, comment: string) => true,
        calculateTrustScore: async (uid: string) => 95,
    },
    system: {
        runHealthCheck: async () => ({ success: true, steps: [{ name: 'Contracts', status: 'Passed' }, { name: 'Database', status: 'Passed' }] }),
        runStressTest: async (load: number) => ({ status: 'Passed', virtualUsers: load, tps: 5000, avgLatencyMs: 25, errorRate: 0.01 }),
        executeFuzzTest: async () => ({ status: 'Passed' as const, operationsCount: 5000, coverage: 98, testId: 'fz_123', logs: ['Init...', 'Testing edge cases...', 'Done.'] }),
        getTreasuryBalance: async () => 1500000,
        exportSystemState: async () => JSON.stringify({ users: [defaultUser], version: '1.0' }),
        restoreSystemState: async (json: string) => true,
        requestAdminMfa: async () => true,
        verifyAdminMfa: async () => true,
        inviteTeamMember: async (email: string, role: string) => true,
        listTeamMembers: async (orgId?: string) => [
             { id: 'tm_1', name: 'Alice', role: 'Admin', avatarUrl: 'https://placehold.co/100', lastActive: 'Today' },
             { id: 'tm_2', name: 'Bob', role: 'Viewer', avatarUrl: 'https://placehold.co/100', lastActive: 'Never' }
        ],
        listDesignTemplates: async () => [
             { id: 'tmp_1', name: 'Modern Studio', itemCount: 12, style: 'Modern', thumbnailUrl: 'https://placehold.co/200' },
             { id: 'tmp_2', name: 'Cozy Cabin', itemCount: 8, style: 'Rustic', thumbnailUrl: 'https://placehold.co/200' }
        ],
        getEnterpriseAnalytics: async () => [
             { month: 'Jan', amount: 12000 }, { month: 'Feb', amount: 15000 }, { month: 'Mar', amount: 18000 }
        ],
        getMarketMetrics: async () => [
             { name: 'Timber', change: 2.5, price: 15.50 }, { name: 'Steel', change: -1.2, price: 120.00 }
        ],
        generateApiKey: async () => "arch_pk_live_generated_" + Date.now(),
        submitProofOfInstallation: async (oid: string, data: string) => ({} as OrderEntity),
        verifyProofOfInstallation: async (oid: string) => ({} as OrderEntity),
    },
    // --- NEW ADMIN DOMAIN ---
    admin: {
        listPendingVendors: async () => [
            { 
                id: 'vend_pending_1', 
                companyName: 'Global Tiles Ltd.', 
                taxId: 'GB123456789', 
                hasInsurance: true, 
                status: 'pending',
                licenseUrl: '#',
                insuranceUrl: '#' 
            },
            { 
                id: 'vend_pending_2', 
                companyName: 'Eco Bricks Co.', 
                taxId: 'US987654321', 
                hasInsurance: true, 
                status: 'pending', 
                licenseUrl: '#',
                insuranceUrl: '#'
            }
        ] as VendorProfile[],
        approveVendor: async (id: string) => {
            console.log(`[Admin] Vendor ${id} approved.`);
            return true;
        },
        rejectVendor: async (id: string, reason: string) => {
            console.log(`[Admin] Vendor ${id} rejected. Reason: ${reason}`);
            return true;
        },
        listAllDisputes: async () => [
            { id: 'ord_disp_1', userId: 'user_02', items: [{productId: 'prod_1', quantity: 50}], total: 4500, status: 'In Dispute' as OrderStatus, createdAt: new Date().toISOString(), dropshipperId: 'vend_1' }
        ] as OrderEntity[]
    }
};

// Export functions with correct signatures
export const authenticateWithPi = MockAdapter.identity.authenticate;
export const listProjects = MockAdapter.engineering.listProjects;
export const listPublicProjects = MockAdapter.engineering.listPublicProjects;
export const generateModelFromScan = MockAdapter.engineering.createProjectFromScan;
export const incrementProjectModification = MockAdapter.engineering.incrementProjectModification;
export const mintProjectAsNft = MockAdapter.engineering.mintNft;
export const shareToFeed = MockAdapter.engineering.shareToFeed;
export const shareToPiFeed = MockAdapter.engineering.shareToFeed;

export const listOrders = MockAdapter.commerce.listOrders;
export const listVendorProducts = MockAdapter.commerce.listProducts;
export const updateOrderStatus = MockAdapter.commerce.updateOrderStatus;
export const getCartOptimizations = MockAdapter.commerce.optimizeCart;
export const checkInventory = MockAdapter.commerce.checkInventory;
export const generatePurchaseAgreement = MockAdapter.commerce.generatePurchaseAgreement;
export const registerAffiliate = MockAdapter.commerce.registerAffiliate;
export const claimAffiliateEarnings = MockAdapter.commerce.claimAffiliateEarnings;
export const activateDropshipping = MockAdapter.commerce.activateDropshipping;
export const listDropshipCandidates = MockAdapter.commerce.listDropshipCandidates;
export const addDropshipListing = MockAdapter.commerce.addDropshipListing;
export const getMyDropshipListings = MockAdapter.commerce.getMyDropshipListings;
export const processVendorOrderAction = MockAdapter.commerce.processVendorOrderAction;
export const listShippingZones = MockAdapter.commerce.listShippingZones;
export const updateShippingZone = MockAdapter.commerce.updateShippingZone;
export const listPromotions = MockAdapter.commerce.listPromotions;
export const createPromotion = MockAdapter.commerce.createPromotion;
export const processBulkOrder = MockAdapter.commerce.processBulkOrder;
export const getInstallationQuote = MockAdapter.commerce.getInstallationQuote;
export const listProducts = MockAdapter.commerce.listProducts;
export const createProduct = MockAdapter.commerce.createProduct;
export const updateProduct = MockAdapter.commerce.updateProduct;
export const deleteProduct = MockAdapter.commerce.deleteProduct;

export const listServiceProviders = MockAdapter.services.listProviders;
export const listGigWorkers = MockAdapter.services.listGigWorkers;
export const createServiceAgreement = MockAdapter.services.createAgreement;
export const listServiceAgreements = async () => [] as ServiceAgreementEntity[]; 
export const fundServiceEscrow = MockAdapter.services.fundEscrow;
export const confirmServiceCompletion = MockAdapter.services.completeAgreement;
export const getServiceLevelAgreementText = MockAdapter.services.getServiceLevelAgreementText;

export const listProposals = MockAdapter.governance.listProposals;
export const voteOnProposal = MockAdapter.governance.vote;
export const executeProposal = MockAdapter.governance.executeProposal;
export const submitProposalComment = MockAdapter.governance.submitProposalComment;
export const listDesignChallenges = MockAdapter.governance.listChallenges;
export const createDesignChallenge = MockAdapter.governance.createChallenge;
export const processExpiredChallenges = MockAdapter.governance.processExpiredChallenges;
export const getChallengeSubmissions = MockAdapter.governance.getChallengeSubmissions;
export const submitProjectToChallenge = MockAdapter.governance.submitToChallenge;
export const voteOnChallengeSubmission = MockAdapter.governance.voteOnChallengeSubmission;
export const stakeArchi = MockAdapter.governance.stakeTokens;
export const unstakeArchi = MockAdapter.governance.unstakeTokens;
export const claimMiningRewards = MockAdapter.governance.claimMiningRewards;

export const listArbitrators = MockAdapter.legal.listArbitrators;
export const listAvailableArbitrators = MockAdapter.legal.listAvailableArbitrators;
export const createBounty = MockAdapter.legal.createBounty;
export const listBounties = MockAdapter.legal.listBounties;
export const getDynamicAgreementText = MockAdapter.legal.getDynamicAgreementText;
export const fundEscrow = MockAdapter.legal.fundBountyEscrow;
export const releaseEscrow = MockAdapter.legal.releaseBountyEscrow;
export const raiseDispute = MockAdapter.legal.raiseDispute;
export const freezeEscrow = MockAdapter.legal.freezeEscrow;
export const selectArbitrator = MockAdapter.legal.selectArbitrator;
export const resolveArbitration = MockAdapter.legal.resolveDispute;
export const listSignedAgreements = MockAdapter.legal.listSignedAgreements;
export const submitRating = MockAdapter.legal.submitRating;
export const calculateTrustScore = MockAdapter.legal.calculateTrustScore;

export const runIntegrationTest = MockAdapter.system.runHealthCheck;
export const runStressTest = MockAdapter.system.runStressTest;
export const executeFuzzTest = MockAdapter.system.executeFuzzTest;
export const exportSystemState = MockAdapter.system.exportSystemState;
export const restoreSystemState = MockAdapter.system.restoreSystemState;
export const requestAdminMfa = MockAdapter.system.requestAdminMfa;
export const verifyAdminMfa = MockAdapter.system.verifyAdminMfa;
export const inviteTeamMember = MockAdapter.system.inviteTeamMember;
export const listTeamMembers = MockAdapter.system.listTeamMembers;
export const listDesignTemplates = MockAdapter.system.listDesignTemplates;
export const getEnterpriseAnalytics = MockAdapter.system.getEnterpriseAnalytics;
export const getMarketMetrics = MockAdapter.system.getMarketMetrics;
export const generateApiKey = MockAdapter.system.generateApiKey;
export const submitProofOfInstallation = MockAdapter.system.submitProofOfInstallation;
export const verifyProofOfInstallation = MockAdapter.system.verifyProofOfInstallation;

export const getVestingSchedule = MockAdapter.identity.getVestingSchedule;
export const joinFounderProgram = MockAdapter.identity.joinFounderProgram;

// Admin Exports
export const listPendingVendors = MockAdapter.admin.listPendingVendors;
export const approveVendor = MockAdapter.admin.approveVendor;
export const rejectVendor = MockAdapter.admin.rejectVendor;
export const listAllDisputes = MockAdapter.admin.listAllDisputes;

export const treasuryBalance = 1500000;
export const escrowBalance = 500000;
export const addLiquidity = async (amtA: number, amtB: number) => true;
export const stakeLpTokens = async () => true;
export const swapTokens = async (from: string, to: string, amt: number) => true;
export const updateProductSustainability = async () => {};
export const calculateFeeDetails = (amt: number, stake: number) => ({ fee: amt * 0.1, effectiveRate: 0.1, discountPercent: 0, originalFee: amt * 0.1 });
