
import React from 'react';
import type { Pipeline } from '../types';
import Card from './Card';
import Label from './Label';
import Input from './Input';
import Textarea from './Textarea';
import Switch from './Switch';
import Button from './Button';

interface PipelineTabProps {
  pipeline: Pipeline;
  setPipeline: React.Dispatch<React.SetStateAction<Pipeline>>;
}

const PipelineTab: React.FC<PipelineTabProps> = ({ pipeline, setPipeline }) => {
  
  const toggleStep = (id: string) => {
    setPipeline(p => ({
      ...p,
      steps: p.steps.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    }));
  };
  
  return (
    <Card title="Pipeline Principal">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Nome do Pipeline</Label>
          <Input value={pipeline.name} onChange={(e) => setPipeline({ ...pipeline, name: e.target.value })} />
        </div>
        <div>
          <Label>Prompt de Sumarização (Gemini)</Label>
          <Textarea 
            value={pipeline.summaryPrompt}
            onChange={(e) => setPipeline({ ...pipeline, summaryPrompt: e.target.value })}
            placeholder="Resuma cada notícia em até 3 bullets..."
            className="h-24"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card title="Passos do Pipeline">
          <ul className="space-y-2">
            {pipeline.steps.map((step) => (
              <li key={step.id} className="flex justify-between items-center bg-slate-50 rounded-lg p-3">
                <span className="font-medium text-sm text-slate-700">{step.label}</span>
                <Switch checked={step.enabled} onChange={() => toggleStep(step.id)} />
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Testar (simulado)">
          <p className="text-sm text-slate-500 mb-4">Útil para validar o fluxo sem coleta real.</p>
          <div className="flex items-center gap-2">
            <Button>Executar (Simulado)</Button>
            <Button variant="secondary" disabled>Parar</Button>
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default PipelineTab;
