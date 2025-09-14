import React, { useState } from 'react';
import { Header } from './components/Header';
import { DetailPanel } from './components/DetailPanel';
import { PipelineEnvironment } from './components/PipelineEnvironment';
import { PIPELINE_CONFIGS } from './constants';
import { Environment, PipelineStage, StageName } from './types';

const App: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<PipelineStage | null>(null);

  const handleSelectStage = (stage: PipelineStage) => {
    setSelectedStage(stage);
  };

  const handleClosePanel = () => {
    setSelectedStage(null);
  };
  
  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">
      <Header />
      <div className="flex-grow flex flex-col lg:flex-row mt-20">
        <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-8 lg:space-y-12 overflow-y-auto">
          {(Object.keys(PIPELINE_CONFIGS) as Environment[]).map((env) => (
            <PipelineEnvironment
              key={env}
              environment={env}
              config={PIPELINE_CONFIGS[env]}
              onSelectStage={handleSelectStage}
            />
          ))}
        </main>
        <DetailPanel stage={selectedStage} onClose={handleClosePanel} />
      </div>
    </div>
  );
};

export default App;
