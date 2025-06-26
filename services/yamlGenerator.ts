
import { SAtDDefYAML, SAtDDefFileEntry } from '../types';

function escapeYamlString(value: string | undefined | null): string {
    if (value === undefined || value === null) return '';
    // Basic escaping for multiline or special character strings
    // A proper YAML library would handle this more robustly.
    if (value.includes(': ') || value.includes('#') || value.startsWith('-') || value.includes('\n')) {
        // Use block scalar for multiline, replace internal newlines with literal newlines preceded by indent
        const lines = value.split('\n');
        if (lines.length > 1) {
            return '|\n' + lines.map(line => `        ${line}`).join('\n'); // Assuming 2 spaces per indent, this is for 4 levels
        }
    }
    return value.replace(/"/g, '""'); // Escape double quotes for double-quoted style if needed
}

function formatValueForYaml(value: any, indentLevel: number, isBlockScalar = false): string {
    const baseIndent = '  '.repeat(indentLevel);
    if (typeof value === 'string') {
        if (value.includes('\n')) {
            const lines = value.split('\n');
            // For the first line, no extra indent. For subsequent lines, apply baseIndent + one more level of indent.
            return `|\n${baseIndent}${lines.map((line, idx) => `${idx > 0 ? baseIndent : ''}${line}`).join(`\n${baseIndent}`)}`;
        }
        // If it contains special characters that might break YAML, quote it.
        // This is a simplification; a full YAML parser/emitter is more robust.
        if (/[#:\-[\]{},&*!|>%@`]/.test(value) || /^\s|\s$/.test(value) || value.toLowerCase() === 'true' || value.toLowerCase() === 'false' || /^\d/.test(value)) {
             // Simple check, may need refinement. Prefer single quotes if no single quotes inside.
            if (!value.includes("'")) return `'${value}'`;
            return `"${value.replace(/"/g, '""')}"`; // Double quote and escape internal double quotes
        }
        return value;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }
    if (value === null || value === undefined) {
        return 'null';
    }
    return String(value); // Fallback
}


export function generateSAtDDefYamlContent(data: SAtDDefYAML): string {
  let yamlString = `sAtdVersion: ${formatValueForYaml(data.sAtdVersion, 0)}\n`;
  yamlString += `projectName: ${formatValueForYaml(data.projectName, 0)}\n`;
  yamlString += `generationDate: ${formatValueForYaml(data.generationDate, 0)}\n\n`;

  yamlString += `settings:\n`;
  yamlString += `  informationIntegrationDegree: ${data.settings.informationIntegrationDegree}\n`;
  if (data.settings.aiModelUsed) {
    yamlString += `  aiModelUsed: ${formatValueForYaml(data.settings.aiModelUsed, 1)}\n`;
  }
  if (data.settings.localLlmEnabled !== undefined) {
    yamlString += `  localLlmEnabled: ${data.settings.localLlmEnabled}\n`;
  }
  if (data.settings.localLlmEndpoint) {
    yamlString += `  localLlmEndpoint: ${formatValueForYaml(data.settings.localLlmEndpoint, 1)}\n`;
  }
  if (data.settings.localLlmModelType) {
    yamlString += `  localLlmModelType: ${formatValueForYaml(data.settings.localLlmModelType, 1)}\n`;
  }
  yamlString += `\n`;

  yamlString += `projectOverview: ${formatValueForYaml(data.projectOverview, 0)}\n\n`;
  
  yamlString += `fileManifest:\n`;
  if (data.fileManifest.length === 0) {
    yamlString += `  [] # No files in manifest\n`;
  }
  data.fileManifest.forEach(file => {
    yamlString += `  - path: ${formatValueForYaml(file.path, 2)}\n`;
    yamlString += `    type: ${file.type}\n`;
    if (file.originalMimeType) yamlString += `    originalMimeType: ${formatValueForYaml(file.originalMimeType, 2)}\n`;
    yamlString += `    userDefinedType: ${formatValueForYaml(file.userDefinedType || (file.type === 'directory' ? 'Directory' : 'Unclassified'), 2)}\n`;
    if (file.aiClassification) yamlString += `    aiClassification: ${formatValueForYaml(file.aiClassification, 2)}\n`;
    if (file.tags && file.tags.length > 0) {
      yamlString += `    tags:\n`;
      file.tags.forEach(tag => {
        yamlString += `      - ${formatValueForYaml(tag, 3)}\n`;
      });
    } else {
      yamlString += `    tags: []\n`;
    }
    yamlString += `    size: ${file.size}\n`;
    if (file.aiSummary) {
      yamlString += `    aiSummary: ${formatValueForYaml(file.aiSummary, 2)}\n`;
    }
    if (file.qrDecodedValue) {
      yamlString += `    qrDecodedValue: ${formatValueForYaml(file.qrDecodedValue, 2)}\n`;
    }
    if (file.relationships) {
      yamlString += `    relationships: ${formatValueForYaml(file.relationships, 2)}\n`;
    }
  });

  return yamlString;
}
