
import React, { Suspense } from 'react';
import { GlassPanel } from './components/GlassPanel';
import { IconButton } from './components/IconButton';
import { ArchitexLogo } from './components/icons/ArchitexLogo';
import { ScanIcon } from './components/icons/ScanIcon';
import { DesignIcon } from './components/icons/DesignIcon';
import { MarketIcon } from './components/icons/MarketIcon';
import { ChevronRightIcon } from './components/icons/ChevronRightIcon';
import { useArchitex } from './hooks/useArchitex';
import { PlusCircleIcon } from './components/icons/PlusCircleIcon';
import { PaymentModal } from './components/PaymentModal';
import { ProfileScreen } from './components/ProfileScreen';
import { UserIcon } from './components/icons/UserIcon';
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
import { ChallengeDetailsModal } from './components/ChallengeDetailsModal';
import { SubmitToChallengeModal } from './components/SubmitToChallengeModal';
import { AmbientBackground } from './components/AmbientBackground';
import { CommandPalette } from './components/CommandPalette';
import { ProjectCard } from './components/ProjectCard'; // Import for Design Tab
import { Loader } from './components/Loader';
import { useAppStore } from './store/useAppStore';
import { WhitePaperModal } from './components/WhitePaperModal';
import { AboutModal } from './components/AboutModal';

// Lazy Loaded Heavy Components
const ScannerInterface = React.lazy(() => import('./components/ScannerInterface').then(module => ({ default: module.ScannerInterface })));
const DeFiGateway = React.lazy(() => import('./components/DeFiGateway').then(module => ({ default: module.DeFiGateway })));
const ChallengesGallery = React.lazy(() => import('./components/ChallengesGallery').then(module => ({ default: module.ChallengesGallery })));
const PublicGallery = React.lazy(() => import('./components/PublicGallery').then(module => ({ default: module.PublicGallery })));

