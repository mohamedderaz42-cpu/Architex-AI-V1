
import type { FC, SVGProps } from 'react';

export type ProjectStatus = 'Scanning' | 'Designing' | 'Sourcing' | 'Complete';
export type MaterialStatus = 'Pending' | 'Ordered' | 'Delivered';
export type BountyStatus = 'Open' | 'In Progress' | 'In Dispute' | 'Arbitration' | 'Complete';
export type EscrowState = 'Unfunded' | 'Funded' | 'Released' | 'Refunded';
export type PromotionType = 'item' | 'invoice';
export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Returned' | 'Return Requested' | 'Refunded' | 'In Dispute';
export type ProofOfInstallationStatus = 'none' | 'pending' | 'submitted' | 'verified' | 'rejected';
export type ProposalStatus = 'Voting' | 'Passed' | 'Failed' | 'Executing' | 'Executed';
export type ReputationEventType = 'BountyCompleted' | 'DisputeWon' | 'RatingReceived' | 'ProofOfInstallation';
export type DesignChallengeStatus = 'Open' | 'Voting' | 'Complete';
export type GigCategory = 'Plumbing' | 'Electrical' | 'Carpentry' | 'Painting' | 'HVAC' | 'General';


export interface VendorProfile {
    hasInsurance: boolean;
    agreedToIndemnity: boolean;
}

export interface ServiceProviderProfile {
    specialty: string;
    portfolioUrl: string;
    serviceZones: string[]; // e.g., ['USA-CA', 'USA-NV']
    hasLiabilityInsurance: boolean;
    verificationStatus?: string;
    insuranceDocUrl?: string;
    // Gig Worker Specifics
    isGigWorker?: boolean;
    gigCategories?: GigCategory[];
    hourlyRate?: number;
    isAvailable?: boolean;
    distance?: string; // Simulated distance string e.g., "0.5 km"
}

export interface ArbitratorProfile {
    specialty: string;
    yearsExperience: number;
    fee: number;
    cvUrl: string;
    verificationStatus: string;
    casesResolved: number;
    resolutionRate: number;
}

export interface UserEntity {
  id: string;
  piUsername: string;
  walletAddress: string;
  trustScore: number; 
  avatarUrl?: string;
  subscriptionTier: 'Free' | 'Accelerator' | 'Enterprise';
  vendorProfile?: VendorProfile;
  serviceProviderProfile?: ServiceProviderProfile;
  arbitratorProfile?: ArbitratorProfile;
  role: 'user' | 'vendor' | 'service-provider' | 'arbitrator';
  stakedArchi?: number;
  isFounder?: boolean;
  stakingPosition?: { unclaimedRewards: number };
  subscriptionExpiry?: string;
}

export interface BillOfMaterialsEntry {
  materialId: string;
  quantity: number;
  status: MaterialStatus;
  name?: string;
  estimatedCost?: number;
  imageUrl?: string;
  isSustainable?: boolean;
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
  likes?: number;
}

export interface MaterialEntity {
  id: string;
  name: string;
  description: string;
  supplierId: string;
  ecoRating: number; 
  price: number; 
  imageUrl: string;
  tags?: string[];
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

// --- E-Commerce Engine Entities ---

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
}

export interface CartItem {
    productId: string;
    quantity: number;
}

export interface OrderEntity {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    status: OrderStatus;
    createdAt: string;
    proofOfInstallationStatus: ProofOfInstallationStatus;
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

// --- Service Provider Entities ---
export type ServiceAgreementStatus = 'pending' | 'signed' | 'funded' | 'work-in-progress' | 'client-confirmed' | 'validator-confirmed' | 'complete' | 'dispute';

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
}

export interface SignedAgreement {
    id: string;
    type: string;
    status: string;
    referenceId: string;
    contentHash: string;
    timestamp: string;
}


// --- Reputation & DAO Entities ---

export interface ReputationEvent {
    id: string;
    userId: string;
    type: ReputationEventType;
    value: number;
    description: string;
    timestamp: string;
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


// --- Design Challenge Entities ---

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

// --- New Entities for Modules ---

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

export interface DesignTemplateEntity {
    id: string;
    name: string;
    itemCount: number;
    style: string;
    thumbnailUrl: string;
}

export interface SpendingMetric {
    month: string;
    amount: number;
}

export interface ScanAnalysis {
    dimensions: string;
    style: string;
    lighting: string;
    summary: string;
}
