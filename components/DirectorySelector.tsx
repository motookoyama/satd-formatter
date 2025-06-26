
import React from 'react';
import { UploadCloud } from 'lucide-react';

interface DirectorySelectorProps {
  onDirectorySelected: (fileList: FileList, directoryName: string) => void;
  isLoading: boolean;
}

const DirectorySelector: React.FC<DirectorySelectorProps> = ({ onDirectorySelected, isLoading }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Try to get the directory name. The first file's webkitRelativePath should contain it.
      const firstFilePathParts = files[0].webkitRelativePath.split('/');
      const directoryName = firstFilePathParts.length > 1 ? firstFilePathParts[0] : 'SelectedProject';
      onDirectorySelected(files, directoryName);
    }
     // Reset the input value to allow selecting the same folder again
    event.target.value = '';
  };

  return (
    <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
      <label
        htmlFor="directory-upload"
        className={`
          flex flex-col items-center justify-center w-full h-48 
          border-2 border-dashed border-neutral-300 rounded-lg 
          cursor-pointer bg-neutral-50 hover:bg-neutral-100
          transition-colors duration-200
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <UploadCloud className="w-12 h-12 text-primary mb-3" />
        <span className="text-lg font-semibold text-neutral-700">
          {isLoading ? 'Processing Project...' : 'Select Project Folder'}
        </span>
        <p className="text-sm text-neutral-500">
          Click or drag folder here
        </p>
        <input
          id="directory-upload"
          type="file"
          // @ts-ignore
          webkitdirectory=""
          directory=""
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </label>
    </div>
  );
};

export default DirectorySelector;
