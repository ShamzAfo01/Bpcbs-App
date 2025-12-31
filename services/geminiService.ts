
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getCafeMoodDescription(gameState: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Describe the atmosphere of a cozy, rain-drenched corner cafe where a developer is working. 
      The current game state is: ${gameState}. 
      Keep it short, poetic, and immersive (max 2 sentences).`,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });
    return response.text || "Rain taps against the glass as the smell of roasted beans fills the air.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The rain continues its rhythmic dance on the window pane.";
  }
}
