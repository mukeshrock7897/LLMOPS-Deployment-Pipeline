import React from 'react';
import type { NodePosition } from './PipelineEnvironment';
import { StageName } from '../types';

interface PipelineEdgeProps {
  fromPos: NodePosition;
  toPos: NodePosition;
  fromName: StageName;
  toName: StageName;
  markerId: string;
}

const getIntersectionPoint = (
  sourcePos: NodePosition,
  targetPos: NodePosition
): { x: number; y: number } => {
  const { x: sx, y: sy, width: sw, height: sh } = sourcePos;
  const { x: tx, y: ty } = targetPos;

  const dx = tx - sx;
  const dy = ty - sy;

  const halfWidth = sw / 2;
  const halfHeight = sh / 2;

  const angle = Math.atan2(dy, dx);
  const cornerAngle = Math.atan2(halfHeight, halfWidth);

  let x, y;

  if (angle > -cornerAngle && angle <= cornerAngle) {
    x = sx + halfWidth;
    y = sy + halfWidth * Math.tan(angle);
  } else if (angle > cornerAngle && angle <= Math.PI - cornerAngle) {
    x = sx + halfHeight / Math.tan(angle);
    y = sy + halfHeight;
  } else if (angle > Math.PI - cornerAngle || angle <= -(Math.PI - cornerAngle)) {
    x = sx - halfWidth;
    y = sy - halfWidth * Math.tan(angle);
  } else { 
    x = sx - halfHeight / Math.tan(angle);
    y = sy - halfHeight;
  }
  
  return { x, y };
};

export const PipelineEdge: React.FC<PipelineEdgeProps> = ({ fromPos, toPos, fromName, toName, markerId }) => {
  const startPoint = getIntersectionPoint(fromPos, toPos);
  const endPoint = getIntersectionPoint(toPos, fromPos);

  const isFeedbackLoop = fromName === StageName.HumanFeedback || toName === StageName.DataIngestion;

  return (
    <line
      x1={startPoint.x}
      y1={startPoint.y}
      x2={endPoint.x}
      y2={endPoint.y}
      stroke="#4a5568"
      strokeWidth="2"
      markerEnd={`url(#${markerId})`}
      strokeDasharray={isFeedbackLoop ? "5,5" : "none"}
    />
  );
};