const App: React.FC = () => {
  const { setUser } = useAppStore(); // Get setUser from store to pass down

  const {
    phase, isMounted, activeTab, projects, publicProjects, bounties, arbitrators, availableArbitrators, uxTip, user, orders, serviceProviders, serviceAgreements, proposals, designChallenges,
    initialize, setActiveTab, isScanning, scanProgress, currentScanInstruction, startScan, cancelScan,
    showPaymentModal, confirmPayment, cancelPayment, isProcessingPayment, isProfileVisible, toggleProfile,
    handleProjectInteraction, showUpsellModal, closeUpsellModal, showCreateBountyModal, openCreateBountyModal,
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
    isCommandPaletteOpen, toggleCommandPalette,
    // Shop & Common Props
    products, cart, addToCart, openShoppingCart, openVendorProfile, 
    votingPower, handleClaimStakingRewards, openCreateChallengeModal, handleJoinFounderProgram,
    showWhitePaper, openWhitePaper, closeWhitePaper,
    showAboutModal, openAboutModal, closeAboutModal
  } = useArchitex();

  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'scan':
        return isScanning ? (
            <Suspense fallback={<Loader />}><ScannerInterface instruction={currentScanInstruction} progress={scanProgress} onCancel={cancelScan} /></Suspense>
        ) : (
          <div className="text-center flex flex-col items-center w-full h-full justify-center pb-20 animate-fade-in">
            <ScanIcon className="w-20 h-20 text-pi-gold mb-4 opacity-80 animate-pulse" />
            <h2 className="text-3xl font-bold text-white tracking-tight">Reality Scanner</h2>
            <p className="text-slate-400 mt-2 mb-8 max-w-xs">Capture physical spaces with LIDAR precision.</p>
            <div className="w-full max-w-xs px-2 mb-6"><ArchieBot message={uxTip} /></div>
            <button onClick={startScan} className="group flex items-center justify-center px-8 py-4 bg-pi-gold/90 rounded-full text-xl font-bold text-brand-dark hover:bg-white hover:shadow-glow-gold transition-all duration-300 transform hover:scale-105">Activate Scanner</button>
          </div>
        );
      case 'explore':
        return (
            <Suspense fallback={<Loader />}>
                <PublicGallery projects={publicProjects} onViewProject={handleProjectInteraction} />
            </Suspense>
        );
      case 'design':
        return (
          <div className="w-full h-full flex flex-col animate-fade-in">
            <div className="flex justify-between items-center mb-4 px-2 pt-2">
                <h2 className="text-2xl font-bold text-white">Studio</h2>
                <button className="flex items-center text-ai-violet hover:text-white transition-colors duration-300 bg-white/5 px-3 py-1 rounded-full border border-white/10 hover:border-ai-violet"><PlusCircleIcon className="w-5 h-5 mr-2" /><span className="font-semibold text-sm">New Project</span></button>
            </div>
            <div className="flex-grow overflow-y-auto space-y-4 pr-2 pb-20">
                {projects.length === 0 ? (
                    <div className="text-center text-slate-500 mt-20">No projects yet. Start scanning!</div>
                ) : (
                    projects.map((project) => (<ProjectCard key={project.id} project={project} onCardClick={() => handleProjectInteraction(project)} onMintClick={() => openMintNftModal(project)} />))
                )}
            </div>
          </div>
        );
      case 'market':
        return (
            <Suspense fallback={<Loader />}>
                <DeFiGateway 
                bounties={bounties} 
                onBountySelect={handleSelectBounty} 
                onCreateBounty={openCreateBountyModal}
                serviceProviders={serviceProviders}
                onHireProvider={handleInitiateHiring}
                arbitrators={arbitrators}
                proposals={proposals}
                user={user}
                onUpdateUser={setUser}
                onStake={handleStake}
                onUnstake={handleUnstake}
                onVote={handleVote}
                onExecuteProposal={handleExecuteProposal}
                onViewTos={openGovernanceTosModal}
                products={products}
                cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
                onAddToCart={addToCart}
                onOpenCart={openShoppingCart}
                onVendorClick={openVendorProfile}
                onOpenDetails={(p) => console.log(p)} // Placeholder
                onJoinFounderProgram={handleJoinFounderProgram}
                handleClaimStakingRewards={handleClaimStakingRewards}
                votingPower={votingPower}
                onCreateChallenge={openCreateChallengeModal}
                />
            </Suspense>
        );
      case 'challenges':
        return (
            <Suspense fallback={<Loader />}>
                <ChallengesGallery challenges={designChallenges} onSelectChallenge={handleSelectChallenge} />
            </Suspense>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-brand-dark text-slate-100 flex flex-col items-center overflow-hidden antialiased relative">
      <AmbientBackground />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={toggleCommandPalette} onNavigate={(tab) => setActiveTab(tab as any)} onOpenWhitePaper={openWhitePaper} />

      {/* Intro Screen */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 z-[60] ${phase === 'intro' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`transition-all duration-700 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <GlassPanel className="p-10 text-center bg-black/40 border-white/5"><ArchitexLogo className="w-24 h-24 mx-auto mb-6" /><h1 className="text-5xl font-bold text-white tracking-tighter">Architex</h1><p className="mt-2 text-slate-300 font-light text-lg">The Future of Design, Decentralized.</p></GlassPanel>
        </div>
        <button onClick={initialize} className={`group mt-12 flex items-center justify-center px-8 py-3 bg-white/10 border border-white/20 rounded-full text-lg font-semibold text-white backdrop-blur-md hover:bg-white hover:text-brand-dark hover:shadow-glow-violet transition-all duration-300 ${isMounted ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-10'}`}>Initialize Blueprint <ChevronRightIcon className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform duration-300" /></button>
      </div>

      {/* Dashboard Container */}
      <div className={`w-full max-w-md h-full flex flex-col transition-opacity duration-1000 z-10 ${phase === 'dashboard' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <header className="relative flex-shrink-0 pt-6 pb-2 px-4 flex justify-between items-center">
             <div className="flex items-center">
                 <ArchitexLogo className="w-8 h-8 mr-2 text-ai-violet"/>
                 <span className="font-bold text-lg tracking-tight">Architex</span>
             </div>
             <div className="flex items-center space-x-2">
                 <button onClick={toggleCommandPalette} className="p-2 text-slate-400 hover:text-white transition-colors"><span className="text-xs bg-white/10 px-2 py-1 rounded border border-white/5">CMD+K</span></button>
                 <button onClick={toggleProfile} className="p-2 text-slate-400 hover:text-white transition-colors"><UserIcon className="w-6 h-6" /></button>
             </div>
        </header>

        <main className="flex-grow flex items-center justify-center p-2 min-h-0">{renderDashboardContent()}</main>
        
        {/* Floating Dock */}
        <footer className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-auto">
          <GlassPanel className="p-2 rounded-2xl bg-black/60 border-white/10 shadow-2xl backdrop-blur-2xl">
              <nav className="flex items-center space-x-1 px-2">
                  <IconButton icon={<DesignIcon />} label="Explore" isActive={activeTab === 'explore'} onClick={() => setActiveTab('explore')} activeColor="ai-violet"/>
                  <IconButton icon={<ScanIcon />} label="Scan" isActive={activeTab === 'scan'} onClick={() => setActiveTab('scan')} activeColor="pi-gold"/>
                  <IconButton icon={<DesignIcon />} label="Studio" isActive={activeTab === 'design'} onClick={() => setActiveTab('design')} activeColor="ai-violet"/>
                  <IconButton icon={<MarketIcon />} label="Market" isActive={activeTab === 'market'} onClick={() => setActiveTab('market')} activeColor="eco-green"/>
                  <IconButton icon={<AwardIcon />} label="Games" isActive={activeTab === 'challenges'} onClick={() => setActiveTab('challenges')} activeColor="pi-gold"/>
              </nav>
          </GlassPanel>
        </footer>
      </div>

      {/* Modals */}
      {showPaymentModal && <PaymentModal onConfirm={confirmPayment} onCancel={cancelPayment} isProcessing={isProcessingPayment} />}
      {isProfileVisible && user && <ProfileScreen user={user} projects={projects} orders={orders} serviceAgreements={serviceAgreements} onConfirmDelivery={handleConfirmDelivery} onRequestReturn={handleRequestReturn} onConfirmServiceCompletion={handleConfirmServiceCompletion} onClose={toggleProfile} userTokens={[]} onClaimVestedTokens={async () => {}} onSubscribe={() => {}} onBecomeProvider={() => {}} onBecomeArbitrator={() => {}} onOpenEnterprise={() => {}} onOpenWhitePaper={openWhitePaper} onOpenAbout={openAboutModal} />}
      {showUpsellModal && <UpsellModal onConfirm={() => { setActiveTab('market'); closeUpsellModal(); }} onCancel={closeUpsellModal}/>}
      {showCreateBountyModal && <CreateBountyModal user={user} onConfirm={handleCreateBounty} onCancel={closeCreateBountyModal}/>}
      {showMintNftModal && projectToMint && <MintNftModal project={projectToMint} onConfirm={() => handleMintNft(projectToMint.id)} onCancel={closeMintNftModal}/>}
      {selectedBounty && <BountyDetailsModal bounty={selectedBounty} arbitrators={availableArbitrators} onClose={closeBountyDetailsModal} onFund={handleInitiateFunding} onRelease={handleReleaseFunds} onDispute={() => handleRaiseDispute(selectedBounty)} onSelectArbitrator={(arbitrator: ArbitratorEntity) => handleSelectArbitrator(selectedBounty, arbitrator)} onOpenLegalShield={() => setShowUserLegalShieldModal(true)} onResolve={handleResolveArbitration}/>}
      {showAgreementModal && agreementText && <AgreementModal agreementText={agreementText} onConfirm={handleConfirmFunding} onCancel={closeAgreementModal}/>}
      {showInstallationUpsellModal && orderForUpsell && <InstallationUpsellModal order={orderForUpsell} onConfirm={() => setShowInstallationUpsellModal(false)} onCancel={() => setShowInstallationUpsellModal(false)}/>}
      {showProjectDetailsModal && selectedProject && <ProjectDetailsModal project={selectedProject} onGetQuotes={handleGetQuotes} onClose={() => setShowProjectDetailsModal(false)} onShare={handleShareProject} onSubmitToChallenge={() => openSubmitToChallengeModal(selectedProject)} />}
      {showServiceAgreementModal && activeServiceAgreement && user && <ServiceAgreementModal agreement={activeServiceAgreement} user={user} arbitrators={arbitrators} onConfirm={handleConfirmServiceHiring} onCancel={() => setShowServiceAgreementModal(false)}/>}
      {showUserLegalShieldModal && <UserLegalShieldModal onClose={() => setShowUserLegalShieldModal(false)}/>}
      {showDisputeResolutionModal && selectedBounty && <DisputeResolutionModal bounty={selectedBounty} arbitrators={availableArbitrators} onConfirmDispute={handleConfirmDispute} onSelectArbitrator={handleSelectArbitrator} onClose={() => setShowDisputeResolutionModal(false)}/>}
      {showRatingModal && userToRate && <RatingModal onConfirm={handleSubmitRating} onCancel={() => setShowRatingModal(false)} />}
      {showProofOfInstallationModal && orderForProof && <ProofOfInstallationModal order={orderForProof} onConfirm={handleSubmitProofOfInstallation} onCancel={() => setShowProofOfInstallationModal(false)}/>}
      {showGovernanceTosModal && <GovernanceTosModal onClose={closeGovernanceTosModal} />}
      {selectedChallenge && <ChallengeDetailsModal challenge={selectedChallenge} submissions={submissions} onVote={handleVoteOnSubmission} onClose={closeChallengeDetailsModal} />}
      {showSubmitToChallengeModal && projectToSubmit && <SubmitToChallengeModal project={projectToSubmit} challenges={designChallenges} onSubmit={handleSubmitProjectToChallenge} onCancel={closeSubmitToChallengeModal} />}
      {showWhitePaper && <WhitePaperModal onClose={closeWhitePaper} />}
      {showAboutModal && <AboutModal onClose={closeAboutModal} />}
    </div>
  );
};

export default App;
