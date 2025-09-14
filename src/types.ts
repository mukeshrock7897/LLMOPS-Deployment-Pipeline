export enum Environment {
  Dev = 'Dev',
  Beta = 'Beta',
  Preprod = 'Preprod',
  Prod = 'Prod',
}

export enum StageName {
  DataIngestion = 'Data Ingestion',
  DataPreprocessing = 'Data Preprocessing',
  ModelFineTuning = 'Model Fine-Tuning',
  ModelEvaluation = 'Model Evaluation',
  ModelVersioning = 'Model Versioning',
  DeploymentStaging = 'Deployment Staging',
  DeploymentProduction = 'Deployment Production',
  Monitoring = 'Monitoring',
  HumanFeedback = 'Human Feedback',
}

export enum StageStatus {
  Pending = 'Pending',
  Running = 'Running',
  Success = 'Success',
  Failed = 'Failed',
}

export interface PipelineStageDetails {
  logs: string[];
  metrics: Record<string, string | number>;
  config: Record<string, string | number | boolean>;
}

export interface PipelineStage {
  name: StageName;
  status: StageStatus;
  position: { top: string; left: string };
  details: PipelineStageDetails;
}

export interface PipelineConfig {
  // FIX: Changed stages to be a partial record to reflect that not all stages exist in every environment.
  stages: Partial<Record<StageName, PipelineStage>>;
  connections: [StageName, StageName][];
  order: StageName[];
}

export type AllPipelineConfigs = Record<Environment, PipelineConfig>;