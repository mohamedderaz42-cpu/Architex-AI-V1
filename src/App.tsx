import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
import { VendorProfileModal } from './components/VendorProfileModal';
import { ProposalDetailsModal } from './components/ProposalDetailsModal';
import { AdminPortal } from './components/AdminPortal';
import { ChatInterface } from './components/ChatInterface';
import { PublicGallery } from './components/PublicGallery';
import { SearchIcon } from './components/icons/SearchIcon';
import { ArchieBotWidget } from './components/ArchieBotWidget';
import { ServiceProviderOnboarding } from './components/ServiceProviderOnboarding';
import { ArbitratorOnboarding } from './components/ArbitratorOnboarding';
import { ShareModal } from './components/ShareModal';
import { CreateChallengeModal } from './components/CreateChallengeModal';
import { EnterprisePortal } from './components/EnterprisePortal';

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
    handleShareProject, handleConfirmShare, showShareModal, projectToShare, closeShareModal,
    selectedChallenge, submissions, handleSelectChallenge, closeChallengeDetailsModal, handleVoteOnSubmission,
    showSubmitToChallengeModal, projectToSubmit, openSubmitToChallengeModal, closeSubmitToChallengeModal, handleSubmitProjectToChallenge,
    showCreateChallengeModal, openCreateChallengeModal, closeCreateChallengeModal, handleCreateChallenge,
    showCreateProjectModal, openCreateProjectModal, closeCreateProjectModal, handleCreateProject,
    cart, addToCart, removeFromCart, updateCartItem, openShoppingCart, closeShoppingCart, showShoppingCartModal, handleCheckout,
    openVendorProfile, showVendorProfileModal, selectedVendor, setShowVendorProfileModal,
    selectedProposal, showProposalDetailsModal, openProposalDetails, closeProposalDetails, handleSubmitComment,
    isAdminModalOpen, openAdminModal, closeAdminModal,
    isChatOpen, openChat, closeChat, messages, handleSendMessage, chatContextId,
    userTokens, handleClaimVestedTokens, handleJoinFounderProgram,
    handleSubscribe,
    showProviderOnboarding, setShowProviderOnboarding, handleProviderRegistration,
    showArbitratorOnboarding, setShowArbitratorOnboarding, handleArbitratorRegistration,
    handleClaimStakingRewards, votingPower,
    showEnterprisePortal, openEnterprisePortal, closeEnterprisePortal
  } = useArchitex();

  // --- Content Rendering Logic with Grid Support ---
  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'scan':
        return isScanning ? <ScannerInterface instruction={currentScanInstruction} progress={scanProgress} onCancel={cancelScan} /> : (
          <div className="text-center flex flex-col items-center justify-center h-full w-full p-6">
            <motion.div initial={{scale: 0.9, opacity: 0}} animate={{scale: 1, opacity: 1}} className="relative w-48 h-48 mb-8">
                 <div className="absolute inset-0 bg-pi-gold/20 rounded-full blur-3xl animate-pulse"></div>
                 <ScanIcon className="w-full h-full text-pi-gold relative z-10 drop-shadow-lg" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">Reality Scanner</h2>
            <p className="text-slate-400 max-w-xs mb-6">Use LIDAR simulation to capture your physical space in seconds.</p>
            <div className="w-full max-w-xs mb-8"><ArchieBot message={uxTip} /></div>
            <motion.button whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} onClick={startScan} className="group flex items-center justify-center px-8 py-4 bg-pi-gold text-brand-dark rounded-full text-xl font-bold shadow-[0_0_20px_rgba(253,179,0,0.4)] hover:shadow-[0_0_30px_rgba(253,179,0,0.6)] transition-all duration-300">
                Activate Scanner
            </motion.button>
          </div>
        );
      case 'design':
        return (
          <div className="w-full h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 px-2">
                <div>
                    <h2 className="text-3xl font-bold text-white">Design Studio</h2>
                    <p className="text-sm text-slate-400">Your creative workspace</p>
                </div>
                <div className="flex space-x-3">
                    <motion.button whileHover={{scale: 1.05}} onClick={() => setActiveTab('explore')} className="p-3 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 border border-white/5" title="Explore Community">
                        <SearchIcon className="w-5 h-5" />
                    </motion.button>
                    <motion.button whileHover={{scale: 1.05}} onClick={openCreateProjectModal} className="flex items-center px-5 py-2 bg-ai-violet text-white rounded-full font-bold shadow-lg hover:bg-violet-600 transition-colors">
                        <PlusCircleIcon className="w-5 h-5 mr-2" /> New Project
                    </motion.button>
                </div>
            </div>
            
            {/* Responsive Grid for Projects */}
            <div className="flex-grow overflow-y-auto pr-2 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {projects.map((project, index) => (
                        <motion.div 
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <ProjectCard project={project} onCardClick={() => handleProjectInteraction(project)} onMintClick={() => openMintNftModal(project)} />
                        </motion.div>
                    ))}
                </div>
            </div>
            <div className="mt-auto pt-2"><ArchieBot message={uxTip} /></div>
          </div>
        );
      case 'explore':
        return <PublicGallery projects={publicProjects} activeChallenges={designChallenges} onViewProject={handleProjectInteraction} />;
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
          products={products}
          cartCount={cart.length}
          onAddToCart={addToCart}
          onOpenCart={openShoppingCart}
          onVendorClick={openVendorProfile}
          onOpenDetails={openProposalDetails}
          onJoinFounderProgram={handleJoinFounderProgram}
          handleClaimStakingRewards={handleClaimStakingRewards}
          votingPower={votingPower}
          onCreateChallenge={openCreateChallengeModal}
        />;
      case 'challenges':
        return <ChallengesGallery challenges={designChallenges} onSelectChallenge={handleSelectChallenge} />;
      default: return null;
    }
  };

  return (
    <div className="h-screen w-full bg-brand-dark text-slate-100 overflow-hidden flex flex-col md:flex-row">
      {/* Sandbox Indicator */}
      <div className="fixed top-0 left-0 w-full bg-pi-gold/80 text-brand-dark text-xs font-bold text-center py-0.5 z-[110] backdrop-blur-sm pointer-events-none">
          TESTNET SANDBOX MODE
      </div>

      {phase === 'onboarding' && <OnboardingTour onComplete={completeOnboarding} />}

      {/* Intro Screen */}
      <div className={`absolute inset-0 z-50 bg-brand-dark flex flex-col items-center justify-center transition-opacity duration-1000 ${phase === 'intro' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`transition-all duration-700 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <GlassPanel className="p-12 text-center border-ai-violet/30 shadow-[0_0_50px_rgba(139,92,246,0.2)]">
              <ArchitexLogo className="w-32 h-32 mx-auto mb-8 animate-float" />
              <h1 className="text-5xl font-bold text-white tracking-wider mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Architex</h1>
              <p className="text-slate-400 text-lg">The Future of Design, Decentralized.</p>
          </GlassPanel>
        </div>
        <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={initialize} 
            className={`group mt-16 flex items-center justify-center px-10 py-4 bg-ai-violet border border-ai-violet/50 rounded-full text-xl font-bold text-white shadow-glow-violet transition-all duration-300 ${isMounted ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-10'}`}
        >
            Initialize Blueprint <ChevronRightIcon className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
        </motion.button>
      </div>

      {/* Main Dashboard Layout */}
      <div className={`flex-grow flex h-full transition-opacity duration-1000 ${phase === 'dashboard' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        {/* DESKTOP SIDEBAR */}
        <nav className="hidden md:flex flex-col w-64 bg-slate-900/50 border-r border-white/5 p-4 pt-8 z-40 backdrop-blur-xl">
            <div className="flex items-center mb-10 px-2">
                <ArchitexLogo className="w-10 h-10 mr-3 text-ai-violet" />
                <h1 className="text-2xl font-bold text-white tracking-wide">Architex</h1>
            </div>
            
            <div className="space-y-2 flex-grow">
                <IconButton isSidebar icon={<ScanIcon />} label="Scan Space" isActive={activeTab === 'scan'} onClick={() => setActiveTab('scan')} activeColor="pi-gold"/>
                <IconButton isSidebar icon={<DesignIcon />} label="Design Studio" isActive={activeTab === 'design' || activeTab === 'explore'} onClick={() => setActiveTab('design')} activeColor="ai-violet"/>
                <IconButton isSidebar icon={<MarketIcon />} label="Marketplace" isActive={activeTab === 'market'} onClick={() => setActiveTab('market')} activeColor="eco-green"/>
                <IconButton isSidebar icon={<AwardIcon />} label="Challenges" isActive={activeTab === 'challenges'} onClick={() => setActiveTab('challenges')} activeColor="pi-gold"/>
            </div>

            <div className="mt-auto pt-4 border-t border-white/5">
                <div 
                    className="flex items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                    onClick={toggleProfile}
                >
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mr-3 border border-white/10">
                         <UserIcon className="w-5 h-5 text-slate-300" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white">{user?.piUsername || 'User'}</div>
                        <div className="text-xs text-slate-400">View Profile</div>
                    </div>
                </div>
            </div>
        </nav>

        {/* MOBILE HEADER (Only visible on mobile) */}
        <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-brand-dark/80 backdrop-blur-md z-40 flex items-center justify-between px-4 border-b border-white/5">
             <div className="flex items-center">
                <ArchitexLogo className="w-8 h-8 mr-2 text-ai-violet"/>
                <h1 className="text-xl font-bold text-slate-200">Design HUD</h1>
            </div>
            <button onClick={toggleProfile} className="p-2 text-slate-400 hover:text-white transition-colors">
                <UserIcon className="w-6 h-6" />
            </button>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-grow relative overflow-hidden pt-16 md:pt-0 pb-24 md:pb-0">
            <div className="h-full w-full max-w-7xl mx-auto p-2 md:p-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="h-full"
                    >
                        {renderDashboardContent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </main>

        {/* MOBILE BOTTOM BAR */}
        <footer className="md:hidden fixed bottom-4 left-4 right-4 z-50">
          <GlassPanel className="p-2 rounded-full shadow-2xl border-t border-white/10 bg-brand-dark/80 backdrop-blur-xl">
              <nav className="flex items-center justify-around">
                  <IconButton icon={<ScanIcon />} label="Scan" isActive={activeTab === 'scan'} onClick={() => setActiveTab('scan')} activeColor="pi-gold"/>
                  <IconButton icon={<DesignIcon />} label="Design" isActive={activeTab === 'design' || activeTab === 'explore'} onClick={() => setActiveTab('design')} activeColor="ai-violet"/>
                  <IconButton icon={<MarketIcon />} label="Market" isActive={activeTab === 'market'} onClick={() => setActiveTab('market')} activeColor="eco-green"/>
                  <IconButton icon={<AwardIcon />} label="Challenges" isActive={activeTab === 'challenges'} onClick={() => setActiveTab('challenges')} activeColor="pi-gold"/>
              </nav>
          </GlassPanel>
        </footer>
      </div>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {showPaymentModal && <PaymentModal key="payment" onConfirm={confirmPayment} onCancel={cancelPayment} isProcessing={isProcessingPayment} error={paymentError} analysis={scanAnalysis} />}
        {showCreateProjectModal && <CreateProjectModal key="createProj" onConfirm={handleCreateProject} onCancel={closeCreateProjectModal} />}
        {showCreateChallengeModal && <CreateChallengeModal key="createChal" onConfirm={handleCreateChallenge} onCancel={closeCreateChallengeModal} />}
        
        {isProfileVisible && user && (
            <ProfileScreen 
                key="profile"
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
                onBecomeProvider={() => setShowProviderOnboarding(true)}
                onBecomeArbitrator={() => setShowArbitratorOnboarding(true)}
                onOpenEnterprise={openEnterprisePortal}
            />
        )}
      </AnimatePresence>
      
      {isProfileVisible && (
        <div className="fixed bottom-6 right-6 z-[70]">
            <button onClick={openAdminModal} className="text-[10px] text-slate-600 hover:text-slate-400 font-mono bg-black/20 px-2 py-1 rounded">Admin Access</button>
        </div>
      )}

      {/* Global ArchieBot Widget */}
      {phase === 'dashboard' && !isProfileVisible && !isAdminModalOpen && !isChatOpen && (
          <ArchieBotWidget 
            tip={uxTip} 
            onClick={() => openChat('support_archie')} 
          />
      )}

      {showUpsellModal && <UpsellModal onConfirm={() => { setActiveTab('market'); closeUpsellModal(); }} onCancel={closeUpsellModal}/>}
      {showCreateBountyModal && <CreateBountyModal user={user} onConfirm={handleCreateBounty} onCancel={closeCreateBountyModal}/>}
      {showMintNftModal && projectToMint && <MintNftModal project={projectToMint} onConfirm={() => handleMintNft(projectToMint.id)} onCancel={closeMintNftModal}/>}
      {selectedBounty && <BountyDetailsModal bounty={selectedBounty} arbitrators={availableArbitrators} onClose={closeBountyDetailsModal} onFund={handleInitiateFunding} onRelease={handleReleaseFunds} onDispute={() => handleRaiseDispute(selectedBounty)} onSelectArbitrator={(arbitrator: ArbitratorEntity) => handleSelectArbitrator(selectedBounty, arbitrator)} onOpenLegalShield={() => setShowUserLegalShieldModal(true)} onResolve={handleResolveArbitration}/>}
      {showAgreementModal && agreementText && <AgreementModal agreementText={agreementText} onConfirm={handleConfirmFunding} onCancel={closeAgreementModal}/>}
      {showInstallationUpsellModal && orderForUpsell && <InstallationUpsellModal order={orderForUpsell} onConfirm={() => setShowInstallationUpsellModal(false)} onCancel={() => setShowInstallationUpsellModal(false)}/>}
      
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
      
      {showShareModal && projectToShare && (
          <ShareModal 
            project={projectToShare} 
            onShare={handleConfirmShare} 
            onCancel={closeShareModal} 
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
      
      {showShoppingCartModal && (
        <ShoppingCartModal 
            cart={cart} 
            user={user}
            onRemove={removeFromCart} 
            onUpdateItem={updateCartItem}
            onCheckout={handleCheckout} 
            onClose={closeShoppingCart} 
        />
      )}
      {showVendorProfileModal && selectedVendor && <VendorProfileModal vendor={selectedVendor} onClose={() => setShowVendorProfileModal(false)} />}
      {showProposalDetailsModal && selectedProposal && <ProposalDetailsModal proposal={selectedProposal} onClose={closeProposalDetails} onComment={handleSubmitComment} />}
      
      {showProviderOnboarding && <ServiceProviderOnboarding onRegister={handleProviderRegistration} onClose={() => setShowProviderOnboarding(false)} />}
      {showArbitratorOnboarding && <ArbitratorOnboarding onRegister={handleArbitratorRegistration} onClose={() => setShowArbitratorOnboarding(false)} />}
      
      {showEnterprisePortal && <EnterprisePortal onClose={closeEnterprisePortal} />}

      {isAdminModalOpen && <AdminPortal onClose={closeAdminModal} />}
      {isChatOpen && chatContextId && user && (
          <ChatInterface 
            contextId={chatContextId} 
            title={chatContextId === 'support_archie' ? "Archie Support" : "Project Discussion"} 
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