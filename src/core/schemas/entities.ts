
import type { FC, SVGProps } from 'react';

// ==========================================
// DOMAIN: IDENTITY & ACCESS
// ==========================================

export type UserRole = 'user' | 'vendor' | 'service-provider' | 'arbitrator' | 'admin';
export type SubscriptionTier = 'Free' | 'Accelerator' | 'Enterprise';

export interface ReputationEvent {
    id: string;
    userId: string;
    type: 'BountyCompleted' | 'DisputeWon' | 'RatingReceived' | 'ProofOfInstallation' | 'GovernanceVote';
    value: number;
    description: string;
    timestamp: string;
}

export interface UserEntity {
  id: string;
  piUsername: string;
  walletAddress: string;
  trustScore: number;
  reputationHistory?: ReputationEvent[]; 
  avatarUrl?: string;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiry?: string;
  role: UserRole;
  
  // Module Profiles
  vendorProfile?: VendorProfile;
  serviceProviderProfile?: ServiceProviderProfile;
  arbitratorProfile?: ArbitratorProfile;
  affiliateProfile?: AffiliateProfile;
  dropshipProfile?: DropshipProfile;
  
  // Governance
  stakedArchi?: number;
  isFounder?: boolean;
  stakingPosition?: { unclaimedRewards: number };
}

export interface VendorProfile {
    hasInsurance: boolean;
    agreedToIndemnity: boolean;
    verificationDate?: string;
    businessName?: string;
    taxId?: string;
}

export interface ServiceProviderProfile {
    specialty: string;
    portfolioUrl: string;
    serviceZones: string[]; 
    hasLiabilityInsurance: boolean;
    verificationStatus?: 'pending' | 'verified' | 'rejected';
    insuranceDocUrl?: string;
    isGigWorker?: boolean;
    gigCategories?: GigCategory[];
    hourlyRate?: number;
    isAvailable?: boolean;
    distance?: string;
}

export interface ArbitratorProfile {
    specialty: string;
    yearsExperience: number;
    fee: number;
    cvUrl: string;
    verificationStatus: 'pending' | 'verified';
    casesResolved: number;
    resolutionRate: number;
}

export interface AffiliateProfile {
    referralCode: string;
    totalReferrals: number;
    totalEarnings: number;
    pendingEarnings: number;
    tier: 'Scout' | 'Ambassador';
    campaigns: { id: string; name: string; clicks: number; conversions: number }[];
}

export interface DropshipProfile {
    storeName: string;
    isActive: boolean;
    liabilityAgreed: boolean;
    totalSales: number;
    reputationScore: number;
}

// ==========================================
// DOMAIN: ENGINEERING & DESIGN
// ==========================================

export type ProjectStatus = 'Scanning' | 'Designing' | 'Sourcing' | 'Complete';
export type MaterialStatus = 'Pending' | 'Ordered' | 'Delivered';

export interface BillOfMaterialsEntry {
  materialId: string;
  quantity: number;
  status: MaterialStatus;
  name?: string;
  estimatedCost?: number;
  imageUrl?: string;
  isSustainable?: boolean;
  carbonFootprint?: number; // CO2e per unit
  sourcingDistance?: number; // km
}

export interface ProjectEntity {
  id: string;
  ownerId: string;
  ownerName?: string;
  name: string;
  roomScanUrl?: string; 
  status: ProjectStatus;
  billOfMaterials: BillOfMaterialsEntry[];
  createdAt: string;
  updatedAt: string;
  isPublic?: boolean;
  thumbnailUrl?: string;
  unreadMessages?: number;
  modificationCount?: number;
  isNft?: boolean;
  nftContractAddress?: string;
  nftTokenId?: string;
  likes?: number;
  sustainabilityScore?: number; // 0-100
}

export interface ScanAnalysis {
    dimensions: string;
    style: string;
    lighting: string;
    summary: string;
}

export interface DesignTemplateEntity {
    id: string;
    name: string;
    itemCount: number;
    style: string;
    thumbnailUrl: string;
}

// ==========================================
// DOMAIN: COMMERCE & MARKETPLACE
// ==========================================

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Returned' | 'Return Requested' | 'Refunded' | 'In Dispute' | 'Forwarded to Vendor';
export type PromotionType = 'item' | 'invoice';
export type ProofOfInstallationStatus = 'none' | 'pending' | 'submitted' | 'verified' | 'rejected';
export type GigCategory = 'Plumbing' | 'Electrical' | 'Carpentry' | 'Painting' | 'HVAC' | 'General';

export interface ProductEntity {
    id: string;
    vendorId: string;
    name: string;
    price: number;
    inStock: number;
    imageUrl: string;
    tags?: string[];
    isEcoFriendly?: boolean;
    sustainabilityCertifications?: string[];
    allowDropshipping?: boolean;
    wholesalePrice?: number;
    dropshipListings?: DropshipListing[]; 
}

export interface DropshipListing {
    id: string;
    originalProductId: string;
    vendorId: string;
    markupPrice: number;
    originalPrice: number;
    margin: number;
    active: boolean;
}

export interface CartItem {
    productId: string;
    quantity: number;
    product: ProductEntity; // Expanded for UI convenience
}

