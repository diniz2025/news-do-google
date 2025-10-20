
import React from 'react';
import type { Source } from '../types';
import Card from './Card';
import Switch from './Switch';
import Badge from './Badge';
import Label from './Label';
import Input from './Input';
import Button from './Button';

interface SourcesTabProps {
  sources: Source[];
  toggleSource: (id: string) => void;
}

const SourcesTab: React.FC<SourcesTabProps> = ({ sources, toggleSource }) => {
  return (
    <Card title="Fontes (Starter Pack)">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3">
        {sources.map((src) => (
          <div key={src.id} className="border border-gray-200 rounded-xl p-3 bg-white">
            <div className="flex items-center gap-3">
              <Switch checked={src.enabled} onChange={() => toggleSource(src.id)} />
              <div className="font-semibold">{src.name}</div>
              <Badge tone="subtle">{src.type}</Badge>
            </div>
            <div className="mt-2 text-xs text-slate-500 break-all">{src.url}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_160px] gap-4 mt-6 pt-4 border-t border-gray-200">
        <div>
          <Label>Nova Fonte – Nome</Label>
          <Input placeholder="Ex.: Blog da Operadora X" />
        </div>
        <div>
          <Label>URL/RSS</Label>
          <Input placeholder="https://…" />
        </div>
        <div className="self-end">
          <Button className="w-full">Adicionar Fonte</Button>
        </div>
      </div>
    </Card>
  );
};

export default SourcesTab;
