
export interface ProjectFile {
  id: string; // Unique ID for React keys, e.g., path
  path: string; // Relative path within the project
  name: string;
  type: 'file' | 'directory';
  mimeType?: string; // For files, especially images
  content?: string; // Text content for preview
  base64Content?: string; // For sending images/files to AI
  size: number;
  children?: ProjectFile[];
  aiSummary?: string; // AI-generated summary or description
  qrDecodedValue?: string; // For QR codes
  userDefinedType?: string; // User-defined classification
  tags?: string[]; // User-defined tags
  relationships?: string; // User-defined relationship notes
  aiClassification?: string; // AI-suggested classification (future use)
}

export interface SAtDData {
  projectName: string;
  overview: string;
  fileStructure: ProjectFile[];
  prompts: string;
  sessionSummary: string;
  modules: string;
}

// Gemini related types
export enum GeminiModel {
  GEMINI_FLASH = 'gemini-2.5-flash-preview-04-17',
  IMAGEN = 'imagen-3.0-generate-002'
}

// Types for sAtddef.yaml
export interface SAtDDefFileEntry {
  path: string;
  type: 'file' | 'directory';
  originalMimeType?: string;
  userDefinedType?: string;
  aiClassification?: string;
  tags?: string[];
  size: number;
  aiSummary?: string;
  qrDecodedValue?: string;
  relationships?: string;
}

export interface SAtDDefSettings {
  informationIntegrationDegree: 0 | 1 | 2; // 0: Basic, 1: Standard, 2: Deep
  aiModelUsed?: string; // e.g., "gemini-2.5-flash-preview-04-17"
  // Placeholders for local LLM settings
  localLlmEnabled?: boolean;
  localLlmEndpoint?: string;
  localLlmModelType?: string; // e.g., "Ollama", "LMStudio"
}

export interface SAtDDefYAML {
  sAtdVersion: string;
  projectName: string;
  generationDate: string;
  settings: SAtDDefSettings;
  projectOverview: string;
  fileManifest: SAtDDefFileEntry[];
}

export const FileClassifications = [
  "Unclassified", "Code", "Text Document", "Image", "Video", "Audio", 
  "Configuration", "Dataset", "Archive", "Executable", "Spreadsheet", 
  "Presentation", "Character Sheet", "Scenario Script", "UI Mockup", 
  "System Diagram", "Prompt Definition", "Knowledge Base", "Other"
];