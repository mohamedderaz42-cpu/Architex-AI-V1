
import React, { Suspense, useState, useEffect } from 'react';
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
import { ProjectCard } from './components/ProjectCard'; 
import { Loader } from './components/Loader';
import { useAppStore } from './store/useAppStore';
import { WhitePaperModal } from './components/WhitePaperModal';
import { AboutModal } from './components/AboutModal';
import { LegalModal } from './components/LegalModal';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { GlobeIcon } from './components/icons/GlobeIcon';
import { useLanguage } from './core/i18n/LanguageContext';
import { PiBrowserGate } from './components/PiBrowserGate';
import { OfflineNotice } from './components/OfflineNotice';
import { SystemBootLoader } from './components/SystemBootLoader'; 
import { ScanAnalysisView } from './components/ScanAnalysisView';
import { ArchieBotWidget } from './components/ai/ArchieBotWidget';
import { ProactiveEngine } from './core/ai/ProactiveEngine';
import { AdminPortal } from './components/AdminPortal';

// Lazy Loaded Heavy Components
const ScannerInterface = React.lazy(() => import('./components/ScannerInterface').then(module => ({ default: module.ScannerInterface })));
const DeFiGateway = React.lazy(() => import('./components/DeFiGateway').then(module => ({ default: module.DeFiGateway })));
const ChallengesGallery = React.lazy(() => import('./components/ChallengesGallery').then(module => ({ default: module.ChallengesGallery })));
const PublicGallery = React.lazy(() => import('./components/PublicGallery').then(module => ({ default: module.PublicGallery })));

