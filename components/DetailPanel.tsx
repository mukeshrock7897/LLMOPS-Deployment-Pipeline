
import React, { useState, useEffect } from 'react';
import type { PipelineStage } from '../types';
import { XIcon, FileTextIcon, BarChart2Icon, SlidersIcon, BrainCircuitIcon } from './icons';

interface DetailPanelProps {
  stage: PipelineStage | null;
  onClose: () => void;
}

type Tab = 'Logs' | 'Metrics' | 'Config';

export const DetailPanel: React.FC<DetailPanelProps> = ({ stage, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Logs');

  useEffect(() => {
    // Reset to the default tab when a new stage is selected
    if (stage) {
      setActiveTab('Logs');
    }
  }, [stage]);


  const renderContent = () => {
    if (!stage) return null;

    switch (activeTab) {
      case 'Logs':
        return (
          <div className="bg-gray-900 p-3 rounded-b-lg font-mono text-sm text-gray-300 h-full overflow-y-auto">
            {stage.details.logs.map((log, index) => (
              <p key={index} className="whitespace-pre-wrap">{`[${new Date().toLocaleTimeString()}] ${log}`}</p>
            ))}
          </div>
        );
      case 'Metrics':
        return (
          <div className="p-4 space-y-3">
            {Object.entries(stage.details.metrics).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center bg-gray-700/50 p-2 rounded">
                <span className="font-semibold text-gray-300">{key}</span>
                <span className="font-mono text-cyan-400">{value}</span>
              </div>
            ))}
          </div>
        );
      case 'Config':
        return (
          <div className="p-4 space-y-3">
            {Object.entries(stage.details.config).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center bg-gray-700/50 p-2 rounded">
                <span className="font-semibold text-gray-300">{key}</span>
                <span className="font-mono text-purple-400">{String(value)}</span>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const panelClasses = `
    bg-gray-800 border-gray-700 shadow-2xl flex flex-col
    fixed z-30 inset-x-0 bottom-0 h-[60vh] rounded-t-xl border-t
    lg:relative lg:z-auto lg:inset-auto lg:w-96 lg:h-auto lg:flex-shrink-0 lg:rounded-xl lg:border
    transform transition-transform duration-300 ease-in-out
    ${stage ? 'translate-y-0 lg:translate-x-0' : 'translate-y-full lg:translate-y-0 lg:translate-x-full'}
  `;

  return (
    <aside className={panelClasses}>
      {stage ? (
        <div className="flex flex-col h-full animate-fade-in">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">{stage.name}</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700 transition-colors" aria-label="Close details panel">
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="border-b border-gray-700">
            <nav className="flex space-x-1 p-2" role="tablist" aria-label="Stage Details">
              <TabButton icon={FileTextIcon} label="Logs" activeTab={activeTab} onClick={() => setActiveTab('Logs')} />
              <TabButton icon={BarChart2Icon} label="Metrics" activeTab={activeTab} onClick={() => setActiveTab('Metrics')} />
              <TabButton icon={SlidersIcon} label="Config" activeTab={activeTab} onClick={() => setActiveTab('Config')} />
            </nav>
          </div>
          <div className="flex-grow overflow-y-auto" role="tabpanel">
            {renderContent()}
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-col items-center justify-center h-full text-gray-500 p-4 text-center">
            <BrainCircuitIcon className="h-16 w-16 mb-4" />
          <h3 className="font-bold text-lg">Select a Stage</h3>
          <p className="text-sm">Click on any stage in the pipeline to view its details.</p>
        </div>
      )}
    </aside>
  );
};

interface TabButtonProps {
    icon: React.ElementType;
    label: Tab;
    activeTab: Tab;
    onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ icon: Icon, label, activeTab, onClick }) => (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={activeTab === label}
      className={`flex-1 flex items-center justify-center p-2 text-sm font-semibold rounded-md transition-colors ${
        activeTab === label ? 'bg-cyan-600/50 text-white' : 'text-gray-400 hover:bg-gray-700'
      }`}
    >
        <Icon className="h-4 w-4 mr-2" />
        {label}
    </button>
)
