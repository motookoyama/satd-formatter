
import React, { useState, useCallback, useEffect } from 'react';
import { ProjectFile, SAtDData, SAtDDefSettings, SAtDDefYAML, SAtDDefFileEntry, GeminiModel } from './types';
import DirectorySelector from './components/DirectorySelector';
import FileTreeDisplay from './components/FileTreeDisplay';
import FileDetailView from './components/FileDetailView';
import EditableField from './components/EditableField';
import SettingsModal from './components/SettingsModal'; // New component
import { processSelectedFiles } from './services/fileUtils';
import { analyzeFileContent } from './services/geminiService';
import { generateSAtDContent } from './services/sAtdFormatter';
import { generateSAtDDefYamlContent } from './services/yamlGenerator'; // New service
import { Download, Settings as SettingsIcon, FileCode as AppIcon, AlertTriangle, X } from 'lucide-react';
import JSZip from 'jszip';

const App: React.FC = () => {
  const [sAtDData, setSAtDData] = useState<SAtDData>({
    projectName: 'UntitledProject',
    overview: '',
    fileStructure: [],
    prompts: '',
    sessionSummary: '',
    modules: '',
  });
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [openDirectories, setOpenDirectories] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [appSettings, setAppSettings] = useState<SAtDDefSettings>({
    informationIntegrationDegree: 0, // Default to Basic
    aiModelUsed: GeminiModel.GEMINI_FLASH,
    localLlmEnabled: false,
    localLlmEndpoint: '',
    localLlmModelType: 'Ollama'
  });

  const apiKey = process.env.API_KEY;
  useEffect(() => {
    if (!apiKey) {
      setError("Gemini API Key (process.env.API_KEY) is not set. AI features will not work.");
    }
  }, [apiKey]);


  const handleDirectorySelected = useCallback(async (fileList: FileList, directoryName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { rootName, files } = await processSelectedFiles(fileList);
      setSAtDData(prev => ({
        ...prev,
        projectName: rootName || directoryName,
        fileStructure: files,
        overview: '',
        prompts: '',
        sessionSummary: '',
        modules: ''
      }));
      setSelectedFile(null);
      setOpenDirectories(new Set()); 
      const newOpenDirs = new Set<string>();
      files.forEach(file => {
        if (file.type === 'directory') newOpenDirs.add(file.path);
      });
      setOpenDirectories(newOpenDirs);

    } catch (err: any) {
      console.error("Error processing directory:", err);
      setError(`Failed to process directory: ${err.message}`);
      setSAtDData(prev => ({ ...prev, fileStructure: [] }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFileSelect = useCallback((file: ProjectFile) => {
    setSelectedFile(file);
  }, []);
  
  const handleUpdateSelectedFileDetails = useCallback((updatedFile: ProjectFile) => {
    setSelectedFile(updatedFile); // Keep the detailed view synced

    const updateInTree = (files: ProjectFile[], targetPath: string): ProjectFile[] => {
        return files.map(f => {
            if (f.path === targetPath) {
                return { ...f, ...updatedFile }; // Merge changes
            }
            if (f.children) {
                return { ...f, children: updateInTree(f.children, targetPath) };
            }
            return f;
        });
    };
    setSAtDData(prev => ({
        ...prev,
        fileStructure: updateInTree(prev.fileStructure, updatedFile.path),
    }));
  }, []);


  const handleToggleDirectory = useCallback((path: string) => {
    setOpenDirectories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  }, []);

  const handleAnalyzeFile = useCallback(async (fileToAnalyze: ProjectFile) => {
    if (!fileToAnalyze || (!fileToAnalyze.base64Content && !fileToAnalyze.content)) {
        setError("File content not available for analysis.");
        return;
    }
    if (!apiKey && !appSettings.localLlmEnabled) { // Check for local LLM eventually
      setError("Gemini API Key is missing, and local LLM is not configured. Cannot analyze file.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      // TODO: Add logic to use local LLM if appSettings.localLlmEnabled is true
      const contentToAnalyze = fileToAnalyze.base64Content || fileToAnalyze.content || "";
      const isText = !!fileToAnalyze.content && !fileToAnalyze.base64Content;
      const summary = await analyzeFileContent(contentToAnalyze, fileToAnalyze.mimeType || 'application/octet-stream', fileToAnalyze.name, isText);
      
      const updatedFile = { ...fileToAnalyze, aiSummary: summary };
      handleUpdateSelectedFileDetails(updatedFile); // This will update both selectedFile and fileStructure

    } catch (err: any) {
      console.error("Error analyzing file:", err);
      setError(`Failed to analyze file: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  }, [apiKey, appSettings, handleUpdateSelectedFileDetails]);

  const handleGenerateSAtD = async () => {
    if (sAtDData.fileStructure.length === 0 && !sAtDData.overview) {
      setError("Please select a project folder and provide some information before generating the .sAtd package.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const mainSAtDContent = generateSAtDContent(sAtDData);
      
      const fileManifest: SAtDDefFileEntry[] = [];
      const mapProjectFilesToManifest = (files: ProjectFile[]) => {
          files.forEach(pf => {
              fileManifest.push({
                  path: pf.path,
                  type: pf.type,
                  originalMimeType: pf.mimeType,
                  userDefinedType: pf.userDefinedType || (pf.type === 'directory' ? 'Directory' : 'Unclassified'),
                  aiClassification: pf.aiClassification,
                  tags: pf.tags,
                  size: pf.size,
                  aiSummary: pf.aiSummary,
                  qrDecodedValue: pf.qrDecodedValue,
                  relationships: pf.relationships,
              });
              if (pf.children) {
                  mapProjectFilesToManifest(pf.children);
              }
          });
      };
      mapProjectFilesToManifest(sAtDData.fileStructure);

      const sAtdDefData: SAtDDefYAML = {
        sAtdVersion: "2.0",
        projectName: sAtDData.projectName,
        generationDate: new Date().toISOString(),
        settings: {
            ...appSettings,
            aiModelUsed: apiKey ? (appSettings.localLlmEnabled ? `Local: ${appSettings.localLlmModelType}` : GeminiModel.GEMINI_FLASH) : (appSettings.localLlmEnabled ? `Local: ${appSettings.localLlmModelType}` : 'N/A - API Key Missing')
        } ,
        projectOverview: sAtDData.overview,
        fileManifest: fileManifest,
      };
      const sAtdDefYamlContent = generateSAtDDefYamlContent(sAtdDefData);

      const zip = new JSZip();
      zip.file(`${sAtDData.projectName || 'project'}.sAtd`, mainSAtDContent);
      zip.file('sAtddef.yaml', sAtdDefYamlContent);

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sAtDData.projectName || 'project'}.sAtd.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (err: any) {
        console.error("Error generating .sAtd package:", err);
        setError(`Failed to generate .sAtd package: ${err.message}`);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleInputChange = (field: keyof SAtDData, value: string) => {
    setSAtDData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-neutral-100 p-4 md:p-8">
      <header className="mb-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center mb-2">
                <AppIcon size={40} className="text-primary mr-3" />
                <h1 className="text-4xl font-bold text-neutral-800">.sAtd Formatter <span className="text-primary text-2xl align-super text-[60%]">v2.0</span></h1>
            </div>
            <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2 text-neutral-600 hover:text-primary transition-colors"
                aria-label="Open Settings"
            >
                <SettingsIcon size={28} />
            </button>
        </div>
        <p className="text-neutral-600 max-w-2xl">
          Analyze your project, add context, and generate a comprehensive ".sAtd" knowledge package (including sAtddef.yaml).
        </p>
      </header>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md flex items-center text-sm">
          <AlertTriangle size={18} className="mr-2 flex-shrink-0"/>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto p-1 text-red-700 hover:bg-red-200 rounded-full">
            <X size={16}/>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <DirectorySelector onDirectorySelected={handleDirectorySelected} isLoading={isLoading} />
          
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-neutral-700 mb-4 border-b pb-2">Project Details</h2>
            <EditableField
              label="Project Name"
              value={sAtDData.projectName}
              onChange={(val) => handleInputChange('projectName', val)}
              placeholder="Enter project name"
              disabled={isLoading}
              rows={1}
            />
            <EditableField
              label="Overview / Description"
              value={sAtDData.overview}
              onChange={(val) => handleInputChange('overview', val)}
              placeholder="Briefly describe the project, its purpose, and key technologies used."
              rows={5}
              disabled={isLoading}
            />
            <EditableField
              label="Prompts Section (for .sAtd text file)"
              value={sAtDData.prompts}
              onChange={(val) => handleInputChange('prompts', val)}
              placeholder="System prompts, important user prompts, or instructions for AI."
              rows={3}
              disabled={isLoading}
            />
            <EditableField
              label="Session Summary / Change Log (for .sAtd text file)"
              value={sAtDData.sessionSummary}
              onChange={(val) => handleInputChange('sessionSummary', val)}
              placeholder="Key development sessions, changes made, or a brief version history."
              rows={3}
              disabled={isLoading}
            />
             <EditableField
              label="Modules / Libraries (Manual Entry - for .sAtd text file)"
              value={sAtDData.modules}
              onChange={(val) => handleInputChange('modules', val)}
              placeholder="List other important modules or libraries not in package.json, or add notes."
              rows={3}
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleGenerateSAtD}
            disabled={isLoading || sAtDData.fileStructure.length === 0}
            className="w-full flex items-center justify-center px-6 py-3 bg-secondary text-white font-bold text-lg rounded-lg shadow-md hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={22} className="mr-2" /> Generate .sAtd Package (.zip)
          </button>
        </div>

        <div className="md:col-span-2 grid grid-rows-[auto,1fr] md:grid-rows-1 md:grid-cols-2 gap-6 max-h-[calc(100vh-12rem)] md:max-h-[calc(100vh-10rem)]">
            <div className="min-h-[300px] md:min-h-0">
                 <FileTreeDisplay
                    files={sAtDData.fileStructure}
                    selectedFile={selectedFile}
                    onFileSelect={handleFileSelect}
                    openDirectories={openDirectories}
                    onToggleDirectory={handleToggleDirectory}
                  />
            </div>
            <div className="min-h-[300px] md:min-h-0">
                <FileDetailView
                    file={selectedFile}
                    onAnalyzeFile={handleAnalyzeFile}
                    isAnalyzing={isAnalyzing}
                    onUpdateFileDetails={handleUpdateSelectedFileDetails}
                  />
            </div>
        </div>
      </div>
       <footer className="text-center mt-12 py-4 text-neutral-500 text-sm">
        <p>&copy; {new Date().getFullYear()} .sAtd Formatter. AI-powered knowledge transfer. v2.0</p>
      </footer>
      {showSettingsModal && (
        <SettingsModal
          settings={appSettings}
          onSave={(newSettings) => {
            setAppSettings(newSettings);
            setShowSettingsModal(false);
          }}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
};

export default App;