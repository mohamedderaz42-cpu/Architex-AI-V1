
import { useState, useEffect, useMemo, useRef } from 'react';
import { ProjectEntity, UserEntity, BountyEntity, ArbitratorEntity, OrderEntity, ServiceAgreementEntity, ProposalEntity, TokenEntity, DesignChallengeEntity, ChallengeSubmissionEntity } from '../core/schemas/entities';
import * as api from '../core/api/contract';
import { getProactiveTip, guidedScanInstructions } from '../core/ux-engine/engine';

declare const Pi: any;

// Use a relative path for the backend URL to work with Vercel's proxying.
const BACKEND_URL = '/api';

export type Phase = 'intro' | 'dashboard';
export type ActiveTab = 'scan' | 'design' | 'market' | 'challenges';

export const useArchitex = () => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [activeTab, setActiveTab] = useState<ActiveTab>('design');
  const [isMounted, setIsMounted] = useState(false);
  const [projects, setProjects] = useState<ProjectEntity[]>([]);
  const [bounties, setBounties] = useState<BountyEntity[]>([]);
  const [arbitrators, setArbitrators] = useState<ArbitratorEntity[]>([]);
  const [availableArbitrators, setAvailableArbitrators] = useState<ArbitratorEntity[]>([]);
  const [user, setUser] = useState<UserEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  // Scanning Flow
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanStep, setCurrentScanStep] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
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
  
  const refreshUserData = async (piUser?: any) => {
      const [userData, userProjects, userBounties, arbitratorsData, ordersData, serviceProvidersData, proposalsData, agreementsData, challengesData] = await Promise.all([
        api.authenticateWithPi(), api.listProjects(), api.listBounties(), api.listArbitrators(), api.listOrders(), api.listServiceProviders(), api.listProposals(), api.listServiceAgreements(), api.listDesignChallenges()
      ]);

      if(piUser) {
        userData.piUsername = piUser.username;
        // In a real app, you would get the wallet address from your backend,
        // but for this simulation, we'll use the user's unique ID (uid).
        userData.walletAddress = piUser.uid;
      }

      setUser(userData);
      setProjects(userProjects);
      setBounties(userBounties);
      setArbitrators(arbitratorsData);
      setOrders(ordersData);
      setServiceProviders(serviceProvidersData);
      setProposals(proposalsData);
      setServiceAgreements(agreementsData);
      setDesignChallenges(challengesData);
      return { ordersData };
  };

  const initialize = async () => {
    setIsLoading(true);
    try {
        const scopes = ['username', 'payments'];
        
        // IMPORTANT: Handle incomplete payments (Sandbox/Testnet Requirement)
        const onIncompletePaymentFound = async (payment: any) => {
            console.log('Incomplete payment found:', payment);
            try {
                // Attempt to complete the payment on the server
                // The payment object from Pi SDK contains 'transaction' if the user signed it
                if (payment.transaction && payment.transaction.txid) {
                    await fetch(`${BACKEND_URL}/complete_payment`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            paymentId: payment.identifier, 
                            txid: payment.transaction.txid 
                        }),
                    });
                    console.log("Recovered and completed payment:", payment.identifier);
                } else {
                    // Use the generic completion endpoint to check status or cancel
                    // For now, we just log it. In production, you might cancel it if it's too old.
                    console.warn("Payment found but no transaction ID yet.");
                }
            } catch (e) {
                console.error("Failed to recover payment", e);
            }
        };

        const piUser = await Pi.authenticate(scopes, onIncompletePaymentFound);
        console.log("Pi Auth Successful. User:", piUser.username);
        await refreshUserData(piUser);
        setPhase('dashboard');
    } catch (err) {
        console.error("Pi Authentication failed or not in Pi Browser. Falling back to mock mode.", err);
        // Fallback to mock data if auth fails (e.g., when not in Pi Browser)
        await refreshUserData();
        setPhase('dashboard');
    } finally {
        setIsLoading(false);
    }
  };
  
  const toggleProfile = () => setIsProfileVisible(prev => !prev);
  const handleProjectInteraction = async (project: ProjectEntity) => { setSelectedProject(project); setShowProjectDetailsModal(true); };
  const closeUpsellModal = () => setShowUpsellModal(false);

  // --- Scanning & Payment ---
  const startScan = () => { setIsScanning(true); setCurrentScanStep(0); setScanProgress(0); const totalDuration = 8000; const stepDuration = totalDuration / guidedScanInstructions.length; scanIntervalRef.current = window.setInterval(() => { setCurrentScanStep(prevStep => { const nextStep = prevStep + 1; if (nextStep >= guidedScanInstructions.length) { clearInterval(scanIntervalRef.current!); setIsScanning(false); setShowPaymentModal(true); return prevStep; } return nextStep; }); setScanProgress(prev => prev + (100 / guidedScanInstructions.length)); }, stepDuration); };
  const cancelScan = () => { if (scanIntervalRef.current) { clearInterval(scanIntervalRef.current); } setIsScanning(false); setScanProgress(0); setCurrentScanStep(0); };
  
  /**
   * Generic Pi Payment Processor
   * Handles the Create -> Approve -> Complete lifecycle for any payment.
   */
  const processPiPayment = async (amount: number, memo: string, metadata: object): Promise<string | null> => {
      setPaymentError(null);
      return new Promise(async (resolve) => {
          try {
              const paymentData = { amount, memo, metadata };
              const callbacks = {
                  onReadyForServerApproval: async (paymentId: string) => {
                      console.log("Approval needed for", paymentId);
                      try {
                        const res = await fetch(`${BACKEND_URL}/approve_payment`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ paymentId }),
                        });
                        if(!res.ok) {
                            const errData = await res.json();
                            throw new Error(errData.error || "Server approval failed");
                        }
                      } catch(e: any) { 
                          console.error("Approval Error", e); 
                          setPaymentError(`Approval Failed: ${e.message}`);
                          throw e;
                      }
                  },
                  onReadyForServerCompletion: async (paymentId: string, txid: string) => {
                      console.log("Completion needed for", paymentId, txid);
                      try {
                        const res = await fetch(`${BACKEND_URL}/complete_payment`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ paymentId, txid }),
                        });
                        if(!res.ok) {
                             const errData = await res.json();
                             throw new Error(errData.error || "Server completion failed");
                        }
                        resolve(txid);
                      } catch(e: any) { 
                          console.error("Completion Error", e); 
                          setPaymentError(`Completion Failed: ${e.message}`);
                          resolve(null); 
                      }
                  },
                  onCancel: (paymentId: string) => {
                      console.log("Payment cancelled by user", paymentId);
                      resolve(null);
                  },
                  onError: (error: Error, payment: any) => {
                      console.error('Pi Payment Error:', error, payment);
                      setPaymentError(`Payment Error: ${error.message}`);
                      resolve(null);
                  },
              };
              
              await Pi.createPayment(paymentData, callbacks);

          } catch (error: any) {
              // Only fallback to simulation if strictly necessary or dev mode
              if (process.env.NODE_ENV === 'development' && !window.navigator.userAgent.includes('PiBrowser')) {
                  console.warn("Simulating successful payment (Dev Mode).");
                  await new Promise(resolveWait => setTimeout(resolveWait, 1500));
                  resolve(`sim_tx_${Date.now()}`);
              } else {
                  console.error("Payment failed.", error);
                  setPaymentError(error.message || "Payment failed to initialize.");
                  resolve(null);
              }
          }
      });
  };

  const confirmPayment = async () => {
      setIsProcessingPayment(true);
      const txid = await processPiPayment(0.50, "Architex 3D Model Generation", { forProjectId: `proj_scan_${Date.now()}` });
      
      if (txid) {
          const newProject = await api.generateModelFromScan();
          setProjects(prev => [newProject, ...prev]);
          setActiveTab('design');
          setShowPaymentModal(false);
      }
      
      setIsProcessingPayment(false);
      // Do not close modal on error, let user see error
  };
  
  const cancelPayment = () => {
      setShowPaymentModal(false);
      setPaymentError(null);
  };

  // --- Bounty, Agreement, and Escrow Flow ---
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
  
  const handleSelectArbitrator = async (bounty: BountyEntity, arbitrator: ArbitratorEntity) => { 
      // Payment Integration: Arbitrator Fee
      if (arbitrator.fee > 0) {
          const txid = await processPiPayment(arbitrator.fee, `Arbitrator Fee: ${arbitrator.name}`, { bountyId: bounty.id, arbitratorId: arbitrator.id });
          if (!txid) return; // User cancelled
      }
      const updatedBounty = await api.selectArbitrator(bounty.id, arbitrator.id); 
      setBounties(prev => prev.map(b => b.id === updatedBounty.id ? updatedBounty : b)); 
      setSelectedBounty(updatedBounty); 
  };
  
  const handleResolveArbitration = async (bounty: BountyEntity, decision: 'Release' | 'Refund') => { const updatedBounty = await api.resolveArbitration(bounty.id, decision); setBounties(prev => prev.map(b => b.id === updatedBounty.id ? updatedBounty : b)); setSelectedBounty(updatedBounty); };
  
  // --- NFT Minting ---
  const openMintNftModal = (project: ProjectEntity) => { setProjectToMint(project); setShowMintNftModal(true); };
  const closeMintNftModal = () => { setProjectToMint(null); setShowMintNftModal(false); };
  const handleMintNft = async (projectId: string) => { const updatedProject = await api.mintProjectAsNft(projectId); setProjects(prevProjects => prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p)); };

  // --- E-Commerce ---
  useEffect(() => {
    const shippedOrderWithInstallable = orders.find(o => o.status === 'Shipped' && o.items.some(i => i.productId === 'prod_01' || i.productId === 'prod_02'));
    if (shippedOrderWithInstallable && !orderForUpsell) {
      setOrderForUpsell(shippedOrderWithInstallable);
      setShowInstallationUpsellModal(true);
    }
  }, [orders, orderForUpsell]);

  const handleConfirmDelivery = async (orderId: string) => { const updatedOrder = await api.updateOrderStatus(orderId, 'Delivered'); const newOrders = orders.map(o => o.id === orderId ? updatedOrder : o); setOrders(newOrders); if (updatedOrder.proofOfInstallationStatus === 'pending') { setOrderForProof(updatedOrder); setShowProofOfInstallationModal(true); } };
  const handleRequestReturn = async (orderId: string) => { await api.updateOrderStatus(orderId, 'Returned'); const newOrders = await api.listOrders(); setOrders(newOrders); };
  const handleMarkAsShipped = async (orderId: string) => { await api.updateOrderStatus(orderId, 'Shipped'); const newOrders = await api.listOrders(); setOrders(newOrders); };
  const handleDisputeReturn = async (orderId: string) => { console.log(`[CONTRACT] Freezing escrow for order ${orderId} and initiating arbitration.`); };

  // --- Service Provider ---
  const handleGetQuotes = () => { setShowProjectDetailsModal(false); setActiveTab('market'); };
  const handleInitiateHiring = async (provider: UserEntity) => { if (!selectedProject) return; const agreement = await api.createServiceAgreement(user!.id, provider.id, selectedProject.id, 500); setActiveServiceAgreement(agreement); const arbitrators = await api.listArbitrators(); setAvailableArbitrators(arbitrators); setShowServiceAgreementModal(true); };
  
  const handleConfirmServiceHiring = async (validatorId?: string) => { 
      if (!activeServiceAgreement) return; 
      
      // Calculate total cost including validator fee
      let totalCost = activeServiceAgreement.price;
      if (validatorId) {
          const validator = arbitrators.find(a => a.id === validatorId);
          if (validator) totalCost += validator.fee;
      }

      // Payment Integration: Service Escrow
      const txid = await processPiPayment(totalCost, `Service Escrow: ${activeServiceAgreement.id}`, { agreementId: activeServiceAgreement.id, validatorId });
      
      if (txid) {
        await api.fundServiceEscrow(activeServiceAgreement.id, validatorId); 
        setShowServiceAgreementModal(false); 
        setActiveServiceAgreement(null); 
      }
  };
  
  const handleConfirmServiceCompletion = async (agreement: ServiceAgreementEntity) => { await api.confirmServiceCompletion(agreement.id, 'client'); };
  
  // --- Reputation & DAO ---
  const handleSubmitRating = async (rating: number, comment: string) => { if(!userToRate) return; await api.submitRating(userToRate, rating, comment); const score = await api.calculateTrustScore(user!.id); setUser(prev => prev ? {...prev, trustScore: score} : null); setUserToRate(null); setShowRatingModal(false); };
  const handleStake = async (amount: number) => { const updatedUser = await api.stakeArchi(amount); setUser(updatedUser); };
  const handleUnstake = async (amount: number) => { const updatedUser = await api.unstakeArchi(amount); setUser(updatedUser); };
  const handleVote = async (proposalId: string, vote: 'for' | 'against') => { if (!user) return; const votingPower = (user.stakedArchi || 0) + user.trustScore; const updatedProposal = await api.voteOnProposal(proposalId, vote, votingPower); setProposals(prev => prev.map(p => p.id === proposalId ? updatedProposal : p)); };

  const handleExecuteProposal = async (proposalId: string) => {
    const updatedProposal = await api.executeProposal(proposalId);
    setProposals(prev => prev.map(p => p.id === proposalId ? updatedProposal : p));
  };
  const handleSubmitProofOfInstallation = async (orderId: string) => {
    await api.submitProofOfInstallation(orderId, 'mock_photo_data');
    const updatedOrder = await api.verifyProofOfInstallation(orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    
    // Refresh trust score
    const score = await api.calculateTrustScore(user!.id);
    setUser(prev => prev ? {...prev, trustScore: score} : null);
  };
  const openGovernanceTosModal = () => setShowGovernanceTosModal(true);
  const closeGovernanceTosModal = () => setShowGovernanceTosModal(false);

  const handleShareProject = async (projectId: string) => {
    const result = await api.shareToPiFeed(projectId);
    return result;
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
  };
  const handleVoteOnSubmission = async (submissionId: string) => {
    if (!user || !selectedChallenge) return;
    const votingPower = (user.stakedArchi || 0) + user.trustScore;
    await api.voteOnChallengeSubmission(submissionId, votingPower);
    // Refresh submissions
    const challengeSubmissions = await api.getChallengeSubmissions(selectedChallenge.id);
    setSubmissions(challengeSubmissions);
  };

  const uxTip = useMemo(() => getProactiveTip(activeTab), [activeTab]);
  const currentScanInstruction = guidedScanInstructions[currentScanStep];

  return {
    phase, isMounted, activeTab, projects, bounties, arbitrators, availableArbitrators, user, isLoading, uxTip, orders, serviceProviders, serviceAgreements, proposals, designChallenges,
    initialize, setActiveTab, toggleProfile, isProfileVisible,
    isScanning, scanProgress, currentScanInstruction, startScan, cancelScan, 
    showPaymentModal, confirmPayment, cancelPayment, isProcessingPayment, paymentError,
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
    // Design Challenges
    selectedChallenge, submissions, handleSelectChallenge, closeChallengeDetailsModal, handleVoteOnSubmission,
    showSubmitToChallengeModal, projectToSubmit, openSubmitToChallengeModal, closeSubmitToChallengeModal, handleSubmitProjectToChallenge,
  };
};
