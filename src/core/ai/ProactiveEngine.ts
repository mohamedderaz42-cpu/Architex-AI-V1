
import { ActiveTab } from '../ux-engine/engine';

type TriggerType = 'hesitation' | 'monetization' | 'upsell' | 'guide';

export interface BotTrigger {
    id: string;
    type: TriggerType;
    message: string;
    actions: {
        label: string;
        actionId: string;
        style?: 'primary' | 'secondary';
    }[];
}

type Listener = (trigger: BotTrigger) => void;
type Navigator = (tab: ActiveTab) => void;

class ProactiveEngineService {
    private static instance: ProactiveEngineService;
    
    // Metrics
    private undoCount = 0;
    private modificationCount = 0;
    private currentProjectValue = 0;
    private lastActionTime = Date.now();
    
    // System
    private listeners: Listener[] = [];
    private navigator: Navigator | null = null;

    private constructor() {}

    public static getInstance(): ProactiveEngineService {
        if (!ProactiveEngineService.instance) {
            ProactiveEngineService.instance = new ProactiveEngineService();
        }
        return ProactiveEngineService.instance;
    }

    public setNavigator(fn: Navigator) {
        this.navigator = fn;
    }

    public subscribe(listener: Listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notify(trigger: BotTrigger) {
        this.listeners.forEach(l => l(trigger));
    }

    public executeAction(actionId: string) {
        console.log(`[ProactiveEngine] Executing action: ${actionId}`);
        switch(actionId) {
            case 'BROWSE_PROS':
                this.navigator?.('market');
                break;
            case 'SHOW_VARIATIONS':
                // In a real app, this would trigger a state change in the Design Studio
                console.log("Triggering AI Variations generation...");
                break;
            case 'INSURE_PROJECT':
                // Trigger insurance modal
                console.log("Opening Insurance Modal...");
                break;
            default:
                break;
        }
    }

    public trackAction(action: 'undo' | 'modify' | 'value_change', payload?: number) {
        this.lastActionTime = Date.now();

        switch(action) {
            case 'undo':
                this.undoCount++;
                this.analyzeBehavior();
                break;
            case 'modify':
                this.modificationCount++;
                this.analyzeBehavior();
                break;
            case 'value_change':
                if (payload) this.currentProjectValue = payload;
                this.analyzeBehavior();
                break;
        }
    }

    private analyzeBehavior() {
        // Rule A: Hesitation (Undo Loop)
        if (this.undoCount > 3) {
            this.notify({
                id: `hesitation_${Date.now()}`,
                type: 'hesitation',
                message: "It seems you are unsure about this specific area. Want to see 3 AI-generated variations?",
                actions: [
                    { label: "Show 3 Variations", actionId: 'SHOW_VARIATIONS', style: 'primary' },
                    { label: "Dismiss", actionId: 'DISMISS', style: 'secondary' }
                ]
            });
            this.undoCount = 0; // Reset to avoid spam
            return;
        }

        // Rule B: Complexity/Monetization (High Modification)
        if (this.modificationCount >= 5) {
            this.notify({
                id: `monetization_${Date.now()}`,
                type: 'monetization',
                message: "This design is getting complex. Would you like to hire a Pro Designer from the marketplace to perfect it?",
                actions: [
                    { label: "Browse Pros", actionId: 'BROWSE_PROS', style: 'primary' },
                    { label: "Keep Designing", actionId: 'DISMISS', style: 'secondary' }
                ]
            });
            this.modificationCount = 0; // Reset
            return;
        }

        // Rule C: Upsell (High Value)
        if (this.currentProjectValue > 5000) {
            // Only trigger once per session roughly
            if (Math.random() > 0.5) return; 
            
            this.notify({
                id: `upsell_${Date.now()}`,
                type: 'upsell',
                message: "High-value project detected ($5,000+). Would you like to purchase design insurance via Smart Contract?",
                actions: [
                    { label: "View Insurance", actionId: 'INSURE_PROJECT', style: 'primary' },
                    { label: "No Thanks", actionId: 'DISMISS', style: 'secondary' }
                ]
            });
            // Reset value trigger threshold implicitly by not resetting value but relying on state logic in a real app
            this.currentProjectValue = 0; // Mock reset
        }
    }
}

export const ProactiveEngine = ProactiveEngineService.getInstance();
