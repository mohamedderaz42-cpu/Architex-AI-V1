
import React from 'react';
import { GlassPanel } from './components/GlassPanel';
import { IconButton } from './components/IconButton';
import { ArchitexLogo } from './components/icons/ArchitexLogo';
import { ScanIcon } from './components/icons/ScanIcon';
import { DesignIcon } from './components/icons/DesignIcon';
import { MarketIcon } from './components/icons/MarketIcon';
import { ChevronRightIcon } from './components/icons/ChevronRightIcon';
import { ProjectCard } from './components/ProjectCard';
import { useArchitex } from './hooks/useArchitex';
import { PlusCircleIcon } from './components/icons/PlusCircleIcon';
import { ScannerInterface } from './components/ScannerInterface';
import { PaymentModal } from './components/PaymentModal';
import { ProfileScreen } from './components/ProfileScreen';
import { UserIcon } from './components/icons/UserIcon';
import { DeFiGateway } from './components/DeFiGateway';
import { UpsellModal } from './components/UpsellModal';
import { CreateBountyModal } from './components/CreateBountyModal';
import { MintNftModal } from './components/MintNftModal';
import { BountyDetailsModal } from './components/BountyDetailsModal';
import { AgreementModal } from './components/AgreementModal';
import { ArbitratorEntity } from './core/schemas/entities';
import { ArchieBot } from './components/ArchieBot';
import { InstallationUpsellModal } from './components/InstallationUpsellModal';
import { ProjectDetailsModal } from './components/ProjectDetailsModal';
import { ServiceAgreementModal } from './components/ServiceAgreementModal';
import { UserLegalShieldModal } from './components/UserLegalShieldModal';
import { DisputeResolutionModal } from './components/DisputeResolutionModal';
import { RatingModal } from './components/RatingModal';
import { ProofOfInstallationModal } from './components/ProofOfInstallationModal';
import { GovernanceTosModal } from './components/GovernanceTosModal';
import { AwardIcon } from './components/icons/AwardIcon';
import { ChallengesGallery } from './components/ChallengesGallery';
import { ChallengeDetailsModal } from './components/ChallengeDetailsModal';
import { SubmitToChallengeModal } from './components/SubmitToChallengeModal';
import { CreateProjectModal } from './components/CreateProjectModal';
import { ToastProvider } from './components/Toast';
import { OnboardingTour } from './components/OnboardingTour';
import { ShoppingCartModal } from './components/ShoppingCartModal';
import { MarketplaceShop } from './components/MarketplaceShop';
import { VendorProfileModal } from './components/VendorProfileModal';
import { ProposalDetailsModal } from './components/ProposalDetailsModal';
import { AdminPortal } from './components/AdminPortal';
import { ChatInterface } from './components/ChatInterface';
import { PublicGallery } from './components/PublicGallery';
import { SearchIcon } from './components/icons/SearchIcon';

