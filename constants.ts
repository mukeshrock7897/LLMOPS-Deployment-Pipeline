import { StageName, StageStatus, PipelineStage, AllPipelineConfigs, Environment } from './types';

const createInitialStage = (name: StageName, position: { top: string; left: string }): PipelineStage => ({
  name,
  status: StageStatus.Pending,
  position,
  details: {
    logs: [`Stage ${name} initialized.`],
    metrics: { progress: '0%' },
    config: { timeout: '60s', retries: 3, 'gpu-enabled': true },
  },
});

export const PIPELINE_CONFIGS: AllPipelineConfigs = {
  [Environment.Dev]: {
    stages: {
      [StageName.DataIngestion]: createInitialStage(StageName.DataIngestion, { top: '30%', left: '20%' }),
      [StageName.DataPreprocessing]: createInitialStage(StageName.DataPreprocessing, { top: '30%', left: '50%' }),
      [StageName.ModelFineTuning]: createInitialStage(StageName.ModelFineTuning, { top: '30%', left: '80%' }),
      [StageName.ModelEvaluation]: createInitialStage(StageName.ModelEvaluation, { top: '70%', left: '50%' }),
    },
    connections: [
      [StageName.DataIngestion, StageName.DataPreprocessing],
      [StageName.DataPreprocessing, StageName.ModelFineTuning],
      [StageName.ModelFineTuning, StageName.ModelEvaluation],
    ],
    order: [StageName.DataIngestion, StageName.DataPreprocessing, StageName.ModelFineTuning, StageName.ModelEvaluation],
  },
  [Environment.Beta]: {
    stages: {
      [StageName.DataIngestion]: createInitialStage(StageName.DataIngestion, { top: '25%', left: '15%' }),
      [StageName.DataPreprocessing]: createInitialStage(StageName.DataPreprocessing, { top: '25%', left: '40%' }),
      [StageName.ModelFineTuning]: createInitialStage(StageName.ModelFineTuning, { top: '25%', left: '65%' }),
      [StageName.ModelEvaluation]: createInitialStage(StageName.ModelEvaluation, { top: '60%', left: '65%' }),
      [StageName.ModelVersioning]: createInitialStage(StageName.ModelVersioning, { top: '60%', left: '40%' }),
      [StageName.DeploymentStaging]: createInitialStage(StageName.DeploymentStaging, { top: '60%', left: '15%' }),
    },
    connections: [
      [StageName.DataIngestion, StageName.DataPreprocessing],
      [StageName.DataPreprocessing, StageName.ModelFineTuning],
      [StageName.ModelFineTuning, StageName.ModelEvaluation],
      [StageName.ModelEvaluation, StageName.ModelVersioning],
      [StageName.ModelVersioning, StageName.DeploymentStaging],
    ],
    order: [StageName.DataIngestion, StageName.DataPreprocessing, StageName.ModelFineTuning, StageName.ModelEvaluation, StageName.ModelVersioning, StageName.DeploymentStaging],
  },
  [Environment.Preprod]: {
    stages: {
        [StageName.DataIngestion]: createInitialStage(StageName.DataIngestion, { top: '20%', left: '10%' }),
        [StageName.DataPreprocessing]: createInitialStage(StageName.DataPreprocessing, { top: '20%', left: '30%' }),
        [StageName.ModelFineTuning]: createInitialStage(StageName.ModelFineTuning, { top: '20%', left: '50%' }),
        [StageName.ModelEvaluation]: createInitialStage(StageName.ModelEvaluation, { top: '20%', left: '70%' }),
        [StageName.ModelVersioning]: createInitialStage(StageName.ModelVersioning, { top: '20%', left: '90%' }),
        [StageName.DeploymentStaging]: createInitialStage(StageName.DeploymentStaging, { top: '65%', left: '35%' }),
        [StageName.DeploymentProduction]: createInitialStage(StageName.DeploymentProduction, { top: '65%', left: '65%' }),
    },
    connections: [
        [StageName.DataIngestion, StageName.DataPreprocessing],
        [StageName.DataPreprocessing, StageName.ModelFineTuning],
        [StageName.ModelFineTuning, StageName.ModelEvaluation],
        [StageName.ModelEvaluation, StageName.ModelVersioning],
        [StageName.ModelVersioning, StageName.DeploymentStaging],
        [StageName.DeploymentStaging, StageName.DeploymentProduction],
    ],
    order: [StageName.DataIngestion, StageName.DataPreprocessing, StageName.ModelFineTuning, StageName.ModelEvaluation, StageName.ModelVersioning, StageName.DeploymentStaging, StageName.DeploymentProduction],
  },
  [Environment.Prod]: {
    stages: {
        [StageName.DataIngestion]: createInitialStage(StageName.DataIngestion, { top: '15%', left: '15%' }),
        [StageName.DataPreprocessing]: createInitialStage(StageName.DataPreprocessing, { top: '15%', left: '50%' }),
        [StageName.ModelFineTuning]: createInitialStage(StageName.ModelFineTuning, { top: '15%', left: '85%' }),
        [StageName.ModelEvaluation]: createInitialStage(StageName.ModelEvaluation, { top: '50%', left: '85%' }),
        [StageName.ModelVersioning]: createInitialStage(StageName.ModelVersioning, { top: '50%', left: '50%' }),
        [StageName.DeploymentStaging]: createInitialStage(StageName.DeploymentStaging, { top: '50%', left: '15%' }),
        [StageName.DeploymentProduction]: createInitialStage(StageName.DeploymentProduction, { top: '85%', left: '15%' }),
        [StageName.Monitoring]: createInitialStage(StageName.Monitoring, { top: '85%', left: '50%' }),
        [StageName.HumanFeedback]: createInitialStage(StageName.HumanFeedback, { top: '85%', left: '85%' }),
    },
    connections: [
        [StageName.DataIngestion, StageName.DataPreprocessing],
        [StageName.DataPreprocessing, StageName.ModelFineTuning],
        [StageName.ModelFineTuning, StageName.ModelEvaluation],
        [StageName.ModelEvaluation, StageName.ModelVersioning],
        [StageName.ModelVersioning, StageName.DeploymentStaging],
        [StageName.DeploymentStaging, StageName.DeploymentProduction],
        [StageName.DeploymentProduction, StageName.Monitoring],
        [StageName.Monitoring, StageName.HumanFeedback],
        [StageName.HumanFeedback, StageName.DataIngestion],
    ],
    order: [StageName.DataIngestion, StageName.DataPreprocessing, StageName.ModelFineTuning, StageName.ModelEvaluation, StageName.ModelVersioning, StageName.DeploymentStaging, StageName.DeploymentProduction, StageName.Monitoring, StageName.HumanFeedback],
  },
};

