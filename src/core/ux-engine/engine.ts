
import { UserEntity } from "../schemas/entities";

export type ActiveTab = 'scan' | 'design' | 'market' | 'challenges' | 'explore';

export interface UXContext {
    activeTab: ActiveTab;
    user: UserEntity | null;
    projectCount: number;
    hasPendingOrders: boolean;
    currentProjectModificationCount?: number;
    pendingReviews: number; 
    hasUnverifiedInstallation: boolean;
}

/**
 * The Proactive UX Engine: Analyzes application state to determine the
 * "Next Best Action" for the user, driving engagement via ArchieBot.
 */
export const getProactiveTip = (context: UXContext): string => {
  const { activeTab, user, projectCount, hasPendingOrders, currentProjectModificationCount, pendingReviews, hasUnverifiedInstallation } = context;

  // 1. Onboarding / Empty State
  if (!user) return "Welcome! Initialize your blueprint to begin the journey.";
  
  if (projectCount === 0 && activeTab !== 'scan') {
      return "Your portfolio is empty. Head to the Room Scanner to capture your first space!";
  }
  
  // 2. Reward & Reputation Rules (High Priority)
  if (hasUnverifiedInstallation) {
      return "Reward Alert: You have a delivered order. Upload a photo of the installation to verify and claim your cashback reward!";
  }

  if (pendingReviews > 0) {
      return `You have ${pendingReviews} completed service(s) awaiting feedback. Rate your provider to boost your own Trust Score!`;
  }

  // 3. Proactive Upsell Rule (Tip Fallback)
  if (currentProjectModificationCount && currentProjectModificationCount >= 2) {
      return "You've iterated on this design multiple times. Our professional designers can help finalize your vision.";
  }

  // 4. Context-Specific Tips
  switch (activeTab) {
    case 'scan':
      return "Pro Tip: Ensure the room is well-lit for the most accurate LIDAR measurements.";
    case 'design':
      if (projectCount > 0) {
          return "Tap on a project to view AI-generated variations or mint it as an NFT.";
      }
      return "Start a new project by scanning a room or describing your vision.";
    case 'market':
      if (user && user.trustScore < 50) {
          return "Complete bounties to raise your Trust Score and unlock lower platform fees.";
      }
      if (hasPendingOrders) {
          return "You have items on the way. Don't forget to request an installation quote!";
      }
      return "Filter materials by 'Eco-Rating' to find sustainable options that earn you ARCHI rewards.";
    case 'challenges':
      return "Winning a design challenge grants significant voting power in the DAO.";
    default:
      return "Architex is ready. What will you build today?";
  }
};

/**
 * Logic Rule: Triggers when a user struggles or iterates frequently on a single design.
 * @param modificationCount The number of times the current project has been modified/regenerated.
 */
export const shouldTriggerDesignerUpsell = (modificationCount: number): boolean => {
    return modificationCount >= 2;
};

/**
 * Provides the content for the proactive designer marketplace upsell.
 * @returns An object containing the title and body for the upsell modal.
 */
export const getUpsellPrompt = (): { title: string, body: string } => {
    return {
        title: "Need a Professional Touch?",
        body: "We noticed you're refining your design. Our marketplace connects you with professional human architects who can perfect your vision.",
    };
};

/**
 * A sequence of instructions for the Guided Scanning feature.
 * Optimized for audio duration.
 */
export const guidedScanInstructions: string[] = [
    "Initializing Scanner.",
    "Scan floor area.",
    "Pan up to walls.",
    "Capture perimeter.",
    "Scan ceiling now.",
    "Processing Cloud.",
];
