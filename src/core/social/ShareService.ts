
import { ProjectEntity } from '../schemas/entities';

export const ShareService = {
    /**
     * Captures the current 3D canvas state and triggers the native share dialog.
     * @param canvas The HTMLCanvasElement from the 3D scene.
     * @param project The project entity being shared.
     */
    captureAndShare: async (canvas: HTMLCanvasElement, project: ProjectEntity) => {
        try {
            // 1. Capture High-Quality Image
            const dataUrl = canvas.toDataURL('image/png', 1.0);
            const blob = await (await fetch(dataUrl)).blob();
            
            // 2. Create File Object
            const file = new File([blob], `architex_${project.id}.png`, { type: 'image/png' });

            // 3. Prepare Share Data
            const shareData = {
                title: `Architex Design: ${project.name}`,
                text: `Check out my sustainable design "${project.name}" created on Architex! 🌿✨ #PiNetwork #Architex #Web3Design`,
                url: `https://architex.app/view/${project.id}`, // Deep link
                files: [file]
            };

            // 4. Trigger Native Share (Mobile/Pi Browser)
            if (navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
                return { success: true, message: 'Shared successfully via native dialog' };
            } else {
                // Fallback for Desktop: Copy Link & Download Image
                await navigator.clipboard.writeText(shareData.url);
                
                // Trigger Download
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `architex_${project.name.replace(/\s+/g, '_')}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                return { success: true, message: 'Link copied & Image downloaded' };
            }
        } catch (error) {
            console.error("Share failed:", error);
            return { success: false, message: 'Sharing failed. Please try again.' };
        }
    }
};
