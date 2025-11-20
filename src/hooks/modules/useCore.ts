
import { useState, useEffect, useMemo } from 'react';
import { UserEntity, TokenEntity, ServiceProviderProfile, ArbitratorProfile } from '../../core/schemas/entities';
import * as api from '../../core/api/contract';
import { getProactiveTip, UXContext } from '../../core/ux-engine/engine';

export type Phase = 'intro' | 'onboarding' | 'dashboard';
export type ActiveTab = 'scan' | 'design' | 'market' | 'challenges' | 'explore';

export const useCore = (addToast: (msg: string, type?: 'success' | 'error' | 'info') => void) => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [activeTab, setActiveTab] = useState<ActiveTab>('design');
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<UserEntity | null>(null);
  const [userTokens, setUserTokens] = useState<TokenEntity[]>(api.mockUserTokens);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  
  // Admin & Chat State
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [showProviderOnboarding, setShowProviderOnboarding] = useState(false);
  const [showArbitratorOnboarding, setShowArbitratorOnboarding] = useState(false);
  const [showEnterprisePortal, setShowEnterprisePortal] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const initialize = async () => {
    setPhase('onboarding');
    setIsLoading(true);
    const userData = await api.authenticateWithPi();
    setUser(userData);
    setIsLoading(false);
  };

  const completeOnboarding = () => setPhase('dashboard');
  const toggleProfile = () => setIsProfileVisible(prev => !prev);

  // Wallet & Subscription
  const handleClaimVestedTokens = async () => {
      addToast("Tokens claimed to wallet", "success");
  };
  
  const handleSubscribe = () => {
      if(user) setUser({ ...user, subscriptionTier: 'Accelerator', subscriptionExpiry: new Date(Date.now() + 30*24*60*60*1000).toISOString() });
      addToast("Subscribed to Accelerator Tier", "success");
  };
  
  const handleJoinFounderProgram = async () => {
      await api.joinFounderProgram();
      const updatedUser = await api.authenticateWithPi(); // Refresh user
      setUser(updatedUser);
      addToast("Welcome to the Founder Program!", "success");
  };

  // Onboarding Handlers
  const handleProviderRegistration = async (profile: ServiceProviderProfile) => {
      if(user) setUser({ ...user, serviceProviderProfile: profile, role: 'service-provider' });
      addToast("Application submitted", "success");
  };
  
  const handleArbitratorRegistration = async (profile: ArbitratorProfile) => {
      if(user) setUser({ ...user, arbitratorProfile: profile });
      addToast("Arbitrator application submitted", "success");
  };

  // Admin
  const openAdminModal = () => setIsAdminModalOpen(true);
  const closeAdminModal = () => setIsAdminModalOpen(false);
  
  // Enterprise
  const openEnterprisePortal = () => setShowEnterprisePortal(true);
  const closeEnterprisePortal = () => setShowEnterprisePortal(false);

  return {
    phase, setPhase,
    activeTab, setActiveTab,
    isMounted,
    user, setUser,
    userTokens,
    isLoading, setIsLoading,
    isProfileVisible, toggleProfile,
    initialize, completeOnboarding,
    handleClaimVestedTokens, handleSubscribe, handleJoinFounderProgram,
    showProviderOnboarding, setShowProviderOnboarding, handleProviderRegistration,
    showArbitratorOnboarding, setShowArbitratorOnboarding, handleArbitratorRegistration,
    isAdminModalOpen, openAdminModal, closeAdminModal,
    showEnterprisePortal, openEnterprisePortal, closeEnterprisePortal
  };
};