export const SIMULATION_MESSAGES: Record<StageName, string[]> = {
    [StageName.DataIngestion]: [
        "Connecting to data sources...",
        "Validating data schema...",
        "Ingesting 1M records...",
        "Data ingestion complete."
    ],
    [StageName.DataPreprocessing]: [
        "Cleaning and normalizing data...",
        "Handling missing values...",
        "Feature engineering in progress...",
        "Data preprocessing successful."
    ],
    [StageName.ModelFineTuning]: [
        "Starting fine-tuning job on Gemini...",
        "Epoch 1/5 completed.",
        "Epoch 2/5 completed.",
        "Epoch 3/5 completed.",
        "Epoch 4/5 completed.",
        "Epoch 5/5 completed. Finalizing model."
    ],
    [StageName.ModelEvaluation]: [
        "Running model against test dataset...",
        "Calculating accuracy: 98.5%",
        "Calculating precision: 97.2%",
        "Calculating recall: 99.1%",
        "Evaluation metrics meet thresholds."
    ],
    [StageName.ModelVersioning]: [
        "Creating new model version: v1.2.0...",
        "Tagging model in registry...",
        "Storing model artifacts...",
        "Versioning complete."
    ],
    [StageName.DeploymentStaging]: [
        "Provisioning staging environment...",
        "Deploying model v1.2.0 to staging...",
        "Running smoke tests...",
        "Staging deployment successful."
    ],
    [StageName.DeploymentProduction]: [
        "Initiating blue/green deployment...",
        "Routing 10% of traffic to new model...",
        "Monitoring initial production metrics...",
        "Shifting 100% traffic to v1.2.0. Deployment complete."
    ],
    [StageName.Monitoring]: [
        "Monitoring for performance degradation...",
        "Analyzing user interaction patterns...",
        "No anomalies detected.",
        "Live monitoring active."
    ],
    [StageName.HumanFeedback]: [
        "Collecting user feedback...",
        "Aggregating feedback data...",
        "Identifying areas for model improvement...",
        "Feedback loop integrated."
    ]
};
