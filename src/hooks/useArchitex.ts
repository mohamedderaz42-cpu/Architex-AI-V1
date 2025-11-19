
import { useState, useEffect, useMemo, useRef } from 'react';
import { ProjectEntity, UserEntity, BountyEntity, ArbitratorEntity, OrderEntity, ServiceAgreementEntity, ProposalEntity, TokenEntity, DesignChallengeEntity, ChallengeSubmissionEntity, ScanAnalysis, ProductEntity, CartItem, MessageEntity, OracleData, SignedAgreement, InventoryConflict, CartOptimization } from '../core/schemas/entities';
import * as api from '../core/api/contract';
import * as ads from '../core/api/ads';
import { getProactiveTip, guidedScanInstructions, UXContext, shouldTriggerDesignerUpsell } from '../core/ux-engine/engine';
import { useToast } from '../components/Toast';

// Define Window interface extension for Pi
declare global {
  interface Window {
    Pi: any;
  }
}

// Use a relative path for the backend URL to work with Vercel's proxying and Netlify redirects.
const BACKEND_URL = '/api';

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
  const [userTokens, setUserTokens] = useState<TokenEntity[]>([]);
  const [oracleData, setOracleData] = useState<OracleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  // Admin Logic
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  
  // Chat Logic
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContextId, setChatContextId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageEntity[]>([]);

  // Marketplace & Cart Data
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [cart, setCart] = useState<{product: ProductEntity, quantity: number}[]>([]);
  const [showShoppingCartModal, setShowShoppingCartModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<UserEntity | null>(null);
  const [showVendorProfileModal, setShowVendorProfileModal] = useState(false);

  // Scanning & Analysis Flow
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanStep, setCurrentScanStep] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [scanAnalysis, setScanAnalysis] = useState<ScanAnalysis | null>(null);
  const scanIntervalRef = useRef<number | null>(null);
  
  // Project Creation Flow
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);

  // Upsell & Bounty Flow
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [showCreateBountyModal, setShowCreateBountyModal] = useState(false);
  const [selectedBounty, setSelectedBounty] = useState<BountyEntity | null>(null);
  const [showDisputeResolutionModal, setShowDisputeResolutionModal] = useState(false);

  // Agreement & Escrow Flow
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [agreementText, setAgreementText] = useState<string | null>(null);
  const bountyToFundRef = useRef<BountyEntity | null>(null);
  const [signedAgreements, setSignedAgreements] = useState<SignedAgreement[]>([]);

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
  const [selectedProposal, setSelectedProposal] = useState<ProposalEntity | null>(null);
  const [showProposalDetailsModal, setShowProposalDetailsModal] = useState(false);
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
      const [userData, userProjects, publicProjs, userBounties, arbitratorsData, ordersData, serviceProvidersData, proposalsData, agreementsData, challengesData, productsData, tokensData, oracle] = await Promise.all([
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
        api.listVendorProducts(),
        api.getUserTokens(),
        api.getOracleData()
      ]);

      if(piUser) {
        userData.piUsername = piUser.username;
        userData.walletAddress = piUser.uid;
      }

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
      setUserTokens(tokensData);
      setOracleData(oracle);
      return { ordersData };
  };

  const initialize = async () => {
    setIsLoading(true);
    try {
        // Check localStorage for onboarding
        const hasSeenOnboarding = localStorage.getItem('architex_onboarding_complete');

        if (!window.Pi) {
            console.warn("Pi SDK not detected on window object. Running in mock mode.");
            await refreshUserData();
            setPhase(hasSeenOnboarding ? 'dashboard' : 'onboarding');
            addToast('Running in Sandbox Mode', 'info');
            setIsLoading(false);
            return;
        }

        const scopes = ['username', 'payments'];
        
        const onIncompletePaymentFound = async (payment: any) => {
            console.log('Incomplete payment found:', payment);
            try {
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
                    addToast('Recovered incomplete payment', 'success');
                } else {
                    console.warn("Payment found but no transaction ID yet.");
                }
            } catch (e) {
                console.error("Failed to recover payment", e);
            }
        };

        const piUser = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
        console.log("Pi Auth Successful. User:", piUser.username);
        await refreshUserData(piUser);
        setPhase(hasSeenOnboarding ? 'dashboard' : 'onboarding');
    } catch (err) {
        console.error("Pi Authentication failed or not in Pi Browser. Falling back to mock mode.", err);
        await refreshUserData();
        const hasSeenOnboarding = localStorage.getItem('architex_onboarding_complete');
        setPhase(hasSeenOnboarding ? 'dashboard' : 'onboarding');
        addToast('Auth Failed: Using Mock Mode', 'error');
    } finally {
        setIsLoading(false);
    }
  };
  
  const completeOnboarding = () => {
      localStorage.setItem('architex_onboarding_complete', 'true');
      setPhase('dashboard');
  };
  
  // --- Tab Navigation with Ad Interstitial ---
  const navigateToTab = async (tab: ActiveTab) => {
      // Show Ad if Free Tier and Cooldown satisfied
      if (user && user.subscriptionTier !== 'Accelerator' && ads.isAdReady()) {
          await ads.showInterstitial();
      }
      setActiveTab(tab);
  }

  const toggleProfile = () => setIsProfileVisible(prev => !prev);
  const handleProjectInteraction = async (project: ProjectEntity) => { setSelectedProject(project); setShowProjectDetailsModal(true); };
  
  const handleModifyProject = async (project: ProjectEntity) => {
      const updatedProject = await api.incrementProjectModification(project.id);
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
      setSelectedProject(updatedProject);
      if (shouldTriggerDesignerUpsell(updatedProject.modificationCount || 0)) {
          setShowUpsellModal(true);
      } else {
          addToast('Design Regenerated', 'success');
      }
  };

  const closeUpsellModal = () => setShowUpsellModal(false);
  
  // --- Chat Logic ---
  const openChat = async (contextId: string) => {
      setChatContextId(contextId);
      
      // If Support Chat, initialize with greeting if empty
      if (contextId === 'support_archie') {
           setMessages([
               { id: 'sys_init', contextId, senderId: 'archie_ai', senderName: 'ArchieBot', text: "Hi! I'm Archie. Ask me anything about your designs or the marketplace.", timestamp: new Date().toISOString() }
           ]);
      } else {
          const msgs = await api.getMessages(contextId);
          setMessages(msgs);
      }
      setIsChatOpen(true);
  };
  
  const closeChat = () => {
      setIsChatOpen(false);
      setChatContextId(null);
  };
  
  const handleSendMessage = async (text: string) => {
      if (!chatContextId) return;
      
      // Optimistic UI Update
      const userMsg: MessageEntity = {
          id: `temp_${Date.now()}`,
          contextId: chatContextId,
          senderId: user!.id,
          senderName: user!.piUsername,
          text,
          timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMsg]);
      
      if (chatContextId === 'support_archie') {
          // Archie AI Logic
          const responseText = await api.askArchie(text);
          const botMsg: MessageEntity = {
              id: `bot_${Date.now()}`,
              contextId: chatContextId,
              senderId: 'archie_ai',
              senderName: 'ArchieBot',
              text: responseText,
              timestamp: new Date().toISOString()
          };
           setMessages(prev => [...prev, botMsg]);
      } else {
           // Standard Message
           await api.sendMessage(chatContextId, text);
           // In a real socket app, we wouldn't need to refetch, but here we just push the optimistic one.
           // The backend mock 'sendMessage' actually saves it.
      }
  };

  // --- Admin Logic ---
  const openAdminModal = () => {
      setIsProfileVisible(false); // Close profile first
      setIsAdminModalOpen(true);
  };
  const closeAdminModal = () => setIsAdminModalOpen(false);


  // --- Cart & Vendor Logic ---
  const addToCart = (product: ProductEntity) => {
      setCart(prev => {
          const existing = prev.find(item => item.product.id === product.id);
          if(existing) {
              return prev.map(item => item.product.id === product.id ? {...item, quantity: item.quantity + 1} : item);
          }
          return [...prev, { product, quantity: 1 }];
      });
      addToast(`Added ${product.name} to cart`, 'success');
  };

  const removeFromCart = (productId: string) => {
      setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartItem = (productId: string, newProductId: string) => {
      setCart(prev => prev.map(item => {
          if (item.product.id === productId) {
              const newProduct = products.find(p => p.id === newProductId);
              return newProduct ? { ...item, product: newProduct } : item;
          }
          return item;
      }));
  }

  const openShoppingCart = () => setShowShoppingCartModal(true);
  const closeShoppingCart = () => setShowShoppingCartModal(false);

  const handleCheckout = async () => {
      const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const txid = await processPiPayment(total, `Architex Store Order`, { type: 'order' });
      if (txid) {
          const orderItems = cart.map(c => ({ productId: c.product.id, quantity: c.quantity }));
          await api.createOrder(orderItems, total);
          setCart([]);
          setShowShoppingCartModal(false);
          const newOrders = await api.listOrders();
          setOrders(newOrders);
          addToast('Order Placed & Escrow Funded!', 'success');
      }
  };

  const openVendorProfile = (vendorId: string) => {
      const vendor = serviceProviders.find(p => p.id === vendorId) || {
          id: vendorId,
          piUsername: 'EcoSupplier_Ltd',
          trustScore: 88,
          avatarUrl: `https://placehold.co/100x100/10B981/FFFFFF/png?text=${vendorId.slice(0,2)}`,
          role: 'vendor',
          walletAddress: 'G...Vendor',
          subscriptionTier: 'Accelerator',
          isFounder: true 
      } as UserEntity;
      setSelectedVendor(vendor);
      setShowVendorProfileModal(true);
  };

  // --- Scanning, Analysis & Payment ---
  const playInstructionAudio = async (text: string) => {
      const audioBuffer = await api.generateSpeech(text);
      if (audioBuffer) {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(ctx.destination);
          source.start();
      }
  };

  const startScan = () => { 
      setIsScanning(true); 
      setCurrentScanStep(0); 
      setScanProgress(0); 
      setScanAnalysis(null);
      playInstructionAudio(guidedScanInstructions[0]);
      
      const totalDuration = 12000; 
      const stepDuration = totalDuration / guidedScanInstructions.length; 
      
      scanIntervalRef.current = window.setInterval(async () => { 
          setCurrentScanStep(prevStep => { 
              const nextStep = prevStep + 1; 
              if (nextStep >= guidedScanInstructions.length) { 
                  clearInterval(scanIntervalRef.current!); 
                  setIsScanning(false); 
                  handleScanCompletion();
                  return prevStep; 
              } 
              playInstructionAudio(guidedScanInstructions[nextStep]);
              return nextStep; 
          }); 
          setScanProgress(prev => prev + (100 / guidedScanInstructions.length)); 
      }, stepDuration); 
  };

  const handleScanCompletion = async () => {
      setShowPaymentModal(true);
      addToast('Scan Complete. Analyzing...', 'info');
      const analysis = await api.getRoomAnalysis();
      setScanAnalysis(analysis);
  };

  const cancelScan = () => { if (scanIntervalRef.current) { clearInterval(scanIntervalRef.current); } setIsScanning(false); setScanProgress(0); setCurrentScanStep(0); };
  
  const processPiPayment = async (amount: number, memo: string, metadata: object): Promise<string | null> => {
      setPaymentError(null);
      if (!window.Pi) {
          console.warn("Pi SDK missing. Simulating payment success.");
          await new Promise(resolve => setTimeout(resolve, 1500));
          return `sim_tx_${Date.now()}`;
      }

      return new Promise(async (resolve) => {
          try {
              const paymentData = { amount, memo, metadata };
              const callbacks = {
                  onReadyForServerApproval: async (paymentId: string) => {
                      try {
                        const res = await fetch(`${BACKEND_URL}/approve_payment`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ paymentId }),
                        });
                        if(!res.ok) throw new Error("Server approval failed");
                      } catch(e: any) { 
                          console.error("Approval Error", e); 
                          setPaymentError(`Approval Failed: ${e.message}`);
                          throw e;
                      }
                  },
                  onReadyForServerCompletion: async (paymentId: string, txid: string) => {
                      try {
                        const res = await fetch(`${BACKEND_URL}/complete_payment`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ paymentId, txid }),
                        });
                        if(!res.ok) throw new Error("Server completion failed");
                        resolve(txid);
                      } catch(e: any) { 
                          console.error("Completion Error", e); 
                          setPaymentError(`Completion Failed: ${e.message}`);
                          resolve(null); 
                      }
                  },
                  onCancel: (paymentId: string) => resolve(null),
                  onError: (error: Error, payment: any) => {
                      console.error('Pi Payment Error:', error, payment);
                      setPaymentError(error.message || "Transaction failed");
                      resolve(null);
                  },
              };
              await window.Pi.createPayment(paymentData, callbacks);
          } catch (error: any) {
              console.error("Payment failed.", error);
              setPaymentError(error.message || "Payment failed to initialize.");
              resolve(null);
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
          setScanAnalysis(null);
          addToast('3D Model Generated Successfully', 'success');
      } else {
          addToast('Payment Cancelled or Failed', 'error');
      }
      setIsProcessingPayment(false);
  };
  
  const cancelPayment = () => {
      setShowPaymentModal(false);
      setPaymentError(null);
      setScanAnalysis(null);
  };

  // --- Create Project (AI) Flow ---
  const openCreateProjectModal = () => setShowCreateProjectModal(true);
  const closeCreateProjectModal = () => setShowCreateProjectModal(false);
  
  const handleCreateProject = async (data: { roomType: string, style: string, prompt: string }) => {
      const newProject = await api.generateAIProject(data);
      setProjects(prev => [newProject, ...prev]);
      addToast('AI Design Created!', 'success');
  };

  // --- Bounty, Agreement, and Escrow Flow ---
  const openCreateBountyModal = () => setShowCreateBountyModal(true);
  const closeCreateBountyModal = () => setShowCreateBountyModal(false);
  const handleCreateBounty = async (bountyDetails: Omit<BountyEntity, 'id' | 'createdAt' | 'status' | 'escrowState'>) => { 
      await api.createBounty(bountyDetails); 
      const updatedBounties = await api.listBounties(); 
      const updatedTokens = await api.getUserTokens();
      setBounties(updatedBounties); 
      setUserTokens(updatedTokens);
      addToast('Bounty Published (10% Fee Applied)', 'success');
  };
  const handleSelectBounty = async (bounty: BountyEntity) => { const available = await api.listAvailableArbitrators(bounty.projectId); setAvailableArbitrators(available); setSelectedBounty(bounty); };
  const closeBountyDetailsModal = () => setSelectedBounty(null);
  const handleInitiateFunding = async (bounty: BountyEntity) => { bountyToFundRef.current = bounty; const text = await api.getDynamicAgreementText(bounty); setAgreementText(text); setShowAgreementModal(true); };
  const handleConfirmFunding = async () => { if (!bountyToFundRef.current) return; const updatedBounty = await api.fundEscrow(bountyToFundRef.current.id); setBounties(prev => prev.map(b => b.id === updatedBounty.id ? updatedBounty : b)); setSelectedBounty(updatedBounty); setShowAgreementModal(false); setAgreementText(null); bountyToFundRef.current = null; addToast('Escrow Funded & Contract Signed', 'success'); };
  const closeAgreementModal = () => { setShowAgreementModal(false); setAgreementText(null); bountyToFundRef.current = null; };
  const handleReleaseFunds = async (bounty: BountyEntity) => { const updatedBounty = await api.releaseEscrow(bounty.id); setBounties(prev => prev.map(b => b.id === updatedBounty.id ? updatedBounty : b)); setSelectedBounty(updatedBounty); if (updatedBounty.winnerId) { setUserToRate(updatedBounty.winnerId); setShowRatingModal(true); } addToast('Funds Released', 'success'); };
  const handleRaiseDispute = (bounty: BountyEntity) => { setSelectedBounty(bounty); setShowDisputeResolutionModal(true); };
  const handleConfirmDispute = async (bounty: BountyEntity) => { const updatedBounty = await api.raiseDispute(bounty.id); setBounties(prev => prev.map(b => b.id === updatedBounty.id ? updatedBounty : b)); setSelectedBounty(updatedBounty); addToast('Dispute Raised', 'error'); };
  
  const handleSelectArbitrator = async (bounty: BountyEntity, arbitrator: ArbitratorEntity) => { 
      if (arbitrator.fee > 0) {
          const txid = await processPiPayment(arbitrator.fee, `Arbitrator Fee: ${arbitrator.name}`, { bountyId: bounty.id, arbitratorId: arbitrator.id });
          if (!txid) return; 
      }
      const updatedBounty = await api.selectArbitrator(bounty.id, arbitrator.id); 
      setBounties(prev => prev.map(b => b.id === updatedBounty.id ? updatedBounty : b)); 
      setSelectedBounty(updatedBounty); 
      addToast('Arbitrator Selected', 'success');
  };
  
  const handleResolveArbitration = async (bounty: BountyEntity, decision: 'Release' | 'Refund') => { const updatedBounty = await api.resolveArbitration(bounty.id, decision); setBounties(prev => prev.map(b => b.id === updatedBounty.id ? updatedBounty : b)); setSelectedBounty(updatedBounty); addToast(`Dispute Resolved: ${decision}`, 'success'); };
  
  // --- NFT Minting ---
  const openMintNftModal = (project: ProjectEntity) => { setProjectToMint(project); setShowMintNftModal(true); };
  const closeMintNftModal = () => { setProjectToMint(null); setShowMintNftModal(false); };
  const handleMintNft = async (projectId: string) => { 
      const updatedProject = await api.mintProjectAsNft(projectId); 
      setProjects(prevProjects => prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p)); 
      const updatedTokens = await api.getUserTokens();
      setUserTokens(updatedTokens);
      addToast('NFT Minted Successfully (Fee Paid)', 'success'); 
  };

  // --- Vesting Claim ---
  const handleClaimVestedTokens = async () => {
      try {
          const result = await api.claimVestedTokens(user!.id);
          addToast(`Successfully claimed ${result.claimed.toLocaleString()} ARCHI`, 'success');
          const updatedTokens = await api.getUserTokens();
          setUserTokens(updatedTokens);
      } catch (e: any) {
          addToast(e.message, 'error');
      }
  };

  const handleClaimStakingRewards = async () => {
      try {
          await api.claimStakingRewards();
          addToast('Staking Rewards Claimed', 'success');
          const updatedUser = await api.authenticateWithPi();
          const updatedTokens = await api.getUserTokens();
          setUser(updatedUser);
          setUserTokens(updatedTokens);
      } catch (e: any) {
          addToast(e.message, 'error');
      }
  };

  // --- E-Commerce ---
  useEffect(() => {
    const shippedOrderWithInstallable = orders.find(o => o.status === 'Shipped' && o.items.some(i => i.productId === 'prod_01' || i.productId === 'prod_02'));
    if (shippedOrderWithInstallable && !orderForUpsell) {
      setOrderForUpsell(shippedOrderWithInstallable);
      setShowInstallationUpsellModal(true);
    }
  }, [orders, orderForUpsell]);

  const handleConfirmDelivery = async (orderId: string) => { const updatedOrder = await api.updateOrderStatus(orderId, 'Delivered'); const newOrders = orders.map(o => o.id === orderId ? updatedOrder : o); setOrders(newOrders); if (updatedOrder.proofOfInstallationStatus === 'pending') { setOrderForProof(updatedOrder); setShowProofOfInstallationModal(true); } addToast('Delivery Confirmed', 'success'); };
  const handleRequestReturn = async (orderId: string) => { await api.updateOrderStatus(orderId, 'Returned'); const newOrders = await api.listOrders(); setOrders(newOrders); addToast('Return Requested', 'info'); };
  const handleMarkAsShipped = async (orderId: string) => { await api.updateOrderStatus(orderId, 'Shipped'); const newOrders = await api.listOrders(); setOrders(newOrders); };
  const handleDisputeReturn = async (orderId: string) => { console.log(`[CONTRACT] Freezing escrow for order ${orderId} and initiating arbitration.`); };

  // --- Service Provider ---
  const handleGetQuotes = () => { setShowProjectDetailsModal(false); setActiveTab('market'); };
  const handleInitiateHiring = async (provider: UserEntity) => { if (!selectedProject) return; const agreement = await api.createServiceAgreement(user!.id, provider.id, selectedProject.id, 500); setActiveServiceAgreement(agreement); const arbitrators = await api.listArbitrators(); setAvailableArbitrators(arbitrators); setShowServiceAgreementModal(true); };
  
  const handleConfirmServiceHiring = async (validatorId?: string) => { 
      if (!activeServiceAgreement) return; 
      let totalCost = activeServiceAgreement.price;
      if (validatorId) {
          const validator = arbitrators.find(a => a.id === validatorId);
          if (validator) totalCost += validator.fee;
      }
      const txid = await processPiPayment(totalCost, `Service Escrow: ${activeServiceAgreement.id}`, { agreementId: activeServiceAgreement.id, validatorId });
      
      if (txid) {
        await api.fundServiceEscrow(activeServiceAgreement.id, validatorId); 
        setShowServiceAgreementModal(false); 
        setActiveServiceAgreement(null); 
        addToast('Service Hired & Escrow Funded', 'success');
      } else {
          addToast('Payment Failed', 'error');
      }
  };
  
  const handleConfirmServiceCompletion = async (agreement: ServiceAgreementEntity) => { await api.confirmServiceCompletion(agreement.id, 'client'); addToast('Service Completed', 'success'); };
  
  // --- Reputation & DAO ---
  const handleSubmitRating = async (rating: number, comment: string) => { if(!userToRate) return; await api.submitRating(userToRate, rating, comment); const score = await api.calculateTrustScore(user!.id); setUser(prev => prev ? {...prev, trustScore: score} : null); setUserToRate(null); setShowRatingModal(false); addToast('Rating Submitted', 'success'); };
  const handleStake = async (amount: number) => { const updatedUser = await api.stakeArchi(amount); setUser(updatedUser); const updatedTokens = await api.getUserTokens(); setUserTokens(updatedTokens); addToast(`Staked ${amount} ARCHI`, 'success'); };
  const handleUnstake = async (amount: number) => { const updatedUser = await api.unstakeArchi(amount); setUser(updatedUser); const updatedTokens = await api.getUserTokens(); setUserTokens(updatedTokens); addToast(`Unstaked ${amount} ARCHI`, 'info'); };
  const handleVote = async (proposalId: string, vote: 'for' | 'against') => { if (!user) return; const votingPower = (user.stakedArchi || 0) + user.trustScore; const updatedProposal = await api.voteOnProposal(proposalId, vote, votingPower); setProposals(prev => prev.map(p => p.id === proposalId ? updatedProposal : p)); addToast('Vote Cast', 'success'); };
  const handleExecuteProposal = async (proposalId: string) => {
    const updatedProposal = await api.executeProposal(proposalId);
    setProposals(prev => prev.map(p => p.id === proposalId ? updatedProposal : p));
    addToast('Proposal Executed', 'success');
  };
  
  // DAO Discussion Logic
  const openProposalDetails = (proposal: ProposalEntity) => {
      setSelectedProposal(proposal);
      setShowProposalDetailsModal(true);
  };
  const closeProposalDetails = () => {
      setSelectedProposal(null);
      setShowProposalDetailsModal(false);
  };
  const handleSubmitComment = async (proposalId: string, text: string) => {
      const updatedProposal = await api.submitProposalComment(proposalId, text);
      setProposals(prev => prev.map(p => p.id === proposalId ? updatedProposal : p));
      setSelectedProposal(updatedProposal); 
  };

  const handleSubmitProofOfInstallation = async (orderId: string) => {
    await api.submitProofOfInstallation(orderId, 'mock_photo_data');
    const updatedOrder = await api.verifyProofOfInstallation(orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    const score = await api.calculateTrustScore(user!.id);
    setUser(prev => prev ? {...prev, trustScore: score} : null);
    addToast('Proof Verified + Reward Claimed', 'success');
  };
  const openGovernanceTosModal = () => setShowGovernanceTosModal(true);
  const closeGovernanceTosModal = () => setShowGovernanceTosModal(false);

  const handleShareProject = async (projectId: string) => {
    const result = await api.shareToPiFeed(projectId);
    if (result.success) {
        addToast(result.message, 'success');
    } else {
        addToast(result.message, 'info');
    }
    return result;
  };

  // Founder Logic
  const handleJoinFounderProgram = async () => {
      if(user?.isFounder) {
          addToast('You are already a Founder!', 'info');
          return;
      }
      const updatedUser = await api.claimFounderStatus();
      setUser(updatedUser);
      addToast('Welcome to the Founder Program!', 'success');
  };
  
  // Subscription Logic
  const handleSubscribe = async () => {
      const txid = await processPiPayment(52.00, "Accelerator Subscription (1 Month)", { type: 'subscription', tier: 'accelerator' });
      if (txid) {
          const updatedUser = await api.subscribeToAccelerator();
          setUser(updatedUser);
          addToast('Welcome to Accelerator Tier!', 'success');
      } else {
          addToast('Subscription Payment Failed', 'error');
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
    addToast('Project Submitted to Challenge', 'success');
  };
  const handleVoteOnSubmission = async (submissionId: string) => {
    if (!user || !selectedChallenge) return;
    const votingPower = (user.stakedArchi || 0) + user.trustScore;
    await api.voteOnChallengeSubmission(submissionId, votingPower);
    const challengeSubmissions = await api.getChallengeSubmissions(selectedChallenge.id);
    setSubmissions(challengeSubmissions);
    addToast('Vote Recorded', 'success');
  };

  const uxContext = useMemo<UXContext>(() => ({
    activeTab,
    user,
    projectCount: projects.length,
    hasPendingOrders: orders.some(o => o.status === 'Shipped'),
    currentProjectModificationCount: selectedProject?.modificationCount // Pass current selected project's mod count
  }), [activeTab, user, projects, orders, selectedProject]);

  const uxTip = useMemo(() => getProactiveTip(uxContext), [uxContext]);
  const currentScanInstruction = guidedScanInstructions[currentScanStep];

  return {
    phase, isMounted, activeTab, projects, publicProjects, bounties, arbitrators, availableArbitrators, user, isLoading, uxTip, orders, serviceProviders, serviceAgreements, proposals, designChallenges, products,
    initialize, setActiveTab: navigateToTab, toggleProfile, isProfileVisible, completeOnboarding,
    isScanning, scanProgress, currentScanInstruction, startScan, cancelScan, 
    showPaymentModal, confirmPayment, cancelPayment, isProcessingPayment, paymentError, scanAnalysis,
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
    handleStake, handleUnstake, handleVote,
    handleExecuteProposal,
    // DAO Discussion
    selectedProposal, showProposalDetailsModal, openProposalDetails, closeProposalDetails, handleSubmitComment,
    showProofOfInstallationModal, setShowProofOfInstallationModal, orderForProof, handleSubmitProofOfInstallation,
    showGovernanceTosModal, openGovernanceTosModal, closeGovernanceTosModal,
    handleShareProject,
    // Design Challenges
    selectedChallenge, submissions, handleSelectChallenge, closeChallengeDetailsModal, handleVoteOnSubmission,
    showSubmitToChallengeModal, projectToSubmit, openSubmitToChallengeModal, closeSubmitToChallengeModal, handleSubmitProjectToChallenge,
    // Create Project
    showCreateProjectModal, openCreateProjectModal, closeCreateProjectModal, handleCreateProject,
    // Cart & Vendor
    cart, addToCart, removeFromCart, updateCartItem, openShoppingCart, closeShoppingCart, showShoppingCartModal, handleCheckout,
    openVendorProfile, showVendorProfileModal, selectedVendor, setShowVendorProfileModal,
    // Smart Checkout APIs exposed via wrapper
    checkInventory: api.checkInventory,
    getCartOptimizations: api.getCartOptimizations,
    generatePurchaseAgreement: api.generatePurchaseAgreement,
    // Admin
    isAdminModalOpen, openAdminModal, closeAdminModal,
    // Chat
    isChatOpen, openChat, closeChat, messages, handleSendMessage, chatContextId,
    // Wallet & Incentives
    userTokens, handleClaimVestedTokens, handleClaimStakingRewards, oracleData,
    // Legal
    signedAgreements,
    // System Test
    runIntegrationTest: api.runIntegrationTest,
    // Founder Logic
    handleJoinFounderProgram,
    // Subscription Logic
    handleSubscribe
  };
};
