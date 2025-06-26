
import React, { useState } from 'react';
import { SAtDDefSettings } from '../types';
import { X, Save, Server, Sliders } from 'lucide-react';

interface SettingsModalProps {
  settings: SAtDDefSettings;
  onSave: (settings: SAtDDefSettings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const [currentSettings, setCurrentSettings] = useState<SAtDDefSettings>(settings);

  const handleChange = (field: keyof SAtDDefSettings, value: any) => {
    setCurrentSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleIntegrationDegreeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange('informationIntegrationDegree', parseInt(e.target.value, 10) as 0 | 1 | 2);
  };
  
  const handleSave = () => {
    onSave(currentSettings);
  };

  return (
    <div 
        className="fixed inset-0 bg-neutral-800 bg-opacity-75 flex items-center justify-center p-4 z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg transform transition-all">
        <div className="flex items-center justify-between mb-6">
          <h2 id="settings-modal-title" className="text-2xl font-semibold text-neutral-800 flex items-center">
            <Sliders size={24} className="mr-3 text-primary" /> Application Settings
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-neutral-700 rounded-full hover:bg-neutral-100"
            aria-label="Close settings"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Information Integration Degree */}
          <div>
            <label htmlFor="integration-degree" className="block text-sm font-medium text-neutral-700 mb-1">
              Information Integration Degree
            </label>
            <select
              id="integration-degree"
              value={currentSettings.informationIntegrationDegree}
              onChange={handleIntegrationDegreeChange}
              className="w-full p-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-white text-black"
            >
              <option value="0">Basic (Manual Focus, On-demand AI Summaries)</option>
              <option value="1">Standard (Include AI Summaries in YAML, More Metadata)</option>
              <option value="2">Deep (Future Placeholder for Advanced AI Analysis)</option>
            </select>
            <p className="mt-1 text-xs text-neutral-500">
              Controls detail in `sAtddef.yaml` and potential future AI processing intensity.
            </p>
          </div>

          {/* Local LLM Settings (Placeholder) */}
          <div className="border-t pt-4 mt-4 border-neutral-200">
            <h3 className="text-lg font-medium text-neutral-700 mb-3 flex items-center">
                <Server size={20} className="mr-2 text-neutral-600"/> Local LLM Configuration (Experimental)
            </h3>
            <div className="space-y-3 p-3 bg-neutral-50 rounded-md border border-neutral-200">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="localLlmEnabled"
                        checked={currentSettings.localLlmEnabled || false}
                        onChange={(e) => handleChange('localLlmEnabled', e.target.checked)}
                        className="h-4 w-4 text-primary border-neutral-300 rounded focus:ring-primary mr-2 cursor-not-allowed"
                        disabled // Disabled for now
                    />
                    <label htmlFor="localLlmEnabled" className="text-sm text-neutral-600 cursor-not-allowed">
                        Enable Local LLM (Feature not yet active)
                    </label>
                </div>
                <div>
                    <label htmlFor="localLlmEndpoint" className="block text-xs font-medium text-neutral-500 mb-0.5">API Endpoint</label>
                    <input
                        type="text"
                        id="localLlmEndpoint"
                        value={currentSettings.localLlmEndpoint || ''}
                        onChange={(e) => handleChange('localLlmEndpoint', e.target.value)}
                        placeholder="e.g., http://localhost:11434/api/generate"
                        className="w-full p-2 border border-neutral-300 rounded-md shadow-sm sm:text-sm bg-neutral-200 text-neutral-500 cursor-not-allowed"
                        disabled // Disabled for now
                    />
                </div>
                 <div>
                    <label htmlFor="localLlmModelType" className="block text-xs font-medium text-neutral-500 mb-0.5">Model Type</label>
                    <select
                        id="localLlmModelType"
                        value={currentSettings.localLlmModelType || 'Ollama'}
                        onChange={(e) => handleChange('localLlmModelType', e.target.value)}
                        className="w-full p-2 border border-neutral-300 rounded-md shadow-sm sm:text-sm bg-neutral-200 text-neutral-500 cursor-not-allowed"
                        disabled // Disabled for now
                    >
                        <option value="Ollama">Ollama</option>
                        <option value="LMStudio">LMStudio</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <p className="text-xs text-neutral-500 italic">Local LLM integration is planned for future versions to offer cost-effective AI analysis.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            type="button"
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Save size={16} className="mr-2"/> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
