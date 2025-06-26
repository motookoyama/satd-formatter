
import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { GeminiModel } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" });

const MAX_TEXT_INPUT_LENGTH = 100000; // Character limit for text analysis to avoid overly large requests

function truncateText(text: string, maxLength: number): string {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "... (truncated)";
  }
  return text;
}

export async function analyzeFileContent(
  fileContent: string,
  mimeType: string,
  fileName: string,
  isTextFile: boolean
): Promise<string> {
  if (!API_KEY) return "API Key not configured. AI analysis unavailable.";

  try {
    let parts: Part[] = [];
    let promptText = "";

    if (isTextFile) {
      const truncatedContent = truncateText(fileContent, MAX_TEXT_INPUT_LENGTH);
      promptText = `Analyze the following file content from "${fileName}". Provide a concise summary (1-2 sentences) and identify key aspects or purpose. If it's a configuration file (e.g. JSON, YAML), summarize its settings. If it's code, describe its functionality. If it's a Markdown file, summarize its content.\n\nFile Content:\n\`\`\`\n${truncatedContent}\n\`\`\``;
      parts.push({ text: promptText });
    } else { // Assuming it's an image or other binary file needing description
      promptText = `Describe the content of the image file named "${fileName}". If it's a QR code, state that and attempt to decode its content if visually apparent. If it's a diagram, explain what it represents. If it's a user interface screenshot, describe the UI.`;
      parts.push({ text: promptText });
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: fileContent, // Expecting base64 string for images
        },
      });
    }
    
    const model = GeminiModel.GEMINI_FLASH;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
      config: {
        temperature: 0.3,
        topP: 0.9,
        topK: 32,
      }
    });

    return response.text.trim();

  } catch (error: any) {
    console.error("Error analyzing file with Gemini:", error);
    return `Error analyzing file with AI: ${error.message || 'Unknown error'}`;
  }
}

export async function generateImageWithImagen(prompt: string): Promise<string | null> {
  if (!API_KEY) {
    console.warn("API_KEY not configured. Image generation unavailable.");
    return null;
  }
  try {
    const response = await ai.models.generateImages({
        model: GeminiModel.IMAGEN,
        prompt: prompt,
        config: {numberOfImages: 1, outputMimeType: 'image/jpeg'},
    });
    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    return null;
  } catch (error) {
    console.error("Error generating image with Imagen:", error);
    return null;
  }
}
