import { useMemo, useEffect } from 'react';
import { useToast } from '../components/Toast';
import { getProactiveTip } from '../core/ux-engine/engine';
import { useCore } from './modules/useCore';
import { useDesignStudio } from './modules/useDesignStudio';
import { useMarketplace } from './modules/useMarketplace';
import { useCommunity } from './modules/useCommunity';

// Re-export types for the rest of the app
export type Phase = 'intro' | 'onboarding' | 'dashboard';
export type ActiveTab = 'scan' | 'design' | 'market' | 'challenges' | 'explore';

export const useArchitex = () => {
  const { addToast } = useToast();

  // 1. Core Logic (User, Auth, Navigation)
  const core = useCore(addToast);

  // 2. Design Logic (Scan, Projects, Minting)
  const design = useDesignStudio(core.setActiveTab, addToast);

  // 3. Marketplace Logic (Bounties, Orders, Services)
  const market = useMarketplace(core.user, design.selectedProject, core.setActiveTab, addToast);

  // 4. Community Logic (DAO, Challenges, Chat)
  const community = useCommunity(core.user, design.selectedProject, design.setSelectedProject, addToast);

  // Global UX Engine Tip
  const uxTip = useMemo(() => {
      const context = {
          activeTab: core.activeTab,
          user: core.user,
          projectCount: design.projects.length,
          hasPendingOrders: market.orders.some(o => o.status !== 'Delivered'),
          pendingReviews: 0,
          hasUnverifiedInstallation: market.orders.some(o => o.proofOfInstallationStatus === 'pending'),
          currentProjectModificationCount: design.selectedProject?.modificationCount
      };
      return getProactiveTip(context);
  }, [core.activeTab, core.user, design.projects, market.orders, design.selectedProject]);

  // Consolidated Initialization
  useEffect(() => {
      if (core.isMounted && core.user) {
          design.fetchProjects();
          market.fetchMarketData();
          community.fetchCommunityData();
      }
  }, [core.isMounted, core.user]);


  // --- Aggregated Interface (Matching App.tsx expectations) ---
  return {
    // Core
    phase: core.phase,
    isMounted: core.isMounted,
    activeTab: core.activeTab,
    user: core.user,
    isLoading: core.isLoading,
    userTokens: core.userTokens,
    initialize: core.initialize,
    setActiveTab: core.setActiveTab,
    toggleProfile: core.toggleProfile,
    isProfileVisible: core.isProfileVisible,
    completeOnboarding: core.completeOnboarding,
    isCommandPaletteOpen: core.isCommandPaletteOpen,
    toggleCommandPalette: core.toggleCommandPalette,
    setIsCommandPaletteOpen: core.setIsCommandPaletteOpen,
    
    // Design & Projects
    projects: design.projects,
    publicProjects: design.publicProjects,
    isScanning: design.isScanning,
    scanProgress: design.scanProgress,
    currentScanInstruction: design.currentScanInstruction,
    startScan: design.startScan,
    cancelScan: design.cancelScan,
    showPaymentModal: design.showPaymentModal,
    confirmPayment: design.confirmPayment,
    cancelPayment: design.cancelPayment,
    isProcessingPayment: design.isProcessingPayment,
    paymentError: design.paymentError,
    scanAnalysis: design.scanAnalysis,
    handleProjectInteraction: design.handleProjectInteraction,
    handleModifyProject: design.handleModifyProject,
    showProjectDetailsModal: design.showProjectDetailsModal,
    selectedProject: design.selectedProject,
    setShowProjectDetailsModal: design.setShowProjectDetailsModal,
    showCreateProjectModal: design.showCreateProjectModal,
    openCreateProjectModal: design.openCreateProjectModal,
    closeCreateProjectModal: design.closeCreateProjectModal,
    handleCreateProject: design.handleCreateProject,
    showMintNftModal: design.showMintNftModal,
    projectToMint: design.projectToMint,
    openMintNftModal: design.openMintNftModal,
    closeMintNftModal: design.closeMintNftModal,
    handleMintNft: design.handleMintNft,
    showShareModal: design.showShareModal,
    projectToShare: design.projectToShare,
    handleShareProject: design.openShareModal,
    handleConfirmShare: design.handleShareProject,
    closeShareModal: design.closeShareModal,

    // Marketplace & Bounties
    bounties: market.bounties,
    arbitrators: market.arbitrators,
    availableArbitrators: market.availableArbitrators,
    orders: market.orders,
    serviceProviders: market.serviceProviders,
    serviceAgreements: market.serviceAgreements,
    products: market.products,
    showUpsellModal: market.showUpsellModal,
    closeUpsellModal: market.closeUpsellModal,
    showCreateBountyModal: market.showCreateBountyModal,
    openCreateBountyModal: market.openCreateBountyModal,
    closeCreateBountyModal: market.closeCreateBountyModal,
    handleCreateBounty: market.handleCreateBounty,
    selectedBounty: market.selectedBounty,
    handleSelectBounty: market.handleSelectBounty,
    closeBountyDetailsModal: market.closeBountyDetailsModal,
    showAgreementModal: market.showAgreementModal,
    agreementText: market.agreementText,
    handleInitiateFunding: market.handleInitiateFunding,
    handleConfirmFunding: market.handleConfirmFunding,
    closeAgreementModal: market.closeAgreementModal,
    handleRaiseDispute: market.handleRaiseDispute,
    handleReleaseFunds: market.handleReleaseFunds,
    handleSelectArbitrator: market.handleSelectArbitrator,
    showInstallationUpsellModal: market.showInstallationUpsellModal,
    setShowInstallationUpsellModal: market.setShowInstallationUpsellModal,
    orderForUpsell: market.orderForUpsell,
    handleConfirmDelivery: market.handleConfirmDelivery,
    handleRequestReturn: market.handleRequestReturn,
    handleMarkAsShipped: market.handleMarkAsShipped,
    handleDisputeReturn: market.handleDisputeReturn,
    handleGetQuotes: market.handleGetQuotes,
    handleInitiateHiring: market.handleInitiateHiring,
    showServiceAgreementModal: market.showServiceAgreementModal,
    setShowServiceAgreementModal: market.setShowServiceAgreementModal,
    activeServiceAgreement: market.activeServiceAgreement,
    handleConfirmServiceHiring: market.handleConfirmServiceHiring,
    handleConfirmServiceCompletion: market.handleConfirmServiceCompletion,
    showUserLegalShieldModal: market.showUserLegalShieldModal,
    setShowUserLegalShieldModal: market.setShowUserLegalShieldModal,
    showDisputeResolutionModal: market.showDisputeResolutionModal,
    setShowDisputeResolutionModal: market.setShowDisputeResolutionModal,
    handleConfirmDispute: market.handleConfirmDispute,
    handleResolveArbitration: market.handleResolveArbitration,
    showRatingModal: market.showRatingModal,
    userToRate: market.userToRate,
    setShowRatingModal: market.setShowRatingModal,
    handleSubmitRating: market.handleSubmitRating,
    showProofOfInstallationModal: market.showProofOfInstallationModal,
    setShowProofOfInstallationModal: market.setShowProofOfInstallationModal,
    orderForProof: market.orderForProof,
    handleSubmitProofOfInstallation: market.handleSubmitProofOfInstallation,
    cart: market.cart,
    addToCart: market.addToCart,
    removeFromCart: market.removeFromCart,
    updateCartItem: market.updateCartItem,
    openShoppingCart: market.openShoppingCart,
    closeShoppingCart: market.closeShoppingCart,
    showShoppingCartModal: market.showShoppingCartModal,
    handleCheckout: market.handleCheckout,
    openVendorProfile: market.openVendorProfile,
    showVendorProfileModal: market.showVendorProfileModal,
    selectedVendor: market.selectedVendor,
    setShowVendorProfileModal: market.setShowVendorProfileModal,

    // Community & DAO
    proposals: community.proposals,
    designChallenges: community.designChallenges,
    handleStake: community.handleStake,
    handleUnstake: community.handleUnstake,
    handleVote: community.handleVote,
    handleExecuteProposal: community.handleExecuteProposal,
    showGovernanceTosModal: community.showGovernanceTosModal,
    openGovernanceTosModal: community.openGovernanceTosModal,
    closeGovernanceTosModal: community.closeGovernanceTosModal,
    selectedChallenge: community.selectedChallenge,
    submissions: community.submissions,
    handleSelectChallenge: community.handleSelectChallenge,
    closeChallengeDetailsModal: community.closeChallengeDetailsModal,
    handleVoteOnSubmission: community.handleVoteOnSubmission,
    showSubmitToChallengeModal: community.showSubmitToChallengeModal,
    projectToSubmit: design.selectedProject, // Mapping back for compatibility
    openSubmitToChallengeModal: community.openSubmitToChallengeModal,
    closeSubmitToChallengeModal: community.closeSubmitToChallengeModal,
    handleSubmitProjectToChallenge: community.handleSubmitProjectToChallenge,
    showCreateChallengeModal: community.showCreateChallengeModal,
    openCreateChallengeModal: community.openCreateChallengeModal,
    closeCreateChallengeModal: community.closeCreateChallengeModal,
    handleCreateChallenge: community.handleCreateChallenge,
    handleClaimStakingRewards: community.handleClaimStakingRewards,
    votingPower: community.votingPower,
    selectedProposal: community.selectedProposal,
    showProposalDetailsModal: community.showProposalDetailsModal,
    openProposalDetails: community.openProposalDetails,
    closeProposalDetails: community.closeProposalDetails,
    handleSubmitComment: community.handleSubmitComment,
    isChatOpen: community.isChatOpen,
    openChat: community.openChat,
    closeChat: community.closeChat,
    messages: community.messages,
    handleSendMessage: community.handleSendMessage,
    chatContextId: community.chatContextId,

    // Admin
    isAdminModalOpen: core.isAdminModalOpen,
    openAdminModal: core.openAdminModal,
    closeAdminModal: core.closeAdminModal,

    // Wallet & Misc
    handleClaimVestedTokens: core.handleClaimVestedTokens,
    handleSubscribe: core.handleSubscribe,
    handleJoinFounderProgram: core.handleJoinFounderProgram,
    showProviderOnboarding: core.showProviderOnboarding,
    setShowProviderOnboarding: core.setShowProviderOnboarding,
    handleProviderRegistration: core.handleProviderRegistration,
    showArbitratorOnboarding: core.showArbitratorOnboarding,
    setShowArbitratorOnboarding: core.setShowArbitratorOnboarding,
    handleArbitratorRegistration: core.handleArbitratorRegistration,
    showEnterprisePortal: core.showEnterprisePortal,
    openEnterprisePortal: core.openEnterprisePortal,
    closeEnterprisePortal: core.closeEnterprisePortal,
    uxTip,
  };
};