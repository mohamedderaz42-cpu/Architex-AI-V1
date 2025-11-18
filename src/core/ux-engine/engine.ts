
export type ActiveTab = 'scan' | 'design' | 'market' | 'challenges';

/**
 * Provides proactive tips based on the current application state.
 * @param activeTab The currently active tab in the dashboard.
 * @returns A string containing a helpful, context-aware tip for the user.
 */
export const getProactiveTip = (activeTab: ActiveTab): string => {
  switch (activeTab) {
    case 'scan':
      return "Point your device at the center of the room and slowly pan around to capture the entire space.";
    case 'design':
      return "Tap on a project to enter the AI design studio and start visualizing styles.";
    case 'market':
      return "Filter materials by their eco-rating to find the most sustainable options for your project.";
    case 'challenges':
      return "Submit your best designs to challenges to earn rewards and build your reputation in the community.";
    default:
      return "Welcome to Architex. Let's build the future.";
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
 */
export const guidedScanInstructions: string[] = [
    "Initializing SLAM system...",
    "Point your camera at the floor.",
    "Slowly pan up towards the walls.",
    "Scan the perimeter of the room.",
    "Now, capture the ceiling details.",
    "Scan complete. Analyzing point cloud data...",
];
