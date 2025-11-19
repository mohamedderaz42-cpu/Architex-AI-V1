
import { UserEntity, ProjectEntity, SystemNotification } from "../schemas/entities";

export type ActiveTab = 'scan' | 'design' | 'market' | 'challenges';

export interface UXContext {
    activeTab: ActiveTab;
    user: UserEntity | null;
    projectCount: number;
    hasPendingOrders: boolean;
}

/**
 * The Proactive UX Engine: Analyzes application state to determine the
 * "Next Best Action" for the user, driving engagement via ArchieBot.
 */
export const getProactiveTip = (context: UXContext): string => {
  const { activeTab, user, projectCount, hasPendingOrders } = context;

  // 1. Onboarding / Empty State
  if (!user) return "Welcome! Initialize your blueprint to begin the journey.";
  
  if (projectCount === 0 && activeTab !== 'scan') {
      return "Your portfolio is empty. Head to the Room Scanner to capture your first space!";
  }

  // 2. Context-Specific Tips
  switch (activeTab) {
    case 'scan':
      return "Pro Tip: Ensure the room is well-lit for the most accurate LIDAR measurements.";
    case 'design':
      if (projectCount > 0) {
          return "Tap on a project to view AI-generated variations or mint it as an NFT.";
      }
      return "Start a new project by scanning a room or describing your vision.";
    case 'market':
      if (user.trustScore < 50) {
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
 * Provides the content for the proactive designer marketplace upsell.
 * @returns An object containing the title and body for the upsell modal.
 */
export const getUpsellPrompt = (): { title: string, body: string } => {
    return {
        title: "Need a Professional Touch?",
        body: "Making lots of changes can be tough. Our marketplace connects you with professional human designers who can perfect your vision.",
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
