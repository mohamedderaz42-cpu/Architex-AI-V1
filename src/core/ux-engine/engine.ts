
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
    walletBalance?: number;
    isOnline?: boolean;
}

interface Insight {
    message: string;
    type: 'critical' | 'warning' | 'opportunity' | 'guide';
    weight: number;
    action?: string;
}

/**
 * The Proactive User Experience Engine.
 * Uses a weighted priority queue to determine the single most important
 * piece of information or guidance to display to the user.
 */
export const getProactiveTip = (context: UXContext): string => {
  const insights: Insight[] = [];
  const { activeTab, user, projectCount, currentProjectModificationCount, pendingReviews, hasUnverifiedInstallation } = context;

  // --- 1. CRITICAL BLOCKERS (Weight 100+) ---
  if (!user) {
      insights.push({
          message: "Welcome to Architex. Initialize your blockchain identity to begin.",
          type: 'critical',
          weight: 100
      });
  }

  if (hasUnverifiedInstallation) {
      insights.push({
          message: "Action Required: Verify your recent installation upload to claim your 2% cashback reward.",
          type: 'critical',
          weight: 90
      });
  }

  // --- 2. REPUTATION & GROWTH (Weight 70-90) ---
  if (pendingReviews > 0) {
      insights.push({
          message: `You have ${pendingReviews} pending reviews. Rate your provider to increase your own Trust Score.`,
          type: 'warning',
          weight: 80
      });
  }
  
  if (user && user.trustScore < 50 && activeTab === 'market') {
      insights.push({
          message: "Your Trust Score is low. Complete verification or successful bounties to unlock lower fees.",
          type: 'warning',
          weight: 75
      });
  }

  // --- 3. WORKFLOW OPTIMIZATION (Weight 50-70) ---
  // AUDIT FIX: Threshold lowered to 2 to trigger upsell earlier in the funnel.
  if (activeTab === 'design' && currentProjectModificationCount && currentProjectModificationCount >= 2) {
      insights.push({
          message: "Stuck on the details? You can hire a professional designer from the marketplace to finalize this blueprint.",
          type: 'opportunity',
          weight: 60
      });
  }

  // --- 4. CONTEXTUAL GUIDANCE (Weight 10-50) ---
  if (activeTab === 'scan') {
      insights.push({ message: "Pro Tip: Slow, steady pans allow the LIDAR to capture cleaner point clouds.", type: 'guide', weight: 30 });
  }

  if (activeTab === 'design' && projectCount === 0) {
      insights.push({ message: "Your studio is empty. Start by scanning a room or using the 'New Project' wizard.", type: 'guide', weight: 40 });
  }

  if (activeTab === 'market' && user?.role === 'vendor') {
      insights.push({ message: "Check the 'Promotions' tab to boost visibility for your slow-moving inventory.", type: 'opportunity', weight: 45 });
  }
  
  if (activeTab === 'challenges') {
      insights.push({ message: "Winning challenges grants significant voting power in the Architex DAO.", type: 'guide', weight: 20 });
  }

  // Fallback
  insights.push({ message: "Architex is online. Ready to build.", type: 'guide', weight: 0 });

  // Sort by weight descending
  insights.sort((a, b) => b.weight - a.weight);

  return insights[0].message;
};

// AUDIT FIX: Helper function alignment - Ensuring consistency with the main logic
export const shouldTriggerDesignerUpsell = (modificationCount: number): boolean => {
    return modificationCount >= 2;
};

export const getUpsellPrompt = (): { title: string, body: string } => {
    return {
        title: "Need Expert Help?",
        body: "You've iterated on this design several times. Our marketplace has certified architects who can turn this concept into a buildable plan.",
    };
};

export const guidedScanInstructions: string[] = [
    "Initializing Lidar...",
    "Scan floor area.",
    "Pan up to walls.",
    "Capture corners.",
    "Scan ceiling.",
    "Processing cloud.",
];
