import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-gray-300/80 text-xs font-semibold mb-1.5 ml-1">{label}</label>}
      <input
        className={`w-full bg-slate-900/60 border border-blue-500/30 focus:border-blue-400 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 outline-none transition-colors backdrop-blur-sm ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <p className="text-red-400 text-xs mt-1 ml-1">{error}</p>}
    </div>
  );
};