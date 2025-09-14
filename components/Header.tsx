import React from 'react';
import { BrainCircuitIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 p-4 z-40 flex justify-center">
      <div className="bg-gray-900/50 backdrop-blur-sm text-white py-2 px-6 rounded-lg border border-gray-700 flex items-center shadow-lg">
        <BrainCircuitIcon className="h-6 w-6 mr-3 text-cyan-400" />
        <h1 className="text-xl font-bold">MLOps Pipeline Simulator</h1>
      </div>
    </header>
  );
};
