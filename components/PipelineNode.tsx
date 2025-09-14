
import React from 'react';
import type { PipelineStage } from '../types';
import { StageStatus, StageName } from '../types';
import {
    DatabaseIcon,
    CpuIcon,
    TestTubeIcon,
    GitBranchIcon,
    ServerIcon,
    ShieldCheckIcon,
    MonitorIcon,
    UsersIcon,
    CogIcon,
} from './icons';

interface PipelineNodeProps {
  stage: PipelineStage;
  onSelect: (name: StageName) => void;
  isSelected: boolean;
}

const statusStyles: Record<StageStatus, { bg: string; border: string; text: string; shadow: string }> = {
  [StageStatus.Pending]: { bg: 'bg-gray-700', border: 'border-gray-500', text: 'text-gray-300', shadow: 'shadow-gray-900/50' },
  [StageStatus.Running]: { bg: 'bg-blue-900/50', border: 'border-blue-400 animate-pulse-fast', text: 'text-blue-200', shadow: 'shadow-blue-500/50' },
  [StageStatus.Success]: { bg: 'bg-green-900/50', border: 'border-green-400', text: 'text-green-200', shadow: 'shadow-green-500/50' },
  [StageStatus.Failed]: { bg: 'bg-red-900/50', border: 'border-red-500', text: 'text-red-200', shadow: 'shadow-red-500/50' },
};

const stageIcons: Record<StageName, React.ElementType> = {
    [StageName.DataIngestion]: DatabaseIcon,
    [StageName.DataPreprocessing]: CogIcon,
    [StageName.ModelFineTuning]: CpuIcon,
    [StageName.ModelEvaluation]: TestTubeIcon,
    [StageName.ModelVersioning]: GitBranchIcon,
    [StageName.DeploymentStaging]: ServerIcon,
    [StageName.DeploymentProduction]: ShieldCheckIcon,
    [StageName.Monitoring]: MonitorIcon,
    [StageName.HumanFeedback]: UsersIcon,
};


export const PipelineNode = React.forwardRef<HTMLDivElement, PipelineNodeProps>(({ stage, onSelect, isSelected }, ref) => {
  const styles = statusStyles[stage.status];
  const Icon = stageIcons[stage.name];
  const isFeedbackLoop = stage.name === StageName.HumanFeedback;

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`Pipeline stage: ${stage.name}, status: ${stage.status}`}
      className={`absolute w-36 h-22 sm:w-40 sm:h-24 p-2 sm:p-3 flex flex-col justify-between rounded-lg border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${styles.bg} ${styles.border} ${isSelected ? 'ring-4 ring-offset-2 ring-offset-gray-800 ring-cyan-400' : ''} shadow-lg ${styles.shadow} ${isFeedbackLoop ? 'border-dashed' : ''}`}
      style={{ top: stage.position.top, left: stage.position.left, transform: `translate(-50%, -50%)` }}
      onClick={() => onSelect(stage.name)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(stage.name)}
    >
      <div className="flex items-center">
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0 ${styles.text}`} />
        <h3 className="font-bold text-xs sm:text-sm text-white truncate">{stage.name}</h3>
      </div>
      <div className="text-right">
        <span className={`text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${styles.bg} ${styles.text}`}>
          {stage.status}
        </span>
      </div>
    </div>
  );
});
