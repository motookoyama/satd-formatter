
import React, { useState, useEffect } from 'react';
import { ProjectFile, FileClassifications } from '../types';
import { Bot, FileText, Image as ImageIcon, AlertCircle, Sparkles, ScanQrCode, Type, Tag, Link2, ChevronDown, ChevronUp } from 'lucide-react';
import { isTextFile, isSupportedImage } from '../services/fileUtils';

interface FileDetailViewProps {
  file: ProjectFile | null;
  onAnalyzeFile: (file: ProjectFile) => void;
  isAnalyzing: boolean;
  onUpdateFileDetails: (updatedFile: ProjectFile) => void;
}

const FileDetailView: React.FC<FileDetailViewProps> = ({ file, onAnalyzeFile, isAnalyzing, onUpdateFileDetails }) => {
  const [localFile, setLocalFile] = useState<ProjectFile | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tagsInput, setTagsInput] = useState('');


  useEffect(() => {
    setLocalFile(file ? { ...file } : null);
    if (file) {
      setTagsInput(file.tags?.join(', ') || '');
      setShowAdvanced(!!(file.userDefinedType && file.userDefinedType !== 'Unclassified' || file.tags?.length || file.relationships));
    } else {
      setShowAdvanced(false);
    }
  }, [file]);

  const handleDetailChange = (field: keyof ProjectFile, value: any) => {
    if (localFile) {
      const updatedFile = { ...localFile, [field]: value };
      setLocalFile(updatedFile);
      onUpdateFileDetails(updatedFile);
    }
  };
  
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTagsInput = e.target.value;
    setTagsInput(newTagsInput);
    const tagsArray = newTagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    handleDetailChange('tags', tagsArray);
  };


  if (!localFile) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md h-full flex flex-col items-center justify-center text-neutral-500">
        <FileText size={48} className="mb-4 text-neutral-400" />
        <p>Select a file or folder from the tree to see details.</p>
      </div>
    );
  }

  const canAnalyze = (localFile.base64Content && (isSupportedImage(localFile.name, localFile.mimeType) || isTextFile(localFile.name, localFile.mimeType))) || (localFile.type === 'file' && isTextFile(localFile.name, localFile.mimeType) && localFile.content);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md h-full overflow-y-auto">
      <h3 className="text-xl font-semibold mb-4 text-neutral-800 border-b pb-2 flex items-center">
        {localFile.type === 'directory' ? <ImageIcon size={24} className="mr-2 text-yellow-500" /> : <FileText size={24} className="mr-2 text-blue-500" />}
        {localFile.name}
      </h3>
      
      <div className="space-y-3 text-sm mb-4">
        <p><strong>Path:</strong> {localFile.path}</p>
        <p><strong>Type:</strong> {localFile.type === 'file' ? localFile.mimeType || 'Unknown' : 'Directory'}</p>
        {localFile.type === 'file' && <p><strong>Size:</strong> {(localFile.size / 1024).toFixed(2)} KB</p>}
      </div>

      {localFile.type === 'file' && (
        <>
          <div className="mb-4">
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-left text-md font-semibold text-neutral-700 mb-2 p-2 rounded hover:bg-neutral-100"
            >
              Advanced Details & Classification
              {showAdvanced ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {showAdvanced && (
              <div className="space-y-3 pl-2 mb-4 border-l-2 border-primary/50">
                <div>
                  <label htmlFor="file-classification" className="block text-xs font-medium text-neutral-600 mb-1">Classification</label>
                  <select
                    id="file-classification"
                    value={localFile.userDefinedType || 'Unclassified'}
                    onChange={(e) => handleDetailChange('userDefinedType', e.target.value)}
                    className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-white text-black"
                  >
                    {FileClassifications.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="file-tags" className="block text-xs font-medium text-neutral-600 mb-1 flex items-center"><Tag size={14} className="mr-1"/> Tags (comma-separated)</label>
                  <input
                    type="text"
                    id="file-tags"
                    value={tagsInput}
                    onChange={handleTagsChange}
                    placeholder="e.g., frontend, api, important"
                    className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-white text-black"
                  />
                </div>
                <div>
                  <label htmlFor="file-relationships" className="block text-xs font-medium text-neutral-600 mb-1 flex items-center"><Link2 size={14} className="mr-1"/>Relationships/Notes</label>
                  <textarea
                    id="file-relationships"
                    value={localFile.relationships || ''}
                    onChange={(e) => handleDetailChange('relationships', e.target.value)}
                    rows={3}
                    placeholder="e.g., Related to user_auth.js; Part of login flow"
                    className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-white text-black"
                  />
                </div>
              </div>
            )}
          </div>


          {isTextFile(localFile.name, localFile.mimeType) && localFile.content && (
            <div className="mb-4">
              <h4 className="text-md font-semibold text-neutral-700 mb-1 flex items-center"><Type size={18} className="mr-2"/>Content Preview (first 100 lines):</h4>
              <pre className="bg-neutral-100 p-3 rounded-md text-xs max-h-60 overflow-auto whitespace-pre-wrap break-all">
                {localFile.content.split('\n').slice(0, 100).join('\n') + (localFile.content.split('\n').length > 100 ? '\n... (truncated)' : '')}
              </pre>
            </div>
          )}

          {isSupportedImage(localFile.name, localFile.mimeType) && localFile.base64Content && (
             <div className="mb-4">
              <h4 className="text-md font-semibold text-neutral-700 mb-1 flex items-center"><ImageIcon size={18} className="mr-2"/>Image Preview:</h4>
              <img 
                src={`data:${localFile.mimeType};base64,${localFile.base64Content}`} 
                alt={localFile.name} 
                className="max-w-full max-h-60 border rounded-md object-contain"
              />
            </div>
          )}
          
          {localFile.qrDecodedValue && (
            <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-md">
              <h4 className="text-md font-semibold text-teal-700 mb-1 flex items-center"><ScanQrCode size={18} className="mr-2"/>QR Code Detected:</h4>
              <p className="text-sm text-teal-600 break-all"><strong>Decoded:</strong> {localFile.qrDecodedValue}</p>
            </div>
          )}

          <div className="mb-4">
            <h4 className="text-md font-semibold text-neutral-700 mb-1 flex items-center"><Bot size={18} className="mr-2"/>AI Analysis:</h4>
            {localFile.aiSummary ? (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700 whitespace-pre-wrap">{localFile.aiSummary}</p>
              </div>
            ) : (
              <p className="text-sm text-neutral-500 italic">No AI summary generated yet.</p>
            )}
          </div>

          {canAnalyze && (
            <button
              onClick={() => onAnalyzeFile(localFile)}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center px-4 py-2.5 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <><Sparkles size={20} className="mr-2" /> Analyze with AI</>
              )}
            </button>
          )}
          {!canAnalyze && localFile.type === 'file' && (
             <p className="text-sm text-neutral-500 italic mt-2">
                AI analysis not available for this file type/size, or content could not be loaded for AI. Max size for AI processing (images or text for base64): 4MB.
             </p>
          )}
        </>
      )}
      {localFile.type === 'directory' && (
        <p className="text-neutral-500 italic">This is a directory. Select a file to see more details or perform AI analysis. Use 'Advanced Details' to classify or tag directories.</p>
      )}
    </div>
  );
};

export default FileDetailView;