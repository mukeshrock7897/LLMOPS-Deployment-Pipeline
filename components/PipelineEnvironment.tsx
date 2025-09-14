import React, { useState, useRef, useEffect, createRef } from 'react';
import { Controls } from './Controls';
import { PipelineNode } from './PipelineNode';
import { PipelineEdge } from './PipelineEdge';
import { SIMULATION_MESSAGES } from '../constants';
import type { PipelineStage, PipelineConfig, Environment } from '../types';
import { StageStatus, StageName } from '../types';

export interface NodePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PipelineEnvironmentProps {
  environment: Environment;
  config: PipelineConfig;
  onSelectStage: (stage: PipelineStage) => void;
}

export const PipelineEnvironment: React.FC<PipelineEnvironmentProps> = ({ environment, config, onSelectStage }) => {
  const [stages, setStages] = useState<Partial<Record<StageName, PipelineStage>>>(
    JSON.parse(JSON.stringify(config.stages))
  );
  const [selectedStageName, setSelectedStageName] = useState<StageName | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED'>('IDLE');
  
  const pipelineContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const [viewTransform, setViewTransform] = useState({ x: 0, y: 0, scale: 1 });
  
  const stageNames = Object.keys(config.stages) as StageName[];

  const nodeRefs = useRef<Partial<Record<StageName, React.RefObject<HTMLDivElement>>>>(
    stageNames.reduce((acc, name) => {
        acc[name] = createRef<HTMLDivElement>();
        return acc;
    }, {} as Partial<Record<StageName, React.RefObject<HTMLDivElement>>>)
  );

  const [nodePositions, setNodePositions] = useState<Partial<Record<StageName, NodePosition>>>({});
  
  const updateNodePositions = () => {
    const newPositions: Partial<Record<StageName, NodePosition>> = {};
    for (const name of stageNames) {
      const node = nodeRefs.current[name]?.current;
      if (node) {
        newPositions[name] = {
          x: node.offsetLeft + node.offsetWidth / 2,
          y: node.offsetTop + node.offsetHeight / 2,
          width: node.offsetWidth,
          height: node.offsetHeight,
        };
      }
    }
    setNodePositions(newPositions);
  };
  
  useEffect(() => {
    const observer = new ResizeObserver(() => {
        updateNodePositions();
    });
    if (pipelineContainerRef.current) {
        observer.observe(pipelineContainerRef.current);
    }
    const timer = setTimeout(updateNodePositions, 50);

    return () => {
        observer.disconnect();
        clearTimeout(timer);
    };
  }, [config]);

  const resetPipeline = () => {
    setStages(JSON.parse(JSON.stringify(config.stages)));
    setIsSimulating(false);
    setStatus('IDLE');
    setSelectedStageName(null);
  };

  const resetView = () => {
    setViewTransform({ x: 0, y: 0, scale: 1 });
    setTimeout(updateNodePositions, 50); // allow view to reset
  }

  const runSimulation = async () => {
    resetPipeline();
    await new Promise(resolve => setTimeout(resolve, 100));
    setIsSimulating(true);
    setStatus('RUNNING');
    
    const runStage = async (stageName: StageName) => {
        setStages(prev => {
            const stage = prev[stageName]!;
            return {
                ...prev,
                [stageName]: {
                    ...stage,
                    status: StageStatus.Running,
                    details: {
                        ...stage.details,
                        logs: [`[INFO] Starting stage: ${stageName}`],
                        metrics: { progress: '0%' }
                    }
                }
            };
        });
        setSelectedStageName(stageName);

        const messages = SIMULATION_MESSAGES[stageName];
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
            const progress = Math.round(((i + 1) / messages.length) * 100);
            setStages(prev => {
                const stage = prev[stageName];
                if (!stage) return prev;
                return {
                    ...prev,
                    [stageName]: {
                        ...stage,
                        details: {
                            ...stage.details,
                            logs: [...stage.details.logs, `[INFO] ${message}`],
                            metrics: { ...stage.details.metrics, progress: `${progress}%` }
                        }
                    }
                };
            });
        }
        
        setStages(prev => {
            const stage = prev[stageName];
            if (!stage) return prev;
            
            const finalMetrics: Record<string, string | number> = { ...stage.details.metrics };

            if (stageName === StageName.ModelEvaluation) {
                finalMetrics['accuracy'] = '98.5%';
                finalMetrics['precision'] = '97.2%';
                finalMetrics['recall'] = '99.1%';
            }
            if (stageName === StageName.DataIngestion) {
                finalMetrics['records_ingested'] = '1,000,000';
            }
            if (stageName === StageName.ModelVersioning) {
                finalMetrics['new_version'] = `v1.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`;
            }

            return {
                ...prev,
                [stageName]: {
                    ...stage,
                    status: StageStatus.Success,
                    details: {
                        ...stage.details,
                        logs: [...stage.details.logs, `[SUCCESS] Stage ${stageName} completed successfully.`],
                        metrics: finalMetrics
                    }
                }
            };
        });
        return true;
    };
    
    for (const stageName of config.order) {
        await runStage(stageName);
    }

    setStatus('COMPLETED');
    setIsSimulating(false);
  };
  
  const handleSelectStage = (name: StageName) => {
    setSelectedStageName(name);
    const stage = stages[name];
    if (stage) {
      onSelectStage(stage);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - viewTransform.x,
      y: e.clientY - viewTransform.y,
    };
    if (pipelineContainerRef.current) pipelineContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const x = e.clientX - dragStartRef.current.x;
    const y = e.clientY - dragStartRef.current.y;
    setViewTransform(prev => ({ ...prev, x, y }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (pipelineContainerRef.current) pipelineContainerRef.current.style.cursor = 'grab';
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = viewTransform.scale * (1 - e.deltaY * 0.001);
    const clampedScale = Math.min(Math.max(0.5, newScale), 2);
    setViewTransform(prev => ({ ...prev, scale: clampedScale }));
  };

  return (
    <section className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">{environment} Environment</h2>
      <div 
        ref={pipelineContainerRef}
        className="relative h-[60vh] bg-gray-900 rounded-lg overflow-hidden border border-gray-700 cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <Controls
          runSimulation={runSimulation}
          resetPipeline={resetPipeline}
          resetView={resetView}
          isSimulating={isSimulating}
          status={status}
        />
        <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{ transform: `translate(${viewTransform.x}px, ${viewTransform.y}px) scale(${viewTransform.scale})`, transition: isDragging ? 'none' : 'transform 0.1s ease-out' }}
        >
          <svg className="absolute top-0 left-0" width="100%" height="100%" style={{ zIndex: 0 }}>
            <defs>
              <marker id={`arrowhead-${environment}`} markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#4a5568" />
              </marker>
            </defs>
            {config.connections.map(([from, to]) => {
              const fromPos = nodePositions[from];
              const toPos = nodePositions[to];
              if (!fromPos || !toPos) return null;
              return <PipelineEdge key={`${from}-${to}`} fromPos={fromPos} toPos={toPos} fromName={from} toName={to} markerId={`arrowhead-${environment}`} />;
            })}
          </svg>
          {Object.values(stages).map(stage => (
            stage && <PipelineNode
              key={stage.name}
              ref={nodeRefs.current[stage.name]!}
              stage={stage}
              onSelect={handleSelectStage}
              isSelected={selectedStageName === stage.name}
            />
          ))}
        </div>
      </div>
    </section>
  );
};