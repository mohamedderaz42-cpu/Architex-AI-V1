/**
 * Architex Privacy Bridge
 * Connects the React Frontend to the local Python/PySyft Microservice.
 */

const PYTHON_SERVICE_URL = 'http://localhost:8000';

export interface PrivateRoomData {
    dimensions: string;
    imageHash: string;
    ownerId: string;
}

export interface PrivacyProcessResult {
    status: string;
    encryptedModelId: string;
    privacyBudgetUsed: number;
}

/**
 * Checks if the local Python Privacy Node is running.
 */
export const checkPrivacyNodeStatus = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${PYTHON_SERVICE_URL}/`);
        if (response.ok) {
            const data = await response.json();
            return data.syft_ready === true;
        }
        return false;
    } catch (error) {
        console.warn("Privacy Node not detected. Falling back to Cloud AI.");
        return false;
    }
};

/**
 * Sends room data to the local Python node for private processing (Federated Learning).
 * This ensures raw data never leaves the user's device/node.
 */
export const processWithPrivacy = async (data: PrivateRoomData): Promise<PrivacyProcessResult> => {
    try {
        const response = await fetch(`${PYTHON_SERVICE_URL}/process-private`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dimensions: data.dimensions,
                image_hash: data.imageHash,
                owner_id: data.ownerId
            }),
        });

        if (!response.ok) {
            throw new Error('Privacy Node Error');
        }

        const result = await response.json();
        return {
            status: result.status,
            encryptedModelId: result.encrypted_model_id,
            privacyBudgetUsed: result.privacy_budget_used
        };
    } catch (error) {
        console.error("Failed to process privately:", error);
        throw error;
    }
};