export interface OrderEntity {
    id: string;
    userId: string;
    items: { productId: string; quantity: number; }[];
    total: number;
    status: OrderStatus;
    createdAt: string;
    proofOfInstallationStatus: ProofOfInstallationStatus;
    isDropshipOrder?: boolean;
    dropshipperId?: string;
}

export interface ShippingZone {
    id: string;
    name: string;
    active: boolean;
}

export interface PromotionEntity {
    id: string;
    type: PromotionType;
    description: string;
    discountValue: number;
    targetId?: string;
    minSpend?: number;
}

export interface TokenEntity {
    symbol: 'PiUSD' | 'ARCHI';
    name: string;
    balance: number;
    icon: FC<SVGProps<SVGSVGElement>>;
}

export interface LiquidityPoolEntity {
    pair: [TokenEntity, TokenEntity];
    userShare: number;
    totalValueLocked: number;
    protocolLiquidity?: number;
}

// ==========================================
// DOMAIN: CONTRACTS & LEGAL
// ==========================================

export type ServiceAgreementStatus = 'pending' | 'signed' | 'funded' | 'work-in-progress' | 'client-confirmed' | 'validator-confirmed' | 'complete' | 'dispute';
export type BountyStatus = 'Open' | 'In Progress' | 'In Dispute' | 'Arbitration' | 'Complete';
export type EscrowState = 'Unfunded' | 'Funded' | 'Released' | 'Refunded';

export interface ServiceAgreementEntity {
    id: string;
    clientId: string;
    providerId: string;
    projectId: string;
    scope: string;
    price: number;
    status: ServiceAgreementStatus;
    qualityAssuranceValidatorId?: string;
    createdAt: string;
    completedAt?: string;
}

export interface SignedAgreement {
    id: string;
    type: 'Service' | 'Bounty' | 'Dropship';
    status: 'Active' | 'Fulfilled' | 'Breached';
    referenceId: string;
    contentHash: string;
    timestamp: string;
    signatories: string[];
}

export interface BountyEntity {
    id: string;
    projectId: string;
    title: string;
    description: string;
    reward: number; 
    status: BountyStatus;
    createdAt: string;
    escrowState: EscrowState;
    winnerId?: string;
}

export interface ArbitratorEntity {
    id: string;
    name: string;
    specialty: string;
    fee: number; 
    resolutionRate: number; 
    casesResolved: number;
    avatarUrl: string;
    conflictsWithProjectIds?: string[];
}

export interface DisputeCase {
    id: string;
    referenceId: string; // Order or Bounty ID
    complainantId: string;
    respondentId: string;
    arbitratorId?: string;
    status: 'Open' | 'Under Review' | 'Resolved';
    evidenceUrls: string[];
    ruling?: 'Upheld' | 'Dismissed';
    createdAt: string;
}

export interface AuditLog {
    id: string;
    actorId: string;
    action: string;
    targetResource: string;
    timestamp: string;
    status: 'Success' | 'Failure';
    metadata?: any;
}

// ==========================================
// DOMAIN: GOVERNANCE (DAO)
// ==========================================

export type ProposalStatus = 'Voting' | 'Passed' | 'Failed' | 'Executing' | 'Executed';
export type DesignChallengeStatus = 'Open' | 'Voting' | 'Complete';

export interface ProposalEntity {
    id: string;
    title: string;
    description: string;
    proposerId: string;
    status: ProposalStatus;
    forVotes: number;
    againstVotes: number;
    createdAt: string;
    endsAt: string;
    quorum: number;
    turnout: number;
    comments?: MessageEntity[];
}

export interface MessageEntity {
    id: string;
    contextId: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: string;
    isSystem?: boolean;
    authorName?: string;
}

export interface DesignChallengeEntity {
    id: string;
    title: string;
    description: string;
    reward: number;
    status: DesignChallengeStatus;
    endsAt: string;
    winnerId?: string;
}

export interface ChallengeSubmissionEntity {
    id: string;
    challengeId: string;
    projectId: string;
    submitterId: string;
    submitterName: string;
    votes: number;
    thumbnailUrl: string;
    projectName: string;
}

// ==========================================
// DOMAIN: SYSTEM ANALYTICS
// ==========================================

export interface SustainabilityReport {
    energyEfficiencyScore: number;
    carbonFootprint: number;
    estimatedAnnualSavings: number;
    recommendations: string[];
}

export interface InventoryConflict {
    productId: string;
    requested: number;
    available: number;
    alternativeProductId?: string;
}

export interface CartOptimization {
    originalProductId: string;
    suggestedProductId: string;
    reason: string;
    savings: number;
}

export interface IntegrationTestResult {
    success: boolean;
    steps: { name: string; status: 'Passed' | 'Failed' }[];
}

export interface StressTestResult {
    status: 'Passed' | 'Failed';
    virtualUsers: number;
    tps: number;
    avgLatencyMs: number;
    errorRate: number;
}

export interface VestingSchedule {
    startTime: string;
    duration: number;
    cliff: number;
    totalAmount: number;
    releasedAmount: number;
}

export interface FuzzTestResult {
    status: 'Passed' | 'Failed';
    operationsCount: number;
    coverage: number;
    testId: string;
    logs: string[];
}

export interface TeamMemberEntity {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
    lastActive: string;
}

export interface SpendingMetric {
    month: string;
    amount: number;
}
