
// Helper module for Pi Network Ads

let lastAdTime = 0;
const AD_COOLDOWN = 120000; // 2 minutes cooldown between interstitials

export const isAdReady = () => {
    return Date.now() - lastAdTime > AD_COOLDOWN;
};

export const showInterstitial = async (): Promise<boolean> => {
    // Don't show if cooldown active
    if (!isAdReady()) {
        return false;
    }

    console.log("[Ads] Requesting Interstitial...");

    // Check if Pi SDK is available and has Ads
    if (window.Pi && window.Pi.Ads) {
        try {
            // Determine if ad is ready to display (Pi SDK specific flow usually involves request -> show)
            // For simplicity in this implementation wrapper, we try to show directly or assume preloading
            const adId = "interstitial_test"; // Replace with actual placement ID if needed
            
            // Note: The V2 SDK flow might vary, this is a standard implementation pattern
            await window.Pi.Ads.showAd(adId);
            
            lastAdTime = Date.now();
            console.log("[Ads] Ad Displayed Successfully.");
            return true;
        } catch (e) {
            console.warn("[Ads] Failed to load or show ad:", e);
            return false;
        }
    } else {
        // Simulation Mode for Dev / Browser
        console.log("[Ads] Simulation: Showing Ad Overlay...");
        lastAdTime = Date.now();
        return new Promise(resolve => {
            // Simulate user watching ad
            setTimeout(() => {
                console.log("[Ads] Simulation: Ad Finished.");
                resolve(true);
            }, 1500);
        });
    }
};

export const showRewarded = async (): Promise<boolean> => {
    console.log("[Ads] Requesting Rewarded Ad...");
    if (window.Pi && window.Pi.Ads) {
        try {
             await window.Pi.Ads.showAd("rewarded_video_test");
             return true;
        } catch (e) {
            console.error("[Ads] Rewarded Ad Failed:", e);
            return false;
        }
    }
    // Simulation
    return new Promise(resolve => setTimeout(() => resolve(true), 2000));
};
