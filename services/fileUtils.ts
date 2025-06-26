
import { ProjectFile } from '../types';
// @ts-ignore // No types for jsqr typically
import jsQR from 'jsqr';


const MAX_TEXT_PREVIEW_SIZE = 50000; // 50KB for text preview
const MAX_BASE64_SIZE_FOR_AI = 4 * 1024 * 1024; // 4MB limit for base64 content to send to AI

export async function processSelectedFiles(fileList: FileList): Promise<{ rootName: string, files: ProjectFile[] }> {
  const filesArray = Array.from(fileList);
  if (filesArray.length === 0) return { rootName: 'UntitledProject', files: [] };

  // Determine root project name from the common base path
  let commonPath = filesArray[0].webkitRelativePath.split('/')[0] || 'UntitledProject';
  const rootName = commonPath;

  const projectFilesMap: Map<string, ProjectFile> = new Map();
  const directoryPromises: Promise<void>[] = [];

  for (const file of filesArray) {
    const pathSegments = file.webkitRelativePath.split('/');
    let currentLevel = projectFilesMap;
    let currentPath = '';

    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      currentPath = i === 0 ? segment : `${currentPath}/${segment}`;

      if (i === pathSegments.length - 1) { // It's a file
        const fileId = file.webkitRelativePath;
        const projectFile: ProjectFile = {
          id: fileId,
          path: file.webkitRelativePath,
          name: file.name,
          type: 'file',
          mimeType: file.type,
          size: file.size,
          content: '', // Will be populated for text files
        };

        // Add file reading promise
        directoryPromises.push((async () => {
          if (isTextFile(file.name, file.type) && file.size <= MAX_TEXT_PREVIEW_SIZE) {
            try {
              projectFile.content = await readFileAsText(file);
            } catch (e) {
              console.warn(`Could not read text content for ${file.name}:`, e);
              projectFile.content = `Error reading file content.`;
            }
          }
          // For AI analysis, prepare base64 if it's an image or a manageable text file
          if ((isSupportedImage(file.name, file.type) || isTextFile(file.name, file.type)) && file.size <= MAX_BASE64_SIZE_FOR_AI) {
            try {
                projectFile.base64Content = await readFileAsBase64(file);
            } catch (e) {
                console.warn(`Could not read base64 content for ${file.name}:`, e);
            }
          }

          // QR Code Decoding for images
          if (isSupportedImage(file.name, file.type) && projectFile.base64Content) {
            try {
              const decodedQR = await decodeQrCodeFromBase64(projectFile.base64Content, file.type);
              if (decodedQR) {
                projectFile.qrDecodedValue = decodedQR;
              }
            } catch (e) {
              console.warn(`Could not decode QR for ${file.name}:`, e);
            }
          }


        })());
        
        // Add to map using full path as key for simplicity in this flat map structure
        // The actual tree structure will be built from these paths later
        projectFilesMap.set(fileId, projectFile);

      } else { // It's a directory
        if (!projectFilesMap.has(currentPath)) {
          projectFilesMap.set(currentPath, {
            id: currentPath,
            path: currentPath,
            name: segment,
            type: 'directory',
            size: 0, // Directories don't have size in this context
            children: [], // This will be populated when building the tree
          });
        }
      }
    }
  }
  
  await Promise.all(directoryPromises);
  return { rootName, files: buildFileTree(Array.from(projectFilesMap.values())) };
}

function buildFileTree(files: ProjectFile[]): ProjectFile[] {
  const tree: ProjectFile[] = [];
  const map: { [key: string]: ProjectFile } = {};

  // Initialize map and ensure all files have children array if they are directories
  files.forEach(file => {
    map[file.path] = file;
    if (file.type === 'directory') {
      file.children = [];
    }
  });

  files.forEach(file => {
    const parentPath = file.path.substring(0, file.path.lastIndexOf('/'));
    if (map[parentPath] && map[parentPath].type === 'directory') {
      map[parentPath].children?.push(file);
    } else if (!parentPath) { // Root file/folder
      tree.push(file);
    }
  });
  
  // Sort children: directories first, then alphabetically
  const sortChildrenRecursive = (nodes: ProjectFile[]) => {
    nodes.sort((a, b) => {
      if (a.type === 'directory' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'directory') return 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach(node => {
      if (node.children) {
        sortChildrenRecursive(node.children);
      }
    });
  };

  sortChildrenRecursive(tree);
  return tree;
}


export function isTextFile(fileName: string, mimeType?: string): boolean {
  const textExtensions = ['.txt', '.md', '.json', '.js', '.ts', '.html', '.css', '.py', '.sh', '.xml', '.yaml', '.yml', '.java', '.c', '.cpp', '.h', '.cs', '.rb', '.php', '.go', '.rs', '.swift', '.kt', '.kts', '.gitignore', '.env'];
  const textMimeTypes = ['text/', 'application/json', 'application/xml', 'application/javascript', 'application/typescript'];
  
  if (mimeType) {
    for (const tm of textMimeTypes) {
      if (mimeType.startsWith(tm)) return true;
    }
  }
  const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  return textExtensions.includes(extension);
}

export function isSupportedImage(fileName: string, mimeType?: string): boolean {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico'];
   const imageMimeTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml', 'image/x-icon'];
  if (mimeType) {
    return imageMimeTypes.includes(mimeType.toLowerCase());
  }
  const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  return imageExtensions.includes(extension);
}


export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix like "data:image/png;base64,"
        resolve(result.substring(result.indexOf(',') + 1));
    }
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function decodeQrCodeFromBase64(base64Data: string, mimeType: string): Promise<string | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }
      ctx.drawImage(image, 0, 0, image.width, image.height);
      const imageData = ctx.getImageData(0, 0, image.width, image.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });
      if (code) {
        resolve(code.data);
      } else {
        resolve(null);
      }
    };
    image.onerror = () => {
      resolve(null);
    };
    image.src = `data:${mimeType};base64,${base64Data}`;
  });
}
