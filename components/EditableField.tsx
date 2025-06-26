import React from 'react';

interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({ label, value, onChange, placeholder, rows = 4, disabled = false }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className="w-full p-3 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-white text-black caret-black disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default EditableField;