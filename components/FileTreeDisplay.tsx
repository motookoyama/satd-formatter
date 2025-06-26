
import React from 'react';
import { ProjectFile } from '../types';
import { FileText, Folder, ChevronRight, ChevronDown, Image as ImageIcon, FileJson, FileCode, Binary } from 'lucide-react';

interface FileTreeDisplayProps {
  files: ProjectFile[];
  selectedFile: ProjectFile | null;
  onFileSelect: (file: ProjectFile) => void;
  openDirectories: Set<string>;
  onToggleDirectory: (path: string) => void;
}

const FileTreeItem: React.FC<{
  item: ProjectFile;
  selectedFile: ProjectFile | null;
  onFileSelect: (file: ProjectFile) => void;
  level: number;
  openDirectories: Set<string>;
  onToggleDirectory: (path: string) => void;
}> = ({ item, selectedFile, onFileSelect, level, openDirectories, onToggleDirectory }) => {
  const isOpen = item.type === 'directory' ? openDirectories.has(item.path) : false;

  const getIcon = () => {
    if (item.type === 'directory') {
      return <Folder size={18} className="mr-2 text-yellow-500" />;
    }
    const ext = item.name.slice(item.name.lastIndexOf('.') + 1).toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico'].includes(ext)) {
      return <ImageIcon size={18} className="mr-2 text-purple-500" />;
    }
    if (['json'].includes(ext)) {
      return <FileJson size={18} className="mr-2 text-green-500" />;
    }
    if (['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'py', 'md', 'sh', 'java', 'c', 'cpp'].includes(ext)) {
      return <FileCode size={18} className="mr-2 text-blue-500" />;
    }
    if (item.qrDecodedValue) { // Assume QR code containing images may not have specific extensions
      return <Binary size={18} className="mr-2 text-teal-500" />; // Icon for binary/special files
    }
    return <FileText size={18} className="mr-2 text-neutral-500" />;
  };

  const handleSelect = () => {
    if (item.type === 'directory') {
      onToggleDirectory(item.path);
    }
    onFileSelect(item); // Select directories too, to show info or actions
  };

  return (
    <div className="text-sm">
      <div
        onClick={handleSelect}
        style={{ paddingLeft: `${level * 1.25}rem` }}
        className={`flex items-center py-1.5 px-2 cursor-pointer hover:bg-neutral-200 rounded ${
          selectedFile?.id === item.id ? 'bg-primary/20 text-primary font-semibold' : ''
        }`}
      >
        {item.type === 'directory' && (
          isOpen ? <ChevronDown size={16} className="mr-1 text-neutral-500" /> : <ChevronRight size={16} className="mr-1 text-neutral-500" />
        )}
        {!item.type && <span className="w-4 mr-1"></span>} {/* Placeholder for non-directory items */}
        {getIcon()}
        <span>{item.name}</span>
      </div>
      {item.type === 'directory' && isOpen && item.children && (
        <div>
          {item.children.map((child) => (
            <FileTreeItem
              key={child.id}
              item={child}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              level={level + 1}
              openDirectories={openDirectories}
              onToggleDirectory={onToggleDirectory}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileTreeDisplay: React.FC<FileTreeDisplayProps> = ({ files, selectedFile, onFileSelect, openDirectories, onToggleDirectory }) => {
  if (!files || files.length === 0) {
    return <p className="text-neutral-500 p-4 text-center">No project files loaded.</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full overflow-y-auto">
      <h3 className="text-lg font-semibold mb-3 text-neutral-700 border-b pb-2">Project Structure</h3>
      {files.map((item) => (
        <FileTreeItem
          key={item.id}
          item={item}
          selectedFile={selectedFile}
          onFileSelect={onFileSelect}
          level={0}
          openDirectories={openDirectories}
          onToggleDirectory={onToggleDirectory}
        />
      ))}
    </div>
  );
};

export default FileTreeDisplay;
