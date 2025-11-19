
import type { FC, SVGProps } from 'react';

export type ProjectStatus = 'Scanning' | 'Designing' | 'Sourcing' | 'Complete';
export type MaterialStatus = 'Pending' | 'Ordered' | 'Delivered';
export type BountyStatus = 'Open' | 'In Progress' | 'In Dispute' | 'Arbitration' | 'Complete';
export type EscrowState = 'Unfunded' | 'Funded' | 'Released' | 'Refunded';
export type PromotionType = 'item' | 'invoice';
export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Return Requested' | 'Returned' | 'In Dispute' | 'Refunded';
export type ProofOfInstallationStatus = 'none' | 'pending' | 'submitted' | 'verified' | 'rejected';
export type ProposalStatus = 'Voting' | 'Passed' | 'Failed' | 'Executing' | 'Executed';
export type ReputationEventType = 'BountyCompleted' | 'DisputeWon' | 'RatingReceived' | 'ProofOfInstallation' | 'DisputeLost' | 'ServiceCompleted';
export type DesignChallengeStatus = 'Open' | 'Voting' | 'Complete';
export type VerificationStatus = 'none' | 'pending' | 'verified' | 'rejected';


export interface VendorProfile {
    hasInsurance: boolean;
    agreedToIndemnity: boolean;
}

export interface ServiceProviderProfile {
    specialty: string;
    portfolioUrl: string;
    serviceZones: string[]; // e.g., ['USA-CA', 'USA-NV']
    hasLiabilityInsurance: boolean;
    insuranceDocUrl?: string;
    verificationStatus: VerificationStatus;
}

export interface ArbitratorProfile {
    specialty: string;
    yearsExperience: number;
    fee: number;
    cvUrl: string;
    verificationStatus: VerificationStatus;
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
  subscriptionExpiry?: string; // ISO Date
  vendorProfile?: VendorProfile;
  serviceProviderProfile?: ServiceProviderProfile;
  arbitratorProfile?: ArbitratorProfile;
  role: 'user' | 'vendor' | 'service-provider' | 'arbitrator' | 'admin';
  stakedArchi?: number;
  stakingPosition?: StakingPosition;
  miningPosition?: LiquidityMiningPosition;
  isFounder?: boolean; // Supply-side incentive status
  organizationId?: string;
}

export interface BillOfMaterialsEntry {
  materialId: string;
  name?: string; // Denormalized for display
  quantity: number;
  status: MaterialStatus;
  // Calculated fields for UI/Reports
  estimatedCost?: number;
  ecoImpactScore?: number; 
  imageUrl?: string;
}

export interface ProjectEntity {
  id: string;
  ownerId: string;
  ownerName?: string; // Denormalized for Public Gallery
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
    protocolLiquidity: number; // Amount seeded by the platform
}

// --- Enterprise & B2B Entities ---
export interface OrganizationEntity {
    id: string;
    name: string;
    plan: 'Enterprise' | 'Standard';
    commissionRate: number; // e.g. 0.05 for 5%
    balance: number; // Corporate account balance
}

export interface TeamMemberEntity {
    id: string;
    userId: string;
    name: string;
    role: 'Admin' | 'Designer' | 'Accountant';
    avatarUrl: string;
    lastActive: string;
}

export interface DesignTemplateEntity {
    id: string;
    name: string;
    style: string;
    thumbnailUrl: string;
    itemCount: number;
    createdAt: string;
}

export interface SpendingMetric {
    month: string;
    amount: number;
    category: 'Materials' | 'Labor' | 'Software';
}

// --- Smart Contract Logic Entities ---
export interface VestingSchedule {
    id: string;
    beneficiaryId: string;
    totalAmount: number;
    releasedAmount: number;
    startTime: string; // ISO Date
    cliff: number; // Seconds
    duration: number; // Seconds
    revocable: boolean;
}

export interface StakingPosition {
    amount: number;
    startTime: string;
    lastClaimTime: string;
    unclaimedRewards: number;
}

export interface LiquidityMiningPosition {
    lpTokenAmount: number;
    lastClaimTime: string;
    unclaimedRewards: number;
}

export interface OracleData {
    price: number;
    lastUpdate: string;
    confidenceScore: number; // 0-100
    isCircuitBreakerActive: boolean;
}

export interface FuzzTestResult {
    testId: string;
    timestamp: string;
    operationsCount: number;
    invariantsChecked: string[];
    status: 'Passed' | 'Failed';
    logs: string[];
    coverage: number;
}

export interface IntegrationTestStep {
    name: string;
    status: 'Pending' | 'Running' | 'Passed' | 'Failed';
    details: string;
}

export interface IntegrationTestResult {
    timestamp: string;
    success: boolean;
    steps: IntegrationTestStep[];
    finalTreasuryBalance: number;
    finalEscrowBalance: number;
}

export interface StressTestResult {
    testId: string;
    timestamp: string;
    virtualUsers: number;
    totalTransactions: number;
    tps: number; // Transactions Per Second
    avgLatencyMs: number;
    errorRate: number; // Percentage
    bottlenecks: string[];
    status: 'Passed' | 'Failed' | 'Warning';
}

export interface SignedAgreement {
    id: string;
    type: 'Bounty' | 'Service' | 'Purchase';
    referenceId: string; // BountyID or ServiceAgreementID
    parties: string[]; // User IDs
    timestamp: string;
    contentHash: string; // Simulation of IPFS/Blockchain hash
    fullText: string;
    status: 'Active' | 'Fulfilled' | 'Disputed';
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
    verificationStatus?: VerificationStatus;
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

export interface InventoryConflict {
    productId: string;
    available: number;
    requested: number;
    alternativeProductId?: string;
}

export interface CartOptimization {
    originalProductId: string;
    suggestedProductId: string;
    reason: string;
    savings: number;
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


// --- Reputation & DAO Entities ---

export interface ReputationEvent {
    id: string;
    userId: string;
    type: ReputationEventType;
    value: number; // e.g., +10 for bounty, -5 for dispute lost
    description: string;
    timestamp: string;
}

export interface ProposalComment {
    id: string;
    proposalId: string;
    authorId: string;
    authorName: string;
    text: string;
    timestamp: string;
}

export interface ProposalEntity {
    id: string;
    title: string;
    description: string;
    proposerId: string;
    status: ProposalStatus;
    forVotes: number; // Sum of voting power
    againstVotes: number; // Sum of voting power
    createdAt: string;
    endsAt: string;
    quorum: number; // e.g., 0.20 for 20%
    turnout: number; // Percentage of total voting power that voted
    comments?: ProposalComment[];
}


// --- Design Challenge Entities ---

export interface DesignChallengeEntity {
    id: string;
    title: string;
    description: string;
    reward: number; // in ARCHI
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

// --- AI Analysis Entities ---
export interface ScanAnalysis {
    dimensions: string;
    style: string;
    lighting: string;
    summary: string;
}

// --- UX Engine Entities ---
export interface SystemNotification {
    type: 'tip' | 'alert' | 'upsell';
    message: string;
    actionLabel?: string;
    actionTarget?: string;
}

// --- Communication Entities ---
export interface MessageEntity {
    id: string;
    contextId: string; // ProjectID or OrderID
    senderId: string;
    senderName: string;
    text: string;
    timestamp: string;
    isSystem?: boolean;
}