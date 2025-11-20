
import { useState, useEffect, useRef } from 'react';
import { BountyEntity, OrderEntity, ProductEntity, UserEntity, ServiceAgreementEntity, ArbitratorEntity } from '../../core/schemas/entities';
import * as api from '../../core/api/contract';
import { useAppStore } from '../../store/useAppStore';

export const useMarketplace = (
    user: UserEntity | null,
    selectedProject: any,
    setActiveTab: (tab: any) => void,
    addToast: (msg: string, type?: 'success' | 'error' | 'info') => void
) => {
    // Use Global Store for Cart
    const { cart, addToCart, removeFromCart, updateCartItem, clearCart } = useAppStore();

    // Data
    const [bounties, setBounties] = useState<BountyEntity[]>([]);
    const [orders, setOrders] = useState<OrderEntity[]>([]);
    const [products, setProducts] = useState<ProductEntity[]>([]);
    const [serviceProviders, setServiceProviders] = useState<UserEntity[]>([]);
    const [serviceAgreements, setServiceAgreements] = useState<ServiceAgreementEntity[]>([]);
    const [arbitrators, setArbitrators] = useState<ArbitratorEntity[]>([]);
    const [availableArbitrators, setAvailableArbitrators] = useState<ArbitratorEntity[]>([]);

    // Bounty Modals
    const [showUpsellModal, setShowUpsellModal] = useState(false);
    const [showCreateBountyModal, setShowCreateBountyModal] = useState(false);
    const [selectedBounty, setSelectedBounty] = useState<BountyEntity | null>(null);
    const [showDisputeResolutionModal, setShowDisputeResolutionModal] = useState(false);
    const [showAgreementModal, setShowAgreementModal] = useState(false);
    const [agreementText, setAgreementText] = useState<string | null>(null);
    const bountyToFundRef = useRef<BountyEntity | null>(null);
    
    // E-Commerce Modals
    const [showInstallationUpsellModal, setShowInstallationUpsellModal] = useState(false);
    const [orderForUpsell, setOrderForUpsell] = useState<OrderEntity | null>(null);
    const [showShoppingCartModal, setShowShoppingCartModal] = useState(false);
    const [showVendorProfileModal, setShowVendorProfileModal] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<UserEntity | null>(null);
    
    // Service Modals
    const [showServiceAgreementModal, setShowServiceAgreementModal] = useState(false);
    const [activeServiceAgreement, setActiveServiceAgreement] = useState<ServiceAgreementEntity | null>(null);
    const [showUserLegalShieldModal, setShowUserLegalShieldModal] = useState(false);
    const [showProofOfInstallationModal, setShowProofOfInstallationModal] = useState(false);
    const [orderForProof, setOrderForProof] = useState<OrderEntity | null>(null);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [userToRate, setUserToRate] = useState<string | null>(null);

    const fetchMarketData = async () => {
        const [bountiesData, arbitratorsData, ordersData, providersData, agreementsData, productsData] = await Promise.all([
            api.listBounties(), api.listArbitrators(), api.listOrders(), api.listServiceProviders(), api.listServiceAgreements(), api.listVendorProducts()
        ]);
        setBounties(bountiesData);
        setArbitrators(arbitratorsData);
        setOrders(ordersData);
        setServiceProviders(providersData);
        setServiceAgreements(agreementsData);
        setProducts(productsData);
    };

    // Upsell Logic
    useEffect(() => {
        const shippedOrderWithInstallable = orders.find(o => o.status === 'Shipped' && o.items.some(i => i.productId === 'prod_01' || i.productId === 'prod_02'));
        if (shippedOrderWithInstallable && !orderForUpsell) {
          setOrderForUpsell(shippedOrderWithInstallable);
          setShowInstallationUpsellModal(true);
        }
    }, [orders, orderForUpsell]);

    const closeUpsellModal = () => setShowUpsellModal(false);
    const openCreateBountyModal = () => setShowCreateBountyModal(true);
    const closeCreateBountyModal = () => setShowCreateBountyModal(false);

    const handleCreateBounty = async (bountyDetails: Omit<BountyEntity, 'id' | 'createdAt' | 'status' | 'escrowState'>) => { 
        await api.createBounty(bountyDetails); 
        const updatedBounties = await api.listBounties(); 
        setBounties(updatedBounties); 
        addToast("Bounty created!", "success"); 
    };

    const handleSelectBounty = async (bounty: BountyEntity) => { 
        const available = await api.listAvailableArbitrators(bounty.projectId); 
        setAvailableArbitrators(available); 
        setSelectedBounty(bounty); 
    };
    const closeBountyDetailsModal = () => setSelectedBounty(null);

    const handleInitiateFunding = async (bounty: BountyEntity) => { 
        bountyToFundRef.current = bounty; 
        const text = await api.getDynamicAgreementText(bounty); 
        setAgreementText(text); 
        setShowAgreementModal(true); 
    };

    const handleConfirmFunding = async () => { 
        if (!bountyToFundRef.current) return; 
        const updatedBounty = await api.fundEscrow(bountyToFundRef.current.id); 
        setBounties(prev => prev.map(b => b.id === updatedBounty.id ? updatedBounty : b)); 
        setSelectedBounty(updatedBounty); 
        setShowAgreementModal(false); 
        setAgreementText(null); 
        bountyToFundRef.current = null; 
        addToast("Escrow funded.", "success"); 
    };
    const closeAgreementModal = () => { setShowAgreementModal(false); setAgreementText(null); bountyToFundRef.current = null; };

    const handleReleaseFunds = async (bounty: BountyEntity) => { 
        const updatedBounty = await api.releaseEscrow(bounty.id); 
        setBounties(prev => prev.map(b => b.id === updatedBounty.id ? updatedBounty : b)); 
        setSelectedBounty(updatedBounty); 
        if (updatedBounty.winnerId) { setUserToRate(updatedBounty.winnerId); setShowRatingModal(true); } 
        addToast("Funds released.", "success"); 
    };

    const handleRaiseDispute = (bounty: BountyEntity) => { setSelectedBounty(bounty); setShowDisputeResolutionModal(true); };
    const handleConfirmDispute = async (bounty: BountyEntity) => { 
        const updatedBounty = await api.raiseDispute(bounty.id); 
        setBounties(prev => prev.map(b => b.id === updatedBounty.id ? updatedBounty : b)); 
        setSelectedBounty(updatedBounty); 
        addToast("Dispute raised. Funds frozen.", "error"); 
    };

    const handleSelectArbitrator = async (bounty: BountyEntity, arbitrator: ArbitratorEntity) => { 
        const updatedBounty = await api.selectArbitrator(bounty.id, arbitrator.id); 
        setBounties(prev => prev.map(b => b.id === updatedBounty.id ? updatedBounty : b)); 
        setSelectedBounty(updatedBounty); 
        addToast("Arbitrator assigned.", "info"); 
    };

    const handleResolveArbitration = async (bounty: BountyEntity, decision: 'Release' | 'Refund') => { 
        const updatedBounty = await api.resolveArbitration(bounty.id, decision); 
        setBounties(prev => prev.map(b => b.id === updatedBounty.id ? updatedBounty : b)); 
        setSelectedBounty(updatedBounty); 
        addToast(`Arbitration resolved: ${decision}`, "info"); 
    };

    // Cart & Orders
    const openShoppingCart = () => setShowShoppingCartModal(true);
    const closeShoppingCart = () => setShowShoppingCartModal(false);
    const handleCheckout = async () => { 
        setShowShoppingCartModal(false); 
        clearCart(); 
        addToast("Order placed successfully!", "success"); 
    };
    const openVendorProfile = (vendorId: string) => {
        const vendor = serviceProviders.find(u => u.id === vendorId) || user;
        if (vendor) { setSelectedVendor(vendor); setShowVendorProfileModal(true); }
    };

    const handleConfirmDelivery = async (orderId: string) => { 
        const updatedOrder = await api.updateOrderStatus(orderId, 'Delivered'); 
        const newOrders = orders.map(o => o.id === orderId ? updatedOrder : o); 
        setOrders(newOrders); 
        if (updatedOrder.proofOfInstallationStatus === 'pending') { setOrderForProof(updatedOrder); setShowProofOfInstallationModal(true); } 
        addToast("Delivery confirmed.", "success"); 
    };
    const handleRequestReturn = async (orderId: string) => { 
        await api.updateOrderStatus(orderId, 'Returned'); 
        const newOrders = await api.listOrders(); 
        setOrders(newOrders); 
        addToast("Return requested.", "info"); 
    };
    const handleMarkAsShipped = async (orderId: string) => { await api.updateOrderStatus(orderId, 'Shipped'); const newOrders = await api.listOrders(); setOrders(newOrders); };
    const handleDisputeReturn = async (orderId: string) => { console.log(`[CONTRACT] Freezing escrow for order ${orderId}.`); };
    const handleSubmitProofOfInstallation = async (orderId: string) => {
        await api.submitProofOfInstallation(orderId, 'mock_photo_data');
        const updatedOrder = await api.verifyProofOfInstallation(orderId);
        setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
        addToast("Proof verified! Cashback sent.", "success");
    };

    // Services
    const handleGetQuotes = () => { setActiveTab('market'); addToast("Requesting quotes from network...", "info"); };
    const handleInitiateHiring = async (provider: UserEntity) => { 
        if (!selectedProject) { addToast("Please select a project first.", "error"); return; } 
        const agreement = await api.createServiceAgreement(user!.id, provider.id, selectedProject.id, 500); 
        setActiveServiceAgreement(agreement); 
        const arbs = await api.listArbitrators(); 
        setAvailableArbitrators(arbs); 
        setShowServiceAgreementModal(true); 
    };
    const handleConfirmServiceHiring = async (validatorId?: string) => { if (!activeServiceAgreement) return; await api.fundServiceEscrow(activeServiceAgreement.id, validatorId); setShowServiceAgreementModal(false); setActiveServiceAgreement(null); addToast("Service hired & Escrow funded", "success"); };
    const handleConfirmServiceCompletion = async (agreement: ServiceAgreementEntity) => { await api.confirmServiceCompletion(agreement.id, 'client'); addToast("Service marked complete", "success"); };

    // Ratings
    const handleSubmitRating = async (rating: number, comment: string) => { 
        if(!userToRate || !user) return; 
        await api.submitRating(userToRate, rating, comment); 
        setUserToRate(null); 
        setShowRatingModal(false); 
        addToast("Rating submitted", "success"); 
    };

    return {
        bounties, setBounties, orders, setOrders, products, setProducts, serviceProviders, setServiceProviders, serviceAgreements, setServiceAgreements, arbitrators, setArbitrators, availableArbitrators, setAvailableArbitrators,
        fetchMarketData,
        showUpsellModal, setShowUpsellModal, closeUpsellModal,
        showCreateBountyModal, openCreateBountyModal, closeCreateBountyModal, handleCreateBounty,
        selectedBounty, setSelectedBounty, handleSelectBounty, closeBountyDetailsModal,
        showAgreementModal, agreementText, handleInitiateFunding, handleConfirmFunding, closeAgreementModal,
        handleReleaseFunds, handleRaiseDispute, showDisputeResolutionModal, setShowDisputeResolutionModal, handleConfirmDispute, handleSelectArbitrator, handleResolveArbitration,
        showInstallationUpsellModal, setShowInstallationUpsellModal, orderForUpsell,
        cart, addToCart, removeFromCart, updateCartItem, openShoppingCart, closeShoppingCart, showShoppingCartModal, handleCheckout,
        openVendorProfile, showVendorProfileModal, selectedVendor, setShowVendorProfileModal,
        handleConfirmDelivery, handleRequestReturn, handleMarkAsShipped, handleDisputeReturn,
        handleGetQuotes, handleInitiateHiring, showServiceAgreementModal, setShowServiceAgreementModal, activeServiceAgreement, handleConfirmServiceHiring, handleConfirmServiceCompletion,
        showUserLegalShieldModal, setShowUserLegalShieldModal,
        showProofOfInstallationModal, setShowProofOfInstallationModal, orderForProof, handleSubmitProofOfInstallation,
        showRatingModal, setShowRatingModal, userToRate, setUserToRate, handleSubmitRating
    };
};
