import { useState, useEffect, useMemo, useRef } from 'react';
import { ProjectEntity, UserEntity, BountyEntity, ArbitratorEntity, OrderEntity, ServiceAgreementEntity, ProposalEntity, TokenEntity, DesignChallengeEntity, ChallengeSubmissionEntity, ProductEntity, ScanAnalysis, MessageEntity, ServiceProviderProfile, ArbitratorProfile } from '../core/schemas/entities';
import * as api from '../core/api/contract';
import { getProactiveTip, guidedScanInstructions } from '../core/ux-engine/engine';
import { useToast } from '../components/Toast';

export type Phase = 'intro' | 'onboarding' | 'dashboard';
export type ActiveTab = 'scan' | 'design' | 'market' | 'challenges' | 'explore';

export const useArchitex = () => {
  const { addToast } = useToast();
  const [phase, setPhase] = useState<Phase>('intro');
  const [activeTab, setActiveTab] = useState<ActiveTab>('design');
  const [isMounted, setIsMounted] = useState(false);
  const [projects, setProjects] = useState<ProjectEntity[]>([]);
  const [publicProjects, setPublicProjects] = useState<ProjectEntity[]>([]);
  const [bounties, setBounties] = useState<BountyEntity[]>([]);
  const [arbitrators, setArbitrators] = useState<ArbitratorEntity[]>([]);
  const [availableArbitrators, setAvailableArbitrators] = useState<ArbitratorEntity[]>([]);
  const [user, setUser] = useState<UserEntity | null>(null);
  const [userTokens, setUserTokens] = useState<TokenEntity[]>(api.mockUserTokens);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  // Scanning Flow
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanStep, setCurrentScanStep] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [scanAnalysis, setScanAnalysis] = useState<ScanAnalysis | null>(null);
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
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [showInstallationUpsellModal, setShowInstallationUpsellModal] = useState(false);
  const [orderForUpsell, setOrderForUpsell] = useState<OrderEntity | null>(null);
  const [cart, setCart] = useState<{ product: ProductEntity; quantity: number }[]>([]);
  const [showShoppingCartModal, setShowShoppingCartModal] = useState(false);
  const [showVendorProfileModal, setShowVendorProfileModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<UserEntity | null>(null);

  // Service Provider Flow
  const [serviceProviders, setServiceProviders] = useState<UserEntity[]>([]);
  const [serviceAgreements, setServiceAgreements] = useState<ServiceAgreementEntity[]>([]);
  const [showProjectDetailsModal, setShowProjectDetailsModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectEntity | null>(null);
  const [showServiceAgreementModal, setShowServiceAgreementModal] = useState(false);
  const [activeServiceAgreement, setActiveServiceAgreement] = useState<ServiceAgreementEntity | null>(null);
  const [showUserLegalShieldModal, setShowUserLegalShieldModal] = useState(false);
  const [showProviderOnboarding, setShowProviderOnboarding] = useState(false);

  // Reputation & DAO Flow
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userToRate, setUserToRate] = useState<string | null>(null);
  const [proposals, setProposals] = useState<ProposalEntity[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<ProposalEntity | null>(null);
  const [showProposalDetailsModal, setShowProposalDetailsModal] = useState(false);
  const [showProofOfInstallationModal, setShowProofOfInstallationModal] = useState(false);
  const [orderForProof, setOrderForProof] = useState<OrderEntity | null>(null);
  const [showGovernanceTosModal, setShowGovernanceTosModal] = useState(false);
  const [showArbitratorOnboarding, setShowArbitratorOnboarding] = useState(false);

  // Design Challenge Flow
  const [designChallenges, setDesignChallenges] = useState<DesignChallengeEntity[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<DesignChallengeEntity | null>(null);
  const [submissions, setSubmissions] = useState<ChallengeSubmissionEntity[]>([]);
  const [showSubmitToChallengeModal, setShowSubmitToChallengeModal] = useState(false);
  const [projectToSubmit, setProjectToSubmit] = useState<ProjectEntity | null>(null);
  const [showCreateChallengeModal, setShowCreateChallengeModal] = useState(false);


  // Social Share
  const [showShareModal, setShowShareModal] = useState(false);
  const [projectToShare, setProjectToShare] = useState<ProjectEntity | null>(null);

  // AI Project Creation
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);

  // Admin & Chat
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContextId, setChatContextId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageEntity[]>([]);


  useEffect(() => { setIsMounted(true); }, []);
  
  // Polling for challenge updates (Simulating the Admin Bot)
  useEffect(() => {
    if (!isMounted) return;
    
    const interval = setInterval(async () => {
        const updated = await api.processExpiredChallenges();
        if (updated.length > 0) {
            setDesignChallenges(updated);
            addToast("A Design Challenge has been finalized.", "info");
        }
    }, 10000); // Check every 10s in demo

    return () => clearInterval(interval);
  }, [isMounted, addToast]);


  const refreshUserData = async () => {
      const [userData, userProjects, publicProjs, userBounties, arbitratorsData, ordersData, serviceProvidersData, proposalsData, agreementsData, challengesData, productsData] = await Promise.all([
        api.authenticateWithPi(), api.listProjects(), api.listPublicProjects(), api.listBounties(), api.listArbitrators(), api.listOrders(), api.listServiceProviders(), api.listProposals(), api.listServiceAgreements(), api.listDesignChallenges(), api.listVendorProducts()
      ]);
      setUser(userData);
      setProjects(userProjects);
      setPublicProjects(publicProjs);
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
    setPhase('onboarding');
    setIsLoading(true);
    await refreshUserData();
    setIsLoading(false);
  };
  
  const completeOnboarding = () => setPhase('dashboard');

  const toggleProfile = () => setIsProfileVisible(prev => !prev);
  const handleProjectInteraction = async (project: ProjectEntity) => { setSelectedProject(project); setShowProjectDetailsModal(true); };
  const handleModifyProject = async (project: ProjectEntity) => {
      const updated = await api.incrementProjectModification(project.id);
      setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
      setSelectedProject(updated);
  };
  const closeUpsellModal = () => setShowUpsellModal(false);

  // --- Scanning & Payment ---
  const startScan = () => { setIsScanning(true); setCurrentScanStep(0); setScanProgress(0); const totalDuration = 8000; const stepDuration = totalDuration / guidedScanInstructions.length; scanIntervalRef.current = window.setInterval(() => { setCurrentScanStep(prevStep => { const nextStep = prevStep + 1; if (nextStep >= guidedScanInstructions.length) { clearInterval(scanIntervalRef.current!); setIsScanning(false); setScanAnalysis({ dimensions: '15x20ft', style: 'Modern', lighting: 'Natural (South)', summary: 'Spacious room with good potential for open-plan living.' }); setShowPaymentModal(true); return prevStep; } return nextStep; }); setScanProgress(prev => prev + (100 / guidedScanInstructions.length)); }, stepDuration); };
  const cancelScan = () => { if (scanIntervalRef.current) { clearInterval(scanIntervalRef.current); } setIsScanning(false); setScanProgress(0); setCurrentScanStep(0); };
  const confirmPayment = async () => { 
      setIsProcessingPayment(true); 
      setPaymentError(null);
      try {
        await api.generateModelFromScan(); 
        const updatedProjects = await api.listProjects(); 
        setProjects(updatedProjects); 
        setIsProcessingPayment(false); 
        setShowPaymentModal(false); 
        setActiveTab('design');
        addToast("Scan processed successfully!", "success");
      } catch (e) {
          setPaymentError("Transaction failed. Please ensure you have sufficient Test-Pi.");
          setIsProcessingPayment(false);
      }
  };
  const cancelPayment = () => setShowPaymentModal(false);

  // --- Bounty, Agreement, and Escrow Flow ---
  const openCreateBountyModal = () => setShowCreateBountyModal(true);
  const closeCreateBountyModal = () => setShowCreateBountyModal(false);
  const handleCreateBounty = async (bountyDetails: Omit<BountyEntity, 'id' | 'createdAt' | 'status' | 'escrowState'>) => { await api.createBounty(bountyDetails); const updatedBounties = await api.listBounties(); setBounties(updatedBounties); addToast("Bounty created!", "success"); };
  const handleSelectBounty = async (bounty: BountyEntity) => { const available = await api.listAvailableArbitrators(bounty.projectId); setAvailableArbitrators(available); setSelectedBounty(bounty); };
  const closeBountyDetailsModal = () => setSelectedBounty(null);
  const handleInitiateFunding = async (bounty: BountyEntity) => { bountyToFundRef.current = bounty; const text = await api.getDynamicAgreementText(bounty); setAgreementText(text); setShowAgreementModal(true); };
  const handleConfirmFunding = async () => { if (!bountyToFundRef.current) return; const updatedBounty = await api.fundEscrow(bountyToFundRef.current.id); setBounties(prev => prev.map(b => b.id === updatedBounty.id ? updatedBounty : b)); setSelectedBounty(updatedBounty); setShowAgreementModal(false); setAgreementText(null); bountyToFundRef.current = null; addToast("Escrow funded.", "success"); };
  const closeAgreementModal = () => { setShowAgreementModal(false); setAgreementText(null); bountyToFundRef.current = null; };
  const handleReleaseFunds = async (bounty: BountyEntity) => { const updatedBounty = await api.releaseEscrow(bounty.id); setBounties(prev => prev.map(b => b.id === updatedBounty.id ? updatedBounty : b)); setSelectedBounty(updatedBounty); if (updatedBounty.winnerId) { setUserToRate(updatedBounty.winnerId); setShowRatingModal(true); } addToast("Funds released.", "success"); };
  const handleRaiseDispute = (bounty: BountyEntity) => { setSelectedBounty(bounty); setShowDisputeResolutionModal(true); };
  const handleConfirmDispute = async (bounty: BountyEntity) => { const updatedBounty = await api.raiseDispute(bounty.id); setBounties(prev => prev.map(b => b.id === updatedBounty.id ? updatedBounty : b)); setSelectedBounty(updatedBounty); addToast("Dispute raised. Funds frozen.", "error"); };
  const handleSelectArbitrator = async (bounty: BountyEntity, arbitrator: ArbitratorEntity) => { const updatedBounty = await api.selectArbitrator(bounty.id, arbitrator.id); setBounties(prev => prev.map(b => b.id === updatedBounty.id ? updatedBounty : b)); setSelectedBounty(updatedBounty); addToast("Arbitrator assigned.", "info"); };
  const handleResolveArbitration = async (bounty: BountyEntity, decision: 'Release' | 'Refund') => { const updatedBounty = await api.resolveArbitration(bounty.id, decision); setBounties(prev => prev.map(b => b.id === updatedBounty.id ? updatedBounty : b)); setSelectedBounty(updatedBounty); addToast(`Arbitration resolved: ${decision}`, "info"); };
  
  // --- NFT Minting ---
  const openMintNftModal = (project: ProjectEntity) => { setProjectToMint(project); setShowMintNftModal(true); };
  const closeMintNftModal = () => { setProjectToMint(null); setShowMintNftModal(false); };
  const handleMintNft = async (projectId: string) => { const updatedProject = await api.mintProjectAsNft(projectId); setProjects(prevProjects => prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p)); addToast("NFT Minted!", "success"); };

  // --- E-Commerce ---
  useEffect(() => {
    const shippedOrderWithInstallable = orders.find(o => o.status === 'Shipped' && o.items.some(i => i.productId === 'prod_01' || i.productId === 'prod_02'));
    if (shippedOrderWithInstallable && !orderForUpsell) {
      setOrderForUpsell(shippedOrderWithInstallable);
      setShowInstallationUpsellModal(true);
    }
  }, [orders, orderForUpsell]);

  const handleConfirmDelivery = async (orderId: string) => { const updatedOrder = await api.updateOrderStatus(orderId, 'Delivered'); const newOrders = orders.map(o => o.id === orderId ? updatedOrder : o); setOrders(newOrders); if (updatedOrder.proofOfInstallationStatus === 'pending') { setOrderForProof(updatedOrder); setShowProofOfInstallationModal(true); } addToast("Delivery confirmed.", "success"); };
  const handleRequestReturn = async (orderId: string) => { await api.updateOrderStatus(orderId, 'Returned'); const newOrders = await api.listOrders(); setOrders(newOrders); addToast("Return requested.", "info"); };
  const handleMarkAsShipped = async (orderId: string) => { await api.updateOrderStatus(orderId, 'Shipped'); const newOrders = await api.listOrders(); setOrders(newOrders); };
  const handleDisputeReturn = async (orderId: string) => { console.log(`[CONTRACT] Freezing escrow for order ${orderId} and initiating arbitration.`); };

  // Cart Logic
  const addToCart = (product: ProductEntity) => {
      setCart(prev => {
          const existing = prev.find(item => item.product.id === product.id);
          if (existing) {
              return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
          }
          return [...prev, { product, quantity: 1 }];
      });
      addToast(`${product.name} added to cart`, 'success');
  };
  const removeFromCart = (productId: string) => setCart(prev => prev.filter(item => item.product.id !== productId));
  const updateCartItem = (oldId: string, newId: string) => {
      const newProduct = products.find(p => p.id === newId);
      if (!newProduct) return;
      setCart(prev => prev.map(item => item.product.id === oldId ? { ...item, product: newProduct } : item));
      addToast("Cart updated with optimization", 'info');
  };
  const openShoppingCart = () => setShowShoppingCartModal(true);
  const closeShoppingCart = () => setShowShoppingCartModal(false);
  const handleCheckout = async () => {
      // Mock checkout
      setShowShoppingCartModal(false);
      setCart([]);
      addToast("Order placed successfully!", "success");
  };

  const openVendorProfile = (vendorId: string) => {
      // Mock fetch vendor
      const vendor = serviceProviders.find(u => u.id === vendorId) || user;
      if (vendor) {
        setSelectedVendor(vendor);
        setShowVendorProfileModal(true);
      }
  };

  // --- Service Provider ---
  const handleGetQuotes = () => { setShowProjectDetailsModal(false); setActiveTab('market'); addToast("Requesting quotes from network...", "info"); };
  const handleInitiateHiring = async (provider: UserEntity) => { if (!selectedProject) { addToast("Please select a project first.", "error"); return; } const agreement = await api.createServiceAgreement(user!.id, provider.id, selectedProject.id, 500); setActiveServiceAgreement(agreement); const arbitrators = await api.listArbitrators(); setAvailableArbitrators(arbitrators); setShowServiceAgreementModal(true); };
  const handleConfirmServiceHiring = async (validatorId?: string) => { if (!activeServiceAgreement) return; await api.fundServiceEscrow(activeServiceAgreement.id, validatorId); setShowServiceAgreementModal(false); setActiveServiceAgreement(null); addToast("Service hired & Escrow funded", "success"); };
  const handleConfirmServiceCompletion = async (agreement: ServiceAgreementEntity) => { await api.confirmServiceCompletion(agreement.id, 'client'); addToast("Service marked complete", "success"); };
  const handleProviderRegistration = async (profile: ServiceProviderProfile) => {
      // Mock update
      if(user) setUser({ ...user, serviceProviderProfile: profile, role: 'service-provider' });
      addToast("Application submitted", "success");
  };
  const handleArbitratorRegistration = async (profile: ArbitratorProfile) => {
      if(user) setUser({ ...user, arbitratorProfile: profile });
      addToast("Arbitrator application submitted", "success");
  };

  // --- Reputation & DAO ---
  const handleSubmitRating = async (rating: number, comment: string) => { if(!userToRate) return; await api.submitRating(userToRate, rating, comment); const score = await api.calculateTrustScore(user!.id); setUser(prev => prev ? {...prev, trustScore: score} : null); setUserToRate(null); setShowRatingModal(false); addToast("Rating submitted", "success"); };
  const handleStake = async (amount: number) => { const updatedUser = await api.stakeArchi(amount); setUser(updatedUser); addToast(`Staked ${amount} ARCHI`, "success"); };
  const handleUnstake = async (amount: number) => { const updatedUser = await api.unstakeArchi(amount); setUser(updatedUser); addToast(`Unstaked ${amount} ARCHI`, "success"); };
  const handleClaimStakingRewards = async () => { addToast("Rewards claimed to wallet", "success"); };
  const handleVote = async (proposalId: string, vote: 'for' | 'against') => { if (!user) return; const votingPower = (user.stakedArchi || 0) + user.trustScore; const updatedProposal = await api.voteOnProposal(proposalId, vote, votingPower); setProposals(prev => prev.map(p => p.id === proposalId ? updatedProposal : p)); addToast("Vote cast successfully", "success"); };

  const handleExecuteProposal = async (proposalId: string) => {
    const updatedProposal = await api.executeProposal(proposalId);
    setProposals(prev => prev.map(p => p.id === proposalId ? updatedProposal : p));
    addToast("Proposal executed on-chain", "success");
  };
  const handleSubmitProofOfInstallation = async (orderId: string) => {
    await api.submitProofOfInstallation(orderId, 'mock_photo_data');
    const updatedOrder = await api.verifyProofOfInstallation(orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    const score = await api.calculateTrustScore(user!.id);
    setUser(prev => prev ? {...prev, trustScore: score} : null);
    addToast("Proof verified! Cashback sent.", "success");
  };
  const openGovernanceTosModal = () => setShowGovernanceTosModal(true);
  const closeGovernanceTosModal = () => setShowGovernanceTosModal(false);
  const openProposalDetails = (proposal: ProposalEntity) => {
      setSelectedProposal(proposal);
      setShowProposalDetailsModal(true);
  };
  const closeProposalDetails = () => {
      setSelectedProposal(null);
      setShowProposalDetailsModal(false);
  };
  const handleSubmitComment = async (proposalId: string, text: string) => {
      const updated = await api.submitProposalComment(proposalId, text);
      setProposals(prev => prev.map(p => p.id === proposalId ? updated : p));
      if(selectedProposal?.id === proposalId) setSelectedProposal(updated);
      addToast("Comment added", "success");
  };

  // Social Share
  const openShareModal = (project: ProjectEntity) => {
      setProjectToShare(project);
      setShowShareModal(true);
  };
  const closeShareModal = () => {
      setShowShareModal(false);
      setProjectToShare(null);
  };
  const handleShareProject = async (caption: string) => {
    if (!projectToShare) return;
    const result = await api.shareToPiFeed(projectToShare.id, caption);
    if (result.success) {
        addToast(result.message, "success");
    } else {
        addToast(result.message, "info");
    }
  };

    // --- Design Challenges ---
  const handleSelectChallenge = async (challenge: DesignChallengeEntity) => {
    const challengeSubmissions = await api.getChallengeSubmissions(challenge.id);
    setSubmissions(challengeSubmissions);
    setSelectedChallenge(challenge);
  };
  const closeChallengeDetailsModal = () => {
    setSelectedChallenge(null);
    setSubmissions([]);
  };

  const openSubmitToChallengeModal = (project: ProjectEntity) => {
    setProjectToSubmit(project);
    setShowSubmitToChallengeModal(true);
  };
  const closeSubmitToChallengeModal = () => {
    setProjectToSubmit(null);
    setShowSubmitToChallengeModal(false);
  };
  const handleSubmitProjectToChallenge = async (challengeId: string) => {
    if (!projectToSubmit) return;
    await api.submitProjectToChallenge(projectToSubmit.id, challengeId);
    closeSubmitToChallengeModal();
    addToast("Project submitted to challenge!", "success");
  };
  const handleVoteOnSubmission = async (submissionId: string) => {
    if (!user || !selectedChallenge) return;
    const votingPower = (user.stakedArchi || 0) + user.trustScore;
    await api.voteOnChallengeSubmission(submissionId, votingPower);
    const challengeSubmissions = await api.getChallengeSubmissions(selectedChallenge.id);
    setSubmissions(challengeSubmissions);
    addToast("Vote recorded", "success");
  };
  const openCreateChallengeModal = () => setShowCreateChallengeModal(true);
  const closeCreateChallengeModal = () => setShowCreateChallengeModal(false);
  const handleCreateChallenge = async (data: Omit<DesignChallengeEntity, 'id' | 'status' | 'winnerId'>) => {
      try {
          const newChallenge = await api.createDesignChallenge(data);
          setDesignChallenges(prev => [newChallenge, ...prev]);
          addToast(`Challenge "${data.title}" Created!`, 'success');
      } catch (e) {
          addToast("Failed to create challenge. Check funds.", "error");
      }
  };

  // --- AI Project Creation ---
  const openCreateProjectModal = () => setShowCreateProjectModal(true);
  const closeCreateProjectModal = () => setShowCreateProjectModal(false);
  const handleCreateProject = async (data: any) => {
      // Mock creation
      const newProject = await api.generateModelFromScan(); // Reuse mock generator
      newProject.name = `${data.roomType} - ${data.style}`;
      setProjects(prev => [newProject, ...prev]);
      addToast("New design generated!", "success");
  };

  // --- Wallet & Subscription ---
  const handleClaimVestedTokens = async () => {
      addToast("Tokens claimed to wallet", "success");
  };
  const handleSubscribe = () => {
      if(user) setUser({ ...user, subscriptionTier: 'Accelerator', subscriptionExpiry: new Date(Date.now() + 30*24*60*60*1000).toISOString() });
      addToast("Subscribed to Accelerator Tier", "success");
  };
  const handleJoinFounderProgram = async () => {
      await api.joinFounderProgram();
      refreshUserData();
      addToast("Welcome to the Founder Program!", "success");
  };

  // --- Admin & Chat ---
  const openAdminModal = () => setIsAdminModalOpen(true);
  const closeAdminModal = () => setIsAdminModalOpen(false);
  const openChat = (contextId: string) => {
      setChatContextId(contextId);
      setMessages([
          { id: 'm1', contextId, senderId: 'system', senderName: 'ArchieBot', text: 'Welcome to the secure channel. How can I help?', timestamp: new Date().toISOString(), isSystem: false }
      ]);
      setIsChatOpen(true);
  };
  const closeChat = () => setIsChatOpen(false);
  const handleSendMessage = (text: string) => {
      if (!user || !chatContextId) return;
      const newMsg: MessageEntity = {
          id: `msg_${Date.now()}`,
          contextId: chatContextId,
          senderId: user.id,
          senderName: user.piUsername,
          text,
          timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, newMsg]);
  };

  const uxTip = useMemo(() => {
      const context = {
          activeTab,
          user,
          projectCount: projects.length,
          hasPendingOrders: orders.some(o => o.status !== 'Delivered'),
          pendingReviews: 0, // mock
          hasUnverifiedInstallation: orders.some(o => o.proofOfInstallationStatus === 'pending'),
          currentProjectModificationCount: selectedProject?.modificationCount
      };
      return getProactiveTip(context);
  }, [activeTab, user, projects, orders, selectedProject]);
  
  const currentScanInstruction = guidedScanInstructions[currentScanStep];
  const votingPower = user ? { total: (user.stakedArchi || 0) + user.trustScore * 50, fromTokens: user.stakedArchi || 0, fromTrust: user.trustScore * 50 } : { total: 0, fromTokens: 0, fromTrust: 0 };

  return {
    phase, isMounted, activeTab, projects, publicProjects, bounties, arbitrators, availableArbitrators, user, isLoading, uxTip, orders, serviceProviders, serviceAgreements, proposals, designChallenges, products,
    userTokens,
    initialize, setActiveTab, toggleProfile, isProfileVisible, completeOnboarding,
    isScanning, scanProgress, currentScanInstruction, startScan, cancelScan, showPaymentModal, confirmPayment, cancelPayment, isProcessingPayment, paymentError, scanAnalysis,
    handleProjectInteraction, handleModifyProject, showUpsellModal, closeUpsellModal, showProjectDetailsModal, selectedProject, setShowProjectDetailsModal, handleGetQuotes,
    showCreateBountyModal, openCreateBountyModal, closeCreateBountyModal, handleCreateBounty, selectedBounty, handleSelectBounty, closeBountyDetailsModal,
    showAgreementModal, agreementText, handleInitiateFunding, handleConfirmFunding, closeAgreementModal, handleRaiseDispute, handleReleaseFunds, handleSelectArbitrator,
    showMintNftModal, projectToMint, openMintNftModal, closeMintNftModal, handleMintNft,
    showInstallationUpsellModal, setShowInstallationUpsellModal, orderForUpsell,
    handleConfirmDelivery, handleRequestReturn, handleMarkAsShipped, handleDisputeReturn,
    handleInitiateHiring, showServiceAgreementModal, setShowServiceAgreementModal, activeServiceAgreement, handleConfirmServiceHiring, handleConfirmServiceCompletion,
    showUserLegalShieldModal, setShowUserLegalShieldModal,
    showDisputeResolutionModal, setShowDisputeResolutionModal, handleConfirmDispute, handleResolveArbitration,
    showRatingModal, userToRate, setShowRatingModal, handleSubmitRating,
    handleStake, handleUnstake, handleVote, handleClaimStakingRewards, votingPower,
    handleExecuteProposal,
    showProofOfInstallationModal, setShowProofOfInstallationModal, orderForProof, handleSubmitProofOfInstallation,
    showGovernanceTosModal, openGovernanceTosModal, closeGovernanceTosModal,
    selectedProposal, showProposalDetailsModal, openProposalDetails, closeProposalDetails, handleSubmitComment,
    handleShareProject: openShareModal, handleConfirmShare: handleShareProject, showShareModal, projectToShare, closeShareModal,
    // Design Challenges
    selectedChallenge, submissions, handleSelectChallenge, closeChallengeDetailsModal, handleVoteOnSubmission,
    showSubmitToChallengeModal, projectToSubmit, openSubmitToChallengeModal, closeSubmitToChallengeModal, handleSubmitProjectToChallenge,
    showCreateChallengeModal, openCreateChallengeModal, closeCreateChallengeModal, handleCreateChallenge,
    // AI Creation
    showCreateProjectModal, openCreateProjectModal, closeCreateProjectModal, handleCreateProject,
    // Cart & Vendor
    cart, addToCart, removeFromCart, updateCartItem, openShoppingCart, closeShoppingCart, showShoppingCartModal, handleCheckout,
    openVendorProfile, showVendorProfileModal, selectedVendor, setShowVendorProfileModal,
    // Admin & Chat
    isAdminModalOpen, openAdminModal, closeAdminModal,
    isChatOpen, openChat, closeChat, messages, handleSendMessage, chatContextId,
    // Wallet
    handleClaimVestedTokens, handleSubscribe, handleJoinFounderProgram,
    // Onboarding Professionals
    showProviderOnboarding, setShowProviderOnboarding, handleProviderRegistration,
    showArbitratorOnboarding, setShowArbitratorOnboarding, handleArbitratorRegistration
  };
};