import { GoogleGenAI } from "@google/genai";
import { useState } from 'react';

// تعريف المفتاح بطريقة ذكية تقبل كل الاحتمالات
const apiKey = import.meta.env.VITE_API_KEY || process.env.VITE_API_KEY || process.env.API_KEY || '';

// إنشاء العميل
const ai = new GoogleGenAI({ apiKey });

export const useGenAI = () => {
    const [isGenerating, setIsGenerating] = useState(false);

    /**
     * Analyzes an image using the Gemini 2.5 Flash model.
     * @param base64Image Raw base64 string of the image (without data:image/jpeg;base64, prefix)
     * @param prompt Contextual prompt for the AI
     */
    const analyzeImage = async (base64Image: string, prompt: string) => {
        if (!apiKey) {
            console.error("GenAI Error: API Key is missing.");
            return null;
        }

        setIsGenerating(true);
        try {
            // Updated to gemini-2.5-flash as per guidelines
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [
                        {
                            inlineData: {
                                mimeType: 'image/jpeg',
                                data: base64Image
                            }
                        },
                        { text: prompt }
                    ]
                }
            });
            return response.text;
        } catch (error) {
            console.error("GenAI Analysis Failed:", error);
            return null;
        } finally {
            setIsGenerating(false);
        }
    };

    return { analyzeImage, isGenerating };
};
