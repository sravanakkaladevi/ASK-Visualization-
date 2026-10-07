import React from 'react';
import { AlgorithmMeta } from '../types/algorithm';
import { CodePanel } from './CodePanel';

interface ConceptDetailsPanelProps {
  meta: AlgorithmMeta;
  highlightedLines: number[];
}

export const ConceptDetailsPanel: React.FC<ConceptDetailsPanelProps> = ({ meta, highlightedLines }) => {
  return <CodePanel code={meta.code} highlightedLines={highlightedLines} />;
};