const AppContent: React.FC = () => {
  const {
    phase, isMounted, activeTab, projects, publicProjects, bounties, arbitrators, availableArbitrators, uxTip, user, orders, serviceProviders, serviceAgreements, proposals, designChallenges, products,
    initialize, setActiveTab, isScanning, scanProgress, currentScanInstruction, startScan, cancelScan, completeOnboarding,
    showPaymentModal, confirmPayment, cancelPayment, isProcessingPayment, paymentError, scanAnalysis, isProfileVisible, toggleProfile,
    handleProjectInteraction, handleModifyProject, showUpsellModal, closeUpsellModal, showCreateBountyModal, openCreateBountyModal,
    closeCreateBountyModal, handleCreateBounty, showMintNftModal, projectToMint, openMintNftModal,
    closeMintNftModal, handleMintNft, selectedBounty, handleSelectBounty, closeBountyDetailsModal,
    showAgreementModal, agreementText, handleInitiateFunding, handleConfirmFunding, closeAgreementModal,
    handleRaiseDispute, handleReleaseFunds, handleSelectArbitrator,
    showInstallationUpsellModal, setShowInstallationUpsellModal, orderForUpsell,
    handleConfirmDelivery, handleRequestReturn, handleMarkAsShipped, handleDisputeReturn,
    showProjectDetailsModal, selectedProject, setShowProjectDetailsModal, handleGetQuotes,
    handleInitiateHiring, showServiceAgreementModal, setShowServiceAgreementModal, activeServiceAgreement, handleConfirmServiceHiring, handleConfirmServiceCompletion,
    showUserLegalShieldModal, setShowUserLegalShieldModal,
    showDisputeResolutionModal, setShowDisputeResolutionModal, handleConfirmDispute, handleResolveArbitration,
    showRatingModal, userToRate, setShowRatingModal, handleSubmitRating,
    handleStake, handleUnstake, handleVote,
    handleExecuteProposal, showProofOfInstallationModal, setShowProofOfInstallationModal, orderForProof, handleSubmitProofOfInstallation,
    showGovernanceTosModal, openGovernanceTosModal, closeGovernanceTosModal,
    handleShareProject,
    selectedChallenge, submissions, handleSelectChallenge, closeChallengeDetailsModal, handleVoteOnSubmission,
    showSubmitToChallengeModal, projectToSubmit, openSubmitToChallengeModal, closeSubmitToChallengeModal, handleSubmitProjectToChallenge,
    showCreateProjectModal, openCreateProjectModal, closeCreateProjectModal, handleCreateProject,
    // Cart & Vendor
    cart, addToCart, removeFromCart, openShoppingCart, closeShoppingCart, showShoppingCartModal, handleCheckout,
    openVendorProfile, showVendorProfileModal, selectedVendor, setShowVendorProfileModal,
    // DAO Discussion
    selectedProposal, showProposalDetailsModal, openProposalDetails, closeProposalDetails, handleSubmitComment,
    // Admin & Chat
    isAdminModalOpen, openAdminModal, closeAdminModal,
    isChatOpen, openChat, closeChat, messages, handleSendMessage, chatContextId,
    // Wallet & Founder
    userTokens, handleClaimVestedTokens, handleJoinFounderProgram,
    // Subscription
    handleSubscribe
  } = useArchitex();

  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'scan':
        return isScanning ? <ScannerInterface instruction={currentScanInstruction} progress={scanProgress} onCancel={cancelScan} /> : (
          <div className="text-center flex flex-col items-center w-full">
            <h2 className="text-2xl font-bold text-white">Room Scanner</h2>
            <div className="w-full max-w-xs px-2 mt-4"><ArchieBot message={uxTip} /></div>
            <button onClick={startScan} className="group mt-8 flex items-center justify-center px-6 py-3 bg-pi-gold/80 border border-pi-gold/90 rounded-full text-lg font-semibold text-white backdrop-blur-md hover:bg-pi-gold hover:shadow-glow-violet transition-all duration-300">Activate Scanner</button>
          </div>
        );
      case 'design':
        return (
          <div className="w-full h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 px-2">
                <h2 className="text-2xl font-bold text-white">Design Studio</h2>
                <div className="flex space-x-2">
                    <button onClick={() => setActiveTab('explore')} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700" title="Explore Community">
                        <SearchIcon className="w-5 h-5" />
                    </button>
                    <button onClick={openCreateProjectModal} className="flex items-center text-ai-violet hover:text-white transition-colors duration-300"><PlusCircleIcon className="w-6 h-6 mr-2" /><span className="font-semibold">New</span></button>
                </div>
            </div>
            <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                {projects.map((project) => (<ProjectCard key={project.id} project={project} onCardClick={() => handleProjectInteraction(project)} onMintClick={() => openMintNftModal(project)} />))}
            </div>
            <div className="mt-4 px-2"><ArchieBot message={uxTip} /></div>
          </div>
        );
      case 'explore':
        return <PublicGallery projects={publicProjects} onViewProject={handleProjectInteraction} />;
      case 'market':
        return <DeFiGateway 
          bounties={bounties} 
          onBountySelect={handleSelectBounty} 
          onCreateBounty={openCreateBountyModal}
          serviceProviders={serviceProviders}
          onHireProvider={handleInitiateHiring}
          arbitrators={arbitrators}
          proposals={proposals}
          user={user}
          onStake={handleStake}
          onUnstake={handleUnstake}
          onVote={handleVote}
          onExecuteProposal={handleExecuteProposal}
          onViewTos={openGovernanceTosModal}
          // New Props for Shop
          cartCount={cart.length}
          onAddToCart={addToCart}
          onOpenCart={openShoppingCart}
          onVendorClick={openVendorProfile}
          // DAO Discussion
          onOpenDetails={openProposalDetails}
          // Founder Logic
          onJoinFounderProgram={handleJoinFounderProgram}
        />;
      case 'challenges':
        return <ChallengesGallery challenges={designChallenges} onSelectChallenge={handleSelectChallenge} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-brand-dark text-slate-100 flex flex-col items-center p-4 overflow-hidden antialiased">
      {/* Sandbox Indicator */}
      <div className="fixed top-0 left-0 w-full bg-pi-gold/80 text-brand-dark text-xs font-bold text-center py-1 z-[90] backdrop-blur-sm">
          TESTNET SANDBOX MODE
      </div>

      {phase === 'onboarding' && <OnboardingTour onComplete={completeOnboarding} />}

      <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${phase === 'intro' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`transition-all duration-700 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <GlassPanel className="p-8 text-center"><ArchitexLogo className="w-24 h-24 mx-auto mb-6" /><h1 className="text-4xl font-bold text-white tracking-wider">Architex</h1><p className="mt-2 text-slate-300">The Future of Design, Decentralized.</p></GlassPanel>
        </div>
        <button onClick={initialize} className={`group mt-12 flex items-center justify-center px-8 py-3 bg-ai-violet/80 border border-ai-violet/90 rounded-full text-lg font-semibold text-white backdrop-blur-md hover:bg-ai-violet hover:shadow-glow-violet transition-all duration-300 ${isMounted ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-10'}`}>Initialize Blueprint <ChevronRightIcon className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform duration-300" /></button>
      </div>

      <div className={`w-full max-w-md h-full flex flex-col transition-opacity duration-1000 ${phase === 'dashboard' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <header className="relative flex-shrink-0 pt-8 pb-4 text-center"><ArchitexLogo className="w-16 h-16 mx-auto mb-2 text-ai-violet"/><h1 className="text-2xl font-bold text-slate-200">Design HUD</h1><button onClick={toggleProfile} className="absolute top-8 right-0 p-2 text-slate-400 hover:text-white transition-colors"><UserIcon className="w-7 h-7" /></button></header>
        <main className="flex-grow flex items-center justify-center p-1 min-h-0 pb-32">
            {renderDashboardContent()}
        </main>
        <footer className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
          <GlassPanel className="p-2 rounded-full"><nav className="flex items-center justify-around">
              <IconButton icon={<ScanIcon />} label="Scan" isActive={activeTab === 'scan'} onClick={() => setActiveTab('scan')} activeColor="pi-gold"/>
              <IconButton icon={<DesignIcon />} label="Design" isActive={activeTab === 'design' || activeTab === 'explore'} onClick={() => setActiveTab('design')} activeColor="ai-violet"/>
              <IconButton icon={<MarketIcon />} label="Market" isActive={activeTab === 'market'} onClick={() => setActiveTab('market')} activeColor="eco-green"/>
              <IconButton icon={<AwardIcon />} label="Challenges" isActive={activeTab === 'challenges'} onClick={() => setActiveTab('challenges')} activeColor="pi-gold"/>
          </nav></GlassPanel>
        </footer>
      </div>

      {showPaymentModal && <PaymentModal onConfirm={confirmPayment} onCancel={cancelPayment} isProcessing={isProcessingPayment} error={paymentError} analysis={scanAnalysis} />}
      {showCreateProjectModal && <CreateProjectModal onConfirm={handleCreateProject} onCancel={closeCreateProjectModal} />}

      {/* Profile with Admin Link Injection */}
      {isProfileVisible && user && (
          <ProfileScreen 
            user={user} 
            projects={projects} 
            orders={orders} 
            serviceAgreements={serviceAgreements}
            userTokens={userTokens} 
            onConfirmDelivery={handleConfirmDelivery} 
            onRequestReturn={handleRequestReturn} 
            onConfirmServiceCompletion={handleConfirmServiceCompletion} 
            onClaimVestedTokens={handleClaimVestedTokens}
            onSubscribe={handleSubscribe}
            onClose={toggleProfile} 
          />
      )}
      {isProfileVisible && (
        <div className="fixed bottom-6 right-6 z-[70]">
            <button onClick={openAdminModal} className="text-[10px] text-slate-600 hover:text-slate-400 font-mono bg-black/20 px-2 py-1 rounded">Admin Access</button>
        </div>
      )}

      {showUpsellModal && <UpsellModal onConfirm={() => { setActiveTab('market'); closeUpsellModal(); }} onCancel={closeUpsellModal}/>}
      {showCreateBountyModal && <CreateBountyModal user={user} onConfirm={handleCreateBounty} onCancel={closeCreateBountyModal}/>}
      {showMintNftModal && projectToMint && <MintNftModal project={projectToMint} onConfirm={() => handleMintNft(projectToMint.id)} onCancel={closeMintNftModal}/>}
      {selectedBounty && <BountyDetailsModal bounty={selectedBounty} arbitrators={availableArbitrators} onClose={closeBountyDetailsModal} onFund={handleInitiateFunding} onRelease={handleReleaseFunds} onDispute={() => handleRaiseDispute(selectedBounty)} onSelectArbitrator={(arbitrator: ArbitratorEntity) => handleSelectArbitrator(selectedBounty, arbitrator)} onOpenLegalShield={() => setShowUserLegalShieldModal(true)} onResolve={handleResolveArbitration}/>}
      {showAgreementModal && agreementText && <AgreementModal agreementText={agreementText} onConfirm={handleConfirmFunding} onCancel={closeAgreementModal}/>}
      {showInstallationUpsellModal && orderForUpsell && <InstallationUpsellModal order={orderForUpsell} onConfirm={() => setShowInstallationUpsellModal(false)} onCancel={() => setShowInstallationUpsellModal(false)}/>}
      
      {/* Enhanced Project Details with Chat */}
      {showProjectDetailsModal && selectedProject && (
        <ProjectDetailsModal 
            project={selectedProject} 
            onGetQuotes={handleGetQuotes} 
            onClose={() => setShowProjectDetailsModal(false)} 
            onShare={handleShareProject} 
            onSubmitToChallenge={() => openSubmitToChallengeModal(selectedProject)} 
            onOpenChat={() => openChat(selectedProject.id)}
            onModify={handleModifyProject}
        />
      )}

      {showServiceAgreementModal && activeServiceAgreement && user && <ServiceAgreementModal agreement={activeServiceAgreement} user={user} arbitrators={arbitrators} onConfirm={handleConfirmServiceHiring} onCancel={() => setShowServiceAgreementModal(false)}/>}
      {showUserLegalShieldModal && <UserLegalShieldModal onClose={() => setShowUserLegalShieldModal(false)}/>}
      {showDisputeResolutionModal && selectedBounty && <DisputeResolutionModal bounty={selectedBounty} arbitrators={availableArbitrators} onConfirmDispute={handleConfirmDispute} onSelectArbitrator={handleSelectArbitrator} onClose={() => setShowDisputeResolutionModal(false)}/>}
      {showRatingModal && userToRate && <RatingModal onConfirm={handleSubmitRating} onCancel={() => setShowRatingModal(false)} />}
      {showProofOfInstallationModal && orderForProof && <ProofOfInstallationModal order={orderForProof} onConfirm={handleSubmitProofOfInstallation} onCancel={() => setShowProofOfInstallationModal(false)}/>}
      {showGovernanceTosModal && <GovernanceTosModal onClose={closeGovernanceTosModal} />}
      {selectedChallenge && <ChallengeDetailsModal challenge={selectedChallenge} submissions={submissions} onVote={handleVoteOnSubmission} onClose={closeChallengeDetailsModal} />}
      {showSubmitToChallengeModal && projectToSubmit && <SubmitToChallengeModal project={projectToSubmit} challenges={designChallenges} onSubmit={handleSubmitProjectToChallenge} onCancel={closeSubmitToChallengeModal} />}
      
      {/* New Modals */}
      {showShoppingCartModal && <ShoppingCartModal cart={cart} onRemove={removeFromCart} onCheckout={handleCheckout} onClose={closeShoppingCart} />}
      {showVendorProfileModal && selectedVendor && <VendorProfileModal vendor={selectedVendor} onClose={() => setShowVendorProfileModal(false)} />}
      {showProposalDetailsModal && selectedProposal && <ProposalDetailsModal proposal={selectedProposal} onClose={closeProposalDetails} onComment={handleSubmitComment} />}
      
      {isAdminModalOpen && <AdminPortal onClose={closeAdminModal} />}
      {isChatOpen && chatContextId && user && (
          <ChatInterface 
            contextId={chatContextId} 
            title="Project Discussion" 
            messages={messages} 
            currentUserId={user.id} 
            onSendMessage={handleSendMessage} 
            onClose={closeChat} 
          />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
