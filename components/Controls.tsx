import React from 'react';
import { PlayIcon, RefreshCwIcon, CheckCircleIcon, XCircleIcon, MaximizeIcon } from './icons';

interface ControlsProps {
  runSimulation: () => void;
  resetPipeline: () => void;
  resetView: () => void;
  isSimulating: boolean;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';
}

export const Controls: React.FC<ControlsProps> = ({ runSimulation, resetPipeline, resetView, isSimulating, status }) => {
  
    const statusInfo = {
        IDLE: { text: 'Ready', color: 'text-gray-400', Icon: null },
        RUNNING: { text: 'Running...', color: 'text-blue-400', Icon: null },
        COMPLETED: { text: 'Success', color: 'text-green-400', Icon: CheckCircleIcon },
        FAILED: { text: 'Failed', color: 'text-red-400', Icon: XCircleIcon },
    };

    const { text, color, Icon } = statusInfo[status];
  
    return (
    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 bg-gray-900/70 p-2 sm:p-3 rounded-lg border border-gray-700 backdrop-blur-sm">
      <button
        onClick={runSimulation}
        disabled={isSimulating}
        className="flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full sm:w-auto"
        aria-label="Run pipeline simulation"
      >
        <PlayIcon className="h-5 w-5 mr-2" />
        <span className="text-sm sm:text-base">{isSimulating ? 'Running...' : 'Run Pipeline'}</span>
      </button>
      <button
        onClick={resetPipeline}
        disabled={isSimulating}
        className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 w-full sm:w-auto"
        aria-label="Reset pipeline"
      >
        <RefreshCwIcon className="h-5 w-5 mr-2"/>
        <span className="text-sm sm:text-base">Reset</span>
      </button>
       <button
        onClick={resetView}
        className="flex items-center justify-center p-2.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        aria-label="Reset view"
        title="Reset View"
      >
        <MaximizeIcon className="h-5 w-5"/>
      </button>
      <div className={`flex items-center text-xs sm:text-sm font-medium ${color} justify-center sm:justify-start pt-1 sm:pt-0 sm:ml-2 border-t border-gray-700 sm:border-0`}>
        {Icon && <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />}
        <span className="hidden sm:inline">Status: </span>
        <span>{text}</span>
      </div>
    </div>
  );
};