import { useState, useEffect, useMemo, useRef } from 'react';
import { ProjectEntity, UserEntity, BountyEntity, ArbitratorEntity, OrderEntity, ServiceAgreementEntity, ProposalEntity, TokenEntity, DesignChallengeEntity, ChallengeSubmissionEntity, ProductEntity } from '../core/schemas/entities';
import * as api from '../core/api/contract';
import { getProactiveTip, guidedScanInstructions } from '../core/ux-engine/engine';
import { useAppStore } from '../store/useAppStore';

export type Phase = 'intro' | 'dashboard';
export type ActiveTab = 'scan' | 'design' | 'market' | 'challenges' | 'explore';

export const useArchitex = () => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [isMounted, setIsMounted] = useState(false);
  
  // Data State
  const [projects, setProjects] = useState<ProjectEntity[]>([]);
  const [publicProjects, setPublicProjects] = useState<ProjectEntity[]>([]);
  const [bounties, setBounties] = useState<BountyEntity[]>([]);
  const [arbitrators, setArbitrators] = useState<ArbitratorEntity[]>([]);
  const [availableArbitrators, setAvailableArbitrators] = useState<ArbitratorEntity[]>([]);
  const [user, setUser] = useState<UserEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  
  // Shop State
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const { cart, addToCart } = useAppStore();
  const [showShoppingCartModal, setShowShoppingCartModal] = useState(false); // Used by UI potentially
  const [showVendorProfileModal, setShowVendorProfileModal] = useState(false);
  const [showCreateChallengeModal, setShowCreateChallengeModal] = useState(false);

  // Scanning Flow
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanStep, setCurrentScanStep] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const scanIntervalRef = useRef<number | null>(null);
  
  // Upsell & Bounty Flow
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [showCreateBountyModal, setShowCreateBountyModal] = useState(false);
  const [selectedBounty, setSelectedBounty] = useState<BountyEntity | null>(null);
  const [showDisputeResolutionModal, setShowDisputeResolutionModal] = useState(false);

  // Agreement & Escrow Flow
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [agreementText, setAgreementText] = useState<string | null>(null);
  const bountyToFundRef = useRef<BountyEntity | null>(null);

  // NFT Minting Flow
  const [showMintNftModal, setShowMintNftModal] = useState(false);
  const [projectToMint, setProjectToMint] = useState<ProjectEntity | null>(null);

  // E-Commerce Flow
  const [orders, setOrders] = useState<OrderEntity[]>([]);
  const [showInstallationUpsellModal, setShowInstallationUpsellModal] = useState(false);
  const [orderForUpsell, setOrderForUpsell] = useState<OrderEntity | null>(null);

  // Service Provider Flow
  const [serviceProviders, setServiceProviders] = useState<UserEntity[]>([]);
  const [serviceAgreements, setServiceAgreements] = useState<ServiceAgreementEntity[]>([]);
  const [showProjectDetailsModal, setShowProjectDetailsModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectEntity | null>(null);
  const [showServiceAgreementModal, setShowServiceAgreementModal] = useState(false);
  const [activeServiceAgreement, setActiveServiceAgreement] = useState<ServiceAgreementEntity | null>(null);
  const [showUserLegalShieldModal, setShowUserLegalShieldModal] = useState(false);

  // Reputation & DAO Flow
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userToRate, setUserToRate] = useState<string | null>(null);
  const [proposals, setProposals] = useState<ProposalEntity[]>([]);
  const [showProofOfInstallationModal, setShowProofOfInstallationModal] = useState(false);
  const [orderForProof, setOrderForProof] = useState<OrderEntity | null>(null);
  const [showGovernanceTosModal, setShowGovernanceTosModal] = useState(false);

  // Design Challenge Flow
  const [designChallenges, setDesignChallenges] = useState<DesignChallengeEntity[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<DesignChallengeEntity | null>(null);
  const [submissions, setSubmissions] = useState<ChallengeSubmissionEntity[]>([]);
  const [showSubmitToChallengeModal, setShowSubmitToChallengeModal] = useState(false);
  const [projectToSubmit, setProjectToSubmit] = useState<ProjectEntity | null>(null);


  useEffect(() => { setIsMounted(true); }, []);
  
  const refreshUserData = async () => {
      const [userData, userProjects, pubProjects, userBounties, arbitratorsData, ordersData, serviceProvidersData, proposalsData, agreementsData, challengesData, productsData] = await Promise.all([
        api.authenticateWithPi(), 
        api.listProjects(), 
        api.listPublicProjects(),
        api.listBounties(), 
        api.listArbitrators(), 
        api.listOrders(), 
        api.listServiceProviders(), 
        api.listProposals(), 
        api.listServiceAgreements(), 
        api.listDesignChallenges(),
        api.listVendorProducts()
      ]);
      setUser(userData);
      setProjects(userProjects);
      setPublicProjects(pubProjects);
      setBounties(userBounties);
      setArbitrators(arbitratorsData);
      setOrders(ordersData);
      setServiceProviders(serviceProvidersData);
      setProposals(proposalsData);
      setServiceAgreements(agreementsData);
      setDesignChallenges(challengesData);
      setProducts(productsData);
  };

  const initialize = async () => {
    setPhase('dashboard');
    setIsLoading(true);
    await refreshUserData();
    setIsLoading(false);
  };
  
  const toggleProfile = () => setIsProfileVisible(prev => !prev);
  const toggleCommandPalette = () => setIsCommandPaletteOpen(prev => !prev);

  const handleProjectInteraction = async (project: ProjectEntity) => { setSelectedProject(project); setShowProjectDetailsModal(true); };
  const closeUpsellModal = () => setShowUpsellModal(false);

  // --- Scanning & Payment ---
  const startScan = () => { setIsScanning(true); setCurrentScanStep(0); setScanProgress(0); const totalDuration = 8000; const stepDuration = totalDuration / guidedScanInstructions.length; scanIntervalRef.current = window.setInterval(() => { setCurrentScanStep(prevStep => { const nextStep = prevStep + 1; if (nextStep >= guidedScanInstructions.length) { clearInterval(scanIntervalRef.current!); setIsScanning(false); setShowPaymentModal(true); return prevStep; } return nextStep; }); setScanProgress(prev => prev + (100 / guidedScanInstructions.length)); }, stepDuration); };
  const cancelScan = () => { if (scanIntervalRef.current) { clearInterval(scanIntervalRef.current); } setIsScanning(false); setScanProgress(0); setCurrentScanStep(0); };
  const confirmPayment = async () => { setIsProcessingPayment(true); await api.generateModelFromScan(); const updatedProjects = await api.listProjects(); setProjects(updatedProjects); setIsProcessingPayment(false); setShowPaymentModal(false); setActiveTab('design'); };
  const cancelPayment = () => setShowPaymentModal(false);

  // Wrappers for missing logic
  const openCreateBountyModal = () => setShowCreateBountyModal(true);
  const closeCreateBountyModal = () => setShowCreateBountyModal(false);
  const handleCreateBounty = async (bountyDetails: Omit<BountyEntity, 'id' | 'createdAt' | 'status' | 'escrowState'>) => { await api.createBounty(bountyDetails); const updatedBounties = await api.listBounties(); setBounties(updatedBounties); };
  const handleSelectBounty = async (bounty: BountyEntity) => { const available = await api.listAvailableArbitrators(bounty.projectId); setAvailableArbitrators(available); setSelectedBounty(bounty); };
  const closeBountyDetailsModal = () => setSelectedBounty(null);
  const handleInitiateFunding = async (bounty: BountyEntity) => { bountyToFundRef.current = bounty; const text = await api.getDynamicAgreementText(bounty); setAgreementText(text); setShowAgreementModal(true); };
  const handleConfirmFunding = async () => { if (!bountyToFundRef.current) return; const updatedBounty = await api.fundEscrow(bountyToFundRef.current.id); setBounties(prev => prev.map(b => b.id === updatedBounty.id ? updatedBounty : b)); setSelectedBounty(updatedBounty); setShowAgreementModal(false); setAgreementText(null); bountyToFundRef.current = null; };
  const closeAgreementModal = () => { setShowAgreementModal(false); setAgreementText(null); bountyToFundRef.current = null; };
  const handleReleaseFunds = async (bounty: BountyEntity) => { const updatedBounty = await api.releaseEscrow(bounty.id); setBounties(prev => prev.map(b => b.id === updatedBounty.id ? updatedBounty : b)); setSelectedBounty(updatedBounty); if (updatedBounty.winnerId) { setUserToRate(updatedBounty.winnerId); setShowRatingModal(true); } };
  const handleRaiseDispute = (bounty: BountyEntity) => { setSelectedBounty(bounty); setShowDisputeResolutionModal(true); };
  const handleConfirmDispute = async (bounty: BountyEntity) => { const updatedBounty = await api.raiseDispute(bounty.id); setBounties(prev => prev.map(b => b.id === updatedBounty.id ? updatedBounty : b)); setSelectedBounty(updatedBounty); };
  const handleSelectArbitrator = async (bounty: BountyEntity, arbitrator: ArbitratorEntity) => { const updatedBounty = await api.selectArbitrator(bounty.id, arbitrator.id); setBounties(prev => prev.map(b => b.id === updatedBounty.id ? updatedBounty : b)); setSelectedBounty(updatedBounty); };
  const handleResolveArbitration = async (bounty: BountyEntity, decision: 'Release' | 'Refund') => { const updatedBounty = await api.resolveArbitration(bounty.id, decision); setBounties(prev => prev.map(b => b.id === updatedBounty.id ? updatedBounty : b)); setSelectedBounty(updatedBounty); };
  const openMintNftModal = (project: ProjectEntity) => { setProjectToMint(project); setShowMintNftModal(true); };
  const closeMintNftModal = () => { setProjectToMint(null); setShowMintNftModal(false); };
  const handleMintNft = async (projectId: string) => { const updatedProject = await api.mintProjectAsNft(projectId); setProjects(prevProjects => prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p)); };
  useEffect(() => { const shippedOrderWithInstallable = orders.find(o => o.status === 'Shipped' && o.items.some(i => i.productId === 'prod_01' || i.productId === 'prod_02')); if (shippedOrderWithInstallable && !orderForUpsell) { setOrderForUpsell(shippedOrderWithInstallable); setShowInstallationUpsellModal(true); } }, [orders, orderForUpsell]);
  const handleConfirmDelivery = async (orderId: string) => { const updatedOrder = await api.updateOrderStatus(orderId, 'Delivered'); const newOrders = orders.map(o => o.id === orderId ? updatedOrder : o); setOrders(newOrders); if (updatedOrder.proofOfInstallationStatus === 'pending') { setOrderForProof(updatedOrder); setShowProofOfInstallationModal(true); } };
  const handleRequestReturn = async (orderId: string) => { await api.updateOrderStatus(orderId, 'Returned'); const newOrders = await api.listOrders(); setOrders(newOrders); };
  const handleMarkAsShipped = async (orderId: string) => { await api.updateOrderStatus(orderId, 'Shipped'); const newOrders = await api.listOrders(); setOrders(newOrders); };
  const handleDisputeReturn = async (orderId: string) => { console.log(`[CONTRACT] Freezing escrow for order ${orderId} and initiating arbitration.`); };
  const handleGetQuotes = () => { setShowProjectDetailsModal(false); setActiveTab('market'); };
  const handleInitiateHiring = async (provider: UserEntity) => { if (!selectedProject) return; const agreement = await api.createServiceAgreement(user!.id, provider.id, selectedProject.id, 500); setActiveServiceAgreement(agreement); const arbitrators = await api.listArbitrators(); setAvailableArbitrators(arbitrators); setShowServiceAgreementModal(true); };
  const handleConfirmServiceHiring = async (validatorId?: string) => { if (!activeServiceAgreement) return; await api.fundServiceEscrow(activeServiceAgreement.id, validatorId); setShowServiceAgreementModal(false); setActiveServiceAgreement(null); };
  const handleConfirmServiceCompletion = async (agreement: ServiceAgreementEntity) => { await api.confirmServiceCompletion(agreement.id, 'client'); };
  const handleSubmitRating = async (rating: number, comment: string) => { if(!userToRate) return; await api.submitRating(userToRate, rating, comment); const score = await api.calculateTrustScore(user!.id); setUser(prev => prev ? {...prev, trustScore: score} : null); setUserToRate(null); setShowRatingModal(false); };
  const handleStake = async (amount: number) => { const updatedUser = await api.stakeArchi(amount); setUser(updatedUser); };
  const handleUnstake = async (amount: number) => { const updatedUser = await api.unstakeArchi(amount); setUser(updatedUser); };
  const handleVote = async (proposalId: string, vote: 'for' | 'against') => { if (!user) return; const votingPower = (user.stakedArchi || 0) + user.trustScore; const updatedProposal = await api.voteOnProposal(proposalId, vote, votingPower); setProposals(prev => prev.map(p => p.id === proposalId ? updatedProposal : p)); };
  const handleExecuteProposal = async (proposalId: string) => { const updatedProposal = await api.executeProposal(proposalId); setProposals(prev => prev.map(p => p.id === proposalId ? updatedProposal : p)); };
  const handleSubmitProofOfInstallation = async (orderId: string) => { await api.submitProofOfInstallation(orderId, 'mock_photo_data'); const updatedOrder = await api.verifyProofOfInstallation(orderId); setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o)); const score = await api.calculateTrustScore(user!.id); setUser(prev => prev ? {...prev, trustScore: score} : null); };
  const openGovernanceTosModal = () => setShowGovernanceTosModal(true);
  const closeGovernanceTosModal = () => setShowGovernanceTosModal(false);
  const handleShareProject = async (projectId: string) => { const result = await api.shareToPiFeed(projectId); return result; };
  const handleSelectChallenge = async (challenge: DesignChallengeEntity) => { const challengeSubmissions = await api.getChallengeSubmissions(challenge.id); setSubmissions(challengeSubmissions); setSelectedChallenge(challenge); };
  const closeChallengeDetailsModal = () => { setSelectedChallenge(null); setSubmissions([]); };
  const openSubmitToChallengeModal = (project: ProjectEntity) => { setProjectToSubmit(project); setShowSubmitToChallengeModal(true); };
  const closeSubmitToChallengeModal = () => { setProjectToSubmit(null); setShowSubmitToChallengeModal(false); };
  const handleSubmitProjectToChallenge = async (challengeId: string) => { if (!projectToSubmit) return; await api.submitProjectToChallenge(projectToSubmit.id, challengeId); closeSubmitToChallengeModal(); };
  const handleVoteOnSubmission = async (submissionId: string) => { if (!user || !selectedChallenge) return; const votingPower = (user.stakedArchi || 0) + user.trustScore; await api.voteOnChallengeSubmission(submissionId, votingPower); const challengeSubmissions = await api.getChallengeSubmissions(selectedChallenge.id); setSubmissions(challengeSubmissions); };

  // New Handlers for App.tsx
  const openShoppingCart = () => setShowShoppingCartModal(true);
  const openVendorProfile = () => setShowVendorProfileModal(true);
  const handleClaimStakingRewards = async () => { await api.claimMiningRewards(); };
  const openCreateChallengeModal = () => setShowCreateChallengeModal(true);
  const handleJoinFounderProgram = async () => { await api.joinFounderProgram(); };
  
  const votingPower = user ? { total: (user.stakedArchi || 0) + user.trustScore * 50, fromTokens: user.stakedArchi || 0, fromTrust: user.trustScore * 50 } : { total: 0, fromTokens: 0, fromTrust: 0 };

  const uxTip = useMemo(() => getProactiveTip(activeTab), [activeTab]);
  const currentScanInstruction = guidedScanInstructions[currentScanStep];

  return {
    phase, isMounted, activeTab, projects, publicProjects, bounties, arbitrators, availableArbitrators, user, isLoading, uxTip, orders, serviceProviders, serviceAgreements, proposals, designChallenges,
    initialize, setActiveTab, toggleProfile, isProfileVisible,
    isScanning, scanProgress, currentScanInstruction, startScan, cancelScan, showPaymentModal, confirmPayment, cancelPayment, isProcessingPayment,
    handleProjectInteraction, showUpsellModal, closeUpsellModal, showProjectDetailsModal, selectedProject, setShowProjectDetailsModal, handleGetQuotes,
    showCreateBountyModal, openCreateBountyModal, closeCreateBountyModal, handleCreateBounty, selectedBounty, handleSelectBounty, closeBountyDetailsModal,
    showAgreementModal, agreementText, handleInitiateFunding, handleConfirmFunding, closeAgreementModal, handleRaiseDispute, handleReleaseFunds, handleSelectArbitrator,
    showMintNftModal, projectToMint, openMintNftModal, closeMintNftModal, handleMintNft,
    showInstallationUpsellModal, setShowInstallationUpsellModal, orderForUpsell,
    handleConfirmDelivery, handleRequestReturn, handleMarkAsShipped, handleDisputeReturn,
    handleInitiateHiring, showServiceAgreementModal, setShowServiceAgreementModal, activeServiceAgreement, handleConfirmServiceHiring, handleConfirmServiceCompletion,
    showUserLegalShieldModal, setShowUserLegalShieldModal,
    showDisputeResolutionModal, setShowDisputeResolutionModal, handleConfirmDispute, handleResolveArbitration,
    showRatingModal, userToRate, setShowRatingModal, handleSubmitRating,
    handleStake, handleUnstake, handleVote,
    handleExecuteProposal,
    showProofOfInstallationModal, setShowProofOfInstallationModal, orderForProof, handleSubmitProofOfInstallation,
    showGovernanceTosModal, openGovernanceTosModal, closeGovernanceTosModal,
    handleShareProject,
    selectedChallenge, submissions, handleSelectChallenge, closeChallengeDetailsModal, handleVoteOnSubmission,
    showSubmitToChallengeModal, projectToSubmit, openSubmitToChallengeModal, closeSubmitToChallengeModal, handleSubmitProjectToChallenge,
    isCommandPaletteOpen, toggleCommandPalette,
    // Added for App.tsx compatibility
    products, cart, addToCart, openShoppingCart, openVendorProfile, 
    votingPower, handleClaimStakingRewards, openCreateChallengeModal, handleJoinFounderProgram
  };
};