const App: React.FC = () => {
  const { setUser } = useAppStore();
  const { t, dir } = useLanguage(); 
  const [showLangModal, setShowLangModal] = useState(false);

  const {
    phase, isMounted, activeTab, projects, publicProjects, bounties, arbitrators, availableArbitrators, uxTip, user, orders, serviceProviders, serviceAgreements, proposals, designChallenges,
    bootSteps, initialize, setActiveTab, isScanning, scanFinished, scanAnalysis, scanProgress, currentScanInstruction, startScan, cancelScan,
    showPaymentModal, confirmPayment, cancelPayment, isProcessingPayment, paymentError, isProfileVisible, toggleProfile,
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
    products, cart, addToCart, openShoppingCart, openVendorProfile, 
    votingPower, handleClaimStakingRewards, openCreateChallengeModal, handleJoinFounderProgram,
    showWhitePaper, openWhitePaper, closeWhitePaper,
    showAboutModal, openAboutModal, closeAboutModal,
    showLegalModal, openLegalModal, closeLegalModal, legalActiveTab,
    handlePurchaseDesign,
    handleOrderDispute,
    showAdminPortal, openAdminPortal, closeAdminPortal // Imported from hook
  } = useArchitex();

  // Initialize Proactive AI Engine
  useEffect(() => {
      ProactiveEngine.setNavigator((tab) => setActiveTab(tab));
  }, [setActiveTab]);

  // Add Admin Secret to Command Palette (or just add a hidden button somewhere, let's use Command Palette logic if possible, but CommandPalette component is self-contained for now. We will pass openAdminPortal to it or just rely on Profile)
  
  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'scan':
        if (isScanning) {
            return <Suspense fallback={<Loader />}><ScannerInterface instruction={currentScanInstruction} progress={scanProgress} onCancel={cancelScan} /></Suspense>;
        }
        if (scanFinished && scanAnalysis) {
            return <ScanAnalysisView analysis={scanAnalysis} />;
        }
        return (
          <div className="text-center flex flex-col items-center w-full h-full justify-center pb-20 animate-fade-in">
            <ScanIcon className="w-20 h-20 text-pi-gold mb-4 opacity-80 animate-pulse" />
            <h2 className="text-3xl font-bold text-white tracking-tight">{t('scan.title')}</h2>
            <p className="text-slate-400 mt-2 mb-8 max-w-xs">{t('scan.desc')}</p>
            <div className="w-full max-w-xs px-2 mb-6"><ArchieBot message={uxTip} /></div>
            <button onClick={startScan} className="group flex items-center justify-center px-8 py-4 bg-pi-gold/90 rounded-full text-xl font-bold text-brand-dark hover:bg-white hover:shadow-glow-gold transition-all duration-300 transform hover:scale-105">{t('scan.action')}</button>
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
                <h2 className="text-2xl font-bold text-white">{t('studio.title')}</h2>
                <button className="flex items-center text-ai-violet hover:text-white transition-colors duration-300 bg-white/5 px-3 py-1 rounded-full border border-white/10 hover:border-ai-violet"><PlusCircleIcon className="w-5 h-5 mr-2" /><span className="font-semibold text-sm">{t('studio.new')}</span></button>
            </div>
            <div className="flex-grow overflow-y-auto space-y-4 pr-2 pb-20">
                {projects.length === 0 ? (
                    <div className="text-center text-slate-500 mt-20">{t('studio.empty')}</div>
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
                onOpenDetails={(p) => console.log(p)} 
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
    <PiBrowserGate>
        <OfflineNotice />
        <div dir={dir} className="h-[100dvh] w-full bg-brand-dark text-slate-100 flex flex-col items-center overflow-hidden antialiased relative pb-safe">
        <AmbientBackground />
        <CommandPalette isOpen={isCommandPaletteOpen} onClose={toggleCommandPalette} onNavigate={(tab) => setActiveTab(tab as any)} onOpenWhitePaper={openWhitePaper} />
        
        {/* Proactive AI Widget */}
        <ArchieBotWidget />

        {/* Intro Screen */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 z-[60] ${phase === 'intro' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`transition-all duration-700 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <GlassPanel className="p-10 text-center bg-black/40 border-white/5"><ArchitexLogo className="w-24 h-24 mx-auto mb-6" /><h1 className="text-5xl font-bold text-white tracking-tighter">{t('app.title')}</h1><p className="mt-2 text-slate-300 font-light text-lg">{t('app.subtitle')}</p></GlassPanel>
            </div>
            <button onClick={initialize} className={`group mt-12 flex items-center justify-center px-8 py-3 bg-white/10 border border-white/20 rounded-full text-lg font-semibold text-white backdrop-blur-md hover:bg-white hover:text-brand-dark hover:shadow-glow-violet transition-all duration-300 ${isMounted ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-10'}`}>{t('app.init')} <ChevronRightIcon className={`w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform duration-300 ${dir === 'rtl' ? 'rotate-180' : ''}`} /></button>
        </div>

        {/* Booting Screen */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 z-[60] ${phase === 'booting' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
             <SystemBootLoader steps={bootSteps} onRetry={initialize} />
        </div>

        {/* Dashboard Container */}
        <div className={`w-full max-w-md h-full flex flex-col transition-opacity duration-1000 z-10 ${phase === 'dashboard' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <header className="relative flex-shrink-0 pt-safe pb-2 px-4 flex justify-between items-center mt-2">
                <div className="flex items-center">
                    <ArchitexLogo className="w-8 h-8 mr-2 text-ai-violet"/>
                    <span className="font-bold text-lg tracking-tight">{t('app.title')}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setShowLangModal(true)} className="p-2 text-slate-400 hover:text-white transition-colors"><GlobeIcon className="w-5 h-5" /></button>
                    <button onClick={toggleCommandPalette} className="p-2 text-slate-400 hover:text-white transition-colors"><span className="text-xs bg-white/10 px-2 py-1 rounded border border-white/5">CMD+K</span></button>
                    <button onClick={toggleProfile} className="p-2 text-slate-400 hover:text-white transition-colors"><UserIcon className="w-6 h-6" /></button>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center p-2 min-h-0">{renderDashboardContent()}</main>
            
            {/* Floating Dock - Added bottom padding for safety */}
            <footer className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-auto mb-safe">
            <GlassPanel className="p-2 rounded-2xl bg-black/60 border-white/10 shadow-2xl backdrop-blur-2xl">
                <nav className="flex items-center space-x-1 px-2">
                    <IconButton icon={<DesignIcon />} label={t('nav.explore')} isActive={activeTab === 'explore'} onClick={() => setActiveTab('explore')} activeColor="ai-violet"/>
                    <IconButton icon={<ScanIcon />} label={t('nav.scan')} isActive={activeTab === 'scan'} onClick={() => setActiveTab('scan')} activeColor="pi-gold"/>
                    <IconButton icon={<DesignIcon />} label={t('nav.design')} isActive={activeTab === 'design'} onClick={() => setActiveTab('design')} activeColor="ai-violet"/>
                    <IconButton icon={<MarketIcon />} label={t('nav.market')} isActive={activeTab === 'market'} onClick={() => setActiveTab('market')} activeColor="eco-green"/>
                    <IconButton icon={<AwardIcon />} label={t('nav.challenges')} isActive={activeTab === 'challenges'} onClick={() => setActiveTab('challenges')} activeColor="pi-gold"/>
                </nav>
            </GlassPanel>
            </footer>
        </div>

        {/* Modals */}
        {showLangModal && <LanguageSelectorModal onClose={() => setShowLangModal(false)} />}
        {showPaymentModal && <PaymentModal onConfirm={confirmPayment} onCancel={cancelPayment} isProcessing={isProcessingPayment} error={paymentError} analysis={scanAnalysis} />}
        {/* Pass openAdminPortal to ProfileScreen to allow triggering it via secret gesture or button if added later */}
        {isProfileVisible && user && <ProfileScreen user={user} projects={projects} orders={orders} serviceAgreements={serviceAgreements} userTokens={[]} onConfirmDelivery={handleConfirmDelivery} onRequestReturn={handleRequestReturn} onConfirmServiceCompletion={handleConfirmServiceCompletion} onClaimVestedTokens={async () => {}} onSubscribe={() => {}} onClose={toggleProfile} onBecomeProvider={() => {}} onBecomeArbitrator={() => {}} onOpenEnterprise={() => {}} onOpenWhitePaper={openWhitePaper} onOpenAbout={openAboutModal} onOpenLegal={openLegalModal} onDisputeOrder={handleOrderDispute} />}
        
        {/* Admin Portal - Rendered when active */}
        {showAdminPortal && <AdminPortal onClose={closeAdminPortal} />}
        
        {showUpsellModal && <UpsellModal onConfirm={() => { setActiveTab('market'); closeUpsellModal(); }} onCancel={closeUpsellModal}/>}
        {showCreateBountyModal && <CreateBountyModal user={user} onConfirm={handleCreateBounty} onCancel={closeCreateBountyModal}/>}
        {showMintNftModal && projectToMint && <MintNftModal project={projectToMint} onConfirm={() => handleMintNft(projectToMint.id)} onCancel={closeMintNftModal}/>}
        {selectedBounty && <BountyDetailsModal bounty={selectedBounty} arbitrators={availableArbitrators} onClose={closeBountyDetailsModal} onFund={handleInitiateFunding} onRelease={handleReleaseFunds} onDispute={() => handleRaiseDispute(selectedBounty)} onSelectArbitrator={(arbitrator: ArbitratorEntity) => handleSelectArbitrator(selectedBounty, arbitrator)} onOpenLegalShield={() => setShowUserLegalShieldModal(true)} onResolve={handleResolveArbitration}/>}
        {showAgreementModal && agreementText && <AgreementModal agreementText={agreementText} onConfirm={handleConfirmFunding} onCancel={closeAgreementModal}/>}
        {showInstallationUpsellModal && orderForUpsell && <InstallationUpsellModal order={orderForUpsell} onConfirm={() => setShowInstallationUpsellModal(false)} onCancel={() => setShowInstallationUpsellModal(false)}/>}
        {showProjectDetailsModal && selectedProject && <ProjectDetailsModal project={selectedProject} userWalletAddress={user?.walletAddress} onGetQuotes={handleGetQuotes} onClose={() => setShowProjectDetailsModal(false)} onShare={handleShareProject} onSubmitToChallenge={() => openSubmitToChallengeModal(selectedProject)} />}
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
        {showLegalModal && <LegalModal initialTab={legalActiveTab} onClose={closeLegalModal} />}
        
        {/* Easter Egg: Triple click title to open Admin? For now, manual console trigger: window.dispatchEvent(new CustomEvent('openAdmin')) */}
        </div>
    </PiBrowserGate>
  );
};

export default App;
